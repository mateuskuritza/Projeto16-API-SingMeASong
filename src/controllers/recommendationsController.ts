import { Request, Response } from "express";
import { validRecommendation } from "../services/recommendationsServices";

function newRecommendation(req: Request, res: Response) {

    const { name, youtubeLink, genresIds } = req.body;

    if (!validRecommendation(name, youtubeLink)) return res.status(400).send("Invalid name or youtube link");

    res.sendStatus(201);
}

export { newRecommendation };