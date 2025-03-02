"use client"

import { suits, values, type TCard, type TDigitValuePairs, type TRemainingCardCounter } from "@/app/_libs/card";
import { useEffect, useState } from "react";

type TNgaoCalculatorComponent = {
    initialCardDeck: TCard[],
    digitValuePairs: TDigitValuePairs,
    initialCardCounter: TRemainingCardCounter,
};

 
export default function NgaoCalculatorComponent({ initialCardDeck, digitValuePairs, initialCardCounter }: TNgaoCalculatorComponent) {

    const cardCounter = initialCardCounter;

    // States
    type TCardSelector = {
        cardNumber: "c1" | "c2" | "c3" | "c4" | "c5",
        card: TCard | null,
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
    const [cardDeck, setCardDeck] = useState(initialCardDeck);
    const [result, setResult] = useState<string | null>(null);


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

    function calculateFirstResult() {
        let points = 0;
        cardSelectors.slice(0, 3).map((cardSelector) => {
            if ((cardSelector.cardNumber === "c1" || cardSelector.cardNumber === "c2" || cardSelector.cardNumber === "c3") && cardSelector.card?.digit) {

                // J, Q, K with point of 10
                if (cardSelector.card.digit === 11 || cardSelector.card.digit === 12 || cardSelector.card.digit === 13) points += 10;

                // Others with point of their digit
                else points += cardSelector.card.digit;
            }
        });

        points %= 10;
        if (points === 0) points = 10;

        setResult(`Result for First Round = ${points}`);
    };

    function calculateSecondResult() {
        let points = 0


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

        setCardDeck(initialCardDeck);
        setResult(null);
    };

    const handleValueSelect = (cardNumber: "c1" | "c2" | "c3" | "c4" | "c5") => (e: React.ChangeEvent<HTMLSelectElement>) => {
        
        const value = e.target.value as TCard["value"] | null;
        if (!value) return;

        setCardSelectors(prevCardSelectors => prevCardSelectors.map((cardSelector) => {
            if (cardSelector.cardNumber !== cardNumber) return cardSelector;

            const suit = cardSelector.card?.suit || "♦";
            const selectedCard = cardDeck.find(card => (card.value === value) && (card.suit === suit));

            return {
                ...cardSelector, 
                card: selectedCard || null,
            };
        }));

        return
    };

    const handleSuitSelect = (cardNumber: "c1" | "c2" | "c3" | "c4" | "c5") => (e: React.ChangeEvent<HTMLSelectElement>) => {
        
        const suit = e.target.value as TCard["suit"] | null;
        if (!suit) return;

        setCardSelectors(prevCardSelectors => prevCardSelectors.map((cardSelector) => {
            if (cardSelector.cardNumber !== cardNumber) return cardSelector
            
            const value = cardSelector.card?.value || "A";
            const selectedCard = cardDeck.find(card => (card.value === value) && (card.suit === suit));

            return {
                ...cardSelector, 
                card: selectedCard || null,
            };
        }));

        return
    };

    const handleCalculate = () => {
        if (canCalculateFirst()) {
            setCardSelectors(prevCardSelectors => prevCardSelectors.map((cardSelector) => {
                if (cardSelector.cardNumber === "c1" || cardSelector.cardNumber === "c2" || cardSelector.cardNumber === "c3") return {...cardSelector, disabled: true}
                else if (cardSelector.cardNumber === "c4" || cardSelector.cardNumber === "c5") return {...cardSelector, disabled: false};
                return cardSelector
            }));

            calculateFirstResult();
        }

        if (canCalculateSecond()) {
            setCardSelectors(prevCardSelectors => prevCardSelectors.map((cardSelector) => {
                return {...cardSelector, disabled: true};
            }));

            calculateSecondResult();
        }
    };


    return (
        <div className="flex flex-col gap-8 my-4">

            <p className="text">Select three cards to calculate your points on the first round. Select another 2 cards to calculate your ox strength on the second round.</p>
            
            <button className="btn-primary w-fit" onClick={handleReset}>Reset</button>
            <button className="btn-primary w-fit" onClick={handleCalculate} disabled={!canCalculateFirst() && !canCalculateSecond()}>Calculate</button>

            <div className="flex flex-col gap-8">
                {cardSelectors.map((cardSelector) => {
                    return (
                        <div className="flex gap-4" key={cardSelector.cardNumber}>
                            <select className="w-fit" value={cardSelector.card?.value || ""} onChange={handleValueSelect(cardSelector.cardNumber as "c1" | "c2" | "c3" | "c4" | "c5")} disabled={cardSelector.disabled}>
                                <option value="">{cardSelector.description}</option>
                                {values.map((value) => {
                                    return <option key={value} value={value}>{value}</option>
                                })}
                            </select>
                            <select className="w-fit" value={cardSelector.card?.suit || ""} onChange={handleSuitSelect(cardSelector.cardNumber as "c1" | "c2" | "c3" | "c4" | "c5")} disabled={cardSelector.disabled}>
                                <option value="">{cardSelector.description}</option>
                                {suits.map((suit) => {
                                    return <option key={suit} value={suit}>{suit}</option>
                                })}
                            </select>
                        </div>
                    );
                })}
            </div>

            {result && 
                <p>{result}</p>
            };

        </div>
    );
};