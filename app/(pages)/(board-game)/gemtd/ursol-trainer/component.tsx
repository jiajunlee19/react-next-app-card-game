"use client"

import { useState, useEffect, useRef } from "react";
import { mazes } from "@/app/(pages)/(board-game)/gemtd/gemtd";
import { twMerge } from "tailwind-merge";

type TGemTDDUrsolTrainerComponent = {

};

 
export default function GemTDUrsolTrainerComponent({ }: TGemTDDUrsolTrainerComponent) {

    // States

    const gridSize = 37;
    const [maze, setMaze] = useState(mazes[0]);
    const [history, setHistory] = useState<string[][][]>([])


    // Functions

    function canPlace(cell: string) {
        // Can place on empty spaces or stones
        if (["0", "S"].includes(cell)) return true
        
        // Otherwise can't place
        return false
    }

    function place(cell: string, i: number, j:number) {
        if (!canPlace(cell)) return
        
        const newMaze = [...maze];
        newMaze[i][j] = "G"

        setHistory([...history, maze]);
        setMaze(newMaze);
    }

    function undo() {
        if (history.length > 0) {
            const previousMaze = history[history.length - 1];
            setMaze(previousMaze);
            setHistory(history.slice(0, -1));
        }
    }



    return (
        <div className="grid gap-0 mt-2" style={{gridTemplateColumns: `repeat(${gridSize}, 0fr)`}}>
            {maze.map((row, i) => row.map((cell, j) => {
                let display = cell;
                if (cell === "0" || cell === "S") {
                    display = ""
                }
                return (
                    <div key={`${i}-${j}`} onClick={() => place(cell, i, j)} className={twMerge(
                        "text flex items-center justify-center w-5 h-5 border border-black dark:border-white",
                        ["1", "2", "3", "4", "5", "6", "7"].includes(cell) && "bg-red-500 text-white",
                        ["G"].includes(cell) && "bg-green-700 text-white"
                    )}>
                        {display}
                    </div>
                )
            }))}
        </div>
    );
};