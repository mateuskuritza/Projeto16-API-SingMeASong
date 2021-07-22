import connection from "../database/database";

export async function validateGenresIds(genreIds: number[]): Promise<boolean> {
    console.log(genreIds);
    const result = await connection.query(`SELECT * FROM genres WHERE id_genre IN (${genreIds.join(", ")})`);
    return result.rowCount === genreIds.length;
}