import { describe, expect, it, vi, afterEach } from "vitest";
import { appRouter } from "../routers";
import type { TrpcContext } from "../_core/context";
import * as db from "../db";

// Mock entire db module
vi.mock("../db", async () => {
  return {
    getAllFestas: vi.fn(),
    getFestaStats: vi.fn(),
  };
});

function createAuthContext(): TrpcContext {
  const user = {
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

describe("festas.stats", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should use optimized getFestaStats and not getAllFestas", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const mockStats = {
      total: 10,
      agendadas: 5,
      realizadas: 3,
      valorTotal: 10000,
      valorPago: 6000,
    };

    vi.mocked(db.getFestaStats).mockResolvedValue(mockStats);

    const result = await caller.festas.stats();

    expect(db.getAllFestas).not.toHaveBeenCalled();
    expect(db.getFestaStats).toHaveBeenCalled();

    expect(result).toEqual({
      total: 10,
      agendadas: 5,
      realizadas: 3,
      valorTotal: 10000,
      valorPago: 6000,
      valorAReceber: 4000, // 10000 - 6000
      ticketMedio: 1000, // 10000 / 10
    });
  });

  it("should handle empty stats correctly", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const mockStats = {
      total: 0,
      agendadas: 0,
      realizadas: 0,
      valorTotal: 0,
      valorPago: 0,
    };

    vi.mocked(db.getFestaStats).mockResolvedValue(mockStats);

    const result = await caller.festas.stats();

    expect(result.ticketMedio).toBe(0);
    expect(result.valorAReceber).toBe(0);
    expect(result.total).toBe(0);
  });
});
