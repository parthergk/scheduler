import { CircleCheck, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

interface SlotData {
  id: number;
  day_of_week: number;
  start_time: string;
  end_time: string;
  active?: boolean;
  created_at?: Date;
  updated_at?: Date;
}

interface Props {
  initSlots?: SlotData[];
  date: string;
}

const Schedule: React.FC<Props> = ({ date, initSlots }) => {
  const [slots, setSlots] = useState<SlotData[]>([]);

  useEffect(() => {
    if (initSlots) {
      setSlots(initSlots);
    }
  }, [initSlots]);

  const handleChange = (
    id: number,
    key: "start_time" | "end_time",
    value: string
  ) => {
    setSlots((prev) =>
      prev.map((slot) => (slot.id === id ? { ...slot, [key]: value } : slot))
    );
  };

  const handleUpdate = async (slot: SlotData) => {
    try {
      const res = await fetch(`http://localhost:8080/api/schedule`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: slot.id,
          date,
          start_time: slot.start_time,
          end_time: slot.end_time,
          status: "edited",
        }),
      });
      if (!res.ok) throw new Error("Failed to update");
      const data = await res.json();
      console.log("✅ Updated successfully:", data);
    } catch (err) {
      console.error("❌ Error updating slot:", err);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:8080/api/schedule`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, date }),
      });
      if (!res.ok) throw new Error("Failed to delete");
      setSlots((prev) => prev.filter((slot) => slot.id !== id));
      console.log("🗑️ Deleted successfully");
    } catch (err) {
      console.error("❌ Error deleting slot:", err);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {slots.map((item) => (
        <div
          key={item.id}
          className="flex items-center gap-1 justify-center"
        >
          {/* Time Inputs */}
          <div className="border border-gray-300 rounded-sm">
            <input
              type="text"
              placeholder="00:00"
              value={item.start_time.slice(0, 5)}
              onChange={(e) =>
                handleChange(item.id, "start_time", e.target.value)
              }
              className="w-12 py-0.5 text-sm text-center outline-none"
            />
            <span> to </span>
            <input
              type="text"
              placeholder="00:00"
              value={item.end_time.slice(0, 5)}
              onChange={(e) =>
                handleChange(item.id, "end_time", e.target.value)
              }
              className="w-12 py-0.5 text-sm text-center outline-none"
            />
          </div>

          {/* Update Button */}
          <button
            onClick={() => handleUpdate(item)}
            className="p-1 text-gray-600 hover:text-black hover:bg-gray-100 rounded-md transition-colors duration-200"
            title="Update slot"
          >
            <CircleCheck className="h-5 w-5" />
          </button>

          {/* Delete Button */}
          <button
            onClick={() => handleDelete(item.id)}
            className="p-1 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-md transition-colors duration-200"
            title="Delete slot"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default Schedule;
