import { decodeDurationInSeconds } from "@/app/_libs/gemtd";
import { gemTDPlayerInfoSchema, steamPlayerInfoSchema, TGemTDPlayerInfo, TSteamPlayerInfo } from "@/app/_libs/zod_server";
import Image from "next/image";

type TGemTDHeroChangerComponent = {
    steamPlayerInfo: TSteamPlayerInfo | {} ,
    gemTDPlayerInfo: TGemTDPlayerInfo | {},
    fullSkillsHeroes: {[key: string]: string} | {},
};

 
export default function GemTDHeroChangerComponent({ steamPlayerInfo, gemTDPlayerInfo, fullSkillsHeroes }: TGemTDHeroChangerComponent) {

    if (!steamPlayerInfo || !gemTDPlayerInfo) {
        return <p>Loading player data ...</p>
    }

    const parsedSteamPlayerInfo = steamPlayerInfoSchema.safeParse(steamPlayerInfo);
    const parsedGemTDPlayerInfo = gemTDPlayerInfoSchema.safeParse(gemTDPlayerInfo);

    if (!parsedSteamPlayerInfo.success || !parsedGemTDPlayerInfo.success) {
        return <p>Failed to load player data ! {parsedSteamPlayerInfo.error?.message} {parsedGemTDPlayerInfo.error?.message}</p>
    }

    const rank = parsedGemTDPlayerInfo.data.rank_info;
    const quest = parsedGemTDPlayerInfo.data.quest;

    const questExpire = decodeDurationInSeconds(quest.quest_expire);
    const passExpire = decodeDurationInSeconds(quest.pass);
    const seasonExpire = decodeDurationInSeconds(quest.season);
    
    return (
        <div style={{ padding: "1rem", fontFamily: "sans-serif", lineHeight: "1.6" }}>
            <h2>🎮 Steam Profile</h2>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <Image
                src={parsedSteamPlayerInfo.data.avatarfull}
                alt="Avatar"
                width={100}
                height={100}
                />
                <div>
                    <p><strong>Name:</strong> {parsedSteamPlayerInfo.data.personaname}</p>
                    <p><strong>SteamID:</strong> {parsedSteamPlayerInfo.data.steamid}</p>
                    <p>
                        <strong>Profile:</strong>{" "}
                        <a href={parsedSteamPlayerInfo.data.profileurl} target="_blank" rel="noreferrer">
                            View on Steam
                        </a>
                    </p>
                    {parsedSteamPlayerInfo.data.gameextrainfo && (
                        <p><strong>Now Playing:</strong> {parsedSteamPlayerInfo.data.gameextrainfo}</p>
                    )}
                </div>
            </div>
    
            <h2>🧬 GemTD Stats</h2>
                <ul>
                    <li className="text"><strong>Ice:</strong> {parsedGemTDPlayerInfo.data.ice}</li>
                    <li className="text"><strong>Candy:</strong> {parsedGemTDPlayerInfo.data.candy}</li>
                    <li className="text"><strong>Shell:</strong> {parsedGemTDPlayerInfo.data.shell}</li>
                    <li className="text"><strong>Pets:</strong> {[parsedGemTDPlayerInfo.data.pet, parsedGemTDPlayerInfo.data.pet2, parsedGemTDPlayerInfo.data.pet3].filter(Boolean).join(", ") || "None"}</li>
                    <li className="text"><strong>Crown Holder:</strong> {parsedGemTDPlayerInfo.data.is_crown ? "Yes 👑" : "No"}</li>
                </ul>
        
            <h3>📈 Rank Info</h3>
                <ul>
                    <li className="text"><strong>MMR:</strong> {rank.mmr}</li>
                    <li className="text"><strong>Rank (All):</strong> {rank.rankall}</li>
                    <li className="text"><strong>Rank (Coop):</strong> {rank.rankcoop}</li>
                    <li className="text"><strong>Rank (Race):</strong> {rank.rankrace}</li>
                    <li className="text"><strong>Best Kills:</strong> P1: {rank.best_kills.p1}, P2: {rank.best_kills.p2}, P3: {rank.best_kills.p3}, P4: {rank.best_kills.p4}</li>
                </ul>
        
            <h3>📜 Quest Info</h3>
                <ul>
                    <li className="text"><strong>Special Quest ID:</strong> {quest.quest}</li>
                    <li className="text"><strong>Special Quest Expires In:</strong> {questExpire}</li>
                    <li className="text"><strong>Win Quest Expires In:</strong> {passExpire}</li>
                    <li className="text"><strong>Current Season Expires In:</strong> {seasonExpire}</li>
                </ul>
        
            <h2>💎 Full-Skill Heroes</h2>
                {Object.keys(fullSkillsHeroes).length === 0 ? (
                    <p>No full-skill heroes found.</p>
                ) : (
                <table style={{ borderCollapse: "collapse", marginTop: "0.5rem" }}>
                    <thead>
                        <tr>
                        <th style={{ border: "1px solid #ccc", padding: "0.5rem" }}>Skill Combo</th>
                        <th style={{ border: "1px solid #ccc", padding: "0.5rem" }}>Hero ID</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.entries(fullSkillsHeroes).map(([combo, heroID]) => (
                            <tr key={combo}>
                            <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>{combo}</td>
                            <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>{heroID}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                )}
        </div>
      );    

}