import "../../src/setup";
import supertest from "supertest";
import app from "../../src/app";

import * as database from "../utils/database";
import * as genreFactory from "../factories/genreFactory";
import * as recommendationFactory from "../factories/recommendationFactory";

beforeEach(async () => {
    await database.clear();
});

afterAll(() => {
    database.clear();
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


describe("GET /genres", () => {
    it("should return all genres in alphabetical order", async () => {
        const one = await genreFactory.create("A");
        const two = await genreFactory.create("B");
        const result = await supertest(app).get("/genres");
        expect(result.body).toEqual([
            {
                id: one.id_genre,
                name: one.name
            },
            {
                id: two.id_genre,
                name: two.name
            }
        ])
    });
})

describe("GET /genres/:id", () => {

    it("should return a genre with his recommendations", async () => {
        const genre = await genreFactory.create();
        const firstRec = await recommendationFactory.create([genre.id_genre]);
        const result = await supertest(app).get(`/genres/${genre.id_genre}`);
        firstRec.genres = [{ id: genre.id_genre, name: genre.name }];
        expect(result.body).toMatchObject({
            id: genre.id_genre,
            name: genre.name,
            score: 0,
            recommendations: [firstRec]
        })
    });
    it("should return 400 invalid id", async () => {
        const result = await supertest(app).get("/genres/x");
        expect(result.status).toBe(400);
    });
    it("should return 404 if genre not found", async () => {
        const result = await supertest(app).get("/genres/1");
        expect(result.status).toBe(404);
    });
})


describe("GET /recommendations/genres/:id/random", () => {
    it("should return 400 invalid id", async () => {
        const result = await supertest(app).get("/recommendations/genres/x/random");
        expect(result.status).toBe(400);
    });
    it("should return 404 if genre not found", async () => {
        const result = await supertest(app).get("/recommendations/genres/1/random");
        expect(result.status).toBe(404);
    });
})
