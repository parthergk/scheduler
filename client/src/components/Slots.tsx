import { useEffect, useState } from "react";
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

const Slots: React.FC<Props> = ({ initSlots, day, onSlotChange }) => {
  const [slots, setSlots] = useState([]);

  useEffect(() => {
    if (initSlots && initSlots.length > 0) {
      setSlots(initSlots);
    }else{
      setSlots([]);
    }
  }, [initSlots]);

  const handleAddTimeInputs = () => {
    if (slots.length < 2) {
      const newSlot = { id: Date.now(), startTime: "00:00", endTime: "00:00" };
      setSlots((prev) => [...prev, newSlot]);
    }
  };


   const handleRemoveTimeInputs = (id: number) => {
    const updated = slots.filter((s) => s.id !== id);
    setSlots(updated);
  };

  const handleUpdateSlot = (startTime: string, endTime: string) => {
    const slot = { day: day.getDay(), startTime, endTime };
    onSlotChange(slot);
  };
  
  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-3 w-full sm:w-auto">
      <div className="flex flex-col gap-2 flex-1">
        {slots.length === 0 ? (
          <div className="text-gray-400 text-sm italic py-2">
            No slots added
          </div>
        ) : (
          slots?.map((item) => (            
            <div key={item.id} className="flex items-center gap-2">
              <TimeRangeInput
                onChange={(start, end) => handleUpdateSlot(start, end)}
                sTime={item.start_time}
                eTime={item.end_time}
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
        disabled={slots.length >= 2}
        onClick={handleAddTimeInputs}
        className={`p-1 rounded-md transition-colors duration-200 flex-shrink-0 ${
          slots.length >= 2
            ? "text-gray-300 cursor-not-allowed"
            : "text-gray-600 hover:text-black hover:bg-gray-100"
        }`}
        title={
          slots.length >= 2 ? "Maximum 2 slots allowed" : "Add slot"
        }
      >
        <CirclePlus className="w-5 h-5" />
      </button>
    </div>
  );
};

export default Slots;
