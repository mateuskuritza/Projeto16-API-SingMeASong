import { Request, Response } from "express";
import * as recommendationsServices from "../services/recommendationsServices";

export async function newRecommendation(req: Request, res: Response) {
    try {
        const { name, youtubeLink, genresIds } = req.body;
        const validRecommendation = await recommendationsServices.validRecommendation(name, youtubeLink, genresIds)
        if (!validRecommendation) return res.status(400).send("Invalid name, youtube link or genre id");
        const alreadyExists = await recommendationsServices.findByYoutubeLink(youtubeLink);
        if (alreadyExists) return res.status(400).send("Youtube link already exists");
        await recommendationsServices.saveRecommendation(name, youtubeLink, genresIds);
        res.sendStatus(201);
    } catch (err) {
        res.status(500).send(err);
    }
}