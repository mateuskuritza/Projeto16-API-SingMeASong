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

afterAll(() => {
    database.end();
})


describe("POST /recommendations", () => {

    it("should answer status 400 with invalid name", async () => {
        const createdGenre = await genresFactory.create();
        console.log(createdGenre);
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
/*
describe("POST /recommendations/:id/upvote", () => {

    it("should answer status 404 with invalid id", async () => {
        const newRecommendation = await recommendationFactory.create();
        const response = await recommendationUtils.upVote(newRecommendation.id_recommendation + 1);
        expect(response.status).toBe(404);
    });
    it("should answer status 200 success", async () => {
        const newRecommendation = await recommendationFactory.create();
        const response = await recommendationUtils.upVote(newRecommendation.id_recommendation);
        expect(response.body).toMatchObject({ score: Number });
        expect(response.status).toBe(200);
    });
})

describe("POST /recommendations/:id/downvote", () => {

    it("should answer status 404 with invalid id", async () => {
        const newRecommendation = await recommendationFactory.create();
        const response = await recommendationUtils.downVote(newRecommendation.id_recommendation + 1);
        expect(response.status).toBe(404);
    });

    it("should remove recommendation when score < -5", async () => {
        const newRecommendation = await recommendationFactory.create();
        for (let i = 0; i < 6; i++) await recommendationUtils.downVote(newRecommendation.id_recommendation)
        const result = await database.getAllRecommendations();
        expect(result.length).toBe(0);
    });

    it("should answer status 200 success", async () => {
        const newRecommendation = await recommendationFactory.create();
        const response = await recommendationUtils.downVote(newRecommendation.id_recommendation);
        expect(response.body).toMatchObject({ score: Number });
        expect(response.status).toBe(200);
    });
})

describe("GET /recommendations/random", () => {
    it("should answer status 404 with no recommendations in database", async () => {
        const response = await supertest(app).get("/recommendations/random");
        expect(response.status).toBe(404);
    })
    it("should answer status 200 with random recommendation", async () => {
        const newRecommendation = await recommendationFactory.create();
        const response = await supertest(app).get(`/recommendations/random`);
        expect(response.status).toBe(200);
        expect(response.body.id_recommendation).toBe(newRecommendation.id_recommendation);
    });
})

describe("GET /recommendations/top/:amount", () => {
    it("should answer status 400 with invalid amount", async () => {
        const response = await supertest(app).get("/recommendations/top/xxx");
        expect(response.status).toBe(400);
    });
    it("should answer status 200 with top amount recommendations", async () => {
        const newRecommendation1 = await recommendationFactory.create();
        const newRecommendation2 = await recommendationFactory.create("name", [], "https://www.youtube.com/watch?v=7EjIdjKNRls&ab_channel=RadarRecordsOficial");
        await recommendationUtils.upVote(newRecommendation1.id_recommendation);
        newRecommendation1.score = 1;
        const response = await supertest(app).get(`/recommendations/top/` + 2);
        expect(response.status).toBe(200);
        expect(response.body).toBe([
            newRecommendation1,
            newRecommendation2
        ]);
    });
})*/