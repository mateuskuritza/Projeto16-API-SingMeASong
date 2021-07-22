import connection from "../../src/database/database";

export function end() {
    connection.end();
}

export function clear() {
    connection.query(`TRUNCATE TABLE recommendations, recommendations_genres, genres RESTART IDENTITY`);
}

export async function getAllRecommendations() {
    return (await connection.query(`SELECT * FROM recommendations`)).rows;
}

export async function getAllGenres() {
    return (await connection.query(`SELECT id_genre, name FROM genres ORDER BY name ASC`)).rows;
}