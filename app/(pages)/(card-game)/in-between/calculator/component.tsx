"use client"

import { calculateCardLeft, type TDigitValuePairs, type TRemainingCardCounter } from "@/app/_libs/card";
import { useState } from "react";

type TInBetweenCalculatorComponent = {
    digitValuePairs: TDigitValuePairs,
    initialCardCounter: TRemainingCardCounter,
};

 
export default function InBetweenCalculatorComponent({ digitValuePairs, initialCardCounter }: TInBetweenCalculatorComponent) {

    // States
    const [cardCounter, setCardCounter] = useState(initialCardCounter);
    const [card1, setCard1] = useState<keyof TDigitValuePairs | null>(null);
    const [card2, setCard2] = useState<keyof TDigitValuePairs | null>(null);


    // Functions
    function calculateProbability() {

        // If either one card 1 or card 2 is not available, unable to calculate.
        if (!card1 || !card2) {
            return {};
        }

        let [c1, c2] = [card1, card2];

        // Swap if needed to ensure c1 <= c2
        if (c1 > c2) {
            [c1, c2] = [c2, c1];
        }

        // Get totalCount
        let totalCount = 0;
        Object.values(cardCounter).forEach((count) => {
            totalCount += count;
        });

        const pLose2 = calculateCardLeft(c1, c2, cardCounter, "hit") / totalCount;
        const pLose1 = calculateCardLeft(c1, c2, cardCounter, "notInBetween") / totalCount;
        const pWin1 = calculateCardLeft(c1, c2, cardCounter, "inBetween") / totalCount;

        const probabilities = {
            'Probability of Losing Double': pLose2,
            'Probability of Losing': pLose1,
            'Probability of Winning': pWin1,
        };

        return probabilities;
    };


    // Handlers
    const handleReset = () => {
        const confirmReset = window.confirm("Are you sure you want to reset?");
        if (!confirmReset) {
            return;
        }

        setCardCounter(initialCardCounter);
        setCard1(null);
        setCard2(null);
    };

    const handleCounterUpdate = (digit: keyof TDigitValuePairs, mode: "increment" | "decrement") => {

        setCardCounter(prevCardCounter => {
            let count = prevCardCounter[digit];

            // Sets min/max
            let [min, max] = [0, 4];
            if (digit === card1 && digit === card2) {
                [min, max] = [2, 2];
            }
            else if (digit === card1 || digit === card2) {
                [min, max] = [1, 3];
            }

            // Handle based on mode (increment/decrement)
            if (mode === "increment" && count < max) {
                count += 1;
            }
            else if (mode === "decrement" && count > min) {
                count -= 1;
            }

            return {...prevCardCounter, [digit]: count};
        });

    };

    const handleCardSelect = (cardNumber: "c1" | "c2") => (e: React.ChangeEvent<HTMLSelectElement>) => {
        const digit = Number(e.target.value) as unknown as keyof TDigitValuePairs;

        if (cardCounter[digit] > 0) {
            if (cardNumber === "c1") setCard1(digit);
            else if (cardNumber === "c2") setCard2(digit);
        }

        else {
            if (cardNumber === "c1") setCard1(null);
            else if (cardNumber === "c2") setCard2(null);
        }

        return
    };


    return (
        <div className="flex flex-col gap-8 my-4">
            <p className="text">Keep track of what cards are drawn by clicking the "+" and "-" buttons. Select your Card1/Card2 and the probability will be automatically calculated.</p>
            <button className="btn-primary w-fit" onClick={() => handleReset()}>Reset</button>

            <ul className="flex flex-col gap-4">
                {Object.entries(cardCounter).map(([k, v]) => {
                    const digit = Number(k) as keyof typeof digitValuePairs ;
                    const value = digitValuePairs[digit];
                    const count = v;

                    return (
                        <li key={digit} className="text flex items-center gap-8 justify-start">
                            <span className="flex gap-4">Card {value}: <span className="font-bold">{count}</span></span>
                            <button className="btn-primary w-fit" onClick={() => handleCounterUpdate(digit, "increment")}>+</button>
                            <button className="btn-primary w-fit" onClick={() => handleCounterUpdate(digit, "decrement")}>-</button>
                        </li>
                    )
                })}
            </ul>

            {[{cardNumber: "c1", card: card1, description: "Select Card 1"}, {cardNumber: "c2", card: card2, description: "Select Card 2"}].map((item) => {
                return (
                    <select className="w-fit" key={item.cardNumber} value={item.card || ""} onChange={handleCardSelect(item.cardNumber as "c1" | "c2")}>
                        <option value="">{item.description}</option>
                        {Object.entries(cardCounter).map(([k, v]) => {
                            const digit = Number(k) as keyof typeof digitValuePairs;
                            const value = digitValuePairs[digit];
                            const count = v;

                            let isDisabled = count <= 0;
                            if (card1 && card2) isDisabled = count-2 <= 0
                            else if (card1 || card2) isDisabled = count-1 <=0
                
                            return <option key={digit} value={digit} disabled={isDisabled}>{value} {count<=0 && " (Unavailable)"}</option>
                        })}
                    </select>
                );
            })}

            <div className="flex flex-col justify-start align-top items-start">
                {Object.entries(calculateProbability()).map(([description, probability], index) => {
                    if (typeof probability !== "number") {
                        return null;
                    }
                    return (
                        <p key={index} className="text">{`${description}: ${(probability*100).toFixed(2)}%`}</p>
                    );
                })}
            </div>        
        </div>
    );
};