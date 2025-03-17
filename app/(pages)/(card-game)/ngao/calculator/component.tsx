"use client"

import { shuffleCardDeck, suits, type TBoardCard, values, type TCard, type TDigitValuePairs, type TRemainingCardCounter } from "@/app/_libs/card";
import { useState } from "react";
import { CardComponent } from "@/app/(pages)/(card-game)/card";
import BaseTable from "@/app/_components/basic/table";
import { columns } from "@/app/(pages)/(card-game)/ngao/calculator/columns";

type TNgaoCalculatorComponent = {
    initialCardDeck: TCard[],
    digitValuePairs: TDigitValuePairs,
};

 
export default function NgaoCalculatorComponent({ initialCardDeck, digitValuePairs }: TNgaoCalculatorComponent) {

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
    const [bestOxCombination, setBestOxCombination] = useState<[TCard["id"],TCard["id"],TCard["id"],TCard["id"],TCard["id"]] | []>([]);


    // Arrays
    type TOxCombination = {
        oxCombination: [string, string, string, string, string],
        points: number,
        description: string,
    };
    let finalOxCombinations: TOxCombination[] = [];


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

    function interchangeThreeOrSix(digit: TCard["digit"]) {
        if (digit === 3) return 6;
        if (digit === 6) return 3;
        return digit;
    };

    function calculateSecondResult() {

        let points = 0;
        let description = "";
        let oxChoices = [];
        let oxStrengthChoices = [];


        finalOxCombinations = [];

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
                    let [digit1, suit1] = [cards[l]?.digit, cards[l]?.suit];
                    let [digit2, suit2] = [cards[m]?.digit, cards[m]?.suit];
                    let [digit3, suit3] = [cards[r]?.digit, cards[r]?.suit];

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
                    if (((digitValue1 + digitValue2 + digitValue3) % 10 === 0) || 
                            ((digitValue1 + digitValue2 + interchangeThreeOrSix(digitValue3)) % 10 === 0) ||
                            ((digitValue1 + interchangeThreeOrSix(digitValue2) + digitValue3) % 10 === 0) ||
                            ((digitValue1 + interchangeThreeOrSix(digitValue2) + interchangeThreeOrSix(digitValue3)) % 10 === 0) ||
                            ((interchangeThreeOrSix(digitValue1) + digitValue2 + digitValue3) % 10 === 0) ||
                            ((interchangeThreeOrSix(digitValue1) + digitValue2 + interchangeThreeOrSix(digitValue3)) % 10 === 0) ||
                            ((interchangeThreeOrSix(digitValue1) + interchangeThreeOrSix(digitValue2) + digitValue3) % 10 === 0) ||
                            ((interchangeThreeOrSix(digitValue1) + interchangeThreeOrSix(digitValue2) + interchangeThreeOrSix(digitValue3)) % 10 === 0)) {
                        oxChoices.push([
                            { digit: digit1, suit: suit1 },
                            { digit: digit2, suit: suit2 },
                            { digit: digit3, suit: suit3 },
                        ]);

                        const remainingCards = cards.filter((_, index) => index !== l && index !== m && index !== r);
                        if (remainingCards.length !== 2) return;
                        
                        oxStrengthChoices.push([
                            {digit: remainingCards[0]!.digit, suit: remainingCards[0]!.suit},
                            {digit: remainingCards[1]!.digit, suit: remainingCards[1]!.suit},
                        ])
                    }
                }
            }
        };
        
        // When there's no any three cards sum up to multiple of 10, you get "No Ox" = 0 payout
        if (oxChoices.length < 1) {
            points = 0
            setResult(prevResult => `${prevResult}\nResult for Second Round = 0 (No Ox)`)
            return;
        }

        // For each oxChoice, check which choice is giving out the best ox strength.
        oxChoices.forEach((oxChoice, index) => {

            // By default digit value is the digit, unless its J, Q, K
            let [oxDigit1, oxSuit1] = [oxChoice[0].digit, oxChoice[0].suit];
            let [oxDigit2, oxSuit2] = [oxChoice[1].digit, oxChoice[1].suit];
            let [oxDigit3, oxSuit3] = [oxChoice[2].digit, oxChoice[2].suit];
            let [oxStrengthDigit1, oxStrengthSuit1] = [oxStrengthChoices[index][0].digit, oxStrengthChoices[index][0].suit];
            let [oxStrengthDigit2, oxStrengthSuit2] = [oxStrengthChoices[index][1].digit, oxStrengthChoices[index][1].suit];

            // By default digit value is the digit, unless its J, Q, K
            let oxDigitValue1 = oxDigit1;
            let oxDigitValue2 = oxDigit2;
            let oxDigitValue3 = oxDigit3;
            let oxStrengthDigitValue1 = oxStrengthDigit1;
            let oxStrengthDigitValue2 = oxStrengthDigit2;

            // For J, Q, K, overwrite digit value to 10
            if (oxDigit1 > 10) oxDigitValue1 = 10;
            if (oxDigit2 > 10) oxDigitValue2 = 10;
            if (oxDigit3 > 10) oxDigitValue3 = 10;
            if (oxStrengthDigit1 > 10) oxStrengthDigitValue1 = 10;
            if (oxStrengthDigit2 > 10) oxStrengthDigitValue2 = 10;

            // When all 5 cards are dukes J/Q/K, you get "Din Shi Gai" or "Five Dukes" = x7 payout
            if (cardSelectors.every(cardSelector => [11, 12, 13].includes(cardSelector.card?.digit ?? 0))) {
                points = 7;
                description = "Din Shi Gai";
            }

            // When Ox strength formed with Ace of spades and a duke, you get "Ngao Dong Gu" = x5 payout	
            else if ((oxStrengthChoices[index][0].digit === 1 && oxStrengthChoices[index][0].suit === '♠' && [11, 12, 13].includes(oxStrengthChoices[index][1].digit)) || 
                        (oxStrengthChoices[index][1].digit === 1 && oxStrengthChoices[index][1].suit === '♠' && [11, 12, 13].includes(oxStrengthChoices[index][0].digit))) {
                points = 5;
                description = "Ngao Dong Gu";
            }

            // When Ox strength formed with Ace of non-spades and a duke, you get "Ngao Nen Gu" = x3 payout
            else if ((oxStrengthChoices[index][0].digit === 1 && oxStrengthChoices[index][0].suit !== '♠' && [11, 12, 13].includes(oxStrengthChoices[index][1].digit)) || 
                        (oxStrengthChoices[index][1].digit === 1 && oxStrengthChoices[index][1].suit !== '♠' && [11, 12, 13].includes(oxStrengthChoices[index][0].digit))) {
                points = 3;
                description = "Ngao Nen Gu";
            }
            
            // When Ox strength formed with two same value, you get "Double Ox" = x2 payout
            else if (oxStrengthDigit1 === oxStrengthDigit2) {
                points = 2;
                description = "Double Ox"
            }

            // When Ox strength formed with no special ox and ones digit of the sum = 0 or 10, you get "Single Ox 10" = x2 payout
            else if (((oxStrengthDigitValue1 + oxStrengthDigitValue2) % 10 === 0) || 
                        ((interchangeThreeOrSix(oxStrengthDigitValue1) + oxStrengthDigitValue2) % 10 === 0) ||
                        ((oxStrengthDigitValue1 + interchangeThreeOrSix(oxStrengthDigitValue2)) % 10 === 0) ||
                        ((interchangeThreeOrSix(oxStrengthDigitValue1) + interchangeThreeOrSix(oxStrengthDigitValue2)) % 10 === 0)
            ) {
                points = 2;
                description = "Single Ox 10"
            }

            // When Ox strength formed with no special ox, strength = the ones digit of the sum ranged from 1 to 9, you get "Single Ox" = x1 payout
            else {
                points = Math.max(((oxStrengthDigitValue1 + oxStrengthDigitValue2) % 10),
                                    ((interchangeThreeOrSix(oxStrengthDigitValue1) + oxStrengthDigitValue2) % 10),
                                    ((oxStrengthDigitValue1 + interchangeThreeOrSix(oxStrengthDigitValue2)) % 10),
                                    ((interchangeThreeOrSix(oxStrengthDigitValue1) + interchangeThreeOrSix(oxStrengthDigitValue2)) % 10),     
                                );
                description = `Single Ox ${points}`
                points /= 10;
                points += 1;
            }

            // Convert digits back to A J Q K values
            const oxValue1 = digitValuePairs[oxDigit1];
            const oxValue2 = digitValuePairs[oxDigit2];
            const oxValue3 = digitValuePairs[oxDigit3];
            const oxStrengthValue1 = digitValuePairs[oxStrengthDigit1];
            const oxStrengthValue2 = digitValuePairs[oxStrengthDigit2];

            finalOxCombinations.push({
                oxCombination: [
                    `${oxValue1}${oxSuit1}`,
                    `${oxValue2}${oxSuit2}`,
                    `${oxValue3}${oxSuit3}`,
                    `${oxStrengthValue1}${oxStrengthSuit1}`,
                    `${oxStrengthValue2}${oxStrengthSuit2}`,
                ], 
                points: points,
                description: description,
            });

        });


        // Identify best ox combination based on the highest points
        const highestPointsCombination = finalOxCombinations.reduce((max, current) => {
            return (current.points > max.points) ? current : max;
        }, finalOxCombinations[0]);

        const bestOxCombination = highestPointsCombination.oxCombination as [TCard["id"],TCard["id"],TCard["id"],TCard["id"],TCard["id"],];
        setResult(prevResult => `${prevResult}\nResult for Second Round = ${points} (${highestPointsCombination.description})`);
        setBestOxCombination(bestOxCombination);
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
        setBestOxCombination([]);
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
            }

            <div className="grid grid-cols-2 gap-4 place-items-center">
                {bestOxCombination.slice(3, 5).map((comb, index) => {
                    const cardNumber = `c${index+1}` as TBoardCard["cardNumber"];
                    const card = initialCardDeck.find(card => card.id === comb);
                    return (
                        <CardComponent key={index} boardCard={{cardNumber: cardNumber , face: "up", card: card ?? null}} />
                    );
                })}
            </div>

            <div className="grid grid-cols-3 gap-4 place-items-center">
                {bestOxCombination.slice(0, 3).map((comb, index) => {
                    const cardNumber = `c${index+3}` as TBoardCard["cardNumber"];
                    const card = initialCardDeck.find(card => card.id === comb);
                    return (
                        <CardComponent key={index} boardCard={{cardNumber: cardNumber , face: "up", card: card ?? null}} />
                    );
                })}
            </div>

            <BaseTable columns={columns} data={finalOxCombinations} />

        </div>
    );
};