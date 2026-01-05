import { expect, test } from 'vitest';
import { groupLeadsByStatus } from '../kanban-utils';

const COLUMNS = [
    { id: "novo" },
    { id: "contato" },
    { id: "visita" },
];

test('groupLeadsByStatus correctly groups leads', () => {
    const leads = [
        { id: 1, statusFunil: 'novo', name: 'Lead 1' },
        { id: 2, statusFunil: 'contato', name: 'Lead 2' },
        { id: 3, statusFunil: 'novo', name: 'Lead 3' },
        { id: 4, statusFunil: 'unknown', name: 'Lead 4' },
    ];

    const grouped = groupLeadsByStatus(leads, COLUMNS);

    expect(grouped['novo']).toHaveLength(2);
    expect(grouped['novo'].map((l: any) => l.id)).toEqual([1, 3]);
    expect(grouped['contato']).toHaveLength(1);
    expect(grouped['visita']).toHaveLength(0);
    expect(grouped['unknown']).toBeUndefined();
});
