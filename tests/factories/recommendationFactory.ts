import faker from "faker";
import connection from "../../src/database/database";

export function getObject(genresIds: number[] = [], name: string = faker.name.findName(), youtubeLink: string = "https://www.youtube.com/watch?v=ePjtnSPFWK8&ab_channel=CHXVEVO") {
    return {
        name,
        youtubeLink,
        genresIds
    }
}

export async function create(genresIds: number[] = [], name: string = faker.name.findName(), youtubeLink: string = "https://www.youtube.com/watch?v=ePjtnSPFWK8&ab_channel=CHXVEVO"): Promise<{ id_recommendation: number, name: string, youtubeLink: string, score: number }> {
    const newRecommendation = (await connection.query(`INSERT INTO recommendations (name, "youtubeLink") values ($1, $2) RETURNING *`, [name, youtubeLink])).rows[0];
    genresIds.forEach(async genreId => {
        await connection.query(`INSERT INTO recommendations_genres (id_recommendation, id_genre) values ($1, $2)`, [newRecommendation.id_recommendation, genreId]);
    });
    return newRecommendation;
}