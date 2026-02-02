import { describe, expect, it, vi, beforeEach } from "vitest";

// Mock better-sqlite3 to avoid binding errors
vi.mock("better-sqlite3", () => {
  return {
    default: vi.fn(() => ({
      prepare: vi.fn(() => ({
        all: vi.fn(),
        run: vi.fn(),
        get: vi.fn()
      })),
      transaction: vi.fn(cb => cb),
      pragma: vi.fn()
    }))
  };
});

// Mock drizzle-orm/better-sqlite3
const mockFrom = vi.fn();
const mockSelect = vi.fn(() => ({ from: mockFrom }));

vi.mock("drizzle-orm/better-sqlite3", () => {
  return {
    drizzle: vi.fn(() => ({
      select: mockSelect,
      insert: vi.fn(() => ({ values: vi.fn() })),
      update: vi.fn(() => ({ set: vi.fn(() => ({ where: vi.fn() })) })),
      delete: vi.fn(() => ({ where: vi.fn() })),
    }))
  };
});

// Set env var before importing db
process.env.DATABASE_URL = "file:test_mock.db";

import * as db from "./db";

describe("db.getFestaStats", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return correct stats from query result", async () => {
    // Mock the result of the query
    mockFrom.mockResolvedValueOnce([{
      total: 10,
      agendadas: 5,
      realizadas: 3,
      valorTotal: 10000,
      valorPago: 5000
    }]);

    const stats = await db.getFestaStats();

    // Verify select was called
    expect(mockSelect).toHaveBeenCalled();

    expect(stats).toEqual({
      total: 10,
      agendadas: 5,
      realizadas: 3,
      valorTotal: 10000,
      valorPago: 5000
    });
  });

  it("should handle null/empty results", async () => {
     mockFrom.mockResolvedValueOnce([{
      total: null,
      agendadas: null,
      realizadas: null,
      valorTotal: null,
      valorPago: null
    }]);

    const stats = await db.getFestaStats();

    expect(stats).toEqual({
      total: 0,
      agendadas: 0,
      realizadas: 0,
      valorTotal: 0,
      valorPago: 0
    });
  });
});
