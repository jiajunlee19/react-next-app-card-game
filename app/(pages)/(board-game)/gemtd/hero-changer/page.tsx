import { getGemTDPlayerInfo, getSteamPlayerInfo } from '@/app/_actions/gemtd';
import { getGemTDFullSkillsHeroes } from '@/app/_libs/gemtd';
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: {
        absolute: 'GemTD | Hero Changer',
    },
    description: 'Developed by jiajunlee',
};

export default async function HeroChangerPage() {

    const steamID = "1234567891"
    const steamPlayerInfo = await getSteamPlayerInfo(steamID);
    const gemTDPlayerInfo = await getGemTDPlayerInfo(steamID);
    const fullSkillHeroes = await getGemTDFullSkillsHeroes(gemTDPlayerInfo);

    return (
        <>
            <p>{JSON.stringify(steamPlayerInfo)}</p>
            <p>{JSON.stringify(fullSkillHeroes)}</p>
        </>
    )
};