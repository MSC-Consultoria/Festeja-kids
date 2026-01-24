import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import * as db from "./db";

// Mock the db module
vi.mock("./db", async importOriginal => {
  const actual: any = await importOriginal();
  return {
    ...actual,
    getAllFestas: vi.fn(),
    getFestaStats: vi.fn(),
  };
});

function createAuthContext(): TrpcContext {
  return {
    user: { id: 1, role: "admin" } as any,
    req: {} as any,
    res: {} as any,
  };
}

describe("festas.stats", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("calculates stats correctly using database aggregation", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    // Mock getFestaStats return value
    const mockStats = {
      total: 10,
      agendadas: 5,
      realizadas: 5,
      valorTotal: 3000,
      valorPago: 2000,
      valorAReceber: 1000,
      ticketMedio: 300,
    };

    (db.getFestaStats as any).mockResolvedValue(mockStats);

    const result = await caller.festas.stats();

    // Verify optimization: getAllFestas should NOT be called
    expect(db.getAllFestas).not.toHaveBeenCalled();

    // Verify getFestaStats IS called
    expect(db.getFestaStats).toHaveBeenCalled();

    expect(result).toEqual(mockStats);
  });
});
