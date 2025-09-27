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

const Schedule: React.FC<Props & {
  onChange: () => void;
  showMessage: (msg: string, isError?: boolean) => void;
}> = ({ date, initSlots, onChange, showMessage }) => {
  const [slots, setSlots] = useState<SlotData[]>([]);

  useEffect(() => {
    if (initSlots) setSlots(initSlots);
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
      const res = await fetch(`https://scheduler-teal-eight.vercel.app/api/schedule`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...slot, date, status: "edited" }),
      });
      if (!res.ok) throw new Error("Failed to update slot");
      await res.json();
      showMessage("Slot updated successfully");
      onChange(); // 🔥 Refetch
    } catch (err: any) {
      showMessage(err.message || "Error updating slot", true);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`https://scheduler-teal-eight.vercel.app/api/schedule`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, date }),
      });
      if (!res.ok) throw new Error("Failed to delete slot");
      showMessage("Slot deleted successfully");
      onChange(); // 🔥 Refetch
    } catch (err: any) {
      showMessage(err.message || "Error deleting slot", true);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {slots.map((item) => (
        <div key={item.id} className="flex items-center gap-1 justify-center">
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
