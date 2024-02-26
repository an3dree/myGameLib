
export interface Game {
    id: number;
    slug: string;
    name: string;
    background_image?: string;
    metacritic?: number;
    playtime?: number;
    status?: string;
    notes?: string;
    platform?: string;
    genre?: string[];
    howLongToBeat?: number;

}