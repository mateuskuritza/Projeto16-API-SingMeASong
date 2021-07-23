import connection from "../database/database";
import faker from "faker";

export async function create(name: string = faker.name.findName(), genresIds: number[] = [], youtubeLink: string = "https://www.youtube.com/watch?v=ePjtnSPFWK8&ab_channel=CHXVEVO"): Promise<{ id_recommendation: number, name: string, youtubeLink: string, score: number }> {
    const newRecommendation = (await connection.query(`INSERT INTO recommendations (name, "youtubeLink") values ($1, $2) RETURNING *`, [name, youtubeLink])).rows[0];
    genresIds.forEach(async genreId => {
        await connection.query(`INSERT INTO recommendations_genres (id_recommendation, id_genre) values ($1, $2)`, [newRecommendation.id_recommendation, genreId]);
    });
    return newRecommendation;
}

export async function findByYoutubeLink(youtubeLink: string) {
    return (await connection.query(`SELECT * FROM recommendations WHERE "youtubeLink" = $1`, [youtubeLink])).rows[0];
}

export async function findById(id: number) {
    return (await connection.query(`SELECT * FROM recommendations WHERE id_recommendation = $1`, [id])).rows[0];
}

export async function findByName(name: string) {
    return (await connection.query(`SELECT * FROM recommendations WHERE name = $1`, [name])).rows[0];
}

export async function upvoteRecommendation(id: number) {
    return (await connection.query(`UPDATE recommendations SET score = score + 1 WHERE id_recommendation = $1 RETURNING *`, [id])).rows[0];
}

export async function downvoteRecommendation(id: number) {
    return (await connection.query(`UPDATE recommendations SET score = score - 1 WHERE id_recommendation = $1 RETURNING *`, [id])).rows[0];
}

export async function deleteRecommendation(id: number) {
    await connection.query(`DELETE FROM recommendations_genres WHERE id_recommendation = $1`, [id]);
    await connection.query(`DELETE FROM recommendations WHERE id_recommendation = $1`, [id]);
}

export async function randomRecommendation() {
    return (await connection.query(`SELECT id_recommendation AS id, name, "youtubeLink", score FROM recommendations ORDER BY RANDOM() LIMIT 1`)).rows[0];
}

export async function bestRecommendations() {
    return (await connection.query(`SELECT id_recommendation AS id, name, "youtubeLink", score FROM recommendations WHERE score > 10`)).rows;
}

export async function worstRecommendations() {
    return (await connection.query(`SELECT id_recommendation AS id, name, "youtubeLink", score FROM recommendations WHERE score < 11`)).rows;
}

export async function findGenresById(id: number): Promise<object[]> {
    const genres = (await connection.query(`
    SELECT rg.id_genre, name 
    FROM genres g
    JOIN recommendations_genres rg
    ON rg.id_genre = g.id_genre
    WHERE rg.id_recommendation = $1
    `, [id])).rows;
    return genres.map(genre => {
        return {
            "id": genre.id_genre,
            "name": genre.name
        }
    });
}

export async function topRecommendations(number: number = 10): Promise<{ id_recommendation: number, name: string, youtubeLink: string, score: number }[]> {
    return (await connection.query(`SELECT * FROM recommendations ORDER BY score DESC LIMIT $1`, [number])).rows;
}

export async function getRandomRecommendationByGenreId(genreId: number): Promise<any> {
    return (await connection.query(`SELECT * FROM recommendations WHERE id_recommendation IN (SELECT id_recommendation FROM recommendations_genres WHERE id_genre = $1) ORDER BY RANDOM() LIMIT 1`, [genreId])).rows[0];
}