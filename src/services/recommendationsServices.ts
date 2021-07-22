import getYouTubeID from "get-youtube-id";
import * as recommendationsRepository from "../repositories/recommendationsRepository";
import * as genresRepository from "../repositories/genresRepository";

export async function validRecommendation(name: string, youtubeLink: string, genresIds: number[]): Promise<boolean> {
    const validIds = await genresRepository.validateGenresIds(genresIds);
    if (!name || !getYouTubeID(youtubeLink) || !validIds) return false;
    return true;
}

export async function saveRecommendation(name: string, youtubeLink: string, genresIds: number[]) {
    await recommendationsRepository.create(name, genresIds, youtubeLink);
}

export async function findByYoutubeLink(youtubeLink: string): Promise<any> {
    return await recommendationsRepository.findByYoutubeLink(youtubeLink);
}