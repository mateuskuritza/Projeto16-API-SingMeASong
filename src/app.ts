import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

import routes from "./routers/routes";
app.use("/", routes);

export default app;
