import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();
import * as RecurringSlot from "./models/recurring_slot_Model";
import * as ExectionSlot from "./models/exection_slot_Model";

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

const port = process.env.PORT || 8080;

app.post("/api/schedule", async (req: Request, res: Response) => {
  try {
    const newSlot = await RecurringSlot.createSlot({
      day_of_week: req.body.day,
      start_time: req.body.startTime,
      end_time: req.body.endTime,
    });
    res.status(200).json(newSlot);
  } catch (error) {
    console.log("Error", error);

    const errMsg =
      error instanceof Error
        ? error.message
        : "server side error please try again";
    res.status(400).json({ error: errMsg });
  }
});

app.get("/api/schedule", async (req: Request, res: Response) => {
  const startDate = req.query.startDate as string;
  const endDate = req.query.endDate as string;

  if (!startDate || !endDate) {
    return res.status(400).json({ error: "Start Date and End Date required" });
  }

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
  const { data } = req.body;
  try {
    const updatedSlot = ExectionSlot.createException(data);
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
  const { id, date } = req.body;
  try {
    await ExectionSlot.markSlotDeleted(id, date);
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
