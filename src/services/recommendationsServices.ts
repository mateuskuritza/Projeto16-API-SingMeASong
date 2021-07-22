import getYouTubeID from "get-youtube-id";

export function validRecommendation(name: string, youtubeLink: string): boolean {
    if (!name || !getYouTubeID(youtubeLink)) return false;
    return true;
}
