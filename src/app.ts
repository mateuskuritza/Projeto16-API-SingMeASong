import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

import * as recommendationsController from "./controllers/recommendationsController";

app.post("/recommendations", recommendationsController.newRecommendation);

export default app;
