import { describe, expect, it, vi } from "vitest";
import * as db from "./db";
import { appRouter } from "./routers";

// Mock the db module
vi.mock("./db", async (importOriginal) => {
  const actual = await importOriginal<typeof import("./db")>();
  return {
    ...actual,
    getFestaStats: vi.fn(),
  };
});

// Mock context with authenticated user
const mockContext = {
  user: {
    id: 1,
    role: "admin",
  },
  req: {},
  res: {},
};

describe("festas.stats", () => {
  it("should call db.getFestaStats and return formatted result", async () => {
    const mockStats = {
      total: 10,
      valorTotal: 10000,
      valorPago: 5000,
      agendadas: 8,
      realizadas: 2,
    };

    vi.mocked(db.getFestaStats).mockResolvedValue(mockStats);

    const caller = appRouter.createCaller(mockContext as any);
    const result = await caller.festas.stats();

    expect(db.getFestaStats).toHaveBeenCalled();
    expect(result).toEqual({
      total: 10,
      agendadas: 8,
      realizadas: 2,
      valorTotal: 10000,
      valorPago: 5000,
      valorAReceber: 5000,
      ticketMedio: 1000, // 10000 / 10
    });
  });

  it("should handle null stats (db failure or empty)", async () => {
    vi.mocked(db.getFestaStats).mockResolvedValue(null);

    const caller = appRouter.createCaller(mockContext as any);
    const result = await caller.festas.stats();

    expect(result).toEqual({
      total: 0,
      agendadas: 0,
      realizadas: 0,
      valorTotal: 0,
      valorPago: 0,
      valorAReceber: 0,
      ticketMedio: 0,
    });
  });
});
