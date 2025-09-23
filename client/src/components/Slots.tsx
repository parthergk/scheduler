import { useState } from "react";
import TimeRangeInput from "./TimeRangeInput";
import { CirclePlus, Trash2 } from "lucide-react";

interface Props {
  day: Date;
  onSlotChange: (slot: {
    day: number;
    startTime: string;
    endTime: string;
  }) => void;
}

const Slots: React.FC<Props> = ({initSlots, day, onSlotChange }) => {
  const [timeRangeInputs, setTimeRangeInputs] = useState<{ id: number }[]>([]);
  const [nextId, setNextId] = useState(1);

  const handleAddTimeInputs = () => {
    if (timeRangeInputs.length < 2) {
      setTimeRangeInputs((prev) => [...prev, { id: nextId }]);
      setNextId((prev) => prev + 1);
    }
  };

  const handleRemoveTimeInputs = (id: number) => {
    setTimeRangeInputs((prev) => prev.filter((item) => item.id !== id));
  };

  const handleUpdateSlot = (startTime: string, endTime: string) => {
    const slot = { day: day.getDay(), startTime, endTime };
    onSlotChange(slot);
  };

  console.log("Slots", initSlots);
  

  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-3 w-full sm:w-auto">
      <div className="flex flex-col gap-2 flex-1">
        {timeRangeInputs.length === 0 ? (
          <div className="text-gray-400 text-sm italic py-2">
            No slots added
          </div>
        ) : (
          timeRangeInputs.map((item) => (
            <div key={item.id} className="flex items-center gap-2">
              <TimeRangeInput
                onChange={(start, end) => handleUpdateSlot(start, end)}
              />
              <button
                type="button"
                onClick={() => handleRemoveTimeInputs(item.id)}
                className="p-1 hover:bg-gray-100 rounded-md transition-colors duration-200 flex-shrink-0"
                title="Remove slot"
              >
                <Trash2 className="w-4 h-4 text-gray-600 hover:text-red-600" />
              </button>
            </div>
          ))
        )}
      </div>

      <button
        type="button"
        disabled={timeRangeInputs.length >= 2}
        onClick={handleAddTimeInputs}
        className={`p-1 rounded-md transition-colors duration-200 flex-shrink-0 ${
          timeRangeInputs.length >= 2
            ? "text-gray-300 cursor-not-allowed"
            : "text-gray-600 hover:text-black hover:bg-gray-100"
        }`}
        title={
          timeRangeInputs.length >= 2 ? "Maximum 2 slots allowed" : "Add slot"
        }
      >
        <CirclePlus className="w-5 h-5" />
      </button>
    </div>
  );
};

export default Slots;
