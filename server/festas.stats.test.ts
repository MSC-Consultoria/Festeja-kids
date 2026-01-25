import { vi, describe, it, expect } from 'vitest';
import { festasRouter } from './routers/festas';
import * as db from './db';

// Mock the db module
vi.mock('./db', () => ({
  getFestaStats: vi.fn(),
  getAllFestas: vi.fn(),
  getDb: vi.fn(),
}));

// We need to create a caller context.
// Looking at _core/trpc.ts, context usually has user.
// But we can try to invoke the router functions directly or create a caller.

import { initTRPC } from '@trpc/server';
const t = initTRPC.create();
const createCaller = t.createCallerFactory(festasRouter);

describe('festas router stats', () => {
  it('should use getFestaStats for efficient aggregation', async () => {
    // Mock data returned by the new optimized function
    const mockAggregatedStats = {
      total: 10,
      agendadas: 4,
      realizadas: 6,
      valorTotal: 10000,
      valorPago: 8000,
    };

    // Setup the mock
    vi.mocked(db.getFestaStats).mockResolvedValue(mockAggregatedStats as any);

    // Create caller with mock context (user is required for protectedProcedure)
    const caller = createCaller({
      user: { id: 1, role: 'admin' },
      req: {} as any,
      res: {} as any
    } as any);

    const result = await caller.stats();

    // Verification
    expect(db.getFestaStats).toHaveBeenCalled();

    // Check calculations performed in the router
    expect(result).toEqual({
      total: 10,
      agendadas: 4,
      realizadas: 6,
      valorTotal: 10000,
      valorPago: 8000,
      valorAReceber: 2000, // 10000 - 8000
      ticketMedio: 1000,   // 10000 / 10
    });
  });

  it('should handle empty database gracefully', async () => {
    const mockEmptyStats = {
      total: 0,
      agendadas: 0,
      realizadas: 0,
      valorTotal: 0,
      valorPago: 0,
    };

    vi.mocked(db.getFestaStats).mockResolvedValue(mockEmptyStats as any);

    const caller = createCaller({
      user: { id: 1, role: 'admin' },
      req: {} as any,
      res: {} as any
    } as any);

    const result = await caller.stats();

    expect(db.getFestaStats).toHaveBeenCalled();
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
