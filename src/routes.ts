import express from "express";
const routes = express.Router();

import * as recommendationsController from "./controllers/recommendationsController";
import * as genresController from "./controllers/genresController";

routes.post("/recommendations", recommendationsController.newRecommendation);
routes.post("/recommendations/:id/upvote", recommendationsController.upvoteRecommendation);
routes.post("/recommendations/:id/downvote", recommendationsController.downvoteRecommendation);
routes.get("/recommendations/random", recommendationsController.randomRecommendation);
routes.get("/recommendations/top/:amount", recommendationsController.topRecommendations);


routes.post("/genres", genresController.newGenre);
routes.get("/genres", genresController.getAllGenres);
routes.get("/genres/:id", genresController.getGenre);
routes.get("/recommendations/genres/:id/random", genresController.randomRecommendationByGenre);

export default routes;