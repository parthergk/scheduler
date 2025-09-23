import { addDays, format, startOfWeek } from "date-fns";
import { useEffect, useState } from "react";
import Slots from "./components/Slots";

export default function App() {
  const [weekDays, setWeekDays] = useState<Date[]>([]);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  useEffect(() => {
    const firstDay = startOfWeek(currentDate, { weekStartsOn: 1 });
    const firstWeek: Date[] = [];
    for (let i = 0; i < 7; i++) {
      firstWeek.push(addDays(firstDay, i));
    }
    setWeekDays(firstWeek);
  }, [currentDate]);

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
      // near bottom
      loadMoreWeek();
    }
  };

  return (
    <div className="min-h-screen w-screen flex justify-center items-center bg-white p-4 sm:p-6 lg:p-8">
      <div className=" w-full max-w-xl mx-auto">
        <div className="bg-white border border-gray-200 rounded-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h1 className="text-2xl sm:text-3xl text-black mb-2 text-center">
              Your Schedule
            </h1>
            <div className="text-sm text-gray-500 font-medium text-end">
            {format(currentDate, "MMMM, yyyy")}
          </div>
          </div>

          <div
            className="flex flex-col gap-3 max-h-96 overflow-y-auto"
            onScroll={handleScroll}
          >
            {weekDays.map((day) => (
              <div
                key={day.toISOString()}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-white p-2 rounded shadow-sm"
              >
                <span className="font-medium w-full sm:w-auto">
                  {format(day, "EE, d MMMM")}
                </span>
                <Slots />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
