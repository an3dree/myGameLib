import { GameStatus } from "./GameStatus";
import { SearchGameResult } from "./SearchGameResult";

export interface Game extends SearchGameResult {
    id: number;
    name: string;
    metacritic: number;
    playtime: number;
    status: GameStatus;
    notes: string;
    platform: string;
    genre: string[];
    howLongToBeat: number;
    released: string;

}