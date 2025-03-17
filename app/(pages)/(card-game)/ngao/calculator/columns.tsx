"use client"

import { TRowData } from "@/app/_libs/types";
import { CellContext, createColumnHelper } from "@tanstack/react-table";

const columnHelper = createColumnHelper<TRowData>();

export const columns = [

    columnHelper.accessor("oxCombination", {
        id: "oxCombination",
        header: "Ox Combination",
        footer: "Ox Combination",
        meta: {
            type: "text",
        },
    }),
    columnHelper.accessor("points", {
        id: "point",
        header: "Points",
        footer: "Points",
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

];