import { getGemTDPlayerInfo, getSteamPlayerInfo } from '@/app/_actions/gemtd';
import { getGemTDFullSkillsHeroes } from '@/app/_libs/gemtd';
import type { Metadata } from 'next'
import GemTDPlayerProfileComponent from './component';

export const metadata: Metadata = {
    title: {
        absolute: 'GemTD | Hero Changer',
    },
    description: 'Developed by jiajunlee',
};

export default async function GemTDHeroChangerPage() {

    const steamID = "150847511"
    const steamPlayerInfo = await getSteamPlayerInfo(steamID);
    const gemTDPlayerInfo = await getGemTDPlayerInfo(steamID);
    const fullSkillHeroes = await getGemTDFullSkillsHeroes(gemTDPlayerInfo);

    return (
        <>
            <GemTDPlayerProfileComponent steamPlayerInfo={steamPlayerInfo} gemTDPlayerInfo={gemTDPlayerInfo} fullSkillsHeroes={fullSkillHeroes} />
        </>
    )
};