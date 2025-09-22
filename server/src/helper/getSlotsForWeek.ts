import * as RecurringSlot from "../models/recurring_slot_Model";

export async function getSlotsForWeek(startDate: string, endDate: string) {
  const { exception, recurring } = await RecurringSlot.getSlot(startDate, endDate);

  const slots = [];
  let current = new Date(startDate);
  let end = new Date(endDate);

  while (current <= end) {
    const dayOfWeek = current.getDay();
    const dateStr = current.toISOString().split("T")[0];

    const daySlot = recurring.filter((s) => s.day_of_week === dayOfWeek);

    for (const rSlot of daySlot) {
      const ex = exception.find(
        (e) => e.recurring_slot_id === rSlot.id && e.date === dateStr
      );

      if (ex) {
        slots.push({
          ...rSlot,
          date: ex.date,
          start_time: ex.start_time,
          end_time: ex.end_time,
          status: "edited",
        });
      } else {
        slots.push({
          ...rSlot,
          date: dateStr,
          status: "recurring",
        });
      }
    }

    current.setDate(current.getDate() + 1);
  }

  return slots;
}
