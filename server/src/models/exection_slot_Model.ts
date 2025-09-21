import { client } from "../database/connection";

interface ExceptionSlot {
  id?: number;
  recurring_slot_id: number;
  date: string;
  start_time?: string;
  end_time?: string;
  status: "edited" | "deleted";
}

export const createException = async (data: ExceptionSlot) => {
  const [exception] = await client("exceptionSlot").insert(data).returning("*");
  return exception;
};

export const markSlotDeleted = async (recurringSlotId: number, date: string) => {
  const [exception] = await client("exceptionSlot").insert({
    recurring_slot_id: recurringSlotId,
    date,
    status: "deleted"
  }).returning("*");
  return exception;
};

