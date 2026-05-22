import dotenv from "dotenv";
import express, { Request, Response } from "express";
import apiRouter from "./routes/api.route";
import cors from "cors";

dotenv.config();

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}))

app.use(express.json());

app.use(apiRouter);

const PORT = process.env.PORT || 2000;
console.log("DB URL:", process.env.DATABASE_URL);


app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});