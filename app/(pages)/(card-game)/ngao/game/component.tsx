"use client"

import { shuffleCardDeck, type TRemainingCardCounter, type TBoardCard, type TCard, getInitialCardCounter } from "@/app/_libs/card";
import { useState } from "react";
import { CardComponent, StackedCardDeckComponent } from "@/app/(pages)/(card-game)/in-between/card";

type TNgaoGameComponent = {
    cardDeck: TCard[],
};

export default function NgaoGameComponent({ cardDeck }: TNgaoGameComponent) {

    // Game States
    const [shuffledCardDeck, setShuffledCardDeck] = useState<TCard[] | []>(shuffleCardDeck(cardDeck));
    const [boardCards, setBoardCards] = useState<TBoardCard[]>([
        { cardNumber: "c1", face: "down", card: null }, 
        { cardNumber: "c2", face: "down", card: null }, 
        { cardNumber: "c3", face: "down", card: null }, 
        { cardNumber: "c4", face: "down", card: null }, 
        { cardNumber: "c5", face: "down", card: null }, 
    ]);
    const [canPlaceBet, setCanPlaceBet] = useState(false);
    const [remainingCardCounter, setRemainingCardCounter] = useState<TRemainingCardCounter>(getInitialCardCounter());


    // Effects


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

    function isValidGame() {
        if (shuffledCardDeck.length < 10) {
            return false;
        }

        return true;
    };

    function canDistributeC1C2C3() {
        if (!isValidGame()) {
            return false;
        }

        const [C1, C2, C3] = boardCards;

        if (C1.card || C2.card || C3.card) {
            return false;
        }

        return true;
    }; 

    function canDistributeC4C5() {
        if (!isValidGame()) {
            return false;
        }

        const [, , , C4, C5] = boardCards;

        if (C4.card || C5.card) {
            return false;
        }

        return true;
    };


    // Handlers
    const handleDistributeCard = () => {
        if (canDistributeC1C2C3() && !canDistributeC4C5()) {
            setCanPlaceBet(false);
            distributeCard("c1");
            distributeCard("c2");
            distributeCard("c3");
            return;
        }
        if (!canDistributeC1C2C3() && canDistributeC4C5()) {
            changeCardFace("c1", "reveal");
            changeCardFace("c2", "reveal");
            changeCardFace("c3", "reveal");
            distributeCard("c4");
            distributeCard("c5");
            setCanPlaceBet(true);
            return;
        }
    };

    return (
        <div className="flex flex-col gap-8 my-4">

            <p>For the first round, draw 3 cards and decide the result based on the sum modulo 10. For the second round, draw another 2 cards and decide result based on ox strength.</p>
        
            <div className="flex gap-32 mb-8 items-center justify-start max-md:gap-20 max-sm:gap-16">
                <div>
                    <p className="text">Cards Left = {shuffledCardDeck.length}</p>
                    <StackedCardDeckComponent shuffledCardDeck={shuffledCardDeck} handleCardClick={handleDistributeCard} />
                </div>
                {/* {displayResult(result, betAmount) ? <p className="text">{displayResult(result, betAmount)}</p> : <></>} */}
            </div>

            <div className="grid grid-cols-5 gap-4 place-items-center">
                {boardCards.map((boardCard, index) => {
                    return (
                        <CardComponent key={index} boardCard={boardCard} 
                            // handleCardClick={boardCard.cardNumber === "c3" ? undefined : (() => changeCardFace(boardCard.cardNumber, "toggle"))} 
                        />
                    );
                })}

                {['Card 1', 'Card 2', 'Card 3', 'Card 4', 'Card 5'].map((description, index) => {
                    return (
                        <p key={index} className="text">{description}</p>
                    );
                })}
            </div>

            <div className="flex justify-center gap-8">
                {boardCards.slice(0, 2).map((boardCard, index) => {
                    return (
                        <CardComponent key={index} boardCard={boardCard} 
                            // handleCardClick={boardCard.cardNumber === "c3" ? undefined : (() => changeCardFace(boardCard.cardNumber, "toggle"))} 
                        />
                    );
                })}
            </div>
            <div className="flex justify-center gap-8">
                {boardCards.slice(2, 5).map((boardCard, index) => {
                    return (
                        <CardComponent key={index} boardCard={boardCard} 
                            // handleCardClick={boardCard.cardNumber === "c3" ? undefined : (() => changeCardFace(boardCard.cardNumber, "toggle"))} 
                        />
                    );
                })}
            </div>

        </div>
    );
};

