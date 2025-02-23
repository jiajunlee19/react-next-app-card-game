import React from "react";
import Link from "next/link";
import BaseTable from "@/app/_components/basic/table";
import { columns } from "@/app/(pages)/(card-game)/ngao/columns";
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: {
        absolute: 'Intro | Ngao',
    },
    description: 'Developed by jiajunlee',
};

export default function NgaoIntroPage() {

    // https://en.wikipedia.org/wiki/Gnau

    const gamePlays = [
        "Each player place a bet.",
        "Banker shuffles the card deck.",
        "Banker distribute three cards to each player.",
        "Banker and players reveal the three cards and determine win/lose for the first round.",
        "For the first round, result is determined with the remainder of sum of three cards divided by 10.",
        "If the result of banker is larger, player loses x1 of the bet amount. Else, player wins x1 of the bet amount.",
        "Banker distribute another two cards to each player.",
        "Banker and players reveal the other two cards and determine win/lose for the second round with total of 5 cards.",
        "For the second round, result is determined by the ox points, whoever has higher ox points win over the lowers.",
        "In the second round, each card value represents its point, with the exception of both 3 and 6 can be represented with either 3 or 6.",
        "If there's any 3 cards with the sum up to the multiple of 10, the player is entitled with ox. Otherwise, its a no-ox, equivalent zero ox strength.",
        "The 2 remaining cards are used to determine the ox point, player should choose the way that makes most powerful ox strength.",
        "Upper row (2 cards) represents ox strength and lower row (3 cards of multiplier of 10) represents ox.",
        "The payout multiplier will be varied based on the ox type, refers to the ox table below (strength/payout from high to low)."
    ] as const;

    const oxTypes = [
        {oxType: "Din Shi Gai / Five Dukes", payoutMultiplier: 7, description: "All five cards are Dukes (J, Q, K)", example: "J, Q \n J, Q, K"},
        {oxType: "Ngao Dong Gu", payoutMultiplier: 5, description: "Ox strength formed with Ace of spades and a duke", example: "A♠, K\n10, 7, 3"},
        {oxType: "Ngao Nen Gu", payoutMultiplier: 3, description: "Ox strength formed with Ace of non-spades and a duke", example: "A♦, K\n10, 7, 3"},
        {oxType: "Double Ox", payoutMultiplier: 2, description: "Ox strength formed with two same value", example: "8, 8\n10, 7, 3"},
        {oxType: "Single Ox 10", payoutMultiplier: 2, description: "Ox strength formed with no special ox and ones digit of the sum = 0 or 10", example: "8, 2\n10, 7, 3"},
        {oxType: "Single Ox", payoutMultiplier: 1, description: "Ox strength formed with no special ox, strength = the ones digit of the sum ranged from 1 to 9", example: "8, 9\n10, 7, 3"},
        {oxType: "No Ox", payoutMultiplier: 0, description: "No three cards sum up to multiple of 10", example: "8, 9\n10, 10, 5"},
    ];

    return (
        <>
            <h1>Introduction of Ngao Card Game</h1>

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

            <BaseTable columns={columns} data={oxTypes} />

            <h2 id="play">Play the Game</h2>
            <p>To play the game, navigate to the <Link href="/ngao/game">Ngao Game</Link>.</p>
            <p>To record the revealed cards and calculate the win/lose probability, navigate to the <Link href="/ngao/calculator">Ngao Calculator</Link>.</p>
            <br />
            <br />
        </>
    )
};