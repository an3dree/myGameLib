import { SearchGameResult } from "../models/SearchGameResult";
import { rawgApiKey } from "../utils/keys";

const API_KEY = rawgApiKey;
const BASE_URL = 'https://api.rawg.io/api';

const searchGames = async (
    searchTerm: string,
    page: number = 1,
    pageSize: number = 20
): Promise<{ results: SearchGameResult[]; totalCount: number }> => {
    try {
        // Construa a URL de busca com o termo de pesquisa fornecido
        const url = `${BASE_URL}/games?key=${API_KEY}&search=${searchTerm}?order=metacritic&page=${page}&page_size=${pageSize}`;

        // Faça a solicitação GET para a API
        const response = await fetch(url);

        // Verifique se a solicitação foi bem-sucedida (código de status 200)
        if (!response.ok) {
            throw new Error('Failed to fetch games');
        }

        // Analise a resposta para obter os dados dos jogos
        const data = await response.json();
        const results: SearchGameResult[] = data.results;
        const totalCount: number = data.count;

        // Retorne os dados dos jogos
        return { results, totalCount };
    } catch (error) {
        console.error('Error fetching games:', error);
        return { results: [], totalCount: 0 }; // Retorna uma matriz vazia em caso de erro
    }
};

export default searchGames;
