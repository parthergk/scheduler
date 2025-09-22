import { addDays, format, startOfWeek } from "date-fns";
import { useEffect, useState } from "react";

export default function App() {
  const [weekDays, setWeekDays] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const firstDay = startOfWeek(currentDate, { weekStartsOn: 1 });
    const firstweek = [];
    for (let i = 0; i < 7; i++) {
      firstweek.push(addDays(firstDay, i));
    }
    setWeekDays(firstweek);
  }, []);

  return (
    <div className=" flex justify-center items-center bg-neutral-600 w-screen h-screen">
      <div className=" w-full max-w-xl border p-3">
        <h1 className=" text-center text-xl">Your Schedule</h1>
        <div className=" flex flex-col gap-3 border mt-3 p-3">
          <div className=" self-end border px-1">month</div>
          <div className=" border px-1">
            <h2 className=" border-b">Week</h2>
            <div className=" mt-3 px-2 flex flex-col gap-1">
              <ul>
                {weekDays.map((day) => (
                  <li key={day}>{format(day, "EE, d MMMM")}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
