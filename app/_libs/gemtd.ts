import { steamID32Schema, steamID64Schema, steamIDSchema, skillIDSchema, heroIDSchema, gemTDPlayerInfoSchema, type TSteamID32, type TSteamID64, type TSteamID, type TSkillID, type THeroID, type TGemTDPlayerInfo } from '@/app/_libs/zod_server';

export function convertSteamID32to64(steamID32: TSteamID32) {
    return (BigInt(76561197960265728) + BigInt(steamID32)).toString();
}

export function getSteamID64(steamID: TSteamID32 | TSteamID64 | unknown) {
    const parsedSteamID32 = steamID32Schema.safeParse(steamID);
    const parsedSteamID64 = steamID64Schema.safeParse(steamID);
    const parsedSteamID = steamIDSchema.safeParse(steamID);

    if (!parsedSteamID.success) return ""
    if (parsedSteamID32.success) return convertSteamID32to64(parsedSteamID32.data)
    if (parsedSteamID64.success) return parsedSteamID64.data 
    return parsedSteamID.data
}

export function decodeGemTDHeroSkill(skillID: TSkillID | unknown) {
    const parsedSkillID = skillIDSchema.safeParse(skillID);

    if (!parsedSkillID.success) return ""

    const heroSkillDict: { [key: string]: {id: string, name: string, symbol: string} } = {
        "a101": {"id": "gemtd_hero_huichun", "name": "heal", "symbol": "Heal"},
	    "a201": {"id": "gemtd_hero_lanse", "name": "B", "symbol": "B"}, 
	    "a202": {"id": "gemtd_hero_danbai", "name": "E", "symbol": "E"}, 
	    "a203": {"id": "gemtd_hero_baise", "name": "D", "symbol": "D"}, 
	    "a204": {"id": "gemtd_hero_hongse", "name": "R", "symbol": "R"}, 
	    "a205": {"id": "gemtd_hero_lvse", "name": "G", "symbol": "G"}, 
	    "a206": {"id": "gemtd_hero_fense", "name": "Q", "symbol": "Q"}, 
	    "a207": {"id": "gemtd_hero_huangse", "name": "Y", "symbol": "Y"}, 
	    "a208": {"id": "gemtd_hero_zise", "name": "P", "symbol": "P"}, 
	    "a210": {"id": "gemtd_hero_putong", "name": "3", "symbol": "3"}, 
	    "a211": {"id": "gemtd_hero_qingyi", "name": "adjSwap", "symbol": "AdjSwap"}, 
	    "a212": {"id": "gemtd_hero_shitou", "name": "stonehenge", "symbol": "Stonehenge"}, 

	    "a301": {"id": "gemtd_hero_kuaisusheji", "name": "haste", "symbol": "Haste"}, 
	    "a302": {"id": "gemtd_hero_baoji", "name": "crit", "symbol": "Crit"}, 
	    "a303": {"id": "gemtd_hero_miaozhun", "name": "aim", "symbol": "Aim"}, 
	    "a304": {"id": "gemtd_hero_fengbaozhichui", "name": "hummer", "symbol": "Hummer"}, 
	    "a305": {"id": "gemtd_hero_wuxia", "name": "4", "symbol": "4"}, 
	    "a306": {"id": "gemtd_hero_huidaoguoqu", "name": "timelapse", "symbol": "TL"}, 
	    "a307": {"id": "gemtd_hero_lianjie", "name": "fatalBond", "symbol": "FatalBond"}, 
	    "a308": {"id": "gemtd_hero_xuanfeng", "name": "ursol", "symbol": "Ursol"}, 

	    "a401": {"id": "gemtd_hero_yixinghuanwei", "name": "swap", "symbol": "Swap"}, 
	    "a402": {"id": "gemtd_hero_wanmei", "name": "5", "symbol": "5"}, 
	    "a403": {"id": "gemtd_hero_guangzhudaobiao", "name": "candy", "symbol": "Candy"}, 
    };

    if (!(parsedSkillID.data in heroSkillDict)) return ""

    return heroSkillDict[parsedSkillID.data]["symbol"]
}

