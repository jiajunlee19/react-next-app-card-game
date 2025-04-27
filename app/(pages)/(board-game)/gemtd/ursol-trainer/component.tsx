"use client"

import { useState, useEffect, useRef } from "react";
import { mazes } from "@/app/(pages)/(board-game)/gemtd/gemtd";
import { twMerge } from "tailwind-merge";

type TGemTDDUrsolTrainerComponent = {

};

 
export default function GemTDUrsolTrainerComponent({ }: TGemTDDUrsolTrainerComponent) {

    // States
    const gridSize = 37;
    const maze = mazes[0];

    // Functions


    return (
        <div className="grid gap-0 mt-2" style={{gridTemplateColumns: `repeat(${gridSize}, 0fr)`}}>
            {maze.map((row, i) => row.map((cell, j) => {
                let display = cell;
                if (cell === "0" || cell === "S") {
                    display = ""
                }
                return (
                    <div key={`${i}-${j}`} className={twMerge(
                        "text flex items-center justify-center w-5 h-5 border border-black dark:border-white",
                        ["1", "2", "3", "4", "5", "6", "7"].includes(cell) && "bg-red-500 text-white"
                    )}>
                        {display}
                    </div>
                )
            }))}
        </div>
    );
};