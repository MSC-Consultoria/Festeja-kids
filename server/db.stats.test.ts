import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// We need to mock dependencies BEFORE importing the module
const mockFrom = vi.fn();
const mockSelect = vi.fn();
const mockDb = {
  select: mockSelect,
};

vi.mock("better-sqlite3", () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      prepare: vi.fn(() => ({ get: vi.fn(), all: vi.fn() })),
      transaction: vi.fn((fn) => fn),
      pragma: vi.fn(),
      close: vi.fn(),
    })),
  };
});

vi.mock("drizzle-orm/better-sqlite3", () => {
  return {
    drizzle: vi.fn().mockReturnValue(mockDb),
  };
});

// Set env var BEFORE importing db
process.env.DATABASE_URL = "file:test.db";

describe("getFestaStats", () => {
  let db: typeof import("./db");

  beforeEach(async () => {
    vi.clearAllMocks();

    // Setup chaining
    mockSelect.mockReturnValue({ from: mockFrom });

    // Import the module dynamically to ensure mocks are applied
    db = await import("./db");
  });

  afterEach(() => {
    vi.resetModules();
  });

  it("should calculate stats correctly from DB result", async () => {
    mockFrom.mockResolvedValue([{
      total: 10,
      agendadas: 5,
      realizadas: 3,
      valorTotal: 10000,
      valorPago: 5000,
    }]);

    const stats = await db.getFestaStats();

    expect(mockSelect).toHaveBeenCalled();
    expect(mockFrom).toHaveBeenCalled();

    expect(stats).toEqual({
      total: 10,
      agendadas: 5,
      realizadas: 3,
      valorTotal: 10000,
      valorPago: 5000,
      valorAReceber: 5000,
      ticketMedio: 1000,
    });
  });

  it("should handle null/undefined values from DB", async () => {
    mockFrom.mockResolvedValue([{
      total: null,
      agendadas: null,
      realizadas: null,
      valorTotal: null,
      valorPago: null,
    }]);

    const stats = await db.getFestaStats();

    expect(stats).toEqual({
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
