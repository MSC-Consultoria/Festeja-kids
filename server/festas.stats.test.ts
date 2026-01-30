import { describe, expect, it, beforeAll } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import * as db from "./db";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-stats-user",
    email: "test-stats@example.com",
    name: "Test Stats User",
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
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };

  return ctx;
}

describe("festas router stats optimization", () => {
  let testClienteId: number;

  beforeAll(async () => {
    try {
      testClienteId = await db.createCliente({
        nome: "Cliente Stats",
        telefone: "11988888888",
        email: "stats@teste.com",
      });
    } catch (e) {
      console.error("Erro ao criar cliente de teste:", e);
      throw e;
    }
  });

  it("deve retornar estatísticas corretas usando a query otimizada", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    // Get initial stats to account for existing data
    const initialStats = await caller.festas.stats();

    // Create 2 agendada festas
    await caller.festas.create({
      codigo: "STATS01",
      clienteId: testClienteId,
      dataFechamento: Date.now(),
      dataFesta: Date.now() + 86400000,
      valorTotal: 100000, // 1000.00
      numeroConvidados: 50,
      tema: "Festa 1",
    });

    await caller.festas.create({
      codigo: "STATS02",
      clienteId: testClienteId,
      dataFechamento: Date.now(),
      dataFesta: Date.now() + 86400000 * 2,
      valorTotal: 200000, // 2000.00
      numeroConvidados: 50,
      tema: "Festa 2",
    });

    // Create 1 realizada festa (create then update)
    const festa3 = await caller.festas.create({
      codigo: "STATS03",
      clienteId: testClienteId,
      dataFechamento: Date.now(),
      dataFesta: Date.now() - 86400000,
      valorTotal: 300000, // 3000.00
      numeroConvidados: 50,
      tema: "Festa 3",
    });

    await caller.festas.update({
        id: festa3.id,
        status: "realizada",
        valorTotal: 300000,
    });

    // Simular pagamento update via DB direct call or assuming logic handles it?
    // festas table has valorPago. createFesta initializes it to 0.
    // I need to update valorPago directly via updateFesta if I want it to be counted.
    await db.updateFesta(festa3.id, { valorPago: 300000 });

    const finalStats = await caller.festas.stats();

    const diffTotal = finalStats.total - initialStats.total;
    const diffAgendadas = finalStats.agendadas - initialStats.agendadas;
    const diffRealizadas = finalStats.realizadas - initialStats.realizadas;
    const diffValorTotal = finalStats.valorTotal - initialStats.valorTotal;
    const diffValorPago = finalStats.valorPago - initialStats.valorPago;

    expect(diffTotal).toBe(3);
    expect(diffAgendadas).toBe(2);
    expect(diffRealizadas).toBe(1);
    expect(diffValorTotal).toBe(600000);
    expect(diffValorPago).toBe(300000);

    // Check calculations
    expect(finalStats.valorAReceber).toBe(finalStats.valorTotal - finalStats.valorPago);
    if (finalStats.total > 0) {
        expect(finalStats.ticketMedio).toBe(finalStats.valorTotal / finalStats.total);
    }
  });
});
