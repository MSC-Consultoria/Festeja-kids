import { describe, expect, it, vi } from "vitest";
import { appRouter } from "./routers";
import * as db from "./db";
import { TRPCError } from "@trpc/server";

// Mock the db module
vi.mock("./db", async (importOriginal) => {
  const actual = await importOriginal<typeof import("./db")>();
  return {
    ...actual,
    getFestaStats: vi.fn(),
  };
});

// Mock context
const mockContext = {
  user: {
    id: 1,
    role: "admin",
    openId: "test",
  },
} as any;

describe("festasRouter.stats", () => {
  it("should return correctly calculated stats from db.getFestaStats", async () => {
    // Mock return value from db.getFestaStats
    const mockStats = {
      total: 10,
      agendadas: 4,
      realizadas: 6,
      valorTotal: 10000, // 100.00
      valorPago: 4000,   // 40.00
    };

    vi.mocked(db.getFestaStats).mockResolvedValue(mockStats);

    const caller = appRouter.createCaller(mockContext);
    const result = await caller.festas.stats();

    expect(db.getFestaStats).toHaveBeenCalled();

    expect(result).toEqual({
      total: 10,
      agendadas: 4,
      realizadas: 6,
      valorTotal: 10000,
      valorPago: 4000,
      valorAReceber: 6000, // 10000 - 4000
      ticketMedio: 1000,   // 10000 / 10
    });
  });

  it("should handle zero festas correctly", async () => {
    const mockStats = {
      total: 0,
      agendadas: 0,
      realizadas: 0,
      valorTotal: 0,
      valorPago: 0,
    };

    vi.mocked(db.getFestaStats).mockResolvedValue(mockStats);

    const caller = appRouter.createCaller(mockContext);
    const result = await caller.festas.stats();

    expect(result).toEqual({
      total: 0,
      agendadas: 0,
      realizadas: 0,
      valorTotal: 0,
      valorPago: 0,
      valorAReceber: 0,
      ticketMedio: 0, // 0 / 0 handled as 0
    });
  });
});
