import supertest from "supertest";
import app from "../../src/app";

export async function downVote(id: number) {
    return await supertest(app).post(`/recommendations/${id}/downvote`);
}

export async function upVote(id: number) {
    return await supertest(app).post(`/recommendations/${id}/upvote`);
}