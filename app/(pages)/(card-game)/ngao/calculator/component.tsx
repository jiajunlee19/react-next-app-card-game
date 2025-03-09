"use client"

import { shuffleCardDeck, suits, values, type TCard, type TDigitValuePairs, type TRemainingCardCounter } from "@/app/_libs/card";
import { useEffect, useState } from "react";

type TNgaoCalculatorComponent = {
    initialCardDeck: TCard[],
    digitValuePairs: TDigitValuePairs,
    initialCardCounter: TRemainingCardCounter,
};

 
export default function NgaoCalculatorComponent({ initialCardDeck, digitValuePairs, initialCardCounter }: TNgaoCalculatorComponent) {

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
    const [cardDeck, setCardDeck] = useState(shuffleCardDeck(initialCardDeck));
    const [result, setResult] = useState<string | null>(null);


    // Functions
    function canDistributeC1C2C3() {

        // if either card 1/2/3 selected, return false
        if (cardSelectors.slice(0, 3).some(cardSelector => cardSelector.card !== null)) return false;

        // if card 1/2/3 are not disabled and card 4/5 are disabled, return true
        return (!cardSelectors.slice(0, 3).every(cardSelector => cardSelector.disabled) && cardSelectors.slice(3, 5).every(cardSelector => cardSelector.disabled));
    };

    function canDistributeC4C5() {

        // if either card 4/5 selected, return false
        if (cardSelectors.slice(3, 5).some(cardSelector => cardSelector.card !== null)) return false;

        // if card 1/2/3 are disabled and card 4/5 are not disabled, return true
        return (cardSelectors.slice(0, 3).every(cardSelector => cardSelector.disabled) && !cardSelectors.slice(3, 5).every(cardSelector => cardSelector.disabled));
    };

    function canCalculateFirst() {
        // if either card 4/5 selected, return false
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
                if (cardSelector.card.digit > 10) points += 10;

                // Others with point of their digit
                else points += cardSelector.card.digit;
            }
        });

        points %= 10;
        if (points === 0) points = 10;

        setResult(`Result for First Round = ${points}`);
    };

    function calculateSecondResult() {

        let points = 0;
        let oxChoices = [];
        let oxStrengthChoices = [];
        let finalOxCombinations = [];

        // We will have 3 cards at the bottom and 2 cards at the top.
        //  _ _     <--- this is your ox strength
        // _ _ _    <--- this is your ox

        // Sort the 5 cards so that we could easily arrange them later
        let cards = [
            cardSelectors[0].card, cardSelectors[1].card, cardSelectors[2].card, cardSelectors[3].card, cardSelectors[4].card
        ].sort((a, b) => {
            if (!a || !b) return 0;
            if (a.digit === b.digit) {
                const suitOrder = { "♦": 1, "♣": 2, "♥": 3, "♠": 4 };
                return suitOrder[a.suit] - suitOrder[b.suit];
            }
            return a.digit - b.digit;
        });

        // Check if can form 3 cards with multiplier of 10, if yes then you haveOx, else no Ox
        // Number of iteration = 5C3 = 5!/(3!2!) = 10, use 3 pointers method
        const n = cards.length
        if (n < 3) return;
        for (let l=0; l<n-2; l++) {
            for (let m=l+1; m<n-1; m++) {
                for (let r=m+1; r<n; r++) {
                    let [digit1, suit1] = [cardSelectors[l].card?.digit, cardSelectors[l].card?.suit];
                    let [digit2, suit2] = [cardSelectors[m].card?.digit, cardSelectors[m].card?.suit];
                    let [digit3, suit3] = [cardSelectors[r].card?.digit, cardSelectors[r].card?.suit];

                    if (!digit1 || !digit2 || !digit3 || !suit1 || !suit2 || !suit3) return;

                    // By default digit value is the digit, unless its J, Q, K
                    let digitValue1 = digit1;
                    let digitValue2 = digit2;
                    let digitValue3 = digit3;

                    // For J, Q, K, overwrite digit value to 10
                    if (digit1 > 10) digitValue1 = 10;
                    if (digit2 > 10) digitValue2 = 10;
                    if (digit3 > 10) digitValue3 = 10;

                    // If the sum is equal to multiplier of 10, add them into oxChoices and oxStrengthChoices accordingly
                    if ((digitValue1 + digitValue2 + digitValue3) % 10 === 0) {
                        oxChoices.push([
                            { digit: digit1, suit: suit1 },
                            { digit: digit2, suit: suit2 },
                            { digit: digit3, suit: suit3 },
                        ]);

                        const remainingCards = cards.filter((_, index) => index !== l && index !== m && index !== r);
                        oxStrengthChoices.push([
                            {digit: remainingCards[0]?.digit, suit: remainingCards[0]?.suit},
                            {digit: remainingCards[1]?.digit, suit: remainingCards[1]?.suit},
                        ])
                    }
                }
            }
        };
        
        // If no ox, return the result as it is
        if (oxChoices.length < 1) {
            setResult(prevResult => `${prevResult}\nResult for Second Round = 0 (No Ox)`)
            return;
        }

        // For each oxChoice, check which choice is giving out the best ox strength.
        oxChoices.forEach((oxChoice, index) => {

            // When Ox strength formed with Ace of spades and a duke, you get "Ngao Dong Gu" = x5 payout	
            if (oxStrengthChoices[index].some(card => card.digit === 1 && card.suit === '♠') && oxStrengthChoices[index].some(card => [11, 12, 13].includes(card?.digit ?? 0))) {
                points = 5;
            }

            // When Ox strength formed with Ace of non-spades and a duke, you get "Ngao Nen Gu" = x3 payout
            if (oxStrengthChoices[index].some(card => card.digit === 1 && card.suit !== '♠') && oxStrengthChoices[index].some(card => [11, 12, 13].includes(card?.digit ?? 0))) {
                points = 3;
            }
            
            finalOxCombinations.push({
                oxCombination: [
                    `${oxChoice[0].digit}${oxChoice[0].suit}`,
                    `${oxChoice[1].digit}${oxChoice[1].suit}`,
                    `${oxChoice[2].digit}${oxChoice[2].suit}`,
                    `${oxStrengthChoices[index][0].digit}${oxStrengthChoices[index][0].suit}`,
                    `${oxStrengthChoices[index][1].digit}${oxStrengthChoices[index][1].suit}`,
                ], 
                points: points,
            });

            

            

            // When Ox strength formed with no special ox and ones digit of the sum = 0 or 10, you get "Single Ox 10" = x2 payout

            // When Ox strength formed with no special ox, strength = the ones digit of the sum ranged from 1 to 9, you get "Single Ox" = x1 payout

            // When there's no any three cards sum up to multiple of 10, you get "No Ox" = 0 payout

        });

        // When all 5 cards are dukes J/Q/K, you get "Din Shi Gai" or "Five Dukes" = x7 payout
        if (cardSelectors.every(cardSelector => ["J", "Q", "K"].includes(cardSelector.card?.value ?? ""))) {
            points = 7;
        }




        setResult(prevResult => `${prevResult}\nResult for Second Round = ${points}\n${JSON.stringify(oxChoices)}`)
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

    const handleDistribute = () => {
        if (canDistributeC1C2C3()) {
            setCardSelectors(prevCardSelectors => prevCardSelectors.map((cardSelector) => {    
                if (cardSelector.cardNumber === "c1" || cardSelector.cardNumber === "c2" || cardSelector.cardNumber === "c3") {
                    const [selectedCard] = cardDeck.splice(0, 1)
                    return {
                        ...cardSelector, 
                        card: selectedCard,
                    };
                }
                else return cardSelector;
            }));
        }

        else if (canDistributeC4C5()) {
            setCardSelectors(prevCardSelectors => prevCardSelectors.map((cardSelector) => {    
                if (cardSelector.cardNumber === "c4" || cardSelector.cardNumber === "c5") {
                    const [selectedCard] = cardDeck.splice(0, 1)
                    return {
                        ...cardSelector, 
                        card: selectedCard,
                    };
                }
                else return cardSelector;
            }));
        }
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

            <p className="text">Select three cards to calculate your points on the first round. Select another 2 cards to calculate your ox strength on the second round. This calculator generates the best combination to maximize your ox strength.</p>
            
            <button className="btn-primary w-fit" onClick={handleReset}>Reset</button>

            <div className="flex gap-4">
                <button className="btn-primary w-fit" onClick={handleDistribute} disabled={!canDistributeC1C2C3() && !canDistributeC4C5()}>Distribute</button>
                <button className="btn-primary w-fit" onClick={handleCalculate} disabled={!canCalculateFirst() && !canCalculateSecond()}>Calculate</button>
            </div>

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
                <p className="whitespace-pre-line">{result}</p>
            };

        </div>
    );
};