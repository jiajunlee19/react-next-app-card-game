"use client"

import { calculateCardLeft, type TDigitValuePairs, type TRemainingCardCounter } from "@/app/_libs/card";
import { useState } from "react";

type TNgaoCalculatorComponent = {
    digitValuePairs: TDigitValuePairs,
    initialCardCounter: TRemainingCardCounter,
};

 
export default function NgaoCalculatorComponent({ digitValuePairs, initialCardCounter }: TNgaoCalculatorComponent) {

    const cardCounter = initialCardCounter;

    // States
    type TCardSelector = {
        cardNumber: "c1" | "c2" | "c3" | "c4" | "c5",
        card: keyof TDigitValuePairs | null,
        description: "Select Card 1" | "Select Card 2" | "Select Card 3" | "Select Card 4" | "Select Card 5",
        disabled: boolean,
    };
    const [cardSelectors, setCardSelectors] = useState<TCardSelector[]>([
        {cardNumber: "c1", card: null, description: "Select Card 1", disabled: false}, 
        {cardNumber: "c2", card: null, description: "Select Card 2", disabled: false},
        {cardNumber: "c3", card: null, description: "Select Card 3", disabled: false},
        {cardNumber: "c4", card: null, description: "Select Card 4", disabled: true},
        {cardNumber: "c5", card: null, description: "Select Card 5", disabled: true},
    ]);


    // Functions
    function canCalculateFirst() {
        // if card 4 or 5 selected, return false
        if (cardSelectors.slice(3, 5).some(cardSelector => cardSelector.card !== null)) return false;

        // if all card 1/2/3 are disabled, return false
        if (cardSelectors.slice(0, 3).every(cardSelector => cardSelector.disabled)) return false;

        // if all card 1/2/3 are selected, return true
        return cardSelectors.slice(0, 3).every(cardSelector => cardSelector.card !== null);
    };

    function canCalculateSecond() {
        // if all card 1/2/3/4/5 are disabled, return false
        if (cardSelectors.every(cardSelector => cardSelector.disabled)) return false;

        // if all card 1/2/3/4/5 are selected, return true
        return cardSelectors.every(cardSelector => cardSelector.card !== null);
    };


    // Handlers
    const handleReset = () => {
        const confirmReset = window.confirm("Are you sure you want to reset?");
        if (!confirmReset) {
            return;
        }

        setCardSelectors([
            {cardNumber: "c1", card: null, description: "Select Card 1", disabled: false}, 
            {cardNumber: "c2", card: null, description: "Select Card 2", disabled: false},
            {cardNumber: "c3", card: null, description: "Select Card 3", disabled: false},
            {cardNumber: "c4", card: null, description: "Select Card 4", disabled: true},
            {cardNumber: "c5", card: null, description: "Select Card 5", disabled: true},
        ]);
    };

    const handleCardSelect = (cardNumber: "c1" | "c2" | "c3" | "c4" | "c5") => (e: React.ChangeEvent<HTMLSelectElement>) => {
        const digit = Number(e.target.value) as unknown as keyof TDigitValuePairs;

        if (cardCounter[digit] > 0) {
            setCardSelectors(prevCardSelectors => prevCardSelectors.map((cardSelector) => {
                if (cardSelector.cardNumber !== cardNumber) return cardSelector
                return {...cardSelector, card: digit};
            }));
        }

        else {
            setCardSelectors(prevCardSelectors => prevCardSelectors.map((cardSelector) => {
                if (cardSelector.cardNumber !== cardNumber) return cardSelector
                return {...cardSelector, card: null};
            }));
        }

        return
    };

    const handleCalculate = () => {
        if (canCalculateFirst()) {
            setCardSelectors(prevCardSelectors => prevCardSelectors.map((cardSelector) => {
                if (cardSelector.cardNumber === "c1" || cardSelector.cardNumber === "c2" || cardSelector.cardNumber === "c3") return {...cardSelector, disabled: true}
                else if (cardSelector.cardNumber === "c4" || cardSelector.cardNumber === "c5") return {...cardSelector, disabled: false};
                return cardSelector
            }));
        }

        if (canCalculateSecond()) {
            setCardSelectors(prevCardSelectors => prevCardSelectors.map((cardSelector) => {
                return {...cardSelector, disabled: true};
            }));
        }
    };


    return (
        <div className="flex flex-col gap-8 my-4">
            <p className="text">Select three cards to calculate your points on the first round. Select another 2 cards to calculate your ox strength on the second round.</p>
            <button className="btn-primary w-fit" onClick={handleReset}>Reset</button>
            <button className="btn-primary w-fit" onClick={handleCalculate} disabled={!canCalculateFirst() && !canCalculateSecond()}>Calculate</button>
            {cardSelectors.map((cardSelector) => {
                return (
                    <select className="w-fit" key={cardSelector.cardNumber} value={cardSelector.card || ""} onChange={handleCardSelect(cardSelector.cardNumber as "c1" | "c2" | "c3" | "c4" | "c5")} disabled={cardSelector.disabled}>
                        <option value="">{cardSelector.description}</option>
                        {Object.entries(cardCounter).map(([k, v]) => {
                            const digit = Number(k) as keyof typeof digitValuePairs;
                            const value = digitValuePairs[digit];
                            const count = v;

                            let isDisabled = count <= 0;
                            const cards = [cardSelectors[0].card, cardSelectors[1].card, cardSelectors[2].card, cardSelectors[3].card, cardSelectors[4].card];

                            // Count the number of times the digit appears in the selected cards
                            const digitCount = cards.filter(card => card === digit).length;

                            // Adjust isDisabled based on the occurrence of the digit
                            if (digitCount > 0) {
                                isDisabled = count - digitCount <= 0;
                            }
                                            
                            return <option key={digit} value={digit} disabled={isDisabled}>{value} {count<=0 && " (Unavailable)"}</option>
                        })}
                    </select>
                );
            })}
        </div>
    );
};