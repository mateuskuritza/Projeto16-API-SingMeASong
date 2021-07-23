import * as genresRepository from '../repositories/genresRepository';

export async function create(name: string) {
    return await genresRepository.create(name);
}

export async function getAll() {
    const result = await genresRepository.getAll();
    return result;
}