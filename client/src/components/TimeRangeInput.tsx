import { useState } from "react";
import TimeInput from "./TimeInput";

const TimeRangeInput = () => {
  const [startTime, setStartTime] = useState("00:00");
  const [endTime, setEndTime] = useState("00:00");

  return (
    <div className="flex items-center gap-2">
      <TimeInput value={startTime} onChange={setStartTime} />
      <span className="text-xs text-gray-600 font-medium">to</span>
      <TimeInput value={endTime} onChange={setEndTime} />
    </div>
  );
};

export default TimeRangeInput;
