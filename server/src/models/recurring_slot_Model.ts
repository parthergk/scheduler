import { client } from "../database/connection";

interface Slot {
  id?: number;
  day_of_week: number;
  start_time: string;
  end_time: string;
  active?: boolean;
  created_at?: Date;
  updated_at?: Date;
}

interface ExceptionSlot {
  id?: number;
  recurring_slot_id: number;
  date: string;
  start_time?: string;
  end_time?: string;
  status: "edited" | "deleted";
}

interface AllSlot{
  recurring: Slot[];
  exception: ExceptionSlot[];
}

export const createSlot = async (data: Slot): Promise<Slot> => {
  const [slot] = await client("recurringSlot").insert(data).returning("*");
  return slot;
};

export const getSlot = async(startDate: string, endDate: string):Promise<AllSlot>=>{
    const recurring = await client("recurringSlot").select("*");
    const exception = await client("exceptionSlot").whereBetween("date", [startDate, endDate]);
    return {recurring, exception};
}
