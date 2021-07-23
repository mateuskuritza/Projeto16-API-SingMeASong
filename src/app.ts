import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

import * as recommendationsController from "./controllers/recommendationsController";
import * as genresController from "./controllers/genresController";

app.post("/recommendations", recommendationsController.newRecommendation);
app.post("/recommendations/:id/upvote", recommendationsController.upvoteRecommendation);
app.post("/recommendations/:id/downvote", recommendationsController.downvoteRecommendation);
app.get("/recommendations/random", recommendationsController.randomRecommendation);
app.get("/recommendations/top/:amount", recommendationsController.topRecommendations);


app.post("/genres", genresController.newGenre);

export default app;
