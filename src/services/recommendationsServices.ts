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

export async function findById(id: number): Promise<any> {
    return await recommendationsRepository.findById(id);
}

export async function upvoteRecommendation(id: number): Promise<any> {
    return await recommendationsRepository.upvoteRecommendation(id);
}

export async function downvoteRecommendation(id: number): Promise<any> {
    return await recommendationsRepository.downvoteRecommendation(id);
}

export async function deleteRecommendation(id: number): Promise<any> {
    return await recommendationsRepository.deleteRecommendation(id);
}

export async function randomRecommendation(): Promise<any> {
    const randomNumber = Math.floor(Math.random() * 100);
    let recommendations: object[] = null;
    if (randomNumber <= 70) {
        recommendations = await recommendationsRepository.bestRecommendations();
    } else {
        recommendations = await recommendationsRepository.worstRecommendations();
    }

    if (recommendations.length === 0) {
        return await recommendationsRepository.randomRecommendation();
    }

    const randomRecommendation = Math.floor(Math.random() * (recommendations.length - 1));
    return recommendations[randomRecommendation];
}

export async function getGenresById(id: number): Promise<any> {
    return await recommendationsRepository.findGenresById(id);
}

export async function topRecommendations(amount: number): Promise<any> {
    return await recommendationsRepository.topRecommendations(amount);
}

export async function getRecommendation(id: number) {
    try {
        const recommendation = await findById(id);
        recommendation.genres = await getGenresById(id);
        return recommendation
    } catch (err) {
        console.log(err);
    }
}