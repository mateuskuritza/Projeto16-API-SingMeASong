import "../../src/setup";
import supertest from "supertest";
import app from "../../src/app";

import * as recommendationFactory from "../factories/recommendationFactory";
import * as genresFactory from "../factories/genreFactory";
import * as database from "../utils/database";
import * as recommendationUtils from "../utils/recommendations";

beforeEach(async () => {
    await database.clear();
});

afterAll(async () => {
    await database.clear();
    database.end();
})

describe("POST /recommendations", () => {

    it("should answer status 400 with invalid name", async () => {
        const createdGenre = await genresFactory.create();
        const response = await supertest(app).post("/recommendations").send(recommendationFactory.getObject([createdGenre.id_genre], ""));
        expect(response.status).toBe(400);
    });
    it("should answer status 400 with invalid youtubeLink", async () => {
        const createdGenre = await genresFactory.create();
        const response = await supertest(app).post("/recommendations").send(recommendationFactory.getObject([createdGenre.id_genre], "Fulano", "fakeLink"));
        expect(response.status).toBe(400);
    });
    it("should answer status 400 with duplicate youtubeLink", async () => {
        const createdGenre = await genresFactory.create();
        const newRecommendation = recommendationFactory.getObject([createdGenre.id_genre]);
        await supertest(app).post("/recommendations").send(newRecommendation);
        const response = await supertest(app).post("/recommendations").send(newRecommendation);
        expect(response.status).toBe(400);
    });
    it("should answer status 400 with duplicate name", async () => {
        const createdGenre = await genresFactory.create();
        const newRecommendation = recommendationFactory.getObject([createdGenre.id_genre], "Fulano");
        const newRecommendation2 = recommendationFactory.getObject([createdGenre.id_genre], "Fulano");
        await supertest(app).post("/recommendations").send(newRecommendation);
        const response = await supertest(app).post("/recommendations").send(newRecommendation2);
        expect(response.status).toBe(400);
    });
    it("should answer status 400 with invalid genreId", async () => {
        const createdGenre = await genresFactory.create();
        const newRecommendation = recommendationFactory.getObject([createdGenre.id_genre + 1]);
        await supertest(app).post("/recommendations").send(newRecommendation);
        const response = await supertest(app).post("/recommendations").send(newRecommendation);
        expect(response.status).toBe(400);
    });
    it("should answer status 201 when created recommendation", async () => {
        const createdGenre = await genresFactory.create();
        const newRecommendation = recommendationFactory.getObject([createdGenre.id_genre]);
        const response = await supertest(app).post("/recommendations").send(newRecommendation);
        const result = await database.getAllRecommendations();
        expect(result.length).toBe(1);
        expect(response.status).toBe(201);
    });
})

describe("POST /recommendations/:id/upvote", () => {

    it("should answer status 404 with invalid id", async () => {
        const createdGenre = await genresFactory.create();
        const newRecommendation = await recommendationFactory.create([createdGenre.id_genre]);
        const response = await recommendationUtils.upVote(newRecommendation.id_recommendation + 1);
        expect(response.status).toBe(404);
    });
    it("should answer status 200 success", async () => {
        const createdGenre = await genresFactory.create();
        const newRecommendation = await recommendationFactory.create([createdGenre.id_genre]);
        const response = await recommendationUtils.upVote(newRecommendation.id_recommendation);
        expect(response.body).toMatchObject({ score: expect.any(Number) });
        expect(response.status).toBe(200);
    });
})

describe("POST /recommendations/:id/downvote", () => {

    it("should remove recommendation when score < -5", async () => {
        const createdGenre = await genresFactory.create();
        const newRecommendation = await recommendationFactory.create([createdGenre.id_genre]);
        for (let i = 0; i <= 5; i++) {
            await recommendationUtils.downVote(newRecommendation.id_recommendation);
        }
        const result = await database.getAllRecommendations();
        expect(result.length).toBe(0);
    });

    it("should answer status 404 with invalid id", async () => {
        const createdGenre = await genresFactory.create();
        const newRecommendation = await recommendationFactory.create([createdGenre.id_genre]);
        const response = await recommendationUtils.downVote(newRecommendation.id_recommendation + 1);
        expect(response.status).toBe(404);
    });


    it("should answer status 200 success", async () => {
        const createdGenre = await genresFactory.create();
        const newRecommendation = await recommendationFactory.create([createdGenre.id_genre]);
        const response = await recommendationUtils.downVote(newRecommendation.id_recommendation);
        expect(response.body).toMatchObject({ score: expect.any(Number) });
        expect(response.status).toBe(200);
    });
})

describe("GET /recommendations/random", () => {
    it("should answer status 404 with no recommendations in database", async () => {
        const response = await supertest(app).get("/recommendations/random");
        expect(response.status).toBe(404);
    })
    it("should answer status 200 with random recommendation", async () => {
        const createdGenre = await genresFactory.create();
        const newRecommendation = await recommendationFactory.create([createdGenre.id_genre]);
        const response = await supertest(app).get(`/recommendations/random`);
        expect(response.status).toBe(200);
        expect(response.body.id).toBe(newRecommendation.id_recommendation);
    });
})

describe("GET /recommendations/top/:amount", () => {
    it("should answer status 400 with invalid amount", async () => {
        const response = await supertest(app).get("/recommendations/top/xxx");
        expect(response.status).toBe(400);
    });
    it("should answer status 200 with top amount recommendations", async () => {
        const createdGenre = await genresFactory.create();
        await recommendationFactory.create([createdGenre.id_genre]);
        const newRecommendation2 = await recommendationFactory.create([createdGenre.id_genre]);
        const newRecommendation3 = await recommendationFactory.create([createdGenre.id_genre]);
        await recommendationUtils.upVote(newRecommendation2.id_recommendation);
        await recommendationUtils.upVote(newRecommendation3.id_recommendation);
        newRecommendation2.genres = [{ id: createdGenre.id_genre, name: createdGenre.name }];
        newRecommendation3.genres = [{ id: createdGenre.id_genre, name: createdGenre.name }];
        newRecommendation2.score = 1;
        newRecommendation3.score = 1;
        const response = await supertest(app).get(`/recommendations/top/` + 2);
        expect(response.status).toBe(200);
        expect(JSON.stringify(response.body)).toMatch(JSON.stringify([newRecommendation2, newRecommendation3]));
    });
})