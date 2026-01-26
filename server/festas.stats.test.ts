import { describe, expect, it, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import * as db from "./db";

// Mock do módulo db
vi.mock("./db", async () => {
  return {
    getFestaStats: vi.fn(),
    getAllFestas: vi.fn(),
  };
});

function createAuthContext(): TrpcContext {
  const user = {
    id: 1,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  } as const;

  const ctx: TrpcContext = {
    user: user as any,
    req: {
      protocol: "https",
      headers: {},
    } as any,
    res: {
      clearCookie: () => {},
    } as any,
  };

  return ctx;
}

describe("festas stats optimization", () => {
  it("deve usar getFestaStats e retornar estatísticas calculadas", async () => {
    // Setup mock return value
    const mockStats = {
      total: 10,
      agendadas: 5,
      realizadas: 5,
      valorTotal: 10000, // 100.00
      valorPago: 5000,   // 50.00
    };

    vi.mocked(db.getFestaStats).mockResolvedValue(mockStats);

    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.festas.stats();

    // Verify db.getFestaStats was called
    expect(db.getFestaStats).toHaveBeenCalledTimes(1);

    // Verify calculations
    expect(result.total).toBe(10);
    expect(result.agendadas).toBe(5);
    expect(result.realizadas).toBe(5);
    expect(result.valorTotal).toBe(10000);
    expect(result.valorPago).toBe(5000);

    // Derived values
    expect(result.valorAReceber).toBe(5000); // 10000 - 5000
    expect(result.ticketMedio).toBe(1000);   // 10000 / 10
  });

  it("deve lidar com zero festas corretamente", async () => {
    const mockStats = {
      total: 0,
      agendadas: 0,
      realizadas: 0,
      valorTotal: 0,
      valorPago: 0,
    };

    vi.mocked(db.getFestaStats).mockResolvedValue(mockStats);

    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.festas.stats();

    expect(result.ticketMedio).toBe(0);
    expect(result.valorAReceber).toBe(0);
  });
});
