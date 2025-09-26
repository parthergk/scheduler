import * as RecurringSlot from "../models/recurring_slot_Model";

export async function getSlotsForWeek(startDate: string, endDate: string) {
  const { exception, recurring } = await RecurringSlot.getSlot(
    startDate,
    endDate
  );

  const slots = [];
  let current = new Date(startDate);
  let end = new Date(endDate);

  while (current <= end) {
    const dayOfWeek = current.getDay();
    const dateStr = current.toISOString().split("T")[0];

    const daySlot = recurring.filter((s) => s.day_of_week === dayOfWeek);

    for (const rSlot of daySlot) {
      const exSlots = exception.filter((e) => e.recurring_slot_id === rSlot.id);

      if (exSlots.length > 0) {
        for(const ex of exSlots){
          if (ex.status === "edited") {
            slots.push({
              ...rSlot,
              date: new Date(ex.date).toLocaleDateString("en-CA"),
              start_time: ex.start_time,
              end_time: ex.end_time,
              status: "edited",
            });
          } else {
            slots.push({
              ...rSlot,
              date: new Date(ex.date).toLocaleDateString("en-CA"),
              status: "deleted",
            });
          }
        }
      }
      slots.push({
        ...rSlot,
        date: dateStr,
        status: "recurring",
      });
    }

    current.setDate(current.getDate() + 1);
  }

  return slots;
}
