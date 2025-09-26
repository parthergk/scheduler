import { addDays, format, startOfWeek } from "date-fns";
import { useEffect, useState } from "react";
import Schedules from "./components/Schedules";
import SlotInput from "./components/SlotInput";
import { getDaySlots } from "./utils/slotHelpers";

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

export default function App() {
  const [weekDays, setWeekDays] = useState<Date[]>([]);
  const [weekSlots, setWeekSlots] = useState<SlotData[]>([]);
  const [currentDate] = useState<Date>(new Date());
  const [message, setMessage] = useState<string | null>(null);

  async function fetchData() {
    const startDate = format(weekDays[0], "yyyy-MM-dd");
    const endDate = format(weekDays[6], "yyyy-MM-dd");

    try {
      const res = await fetch(
        `https://scheduler-ten-eosin.vercel.app/api/schedule?startDate=${startDate}&endDate=${endDate}`
      );
      if (!res.ok) throw new Error("Failed to fetch slots");

      const { data } = await res.json();
      setWeekSlots(data);
    } catch (err: any) {
      showMessage(err.message || "Error fetching slots", true);
    }
  }

  function showMessage(msg: string, isError = false) {
    setMessage(isError ? `❌ ${msg}` : `✅ ${msg}`);
    setTimeout(() => setMessage(null), 3000);
  }

  useEffect(() => {
    const firstDay = startOfWeek(currentDate, { weekStartsOn: 1 });
    const firstWeek: Date[] = [];
    for (let i = 0; i < 7; i++) {
      firstWeek.push(addDays(firstDay, i));
    }
    setWeekDays(firstWeek);
  }, [currentDate]);

  useEffect(() => {
    if (weekDays.length > 0) fetchData();
  }, [weekDays]);

  const loadMoreWeek = () => {
    if (weekDays.length === 0) return;
    const lastDay = weekDays[weekDays.length - 1];
    const newWeek = Array.from({ length: 7 }, (_, i) => addDays(lastDay, i + 1));
    setWeekDays((prev) => [...prev, ...newWeek]);
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
    if (scrollTop + clientHeight >= scrollHeight - 50) loadMoreWeek();
  };

  return (
    <div className="min-h-screen w-screen flex justify-center items-center bg-white p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-xl mx-auto">
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
            {message && (
              <div className="mt-3 text-center text-sm font-medium">
                {message}
              </div>
            )}
          </div>

          <div
            className="flex flex-col gap-3 max-h-96 overflow-y-auto"
            onScroll={handleScroll}
          >
            {weekDays.map((day) => {
              const daySlots = getDaySlots(weekSlots, day);
              return (
                <div
                  key={day.toISOString()}
                  className="bg-white p-2 rounded shadow-sm"
                >
                  <div className="flex flex-col justify-between items-start gap-2">
                    <div className="w-full flex justify-between">
                      <span className="font-medium w-full sm:w-auto">
                        {format(day, "EE, d MMMM")}
                      </span>
                      <SlotInput
                        length={daySlots.length}
                        day={day.getDay()}
                        onChange={fetchData}
                        showMessage={showMessage}
                      />
                    </div>
                    <Schedules
                      date={format(day, "yyyy-MM-dd")}
                      initSlots={daySlots}
                      onChange={fetchData}
                      showMessage={showMessage}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
