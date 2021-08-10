import connection from "../database/database";

export async function validateIds(genreIds: number[]): Promise<boolean> {
    const result = await connection.query(`SELECT * FROM genres WHERE id_genre IN (${genreIds.join(", ")})`);
    return result.rowCount === genreIds.length;
}

export async function create(name: string) {
    const result = await connection.query(`INSERT INTO genres (name) VALUES ($1) RETURNING *`, [name]);
    return result.rows[0];
}

export async function getAll() {
    return (await connection.query(`SELECT id_genre AS id, name FROM genres ORDER BY name ASC`)).rows;
}

export async function getById(id: number) {
    const result = (await connection.query(`
    SELECT g.id_genre, rg.id_recommendation, g.name AS genre_name, r.name as recommendation_name
    FROM genres AS g 
    JOIN "recommendations_genres" as rg 
    ON g.id_genre = rg.id_genre
    JOIN recommendations as r 
    ON r.id_recommendation = rg.id_recommendation AND rg.id_genre = $1
    `, [id])).rows;
    return result
}

export async function getRecommendations(id: number) {
    return (await connection.query(`
    SELECT g.id_genre as id, g.name AS name
    FROM genres AS g 
    JOIN "recommendations_genres" as rg 
    ON g.id_genre = rg.id_genre
    WHERE rg.id_recommendation = $1
    `, [id])).rows;
}