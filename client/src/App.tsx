import { addDays, format, startOfWeek } from "date-fns";
import { useEffect, useState } from "react";
import Schedules from "./components/Schedules";
import SlotInput from "./components/SlotInput";

interface SlotData {
  id: number;
  day_of_week: number;
  start_time: string;
  end_time: string;
  active?: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export default function App() {
  const [weekDays, setWeekDays] = useState<Date[]>([]);
  const [weekSlots, setWeekSlots] = useState<SlotData[]>([]);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  async function fetchData() {
    const startDate = format(weekDays[0], "yyyy-MM-dd");
    const endDate = format(weekDays[6], "yyyy-MM-dd");

    try {
      const res = await fetch(
        `http://localhost:8080/api/schedule?startDate=${startDate}&endDate=${endDate}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!res.ok) throw new Error("Failed to save");
      const data = await res.json();

      // const mappedWeek = weekDays.map((day, index) => {
      //   const dayOfWeek = index + 1;
      //   const slotsForDay = data.filter(
      //     (slot: any) => slot.day_of_week === dayOfWeek
      //   );
      //   return slotsForDay;
      // });

      setWeekSlots(data);

      console.log("Saved successfully:", data);
    } catch (err) {
      console.error("Error saving schedule:", err);
    }
  }

  useEffect(() => {
    const firstDay = startOfWeek(currentDate, { weekStartsOn: 1 });
    const firstWeek: Date[] = [];
    const currentDay = currentDate.getDay() - 1;
    for (let i = currentDay; i < currentDay + 7; i++) {
      firstWeek.push(addDays(firstDay, i));
    }
    setWeekDays(firstWeek);
  }, [currentDate]);

  useEffect(() => {
    if (weekDays.length === 0) return;
    fetchData();
  }, [weekDays]);

  const loadMoreWeek = () => {
    if (weekDays.length === 0) return;

    const lastDay = weekDays[weekDays.length - 1];
    const newWeek: Date[] = [];
    for (let i = 1; i <= 7; i++) {
      newWeek.push(addDays(lastDay, i));
    }
    setWeekDays((prev) => [...prev, ...newWeek]);
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
    if (scrollTop + clientHeight >= scrollHeight - 50) {
      loadMoreWeek();
    }
  };

  return (
    <div className="min-h-screen w-screen flex justify-center items-center bg-white p-4 sm:p-6 lg:p-8">
      <div className=" w-full max-w-xl mx-auto">
        <div className="bg-white border border-gray-200 rounded-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h1 className="text-2xl sm:text-3xl text-black mb-5 text-center">
              Your Schedule
            </h1>
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500 font-medium">
                {format(currentDate, "MMMM, yyyy")}
              </div>
            </div>
          </div>

          <div
            className="flex flex-col gap-3 max-h-96 overflow-y-auto"
            onScroll={handleScroll}
          >
            {weekDays.map((day) => (
              <div
                key={day.toISOString()}
                className=" bg-white p-2 rounded shadow-sm"
              >
                <div className="flex flex-col justify-between items-start gap-2">
                  <div className=" w-full flex justify-between">
                    <span className="font-medium w-full sm:w-auto">
                      {format(day, "EE, d MMMM")}
                    </span>
                    <SlotInput
                      length={
                        weekSlots?.filter(
                          (slot) => day.getDay() === slot.day_of_week
                        ).length
                      }
                      day={day.getDay()}
                    />
                  </div>
                  <Schedules
                    initSlots={weekSlots?.filter(
                      (slot) => day.getDay() === slot.day_of_week
                    )}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
