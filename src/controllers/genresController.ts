import { Request, Response } from "express";
import * as genresServices from "../services/genresServices";

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