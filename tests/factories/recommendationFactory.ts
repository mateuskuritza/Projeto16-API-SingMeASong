import faker from "faker";
import connection from "../../src/database/database";

function randomYoutubeLink() {
    const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_'
    let id: string = "";
    for (let i = 0; i < 11; i++) {
        id += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return `https://www.youtube.com/watch?v=${id}`;
}

export function getObject(genresIds: number[] = [], name: string = faker.name.findName(), youtubeLink: string = randomYoutubeLink()) {
    return {
        name,
        youtubeLink,
        genresIds
    }
}

export async function create(genresIds: number[] = [1], name: string = faker.name.findName(), youtubeLink: string = randomYoutubeLink()): Promise<{ id_recommendation: number, name: string, youtubeLink: string, score: number, genres: any[] }> {
    const newRecommendation = (await connection.query(`INSERT INTO recommendations (name, "youtubeLink") values ($1, $2) RETURNING *`, [name, youtubeLink])).rows[0];
    genresIds.forEach(async genreId => {
        await connection.query(`INSERT INTO recommendations_genres (id_recommendation, id_genre) values ($1, $2)`, [newRecommendation.id_recommendation, genreId]);
    });
    newRecommendation.genres = genresIds;
    return newRecommendation;
}