import { Genre } from "./SearchGenreResult";
import { Platform } from "./SearchPlatformResult";

export interface SearchGameResult {
    id: number;
    slug: string;
    name: string;
    platforms: Platform[];
    background_image?: string;
    metacritic?: number;
    playtime?: number;
    genres?: Genre[];
}