import express from "express";
const rootRouter = express.Router();

import genreRoutes from "./genreRouter";
import recommendationRoutes from "./recommendationRouter";

rootRouter.use("/genres", genreRoutes);
rootRouter.use("/recommendations", recommendationRoutes);

export default rootRouter;