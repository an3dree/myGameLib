import { SearchGameResult } from "../models/SearchGameResult";

//import dotenv from 'dotenv';
//dotenv.config({ path: '.env' });


const API_KEY = process.env.REACT_APP_RAWG_API_KEY;
const BASE_URL = 'https://api.rawg.io/api';

const searchGames = async (
    searchTerm: string,
    page: number = 1,
    pageSize: number = 20
): Promise<{ results: SearchGameResult[]; totalCount: number }> => {
    try {
        const url = `${BASE_URL}/games?key=${API_KEY}&search=${searchTerm}?order=metacritic&page=${page}&page_size=${pageSize}&search_precise=true`;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error('Failed to fetch games');
        }

        const data = await response.json();
        const results: SearchGameResult[] = data.results;
        const totalCount: number = data.count;

        return { results, totalCount };
    } catch (error) {
        console.error('Error fetching games:', error);
        return { results: [], totalCount: 0 };
    }
};

export default searchGames;
