"use client"

import { shuffleCardDeck, type TBoardCard, type TCard } from "@/app/_libs/card";
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

    // Effects


    // Functions


    // Handlers


    return (
        <div className="flex flex-col gap-8 my-4">
            <p>For the first round, draw 3 cards and decide the result based on the sum modulo 10. For the second round, draw another 2 cards and decide result based on ox strength.</p>
        
            <div className="flex gap-32 mb-8 items-center justify-start max-md:gap-20 max-sm:gap-16">
                <div>
                    <p className="text">Cards Left = {shuffledCardDeck.length}</p>
                    <StackedCardDeckComponent shuffledCardDeck={shuffledCardDeck} handleCardClick={() => null} />
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

            <div>
                {boardCards.map((boardCard, index) => {
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

