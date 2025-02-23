import React from "react";
import type { Metadata } from 'next'
import Link from "next/link";
import { twMerge } from "tailwind-merge";

export const metadata: Metadata = {
    title: {
        absolute: 'Intro | In-Between',
    },
    description: 'Developed by jiajunlee',
};

export default function InBetweenIntroPage() {

    const gamePlays = [
        "Banker set a minimum bet amount, eg: betAmount = 2",
        "Each player pays the minimum bet amount into the bank, eg: bankAmount = 2n where n is the number of players",
        "Banker shuffles the card deck",
        "Banker distribute two cards (C1 and C2) to the first player",
        "Player reveals both cards (C1 and C2)",
        "Player decides whether to bet the minimum amount or to raise the bet, bet amount must be ranged from the minimum bet amount to the bank amount as maximum",
        "Banker distribute the third card to the same player",
        "Player reveal the third card (C3) and determine win/lose",
        "If C3 is exactly equal to C1 or C2, player loses x2 of bet amount to the bank",
        "If C3 is not in range of C1 and C2, player loses x1 of bet amount to the bank",
        "If C3 is in range of C1 and C2, player wins x1 of bet amount from the bank",
        "Banker distribute two cards to the following player and repeat from (5) to (12), until the bank amount is zero or no more than 3 cards left in the card deck",
        "Repeat from (1) to start a new round, the bank amount accumulates from the previous round, player no longer needs to pay the minimum bet amount to the bank",
        "In any case that players decided to stop the game when bank amount is not emptied, the bank amount is equally distributed to each player",
    ] as const;

    const probabilities = [
        "One card deck consists of 52 unique cards.",
        "There are 13 values ('A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K') and 4 type of suits ('♦', '♣', '♥', '♠').",
        "Each card is formed by a value-suit pair, eg: '5♦', '9♠', etc.",
        "The more the difference between C1 and C2, the higher the chance of winning. Difference can varied from 0 to 12.",
        "Given that the card deck are not shuffled, we can keep track of the remaining card count of each values and determine the probability.",
        "cardCounter = {values: count} for each values is initialized to count of 4 and decrement by 1 when a card with the particular value is revealed.",
        "Let P(-2), P(-1) and P(1) to be the probability of losing x2, losing x1 and winning x1 respectively.",
        "Let x to be the remaining card count in card deck.",
        "P(-2) = cardCounter[C1.digit] / x",
        "P(-1) = ( cardCounter[1:C1.digit] + cardCounter[C2.digit+1:13] ) / x",
        "P(1) = cardCounter[C1.digit+1:C2.digit] / x",
    ] as const;

    return (
        <>
            <h1>Introduction of In-Between Card Game</h1>

            <h2 id="gameplays">Game Plays</h2>
            <ul className="list-inside list-decimal">
                {gamePlays.map((gamePlay, index) => {
                    return (
                        <React.Fragment key={index}>
                            <li className="text">{gamePlay}</li>
                        </React.Fragment>
                    );
                })}
            </ul>

            <h2 id="probability">Probability of Winning or Losing</h2>
            <ol>
                {probabilities.map((probability, index) => {
                    return (
                        <React.Fragment key={index}>
                            <li className={twMerge("text", (index === 3 || index === 5 || index === 7 || index === 10) && "mb-4")}>{probability}</li>
                        </React.Fragment>
                    );
                })}
            </ol>

            <h2 id="play">Play the Game</h2>
            <p>To play the game, navigate to the <Link href="/in-between/game">In-Between Game</Link>.</p>
            <p>To record the revealed cards and calculate the win/lose probability, navigate to the <Link href="/in-between/calculator">In-Between Calculator</Link>.</p>
            <br />
            <br />
        </>
    )
};