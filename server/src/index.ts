import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();
import * as RecurringSlot from "./models/recurring_slot_Model";
import * as ExectionSlot from "./models/exection_slot_Model";
import { getSlotsForWeek } from "./helper/getSlotsForWeek";

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

const port = process.env.PORT || 8080;

app.post("/api/schedule", async (req: Request, res: Response) => {
  const { day, startTime, endTime } = req.body;
  try {
    if (!day || !startTime || !endTime) {
      return res.status(400).json({
        success: false,
        error: "day, startTime, endTime are required",
      });
    }

    const newSlot = await RecurringSlot.createSlot({
      day_of_week: day,
      start_time: startTime,
      end_time: endTime,
    });

    return res.status(201).json({ success: true, data: newSlot });
  } catch (error) {
    console.log("Error", error);
    const errMsg =
      error instanceof Error
        ? error.message
        : "server side error please try again";
    res.status(500).json({ error: errMsg });
  }
});

app.get("/api/schedule", async (req: Request, res: Response) => {
  const startDate = req.query.startDate as string;
  const endDate = req.query.endDate as string;

  if (!startDate || !endDate) {
    return res
      .status(400)
      .json({ success: false, error: "Start Date and End Date required" });
  }

  try {
    const slots = await getSlotsForWeek(startDate, endDate);

    return res.status(200).json({ success: true, data: slots });
  } catch (error) {
    const errMsg =
      error instanceof Error
        ? error.message
        : "server side error please try again";
    res.status(500).json({ error: errMsg });
  }
});

app.put("/api/schedule", async (req: Request, res: Response) => {
  const { id, date, start_time, end_time, status } = req.body;

  if (!id || !date) {
    return res
      .status(400)
      .json({ success: false, error: "id and date are required" });
  }
  
  try {
    const updatedSlot = await ExectionSlot.createException({
      recurring_slot_id: id,
      date,
      start_time,
      end_time,
      status,
    });

    return res.status(200).json({ success: true, data: updatedSlot });
  } catch (error) {
    const errMsg =
      error instanceof Error
        ? error.message
        : "server side error please try again";
    res.status(500).json({ error: errMsg });
  }
});

app.delete("/api/schedule", async (req: Request, res: Response) => {
  const { id, date } = req.body;
  
  if (!id || !date) {
    return res
      .status(400)
      .json({ success: false, error: "id and date are required" });
  }
  try {
    await ExectionSlot.markSlotDeleted({
    recurring_slot_id: id,
    date,
    status: "deleted"
  });

    return res.status(200).json({ success: true, message: "Slot deleted" });
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
