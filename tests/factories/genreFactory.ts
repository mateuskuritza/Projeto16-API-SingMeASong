import faker from "faker";
import connection from "../../src/database/database";

export async function create(): Promise<{ id_genre: number, name: string }> {
    const name = faker.lorem.word();
    const genre = (await connection.query("INSERT INTO genres (name) VALUES ($1) RETURNING *", [name])).rows[0];
    return genre;
}

export function getObject(name: string = faker.lorem.word()) {
    return {
        name
    }
}