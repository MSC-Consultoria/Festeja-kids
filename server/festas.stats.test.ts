import { describe, expect, it, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import * as db from "./db";

// Mock the entire db module
vi.mock("./db", async (importOriginal) => {
  const actual = await importOriginal<typeof import("./db")>();
  return {
    ...actual,
    getFestaStats: vi.fn(),
  };
});

function createAuthContext(): TrpcContext {
  const user = {
    id: 1,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role: "admin" as const,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
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

describe("festas router stats optimization", () => {
  it("should use db.getFestaStats and calculate derived metrics correctly", async () => {
    // Setup mock return value
    const mockStats = {
      total: 10,
      agendadas: 4,
      realizadas: 6,
      valorTotal: 10000, // 100.00
      valorPago: 6000,   // 60.00
    };

    vi.mocked(db.getFestaStats).mockResolvedValue(mockStats);

    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.festas.stats();

    // Verify db function was called
    expect(db.getFestaStats).toHaveBeenCalledTimes(1);

    // Verify returned values
    expect(result.total).toBe(10);
    expect(result.agendadas).toBe(4);
    expect(result.realizadas).toBe(6);
    expect(result.valorTotal).toBe(10000);
    expect(result.valorPago).toBe(6000);

    // Verify derived calculations
    // valorAReceber = valorTotal - valorPago = 10000 - 6000 = 4000
    expect(result.valorAReceber).toBe(4000);

    // ticketMedio = valorTotal / total = 10000 / 10 = 1000
    expect(result.ticketMedio).toBe(1000);
  });

  it("should handle zero total for ticketMedio", async () => {
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
  });
});
