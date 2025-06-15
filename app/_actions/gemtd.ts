'use server'

import { rateLimitByIP, rateLimitByUid } from "@/app/_libs/rate_limit";
import { getServerSession } from "next-auth/next";
import { options } from "@/app/_libs/nextAuth_options";
import { steamID32Schema, steamID64Schema, steamIDSchema, steamPlayerInfoSchema, skillIDSchema, heroIDSchema, gemTDPlayerInfoSchema, type TSteamID32, type TSteamID64, type TSteamID, type TSteamPlayerInfo, type TSkillID, type THeroID, type TGemTDPlayerInfo } from '@/app/_libs/zod_server';
import { convertSteamID32to64, getSteamID64, decodeGemTDHeroSkill, decodeGemTDHero } from '@/app/_libs/gemtd';
import { getErrorMessage } from '@/app/_libs/error_handler';
import { parsedEnv } from '@/app/_libs/zod_env';
import { unstable_noStore as noStore } from 'next/cache';

export async function getSteamPlayerInfo(steamID: TSteamID | unknown, apiKey: string | unknown = "89C570CC836D6416F3DE9A0651E81BC0") {
    noStore();

    if (typeof apiKey !== "string") {
        throw new Error("Invalid API Key !")
    }

    const parsedSteamID = steamIDSchema.safeParse(steamID);

    if (!parsedSteamID.success) {
        throw new Error(parsedSteamID.error.message)
    };

    // const session = await getServerSession(options);

    // if (!session) {
    //     redirect("/denied");
    // }

    // if (await rateLimitByUid(session.user.user_uid, 20, 1000*60)) {
    //     redirect("/tooManyRequests");
    // }

    try {
        const steamID64 = getSteamID64(steamID);
        const url = `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${apiKey}&steamids=${steamID64}}`;
        const r = await fetch(url);

        if (!r.ok) return {}

        const data = await r.json();

        if (!data?.response || !data?.response?.players) return {}

        return data["response"]["players"][0] as TSteamPlayerInfo ?? {}
    } 
    catch (err) {
        return {}
        // throw new Error(getErrorMessage(err))
    }
};

export async function getGemTDPlayerInfo(steamID: TSteamID | unknown) {
    noStore();

    const parsedSteamID = steamIDSchema.safeParse(steamID);

    if (!parsedSteamID.success) {
        throw new Error(parsedSteamID.error.message)
    };

    // const session = await getServerSession(options);

    // if (!session) {
    //     redirect("/denied");
    // }

    // if (await rateLimitByUid(session.user.user_uid, 20, 1000*60)) {
    //     redirect("/tooManyRequests");
    // }

    try {
        const steamID64 = getSteamID64(steamID);
        const url = `http://gemtd.ppbizon.com/gemtd/202203/heros/get/@${steamID64}`;
        const r = await fetch(url);

        if (!r.ok) return {}

        const data = await r.json();

        if (!data?.msg || !data?.data || data.msg.toLowerCase() !== "success") return {}

        return data.data[steamID64] as TGemTDPlayerInfo ?? {}
    } 
    catch (err) {
        return {}
        // throw new Error(getErrorMessage(err))
    }
};

export async function changeGemTDPlayerHero(steamID: TSteamID | unknown, heroID: THeroID | unknown) {
    noStore();

    const parsedSteamID = steamIDSchema.safeParse(steamID);
    const parsedHeroID = heroIDSchema.safeParse(heroID);

    if (!parsedSteamID.success) {
        throw new Error(parsedSteamID.error.message)
    };

    if (!parsedHeroID.success) {
        throw new Error(parsedHeroID.error.message)
    };

    // const session = await getServerSession(options);

    // if (!session) {
    //     redirect("/denied");
    // }

    // if (await rateLimitByUid(session.user.user_uid, 20, 1000*60)) {
    //     redirect("/tooManyRequests");
    // }

    try {
        const steamID64 = getSteamID64(steamID);
        const url = `http://gemtd.ppbizon.com/gemtd/hero/save/{heroID}@${steamID64}?hehe=1`;
        const r = await fetch(url);

        if (!r.ok) return false

        const data = await r.json();

        if (!data?.msg || data.msg.toLowerCase() !== "success") return false

        return true
    } 
    catch (err) {
        return false
        // throw new Error(getErrorMessage(err))
    }
};