import React, { useState, useRef, useEffect } from "react";
import "./CustomSelect.css";

const CustomSelect = ({ options = [], placeholder = "Seleccionar", onChange }) => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const selectRef = useRef(null);

  const handleSelect = (option) => {
    setSelected(option);
    onChange(option);
    setOpen(false);
  };

  useEffect(() => {
    const closeSelect = (e) => {
      if (selectRef.current && !selectRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", closeSelect);
    return () => document.removeEventListener("mousedown", closeSelect);
  }, []);

  return (
    <div className="custom-select" ref={selectRef}>
      <div
        className="custom-select-trigger"
        onClick={() => setOpen(!open)}
      >
        {selected ? selected.label : placeholder}
        <span className="arrow">⌵</span>
      </div>

      {open && (
        <ul className="custom-options">
          {options.map((opt, i) => (
            <li
              key={i}
              className={`custom-option ${
                selected?.value === opt.value ? "selected" : ""
              }`}
              onClick={() => handleSelect(opt)}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomSelect;
