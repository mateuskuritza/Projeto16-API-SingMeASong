import "../../src/setup";
import supertest from "supertest";
import app from "../../src/app";

import * as database from "../utils/database";
import * as genreFactory from "../factories/genreFactory";
import * as recommendationFactory from "../factories/recommendationFactory";

beforeEach(() => {
    database.clear();
});

afterAll(() => {
    database.end();
})

describe("POST /genres", () => {
    it("should create a new genre with status 201", async () => {
        const genre = genreFactory.getObject();
        const result = await supertest(app).post("/genres").send(genre);
        expect(result.body).toMatchObject({
            name: genre.name,
            id_genre: expect.any(Number),
        });
        expect(result.status).toBe(201);
    });
    it("should return 409 existing genre", async () => {
        const genre = genreFactory.getObject();
        await supertest(app).post("/genres").send(genre);
        const result = await supertest(app).post("/genres").send(genre);
        expect(result.status).toBe(409);
    });
})
/*
describe("GET /genres", () => {
    it("should return all genres", async () => {
        const genres = database.getAllGenres();
        const result = await supertest(app).get("/genres");
        expect(result.body).toEqual(genres);
    });
})

describe("GET /genres/:id", () => {
    it("should return a genre with his recommendations", async () => {
        const genre = await genreFactory.create();
        const firstRec = await recommendationFactory.create("musica1", [genre.id_genre]);
        const result = await supertest(app).get(`/genres/${genre.id_genre}`);
        expect(result.body).toMatchObject({
            id: genre.id_genre,
            name: genre.name,
            score: 0,
            recommendations: { firstRec, genres: Array }
        })
        // falta arrumar
    });

    it("should return 404 if genre not found", async () => {
        const result = await supertest(app).get("/genres/0");
        expect(result.status).toBe(404);
    });
})


describe("GET /recommendations/genres/:id/random", () => {

})

*/