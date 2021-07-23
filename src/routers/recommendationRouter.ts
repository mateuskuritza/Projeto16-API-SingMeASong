import express from "express";
const routes = express.Router();

import * as recommendationsController from "../controllers/recommendationsController";

routes.post("/", recommendationsController.newRecommendation);
routes.post("/:id/upvote", recommendationsController.upvoteRecommendation);
routes.post("/:id/downvote", recommendationsController.downvoteRecommendation);
routes.get("/random", recommendationsController.randomRecommendation);
routes.get("/top/:amount", recommendationsController.topRecommendations);
routes.get("/genres/:id/random", recommendationsController.randomRecommendationByGenre);

export default routes