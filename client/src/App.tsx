import { addDays, format, startOfWeek } from "date-fns";
import { useEffect, useState } from "react";
import Slots from "./components/Slots";
import { useSave } from "./context/SaveProvider";

export default function App() {
  const { isSave } = useSave();
  const [weekDays, setWeekDays] = useState<Date[]>([]);
  const [weekSlots, setWeekSlots] = useState();
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [slotsData, setSlotsData] = useState<{
    day: number;
    startTime: string;
    endTime: string;
  } | null>(null);

  const handleSave = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(slotsData),
      });

      if (!res.ok) throw new Error("Failed to save");
      const data = await res.json();
      console.log("Saved successfully:", data);
    } catch (err) {
      console.error("Error saving schedule:", err);
    }
  };

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

      const mappedWeek = weekDays.map((day, index) => {
        const dayOfWeek = index + 1;
        const slotsForDay = data.recurring.filter(
          (slot: any) => slot.day_of_week === dayOfWeek
        );
        return slotsForDay;
      });
      
      setWeekSlots(mappedWeek);

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
              <button
                onClick={handleSave}
                disabled={isSave !== true}
                className={` cursor-pointer text-sm font-medium text-white px-2 rounded-sm ${
                  isSave ? " bg-amber-500" : "bg-neutral-400"
                }`}
              >
                Save
              </button>
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
                <Slots
                initSlots={weekSlots}
                  day={day}
                  onSlotChange={(slot) => {
                    setSlotsData(slot);
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