export function decodeGemTDHero(heroID: THeroID | unknown) {
    const parsedHeroID = skillIDSchema.safeParse(heroID);

    if (!parsedHeroID.success) return ""

    const heroDict: { [key: string]: string } = {
        "h101": "npc_dota_hero_enchantress",
        "h102": "npc_dota_hero_puck",
        "h103": "npc_dota_hero_omniknight",
        "h104": "npc_dota_hero_wisp",
        "h105": "npc_dota_hero_ogre_magi",
        "h106": "npc_dota_hero_lion",
        "h107": "npc_dota_hero_keeper_of_the_light",
        "h108": "npc_dota_hero_rubick",
        "h109": "npc_dota_hero_jakiro",
        "h110": "npc_dota_hero_sand_king",
        "h111": "npc_dota_hero_ancient_apparition", 
        "h112": "npc_dota_hero_earth_spirit", 

        "h201": "npc_dota_hero_crystal_maiden",
        "h202": "npc_dota_hero_death_prophet",
        "h203": "npc_dota_hero_templar_assassin",
        "h204": "npc_dota_hero_lina",
        "h205": "npc_dota_hero_tidehunter",
        "h206": "npc_dota_hero_naga_siren",
        "h207": "npc_dota_hero_phoenix",
        "h208": "npc_dota_hero_dazzle",
        "h209": "npc_dota_hero_warlock",
        "h210": "npc_dota_hero_necrolyte",
        "h211": "npc_dota_hero_lich",
        "h212": "npc_dota_hero_furion",
        "h213": "npc_dota_hero_venomancer",
        "h214": "npc_dota_hero_kunkka",
        "h215": "npc_dota_hero_axe",
        "h216": "npc_dota_hero_slark",
        "h217": "npc_dota_hero_viper",
        "h218": "npc_dota_hero_tusk",
        "h219": "npc_dota_hero_abaddon",
        "h220": "npc_dota_hero_winter_wyvern", 
        "h221": "npc_dota_hero_ember_spirit", 

        "h301": "npc_dota_hero_windrunner",
        "h302": "npc_dota_hero_phantom_assassin",
        "h303": "npc_dota_hero_sniper",
        "h304": "npc_dota_hero_sven",
        "h305": "npc_dota_hero_luna",
        "h306": "npc_dota_hero_mirana",
        "h307": "npc_dota_hero_nevermore",
        "h308": "npc_dota_hero_queenofpain",
        "h309": "npc_dota_hero_juggernaut",
        "h310": "npc_dota_hero_pudge",
        "h311": "npc_dota_hero_shredder",
        "h312": "npc_dota_hero_slardar",
        "h313": "npc_dota_hero_antimage",
        "h314": "npc_dota_hero_bristleback",
        "h315": "npc_dota_hero_lycan",
        "h316": "npc_dota_hero_lone_druid",
        "h317": "npc_dota_hero_storm_spirit", 
        "h318": "npc_dota_hero_obsidian_destroyer", 
        "h319": "npc_dota_hero_grimstroke", 

        "h401": "npc_dota_hero_vengefulspirit",
        "h402": "npc_dota_hero_invoker",
        "h403": "npc_dota_hero_alchemist",
        "h404": "npc_dota_hero_spectre",
        "h405": "npc_dota_hero_morphling",
        "h406": "npc_dota_hero_techies",
        "h407": "npc_dota_hero_chaos_knight",
        "h408": "npc_dota_hero_faceless_void",
        "h409": "npc_dota_hero_legion_commander",
        "h410": "npc_dota_hero_monkey_king",
        "h411": "npc_dota_hero_razor",
        "h412": "npc_dota_hero_tinker",
        "h413": "npc_dota_hero_pangolier",
        "h414": "npc_dota_hero_dark_willow",
        "h415": "npc_dota_hero_terrorblade", 
        "h416": "npc_dota_hero_enigma",
    };

    if (!(parsedHeroID.data in heroDict)) return ""

    return heroDict[parsedHeroID.data]
}

export function getGemTDFullSkillsHeroes(gemTDPlayerInfo: TGemTDPlayerInfo | {}) {

    if (!gemTDPlayerInfo || Object.keys(gemTDPlayerInfo).length === 0 || !("hero_sea" in gemTDPlayerInfo)) return {};
        
    // Full-skilled heroes should have minimum 4 skills, each skill should be minimally level 4
    const heroSkillSymbolSequence = [
        "B", "Q", "E", "D", "P", "G", "R", "Y",
        "3", "4", "5",
        "Swap", "Candy", "Aim", "TL", "Ursol, Stonehenge", "Hummer",
    ];

    const heroes = gemTDPlayerInfo["hero_sea"];

    let fullSkillHeroes: {[key: string]: string} = {};
    for (const [heroID, heroAssets] of Object.entries(heroes)) {
        const { ability, effect } = heroAssets;

        if (Object.keys(ability).length < 4) continue;

        const abilitySymbols: string[] = [];

        let isFullSkill = true;

        for (const [abilityID, level] of Object.entries(ability)) {
            if (level < 4) {
                isFullSkill = false;
                break;
            }

            const symbol = decodeGemTDHeroSkill(abilityID);
            abilitySymbols.push(symbol);
        }

        if (!isFullSkill) continue;

        const sortedSymbols = abilitySymbols.sort((a, b) => {
            const aIndex = heroSkillSymbolSequence.indexOf(a);
            const bIndex = heroSkillSymbolSequence.indexOf(b);
            return (aIndex === -1 ? 999 : aIndex) - (bIndex === -1 ? 999 : bIndex);
        });

        fullSkillHeroes[sortedSymbols.join("")] = heroID;
    }

    return fullSkillHeroes;
}

export function decodeDurationInSeconds(seconds: number) {
    const days = Math.floor(seconds / (60*60*24));
    const hours = Math.floor((seconds % (60*60*24)) / (60*60));
    const minutes = Math.floor((seconds % (60*60) / (60)));

    return `${days}days ${hours}h ${minutes}mins`
}