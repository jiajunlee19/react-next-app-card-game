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
    const [history, setHistory] = useState<string[][][]>([mazes[0]])


    // Functions
    function canPlace(cell: string) {
        // Can place on empty spaces or stones
        if (["0", "S"].includes(cell)) return true;
        
        // Otherwise can't place
        return false;
    }

    function canUndo() {
        if (history.length < 2) return false;
        return true;
    }

    function place(cell: string, i: number, j:number) {
        if (!canPlace(cell)) return
        
        const newMaze = maze.map(row => [...row]);
        newMaze[i][j] = "G"

        setHistory([...history, newMaze]); // Store only the changed cell

        if (JSON.stringify(newMaze) !== JSON.stringify(maze)) {
            setMaze(newMaze);
        } 
    }

    function undo() {
        if (!canUndo()) return;

        setHistory(prev => {
            const newHistory = prev.slice(0, -1);
            setMaze(newHistory[newHistory.length - 1].map(row => [...row]));
            return newHistory;
        })
    }

    function reset() {
        const confirmReset = window.confirm("Are you sure to reset into your last saved maze ?");
        if (!confirmReset) {
            return;
        }

        setMaze(mazes[0]);
        setHistory([mazes[0]]);
    }



    return (
        <div className="flex gap-10 mt-4">
            <div className="grid gap-0" style={{gridTemplateColumns: `repeat(${gridSize}, 0fr)`}}>
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
            <div className="flex gap-10">
                <button className="btn btn-primary h-min" onClick={() => undo()} disabled={!canUndo()}>Undo</button>
                <button className="btn btn-primary h-min" onClick={() => reset()}>Reset</button>
            </div>
        </div>
    );
};