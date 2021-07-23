import * as genresRepository from '../repositories/genresRepository';

export async function create(name: string) {
    return await genresRepository.create(name);
}

export async function getAll() {
    const result = await genresRepository.getAll();
    return result;
}

export async function getById(id: number) {
    const result = await genresRepository.getById(id);
    return result;
}

export async function getRecommendationsGenres(userId: number) {
    const result = await genresRepository.getRecommendationsGenres(userId);
    return result;
}