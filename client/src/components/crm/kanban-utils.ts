
export const currencyFormatter = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
});

export function formatCurrency(value: number): string {
    return currencyFormatter.format(value / 100);
}

export function groupLeadsByStatus(leads: any[], columns: { id: string }[]) {
    const grouped: Record<string, any[]> = {};

    // Initialize empty arrays for all columns
    for (const col of columns) {
        grouped[col.id] = [];
    }

    for (const lead of leads) {
        const status = lead.statusFunil;
        // Only add if the status matches a known column
        if (grouped[status]) {
            grouped[status].push(lead);
        }
    }

    return grouped;
}
