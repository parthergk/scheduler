import { useState } from "react";

interface SlotData {
  id?: number;
  day_of_week: number;
  start_time: string;
  end_time: string;
  active?: boolean;
  created_at?: Date;
  updated_at?: Date;
}

interface Props {
  initSlots?: SlotData[];
}

const Schedule: React.FC<Props> = ({ initSlots }) => {
  const [input, setInput]= useState("");
  
  return (
    <div className=" flex flex-col gap-2">
      {initSlots?.map((item) => (
        <input
          key={item.id}
          type="text"
          placeholder="00:00"
          onChange={(e)=>setInput(e.target.value)}
          value={`${item.start_time.slice(0, 5)} to ${item.end_time.slice(
            0,
            5
          )}`}
          className={`w-28 px-2 py-1 text-sm border border-gray-300 rounded-sm bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all duration-200 text-center`}
        />
      ))}
    </div>
  );
};

export default Schedule;
