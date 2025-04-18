"use client"

import { TRowData } from "@/app/_libs/types";
import { CellContext, createColumnHelper } from "@tanstack/react-table";

const columnHelper = createColumnHelper<TRowData>();

export const columns = [

    columnHelper.accessor("skill", {
        id: "skill",
        header: "Skill",
        footer: "Skill",
        meta: {
            type: "text",
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
    columnHelper.accessor("goldCosts", {
        id: "goldCosts",
        header: "Gold Costs (from level 1 to level 4)",
        footer: "Gold Costs (from level 1 to level 4)",
        meta: {
            type: "text",
        },
    }),

];