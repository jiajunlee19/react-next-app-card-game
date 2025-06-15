import React from "react";
import BaseTable from "@/app/_components/basic/table";
import { columns } from "@/app/(pages)/(board-game)/gemtd/columns";
import Link from "next/link";
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: {
        absolute: 'Intro | GemTD',
    },
    description: 'Developed by jiajunlee',
};

export default function GemTDntroPage() {

    // https://dota2.fandom.com/wiki/Gem_TD

    const gamePlays = [
        "During the start of any single build phase, players must place 5 gems on the maze.",
        "On any single build phase, players can choose to SELECT or REMOVE or MERGE1 or MERGE2 or COMBINE or DOWNGRADE to complete the build phase",
        "SELECT will keep the selected gem and turn the other 4 into stones.",
        "REMOVE will remove the selected stone.",
        "MERGE1 will replace the selected gem and upgrade it into one level higher. Can be used only when there are two identical gems in a single build phase.",
        "MERGE2 will replace the selected gem and upgrade it into two level higher. Can be used only when there are four identical gems in a single build phase.",
        "DOWNGRADE will replace the selected gem and downgrade it into any level lower, with the cost of 200 gold.",
        "COMBINE will replace the selected gem and upgrade it into a stronger tower. Can be used only when there are three gems matching a special combination.",
        "SPECIAL skills will not complete the build phase, players can use special skills to pray for a higher quality gems or to reposition your gems or to buff your gems.",
        "Once build phase is completed, creeps will start attacking from point 1 to point 7, following the path of the maze.",
        "If creeps reached the last castle point, the castle hp will be reduced. Game loses if castle hp = 0",
    ] as const;

    const skills = [
        {skill: "URSOL", description: "Point-targeted reposition skill to rotate surrounding gems in anti-clockwise.", goldCosts: "200 -> 125 -> 75 -> 50"},
        {skill: "SWAP", description: "Gem-or-stone targeted reposition skill to swap two gems/stones by casting twice.", goldCosts: "300 -> 225 -> 175 -> 150"},
        {skill: "TIMELAPSE", description: "Channeled skill to remove current build phase gems and allow for rebuild.", goldCosts: "600 -> 500 -> 400 -> 300"},
        {skill: "Stay tuned for more skills", description: "Stay tuned for more skills", goldCosts: "0 -> 0 -> 0 -> 0"},
    ];

    return (
        <>
            <h1>Introduction of GemTD Game</h1>

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
            
            <BaseTable columns={columns} data={skills} />

            <h2 id="play">Utility for GemTD Game</h2>
            <p>To learn or train your URSOL skill, navigate to the <Link href="/gemtd/ursol-trainer">Ursol Trainer</Link>.</p>
            <p>Wanted to AFK in gemtd without physically present to accept games? Navigate to the <Link href="/gemtd/gemtd-auto">gemtd-auto</Link> solution.</p>
            <p>Wanted to view gemtd player profile or change the gemtd heroes for other players? Navigate to the <Link href="/gemtd/player-profile">player-profile</Link> solution.</p>
            <br />
            <br />
        </>
    )
};