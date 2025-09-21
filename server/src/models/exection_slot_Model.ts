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
export const updateSlot = async (id: number, data:Slot) => {
  const updatedSlot = await client("exceptionSlot").where({
    recurring_slot_id: id,
  }).update(data).returning("*");

  return updatedSlot;
};

export const deleteSlot = async(id:number)=>{
    await client("exceptionSlot").where({recurring_slot_id: id}).delete();
}
