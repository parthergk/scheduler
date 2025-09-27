import { CircleCheck } from "lucide-react";
import { useState } from "react";

const SlotInput = ({
  length,
  day,
  onChange,
  showMessage,
}: {
  length: number;
  day: number;
  onChange: () => void;
  showMessage: (msg: string, isError?: boolean) => void;
}) => {
  const [startTime, setStartTime] = useState("00:00");
  const [endTime, setEndTime] = useState("00:00");

  function hanleStartTimeChange(e: React.ChangeEvent<HTMLInputElement>) {
    let input = e.target.value.replace(/[^\d]/g, "");
    input = input.substring(0, 4);
    if (input.length >= 3) {
      const hours = input.substring(0, 2);
      const minutes = input.substring(2, 4);
      input = `${hours}:${minutes}`;
    }
    setStartTime(input);
  }
  function hanleEndTimeChange(e: React.ChangeEvent<HTMLInputElement>) {
    let input = e.target.value.replace(/[^\d]/g, "");
    input = input.substring(0, 4);
    if (input.length >= 3) {
      const hours = input.substring(0, 2);
      const minutes = input.substring(2, 4);
      input = `${hours}:${minutes}`;
    }
    setEndTime(input);
  }

  async function saveData() {
    try {
      const res = await fetch("https://scheduler-teal-eight.vercel.app/api/schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ day, startTime, endTime }),
      });

      if (!res.ok) throw new Error("Failed to add slot");
      await res.json();
      showMessage("Slot added successfully");
      onChange(); // 🔥 Refetch
    } catch (err: any) {
      showMessage(err.message || "Error saving slot", true);
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Allow backspace, delete, tab, escape, enter
    if (
      [8, 9, 27, 13, 46].indexOf(e.keyCode) !== -1 ||
      // Allow Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
      (e.keyCode === 65 && e.ctrlKey === true) ||
      (e.keyCode === 67 && e.ctrlKey === true) ||
      (e.keyCode === 86 && e.ctrlKey === true) ||
      (e.keyCode === 88 && e.ctrlKey === true)
    ) {
      return;
    }

    // Ensure that it is a number and stop the keypress
    if (
      (e.shiftKey || e.keyCode < 48 || e.keyCode > 57) &&
      (e.keyCode < 96 || e.keyCode > 105)
    ) {
      e.preventDefault();
    }
  };
  return (
    <div className=" flex gap-1">
      <input
        type="text"
        maxLength={5}
        value={startTime}
        onChange={hanleStartTimeChange}
        onKeyDown={handleKeyDown}
        placeholder="00:00"
        className={`w-20 py-0.5 text-sm border border-gray-300 rounded-sm bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all duration-200 text-center`}
      />
      <span>To</span>
      <input
        type="text"
        maxLength={5}
        value={endTime}
        onChange={hanleEndTimeChange}
        onKeyDown={handleKeyDown}
        placeholder="00:00"
        className={`w-20 py-0.5 text-sm border border-gray-300 rounded-sm bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all duration-200 text-center`}
      />
      <button
        type="button"
        disabled={length >= 2}
        onClick={saveData}
        className={`p-1 rounded-md transition-colors duration-200 flex-shrink-0 ${
          length >= 2
            ? "text-gray-300 cursor-not-allowed"
            : "text-gray-600 hover:text-black hover:bg-gray-100"
        }`}
        title={length >= 2 ? "Maximum 2 slots allowed" : "Add slot"}
      >
        <CircleCheck className=" w-5 h-5" />
      </button>
    </div>
  );
};

export default SlotInput;
