import { z } from 'zod';

export const uuidSchema = z.string().toLowerCase().min(1).uuid();

export const itemsPerPageSchema = z.coerce.number().int().min(1).catch(10);
export const currentPageSchema = z.coerce.number().int().min(1).catch(1);
export const querySchema = z.string().min(1).optional().catch(undefined);

export const createTypeSchema = z.object({
    type_uid: z.string().toLowerCase().min(1).uuid(),
    type: z.string().toUpperCase().min(1),
    type_created_dt: z.coerce.date(),
    type_updated_dt: z.coerce.date(),
});

export type TReadTypeSchema = z.infer<typeof readTypeSchema>;

export const readTypeSchema = createTypeSchema.partial();

export const updateTypeSchema = createTypeSchema.pick({
    type_uid: true,
    type_updated_dt: true,
});

export const deleteTypeSchema = createTypeSchema.pick({
    type_uid: true,
});

export const TypeSchema = createTypeSchema.pick({
    type: true,
});

export const steamID32Schema = z.string().max(10).regex(/^\d+$/, "SteamID32 should have minimum 10 digits !");
export type TSteamID32 = z.infer<typeof steamID32Schema>;

export const steamID64Schema = z.string().length(17).regex(/^7656\d{13}$/, "SteamID64 should have length of 17 and starts with 7656 !");
export type TSteamID64 = z.infer<typeof steamID64Schema>;

export const steamIDSchema = z.union([steamID32Schema, steamID64Schema]);
export type TSteamID = z.infer<typeof steamIDSchema>;

export const steamPlayerInfoSchema = z.object({
    steamid: z.string(),
    communityvisibilitystate: z.number(),
    profilestate: z.number(),
    personaname: z.string(),
    profileurl: z.string().url(),
    avatar: z.string().url(),
    avatarmedium: z.string().url(),
    avatarfull: z.string().url(),
    avatarhash: z.string(),
    lastlogoff: z.number(),
    personastate: z.number(),
    primaryclanid: z.string(),
    timecreated: z.number(),
    personastateflags: z.number(),
    gameextrainfo: z.string().optional(),
    gameid: z.string().optional(),
});
  
export type TSteamPlayerInfo = z.infer<typeof steamPlayerInfoSchema>;

export const skillIDSchema = z.string().regex(/^a\d{3}$/, "Skill ID should start with a, followed by 3 digits !")
export type TSkillID = z.infer<typeof skillIDSchema>;

export const heroIDSchema = z.string().regex(/^h\d{3}$/, "Hero ID should start with h, followed by 3 digits !")
export type THeroID = z.infer<typeof heroIDSchema>;

export const effectIDSchema = z.string().regex(/^e\d{3}$/, "Effect ID should start with e, followed by 3 digits !").or(z.literal(""))
export type TEffectID = z.infer<typeof effectIDSchema>;

export const questIDSchema = z.string().regex(/^q\d{3}$/, "Quest ID should start with q, followed by 3 digits !")
export type TQuestID = z.infer<typeof questIDSchema>;

const abilitySchema = z.record(skillIDSchema, z.number().min(1).max(4));

const heroSchema = z.object({
  ability: abilitySchema,
  effect: effectIDSchema,
  extend: z.number().optional(),
  hero_id: z.string().optional(),
});

const heroSeaSchema = z.record(heroIDSchema, heroSchema);

const rankInfoSchema = z.object({
    user: steamID64Schema,
    match: z.number(),
    mmr: z.number(),
    rankall: z.string(),
    rankcoop: z.string(),
    rankrace: z.string(),
    all_level: z.number(),
    coop_level: z.number(),
    race_level: z.number(),
    score: z.number(),
    best_kills: z.object({
    p1: z.number(),
    p2: z.number(),
    p3: z.number(),
    p4: z.number(),
    }),
});

const questSchema = z.object({
    quest_expire: z.number(),
    quest: questIDSchema,
    quest_finish_count: z.number(),
    pass: z.number(),
    season: z.number(),
});

export const gemTDPlayerInfoSchema = z.object({
    is_test_user: z.boolean(),
    hero_sea: heroSeaSchema,
    onduty_hero: heroSchema,
    shell: z.number(),
    ice: z.number(),
    candy: z.number(),
    quest: questSchema,
    pre_shell: z.number(),
    extend_tool: z.string(),
    pet: z.string().nullable(),
    pet2: z.string().nullable(),
    pet3: z.string().nullable(),
    items: z.any().nullable(),
    is_crown: z.number(),
    rank_info: rankInfoSchema,
});

export type TGemTDPlayerInfo = z.infer<typeof gemTDPlayerInfoSchema>;
