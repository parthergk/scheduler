import { format } from "date-fns";

interface SlotData {
  id: number;
  day_of_week: number;
  start_time: string;
  end_time: string;
  active?: boolean;
  created_at?: Date;
  updated_at?: Date;
  status: "recurring" | "edited" | "deleted";
  date?: string;
}
export const getDaySlots = (slots: SlotData[], day: Date): SlotData[] => {
  const slotDate = format(day, "yyyy-MM-dd");

  return slots.filter((slot) => {
    if (slot.status === "edited") {
      const hasDeleted = slots.some(
        (del) => del.status === "deleted" && del.id === slot.id && del.date === slotDate
      );
      return slot.date === slotDate && !hasDeleted;
    }

    if (slot.status === "deleted") return false;

    const hasException = slots.some(
      (ex) => ex.status === "edited" && ex.id === slot.id && ex.date === slotDate
    );
    const hasDeleted = slots.some(
      (del) => del.status === "deleted" && del.id === slot.id && del.date === slotDate
    );

    return slot.day_of_week === day.getDay() && !hasException && !hasDeleted;
  });
};