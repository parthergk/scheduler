import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import * as RecurringSlot from "./models/recurring_slot_Model";

dotenv.config();

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

const port = process.env.PORT || 8080;

app.post("/", async (req: Request, res: Response) => {
  try {
    const newSlot = await RecurringSlot.createSlot(req.body);
    res.status(200).json(newSlot);
  } catch (error) {
    const errMsg =
      error instanceof Error
        ? error.message
        : "server side error please try again";
    res.status(400).json({ error: errMsg });
  }
});

app.post("/", async (req: Request, res: Response) => {
  const { startDate, endDate } = req.body;
  try {
    const slots = await RecurringSlot.getSlot(startDate, endDate);
    res.status(200).json(slots);
  } catch (error) {
    const errMsg =
      error instanceof Error
        ? error.message
        : "server side error please try again";
    res.status(400).json({ error: errMsg });
  }
});

app.listen(port, () => {
  console.log(`http server is runing on http://localhost:${port}`);
});
