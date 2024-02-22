import { SearchGameResult } from "../models/SearchGameResult";
import { rawgApiKey } from "../utils/keys";

const API_KEY = rawgApiKey;
const BASE_URL = 'https://api.rawg.io/api';

const searchGames = async (searchTerm: string): Promise<SearchGameResult[]> => {
    try {
        // Construa a URL de busca com o termo de pesquisa fornecido
        const url = `${BASE_URL}/games?key=${API_KEY}&search=${searchTerm}`;

        // Faça a solicitação GET para a API
        const response = await fetch(url);

        // Verifique se a solicitação foi bem-sucedida (código de status 200)
        if (!response.ok) {
            throw new Error('Failed to fetch games');
        }

        // Analise a resposta para obter os dados dos jogos
        const data = await response.json();

        // Retorne os dados dos jogos
        return data.results;
    } catch (error) {
        console.error('Error fetching games:', error);
        return []; // Retorna uma matriz vazia em caso de erro
    }
};

export default searchGames;
