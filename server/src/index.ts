import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();
import * as UserModel from "./models/userModel";

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

const port = process.env.PORT || 8080;

app.post("/", async (req: Request, res: Response) => {
  try {
    const user = await UserModel.createUser(req.body);
    res.status(201).json(user);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.get("/", async (req: Request, res: Response) => {
  try {
    const user = await UserModel.getUser();
    res.status(201).json(user);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`http server is runing on http://localhost:${port}`);
});
