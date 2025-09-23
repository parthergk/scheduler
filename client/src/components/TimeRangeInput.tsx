import { useState } from "react";
import TimeInput from "./TimeInput";
import { useSave } from "../context/SaveProvider";

interface Props{
  onChange: (s:string, e:string)=>void;
};

const TimeRangeInput:React.FC<Props> = ({ onChange }) => {
  const invalidTimes = ["00:00", "00:0", "00", "0", ""];

  const [startTime, setStartTime] = useState("00:00");
  const [endTime, setEndTime] = useState("00:00");

  const { setIsSave } = useSave();

  const handleStartTimeChange = (value: string) => {
    if (!invalidTimes.includes(startTime)) {
      setIsSave(true);
    }

    setStartTime(value);
    onChange(value, endTime);
  };
  const handleEndTimeChange = (value: string) => {
    if (!invalidTimes.includes(startTime)) {
      setIsSave(true);
    }
    setEndTime(value);
    onChange(startTime, value);
  };

  return (
    <div className="flex items-center gap-2">
      <TimeInput value={startTime} onChange={handleStartTimeChange} />
      <span className="text-xs text-gray-600 font-medium">to</span>
      <TimeInput value={endTime} onChange={handleEndTimeChange} />
    </div>
  );
};

export default TimeRangeInput;
