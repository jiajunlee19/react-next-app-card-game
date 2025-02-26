"use client"

import { calculateCardLeft, type TDigitValuePairs, type TRemainingCardCounter } from "@/app/_libs/card";
import { useState } from "react";

type TNgaoCalculatorComponent = {
    digitValuePairs: TDigitValuePairs,
    initialCardCounter: TRemainingCardCounter,
};

 
export default function NgaoCalculatorComponent({ digitValuePairs, initialCardCounter }: TNgaoCalculatorComponent) {

    // States
    const [cardCounter, setCardCounter] = useState(initialCardCounter);
    const [card1, setCard1] = useState<keyof TDigitValuePairs | null>(null);
    const [card2, setCard2] = useState<keyof TDigitValuePairs | null>(null);
    const [card3, setCard3] = useState<keyof TDigitValuePairs | null>(null);
    const [card4, setCard4] = useState<keyof TDigitValuePairs | null>(null);
    const [card5, setCard5] = useState<keyof TDigitValuePairs | null>(null);

    const cards = [
        {cardNumber: "c1", card: card1, description: "Select Card 1"}, 
        {cardNumber: "c2", card: card2, description: "Select Card 2"},
        {cardNumber: "c3", card: card3, description: "Select Card 3"},
        {cardNumber: "c4", card: card4, description: "Select Card 4"},
        {cardNumber: "c5", card: card5, description: "Select Card 5"},
    ];

    // Functions


    // Handlers
    const handleReset = () => {
        const confirmReset = window.confirm("Are you sure you want to reset?");
        if (!confirmReset) {
            return;
        }

        setCard1(null);
        setCard2(null);
        setCard3(null);
        setCard4(null);
        setCard5(null);
    };

    const handleCardSelect = (cardNumber: "c1" | "c2" | "c3" | "c4" | "c5") => (e: React.ChangeEvent<HTMLSelectElement>) => {
        const digit = Number(e.target.value) as unknown as keyof TDigitValuePairs;

        if (cardCounter[digit] > 0) {
            if (cardNumber === "c1") setCard1(digit);
            else if (cardNumber === "c2") setCard2(digit);
            else if (cardNumber === "c3") setCard3(digit);
            else if (cardNumber === "c4") setCard4(digit);
            else if (cardNumber === "c5") setCard5(digit);
        }

        else {
            if (cardNumber === "c1") setCard1(null);
            else if (cardNumber === "c2") setCard2(null);
            else if (cardNumber === "c3") setCard3(null);
            else if (cardNumber === "c4") setCard4(null);
            else if (cardNumber === "c5") setCard5(null);
        }

        return
    };


    return (
        <div className="flex flex-col gap-8 my-4">
            <p className="text">Select three cards to calculate your points on the first round. Select five cards to calculate your ox strength on the second round.</p>
            <button className="btn-primary w-fit" onClick={() => handleReset()}>Reset</button>
      
            {cards.map((item) => {
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
        </div>
    );
};