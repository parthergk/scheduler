import { useState } from "react";

interface Props {
  value: string;
  onChange: (value: string) => void;
}
const TimeInput: React.FC<Props> = ({ value, onChange }) => {
  const [focused, setFocused] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let input = e.target.value.replace(/[^\d]/g, "");
    input = input.substring(0, 4);

    if (input.length >= 3) {
      const minutes = input.substring(0, 2);
      const seconds = input.substring(2, 4);
      input = `${minutes}:${seconds}`;
    } else if (input.length >= 1) {
      input = input.substring(0, 2);
    }

    onChange(input);
  };

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
    <input
      type="text"
      value={value}
      onChange={handleInputChange}
      onKeyDown={handleKeyDown}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      placeholder="00:00"
      className={`w-16 px-2 py-1 text-sm border border-gray-300 rounded-sm bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all duration-200 ${
        focused ? "shadow-sm" : ""
      }`}
      maxLength={5}
    />
  );
};

export default TimeInput;
