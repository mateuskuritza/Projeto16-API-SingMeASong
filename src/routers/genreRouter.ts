import express from "express";
const routes = express.Router();

import * as genresController from "../controllers/genresController";

routes.post("/", genresController.newGenre);
routes.get("/", genresController.getAllGenres);
routes.get("/:id", genresController.getGenre);

export default routes
