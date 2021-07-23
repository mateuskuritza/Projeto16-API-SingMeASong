import * as genresRepository from '../repositories/genresRepository';
import * as recommendationsServices from "../services/recommendationsServices";

export async function create(name: string) {
    return await genresRepository.create(name);
}

export async function getAll() {
    return await genresRepository.getAll();
}

export async function getById(id: number) {
    return await genresRepository.getById(id);
}

export async function getRecommendationsGenres(userId: number) {
    return await genresRepository.getRecommendationsGenres(userId);
}

export async function getGenreFormated(genre: any) {
    let score = 0;
    const recommendations = await Promise.all((genre.map(async (g: any) => {
        const recommendation = await recommendationsServices.getRecommendation(g.id_recommendation);
        score += recommendation.score;
        return recommendation;
    })));

    const resp = {
        id: genre[0].id_genre,
        name: genre[0].genre_name,
        score,
        recommendations: recommendations
    }
    return resp
}