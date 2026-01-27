import { describe, expect, it, vi, beforeEach } from "vitest";

// Mock dependencies
vi.mock("better-sqlite3", () => {
  return {
    default: vi.fn()
  };
});

vi.mock("drizzle-orm/better-sqlite3", () => ({
  drizzle: vi.fn(),
}));

// Set env var to trigger SQLite path in getDb
process.env.DATABASE_URL = "file:test.db";

import { drizzle } from "drizzle-orm/better-sqlite3";
import * as db from "./db";

describe("getFestaStats", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should process db results correctly", async () => {
    const mockDb = {
      select: vi.fn().mockReturnThis(),
      from: vi.fn().mockResolvedValue([{
        total: 10,
        agendadas: 4,
        realizadas: 6,
        valorTotal: 1000,
        valorPago: 400
      }])
    };

    // Mock the drizzle factory to return our mock DB
    vi.mocked(drizzle).mockReturnValue(mockDb as any);

    const stats = await db.getFestaStats();

    expect(stats.total).toBe(10);
    expect(stats.agendadas).toBe(4);
    expect(stats.realizadas).toBe(6);
    expect(stats.valorTotal).toBe(1000);
    expect(stats.valorPago).toBe(400);
    expect(stats.valorAReceber).toBe(600);
    expect(stats.ticketMedio).toBe(100);
  });
});
