import { Request, Response } from "express";
import * as genresServices from "../services/genresServices";
import { getRecommendation } from "../services/recommendationsServices";

export async function newGenre(req: Request, res: Response) {
    try {
        const { name } = req.body;
        if (!name) return res.status(400).send("Name is required");
        let genre: object = {};
        try {
            genre = await genresServices.create(name);
        } catch {
            return res.status(409).send("Genre already exists");
        }
        res.status(201).send(genre);
    } catch (err) {
        res.status(500).send(err);
    }
}

export async function getAllGenres(req: Request, res: Response) {
    try {
        const genres = await genresServices.getAll();
        res.status(200).send(genres);
    } catch (err) {
        res.status(500).send(err);
    }
}

export async function getGenre(req: Request, res: Response) {
    try {
        const { id } = req.params;
        if (!id) return res.status(400).send("Id is required");
        const genre = await genresServices.getById(Number(id));
        if (!genre) return res.status(404).send("Genre not found");

        let score = 0;
        const recommendations = await Promise.all((genre.map(async g => {
            const recommendation = await getRecommendation(g.id_recommendation);
            score += recommendation.score;
            return recommendation;
        })));

        const resp = {
            id: genre[0].id_genre,
            name: genre[0].genre_name,
            score,
            recommendations: recommendations
        }

        res.status(200).send(resp);
    } catch (err) {
        res.status(500).send(err);
    }
}