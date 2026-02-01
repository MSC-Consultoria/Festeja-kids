import { describe, expect, it, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import * as db from "./db";

// Mock the db module
vi.mock("./db", () => ({
  getFestaStats: vi.fn(),
  getAllFestas: vi.fn(),
  getFestaById: vi.fn(),
  getFestaByCodigo: vi.fn(),
  getFestasByStatus: vi.fn(),
  getFestasByCliente: vi.fn(),
  getFestasByDateRange: vi.fn(),
  createFesta: vi.fn(),
  updateFesta: vi.fn(),
  deleteFesta: vi.fn(),
  getClienteById: vi.fn(),
}));

function createAuthContext(): TrpcContext {
  return {
    user: {
      id: 1,
      openId: "test-user",
      email: "test@example.com",
      name: "Test User",
      loginMethod: "manus",
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: {} as any,
    res: {} as any,
  };
}

describe("festas router with mock db", () => {
  it("should return stats from db.getFestaStats", async () => {
    const mockStats = {
      total: 10,
      agendadas: 5,
      realizadas: 5,
      valorTotal: 10000,
      valorPago: 8000,
    };

    // @ts-ignore
    db.getFestaStats.mockResolvedValue(mockStats);

    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.festas.stats();

    expect(db.getFestaStats).toHaveBeenCalled();
    expect(result.total).toBe(10);
    expect(result.agendadas).toBe(5);
    expect(result.realizadas).toBe(5);
    expect(result.valorTotal).toBe(10000);
    expect(result.valorPago).toBe(8000);
    expect(result.valorAReceber).toBe(2000); // 10000 - 8000
    expect(result.ticketMedio).toBe(1000); // 10000 / 10
  });

  it("should handle zero total for ticketMedio", async () => {
    const mockStats = {
        total: 0,
        agendadas: 0,
        realizadas: 0,
        valorTotal: 0,
        valorPago: 0,
    };

    // @ts-ignore
    db.getFestaStats.mockResolvedValue(mockStats);

    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.festas.stats();

    expect(result.ticketMedio).toBe(0);
  });
});
