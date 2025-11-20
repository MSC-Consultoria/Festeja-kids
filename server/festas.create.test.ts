import { describe, expect, it, beforeAll } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import * as db from "./db";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "sample-user",
    email: "sample@example.com",
    name: "Sample User",
    loginMethod: "manus",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };

  return ctx;
}

describe("festas.create", () => {
  let clienteId: number;

  beforeAll(async () => {
    // Criar cliente de teste
    clienteId = await db.createCliente({
      nome: "Cliente Teste",
      telefone: "999999999",
    });
  });

  it("deve criar uma nova festa com código gerado automaticamente", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const dataFechamento = new Date("2025-12-01").getTime();
    const dataFesta = new Date("2026-06-15").getTime();

    const result = await caller.festas.create({
      clienteId,
      dataFechamento,
      dataFesta,
      valorTotal: 500000, // R$ 5.000,00 em centavos
      numeroConvidados: 100,
      tema: "Frozen",
      horario: "14h às 18h",
      observacoes: "Festa de teste",
    });

    expect(result).toHaveProperty("id");
    expect(result).toHaveProperty("codigo");
    expect(result.codigo).toMatch(/^\d{6}CL\d*$/); // Formato: MMDDYYXX

    // Verificar se a festa foi criada no banco
    const festa = await db.getFestaById(result.id);
    expect(festa).toBeDefined();
    expect(festa?.codigo).toBe(result.codigo);
    expect(festa?.clienteId).toBe(clienteId);
    expect(festa?.valorTotal).toBe(500000);
    expect(festa?.numeroConvidados).toBe(100);
    expect(festa?.tema).toBe("Frozen");
    expect(festa?.status).toBe("agendada");
  });

  it("deve gerar códigos únicos para festas com mesma data e cliente", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const dataFechamento = new Date("2025-12-01").getTime();
    const dataFesta = new Date("2026-07-20").getTime();

    // Criar primeira festa
    const result1 = await caller.festas.create({
      clienteId,
      dataFechamento,
      dataFesta,
      valorTotal: 500000,
      numeroConvidados: 100,
    });

    // Criar segunda festa com mesma data
    const result2 = await caller.festas.create({
      clienteId,
      dataFechamento,
      dataFesta,
      valorTotal: 600000,
      numeroConvidados: 120,
    });

    expect(result1.codigo).not.toBe(result2.codigo);
    expect(result2.codigo).toMatch(/^\d{6}CL\d+$/); // Deve ter sufixo numérico
  });

  it("deve criar festa com campos opcionais vazios", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const dataFechamento = new Date("2025-12-05").getTime();
    const dataFesta = new Date("2026-08-10").getTime();

    const result = await caller.festas.create({
      clienteId,
      dataFechamento,
      dataFesta,
      valorTotal: 450000,
      numeroConvidados: 80,
    });

    expect(result).toHaveProperty("id");
    expect(result).toHaveProperty("codigo");

    const festa = await db.getFestaById(result.id);
    expect(festa?.tema).toBeNull();
    expect(festa?.horario).toBeNull();
    expect(festa?.observacoes).toBeNull();
  });

  it("deve rejeitar criação com cliente inexistente", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const dataFechamento = new Date("2025-12-01").getTime();
    const dataFesta = new Date("2026-06-15").getTime();

    await expect(
      caller.festas.create({
        clienteId: 999999, // ID inexistente
        dataFechamento,
        dataFesta,
        valorTotal: 500000,
        numeroConvidados: 100,
      })
    ).rejects.toThrow("Cliente não encontrado");
  });
});
