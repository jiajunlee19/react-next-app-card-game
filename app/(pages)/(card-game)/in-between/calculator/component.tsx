"use client"

import { type TDigitValuePairs, type TRemainingCardCounter } from "@/app/_libs/card";
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


    // Handlers
    const handleReset = () => {
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
        <>
            <button className="btn-primary" onClick={() => handleReset()}>Reset</button>

            <ul>
                {Object.entries(cardCounter).map(([k, v]) => {
                    const digit = Number(k) as keyof typeof digitValuePairs ;
                    const value = digitValuePairs[digit];
                    const count = v;

                    return (
                        <li key={digit} className="text">
                            Card {value}: {count}
                            <button className="btn-primary" onClick={() => handleCounterUpdate(digit, "increment")}>+</button>
                            <button className="btn-primary" onClick={() => handleCounterUpdate(digit, "decrement")}>-</button>
                        </li>
                    )
                })}
            </ul>

            {[{cardNumber: "c1", card: card1, description: "Select Card 1"}, {cardNumber: "c2", card: card2, description: "Select Card 2"}].map((item) => {
                return (
                    <select key={item.cardNumber} value={item.card || ""} onChange={handleCardSelect(item.cardNumber as "c1" | "c2")}>
                        <option value="">{item.description}</option>
                        {Object.entries(cardCounter).map(([k, v]) => {
                            const digit = Number(k) as keyof typeof digitValuePairs ;
                            const value = digitValuePairs[digit];
                            const count = v;

                            let isDisabled = count <= 0;
                            if (card1 && card2) isDisabled = count-2 <= 0
                            else if (card1 || card2) isDisabled = count-1 <=0
                
                            return <option key={digit} value={digit} disabled={isDisabled}>{value} {count<=0 && " (Unavailable)"}</option>
                        })}
                    </select>
                );
            })};
        </>
    );
};