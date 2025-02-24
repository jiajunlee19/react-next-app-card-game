"use client"

import { type TCard, type TBoardCard, type TRemainingCardCounter, getInitialCardCounter, calculateCardLeft, getDigitValuePairs } from "@/app/_libs/card";
import { shuffleCardDeck } from '@/app/_libs/card';
import { useEffect, useRef, useState } from 'react';
import { CardComponent, StackedCardDeckComponent } from "@/app/(pages)/(card-game)/in-between/card";
import Link from "next/link";

type TInBetweenComponent = {
    cardDeck: TCard[],
};

export default function InBetweenGameComponent({ cardDeck }: TInBetweenComponent) {

    const digitValuePairs = getDigitValuePairs();

    // Game States
    const [shuffledCardDeck, setShuffledCardDeck] = useState<TCard[] | []>(shuffleCardDeck(cardDeck));
    const [betAmount, setBetAmount] = useState(0);
    const [bankAmount, setBankAmount] = useState(0);
    const [boardCards, setBoardCards] = useState<TBoardCard[]>([
        { cardNumber: "c1", face: "down", card: null }, 
        { cardNumber: "c3", face: "down", card: null }, 
        { cardNumber: "c2", face: "down", card: null }, 
    ]);
    const [canPlaceBet, setCanPlaceBet] = useState(false);
    const [result, setResult] = useState<-2 | -1 | 1 | 0>(0);
    const [isShowProbability, setIsShowProbability] = useState(false);
    const [remainingCardCounter, setRemainingCardCounter] = useState<TRemainingCardCounter>(getInitialCardCounter());


    // Effects
    const betRef = useRef<HTMLInputElement>(null);
    useEffect(() => {
        if (canPlaceBet && betRef.current) {
            betRef.current.focus();
        }
    }, [canPlaceBet]);

    const initBankRef = useRef<HTMLInputElement>(null);
    useEffect(() => {
        if (canInitBank() && initBankRef.current) {
            setTimeout(() => initBankRef.current?.focus(), 0);
        }
    }, [canInitBank()]);


    // Functions
    function distributeCard(cardNumber: TBoardCard["cardNumber"]) {
        const [card] = shuffledCardDeck.splice(0, 1);
        setBoardCards(prevBoardCards => prevBoardCards.map((boardCard) => {
            if (boardCard.cardNumber === cardNumber) {
                return { ...boardCard, face: "down", card: card};
            }
            return boardCard;
        }));
    };

    function changeCardFace(cardNumber: TBoardCard["cardNumber"], mode: "reveal" | "hide" | "toggle") {
        setBoardCards(prevBoardCards => prevBoardCards.map((boardCard) => {
            // if no card, do nothing
            if (!boardCard.card) {
                return boardCard;
            }

            // if card number matches, change face based on the mode
            if (boardCard.cardNumber === cardNumber) {
                if (mode === "reveal") {
                    setRemainingCardCounter(prevRemainingCardCounter => {
                        const remainingCardCounter = {...prevRemainingCardCounter};
                        if (boardCard.card) remainingCardCounter[boardCard.card.digit] -= 1
                        return remainingCardCounter;
                    });
                    return { ...boardCard, face: "up"};
                }
                else if (mode === "hide") return { ...boardCard, face: "down"};
                else return { ...boardCard, face: boardCard.face === "down" ? "up" : "down" };
            }

            // Otherwise, do nothing
            return boardCard;
        }));

    };

    function calculateProbability() {
        const [C1, C3, C2] = boardCards;

        // If either one card 1 or card 2 is not available, unable to calculate.
        if (!C1.card || C1.face === "down" || !C2.card || C2.face === "down") {
            return {};
        }

        // If C3 is faced up, user already knew the result, no need to calculate.
        if (C3.card && C3.face === "up") {
            return {};
        }

        let [c1, c2] = [C1.card.digit, C2.card.digit];

        // Swap if needed to ensure c1 <= c2
        if (c1 > c2) {
            [c1, c2] = [c2, c1];
        }

        const pLose2 = calculateCardLeft(c1, c2, remainingCardCounter, "hit") / (shuffledCardDeck.length+1);
        const pLose1 = calculateCardLeft(c1, c2, remainingCardCounter, "notInBetween") / (shuffledCardDeck.length+1);
        const pWin1 = calculateCardLeft(c1, c2, remainingCardCounter, "inBetween") / (shuffledCardDeck.length+1);

        const probabilities = {
            'Probability of Losing Double': pLose2,
            'Probability of Losing': pLose1,
            'Probability of Winning': pWin1,
        };

        return probabilities;
    };

    function placeBet(amount: number) {
        if (amount <= 0 || amount > bankAmount || !Number.isInteger(amount)) {
            setBetAmount(1);
            return;
        }
        setBetAmount(amount);
    };

    function decideWinLose() {
        const [C1, C3, C2] = boardCards;
        // Do nothing if the game is still in-progress and the result is not ready to be decided.
        if (!C1.card || C1.face === 'down' || !C3.card || !C2.card || C2.face === 'down') {
            setResult(0);
            return;
        }

        // Reveal Card 3
        changeCardFace("c3", "reveal");

        // If C3 is exactly equal to C1 or C2, player loses x2 of bet amount to the bank
        if (C3.card.digit === C1.card.digit || C3.card.digit === C2.card.digit) {
            setBankAmount(prevBankAmount => prevBankAmount + betAmount*2);
            setResult(-2);
        } 
        
        // If C3 is not in range of C1 and C2, player loses x1 of bet amount to the bank
        else if (C3.card.digit < Math.min(C1.card.digit,C2.card.digit) || C3.card.digit > Math.max(C1.card.digit,C2.card.digit)) {
            setBankAmount(prevBankAmount => prevBankAmount + betAmount*1);
            setResult(-1);
        }

        // If C3 is in range of C1 and C2, player wins x1 of bet amount from the bank
        else if (Math.min(C1.card.digit,C2.card.digit) < C3.card.digit && C3.card.digit < Math.max(C1.card.digit,C2.card.digit)) {
            setBankAmount(prevBankAmount => prevBankAmount - betAmount*1); 
            setResult(1);
        }

        return;
    };

    function displayResult(result: -2 | -1 | 1 | 0, betAmount: number) {
        if (result === -2) {
            return "Boom! Player loses x2 of bet amount to the bank !".replace("bet amount", `bet amount (${(betAmount*2).toString()})`)
        }
        else if (result === -1) {
            return "Oops! Player loses x1 of bet amount to the bank !".replace("bet amount", `bet amount (${(betAmount*1).toString()})`)
        }
        else if (result === 1) {
            return "Yay! Player wins x1 of bet amount from the bank !".replace("bet amount", `bet amount (${(betAmount*1).toString()})`)
        }
        return;
    };

    function resetBoardCards() {

        setBoardCards(prevBoardCards => prevBoardCards.map((boardCard) => {
            return { ...boardCard, face: "down", card: null};
        }));

        setResult(0);

    };

    function resetGame() {
        resetBoardCards();
        setShuffledCardDeck(shuffleCardDeck(cardDeck));
        setRemainingCardCounter(getInitialCardCounter());
        setCanPlaceBet(false);
        setBankAmount(0);
        setBetAmount(0);
    };

    function isValidGame() {
        if (shuffledCardDeck.length < 3 || bankAmount <= 0) {
            return false;
        }

        return true;
    };

    function canInitBank() {
        if (bankAmount === 0) {
            return true;
        }
        
        return false;
    }

    function canDistributeC1C2() {
        if (!isValidGame()) {
            return false;
        }

        const [C1, C3, C2] = boardCards;

        if (C1.card || C2.card || C3.card) {
            return false;
        }

        return true;
    }; 

    function canDistributeC3() {
        if (!isValidGame()) {
            return false;
        }

        const [C1, C3, C2] = boardCards;

        if (C3.card || !C1.card || !C2.card) {
            return false;
        }

        return true;
    };

    function canDecideWinLose() {
        const [C1, C3, C2] = boardCards;
        // Do not decide win/lose if bank is zero or result is already decided or all three cards are not drawn/faced up
        if (result !== 0 || !C1.card || C1.face === 'down' || !C3.card || !C2.card || C2.face === 'down') {
            return false;
        }

        return true;
    };

    function canGoNext() {
        if (!isValidGame() || result === 0) {
            return false;
        }
        return true;
    };


    // Handlers
    const handleInitBankChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!canInitBank()) {
            return;
        }

        const amount = parseInt(e.target.value, 10)
        if (amount <= 0 || !Number.isInteger(amount)) {
            setBankAmount(0);
            return;
        }
        setBankAmount(amount);
    };

    const handleDistributeCard = () => {
        if (canDistributeC1C2() && !canDistributeC3()) {
            setCanPlaceBet(false);
            distributeCard("c1");
            distributeCard("c2");
            return;
        }
        if (!canDistributeC1C2() && canDistributeC3()) {
            changeCardFace("c1", "reveal");
            changeCardFace("c2", "reveal");
            distributeCard("c3");
            setCanPlaceBet(true);
            return;
        }
    };

    const handleBetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!canPlaceBet) {
            return;
        }
        const betAmount = parseInt(e.target.value, 10)
        placeBet(betAmount);
    };

    const handleBetAllIn = () => {
        if (!canPlaceBet) {
            return;
        }
        placeBet(bankAmount);
    };

    const handleDecideWinLose = () => {
        if (!canDecideWinLose()) {
            return;
        }
        setCanPlaceBet(false);
        decideWinLose();
    };

    const handleGoNext = () => {
        if (!canGoNext()) {
            return;
        }
        resetBoardCards();
    };

    const handleStartNewGame = () => {
        const confirmStartNewGame = window.confirm("Are you sure you want to start a new game?");
        if (!confirmStartNewGame) {
            return;
        }
        resetGame();
    };

    const handleShowProbabilityToggle = () => {
        setIsShowProbability(!isShowProbability);
    };



    return (
        <>
            <ul className="list-inside list-disc">
                <li className="text">{"Init Bet Amount -> Start a New Game -> Click Card Decks -> Reveal Card 1/2 -> Place Bet -> Reveal Card 3 -> Decide -> Go Next -> Repeat"}</li>
                <li className="text">You win if the value of Card 3 is in-between Card 1 and 2, otherwise you lose. If the value of Card 3 is equal to either of Card 1 or 2, you lose double the amount !</li>
                <li className="text">For detailed introduction, navigate to <Link href="/in-between">here</Link>.</li>
            </ul>

            <div className="flex gap-32 mt-12 mb-8 items-center justify-start max-md:gap-16 max-sm:gap-10">
                <button className="btn-primary" onClick={handleStartNewGame}>Start a New Game</button>
                <div className="flex gap-4">
                    <label className="whitespace-nowrap" htmlFor="initBankAmount">initBankAmount: </label>
                    <input className="w-fit" id="initBankAmount" type="number" min="1" max="1000000" placeholder="1" defaultValue="1" onBlur={handleInitBankChange} disabled={!canInitBank()} ref={initBankRef} />
                </div>
                <p className="text whitespace-nowrap">Bank Amount = {bankAmount}</p>
                <div className="flex gap-4">
                    <label className="whitespace-nowrap" htmlFor="showProbability">showProbability?</label>
                    <input id="showProbability" type="checkbox" checked={isShowProbability} onChange={handleShowProbabilityToggle} />
                </div>
            </div>

            <div className="flex gap-32 mt-12 mb-8 items-center justify-start max-md:gap-16 max-sm:gap-10">
                {canPlaceBet && 
                    <div className="flex gap-8 max-md:gap-4">
                        <label className="whitespace-nowrap" htmlFor="betAmount">Enter your bet: </label>
                        <input className="min-w-10 max-w-40" id="betAmount" type="number" min="1" step="1" max={bankAmount} placeholder="1" value={betAmount} onBlur={handleBetChange} onChange={handleBetChange} disabled={!canPlaceBet} ref={betRef} />
                        <button className="btn-secondary" onClick={handleBetAllIn}>All In</button>
                    </div>
                }
                <button className="btn-primary" onClick={handleDecideWinLose} disabled={!canDecideWinLose()}>Decide</button>
                <button className="btn-primary" onClick={handleGoNext} disabled={!canGoNext()}>Go Next</button>
            </div>

            <div className="flex gap-32 mb-8 items-center justify-start max-md:gap-20 max-sm:gap-16">
                <div>
                    <p className="text">Cards Left = {shuffledCardDeck.length}</p>
                    <StackedCardDeckComponent shuffledCardDeck={shuffledCardDeck} handleCardClick={handleDistributeCard} />
                </div>
                {displayResult(result, betAmount) ? <p className="text">{displayResult(result, betAmount)}</p> : <></>}
            </div>

            <div className="grid grid-cols-3 gap-4 place-items-center">
                {boardCards.map((boardCard, index) => {
                    return (
                        <CardComponent key={index} boardCard={boardCard} 
                            // handleCardClick={boardCard.cardNumber === "c3" ? undefined : (() => changeCardFace(boardCard.cardNumber, "toggle"))} 
                        />
                    );
                })}

                {['Card 1', 'Card 3', 'Card 2'].map((description, index) => {
                    return (
                        <p key={index} className="text">{description}</p>
                    );
                })}
            </div>

            {isShowProbability && 
                <div className="flex flex-col gap-8 justify-center align-middle items-center mt-8">
                    <div>
                        {Object.entries(calculateProbability()).map(([description, probability], index) => {
                            if (typeof probability !== "number") {
                                return null;
                            }
                            return (
                                <p key={index} className="text">{`${description}: ${(probability*100).toFixed(2)}%`}</p>
                            );
                        })}
                    </div>

                    <ul className="flex flex-col gap-4 mb-4">
                        {Object.entries(remainingCardCounter).map(([k, v]) => {
                            const digit = Number(k) as keyof typeof digitValuePairs ;
                            const value = digitValuePairs[digit];
                            const count = v;

                            return (
                                <li key={digit} className="text flex items-center gap-8 justify-start">
                                    <span className="flex gap-4">Card {value}: <span className="font-bold">{count}</span></span>
                                </li>
                            )
                        })}
                    </ul>
                </div>
            }
        </>
    );
};

