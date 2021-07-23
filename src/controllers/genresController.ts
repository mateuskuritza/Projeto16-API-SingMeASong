import { Request, Response } from "express";
import * as genresServices from "../services/genresServices";

export async function newGenre(req: Request, res: Response) {
    try {
        const { name } = req.body;
        if (!name) return res.status(400).send("Name is required");
        try {
            const genre = await genresServices.create(name);
            res.status(201).send(genre);
        } catch {
            return res.status(409).send("Genre already exists");
        }
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
        if (!id || (isNaN(parseInt(id)))) return res.status(400).send("Id is required");
        const genre = await genresServices.getById(parseInt(id));
        if (genre.length === 0) return res.status(404).send("Genre not found");
        const resp = await genresServices.getGenreFormated(genre);
        res.status(200).send(resp);
    } catch (err) {
        res.status(500).send(err);
    }
}