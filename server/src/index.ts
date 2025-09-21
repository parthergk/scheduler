import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import * as RecurringSlot from "./models/recurring_slot_Model";
import * as ExectionSlot from "./models/exection_slot_Model";

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

app.put("/", async (req: Request, res: Response) => {
  const { id, data } = req.body;
  try {
    const updatedSlot = ExectionSlot.updateSlot(id, data);
    res.status(200).json(updatedSlot);
  } catch (error) {
    const errMsg =
      error instanceof Error
        ? error.message
        : "server side error please try again";
    res.status(400).json({ error: errMsg });
  }
});

app.delete("/", async (req: Request, res: Response) => {
  const { id } = req.body;
  try {
    await ExectionSlot.deleteSlot(id);
    res.status(200).json({ message: "slot deleted" });
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
