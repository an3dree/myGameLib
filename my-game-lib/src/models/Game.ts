import { GameStatus } from "./GameStatus";
import { Genre } from "./SearchGenreResult";
import { Platform } from "./SearchPlatformResult";

export interface Game {
    id: number;
    docId?: string;
    slug: string;
    name: string;
    background_image?: string;
    metacritic?: number;
    playedTime?: number;
    status?: GameStatus;
    notes?: string;
    platform?: Platform;
    genres?: Genre[];
    howLongToBeat?: number;

}