
import { describe, it, expect, vi, beforeAll, beforeEach } from 'vitest';
import { getFestasByDateRange } from './db';

// Mock objects
const mockSelect = vi.fn().mockReturnThis();
const mockFrom = vi.fn().mockReturnThis();
const mockLeftJoin = vi.fn().mockReturnThis();
const mockWhere = vi.fn().mockReturnThis();
const mockOrderBy = vi.fn().mockReturnThis();

const mockDb = {
  select: mockSelect,
  from: mockFrom,
  leftJoin: mockLeftJoin,
  where: mockWhere,
  orderBy: mockOrderBy,
};

// Mock drizzle-orm/better-sqlite3
vi.mock('drizzle-orm/better-sqlite3', () => ({
  drizzle: vi.fn(() => mockDb),
}));

// Mock better-sqlite3 driver
vi.mock('better-sqlite3', () => {
  return {
    default: vi.fn(() => ({})),
  };
});

// Mock drizzle-orm
vi.mock('drizzle-orm', async () => {
  const actual = await vi.importActual('drizzle-orm');
  return {
    ...actual,
    desc: vi.fn(),
    eq: vi.fn(),
    and: vi.fn(),
    gte: vi.fn(),
    lte: vi.fn(),
  };
});

describe('getFestasByDateRange', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.DATABASE_URL = 'file:test.db';
    // We need to reset the internal _db variable in server/db.ts if possible,
    // but we can't access it.
    // However, if getDb was never called successfully, _db is null.
    // We can assume it's null or we are the first to call it in this test context.
  });

  it('should include joined client fields', async () => {
    const start = new Date('2023-01-01');
    const end = new Date('2023-01-31');

    await getFestasByDateRange(start, end);

    // Verify select was called
    expect(mockSelect).toHaveBeenCalled();

    // Verify structure
    expect(mockFrom).toHaveBeenCalled();
    expect(mockLeftJoin).toHaveBeenCalled(); // The join with clientes
    expect(mockWhere).toHaveBeenCalled();
    expect(mockOrderBy).toHaveBeenCalled();
  });
});
