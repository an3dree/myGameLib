import { Genre } from "./SearchGenreResult";
import { Platform } from "./SearchPlatformResult";

export interface Game {
    id: number;
    slug: string;
    name: string;
    background_image?: string;
    metacritic?: number;
    playtime?: number;
    status?: string;
    notes?: string;
    platform?: Platform;
    genres?: Genre[];
    howLongToBeat?: number;

}