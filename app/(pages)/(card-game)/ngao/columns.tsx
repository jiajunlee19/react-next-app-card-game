"use client"

import { TRowData } from "@/app/_libs/types";
import { CellContext, createColumnHelper } from "@tanstack/react-table";

const columnHelper = createColumnHelper<TRowData>();

export const columns = [

    columnHelper.accessor("oxType", {
        id: "oxType",
        header: "Ox Type",
        footer: "Ox Type",
        meta: {
            type: "text",
        },
    }),
    columnHelper.accessor("payoutMultiplier", {
        id: "payoutMultiplier",
        header: "Payout Multiplier",
        footer: "Payout Multiplier",
        meta: {
            type: "number",
        },
    }),
    columnHelper.accessor("description", {
        id: "description",
        header: "Description",
        footer: "Description",
        meta: {
            type: "text",
        },
    }),
    columnHelper.accessor("example", {
        id: "example",
        header: "Example",
        footer: "Example",
        meta: {
            type: "text",
        },
        cell: ({ getValue }: CellContext<TRowData, string>) => (
            <div style={{ whiteSpace: 'pre-line' }}>{getValue()}</div>
        ),
    }),

];