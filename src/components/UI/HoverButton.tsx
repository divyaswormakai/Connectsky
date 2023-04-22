import React from "react";

// types import
import { Props } from "../@types/UI/HoverButton";

const HoverButton = ({ checkOne, checkTwo, icon, text, action }: Props) => {
  // it changes the color to white if it is active
  return (
    <button
      onClick={action}
      className={` px-3 py-2 absolute w-full flex items-center gap-4 rounded-md transition-all duration-500 origin-center text-xl   ${
        checkOne === checkTwo ? "bg-white " : "hover:bg-slate-100"
      }`}
    >
      {icon}
      {text}
    </button>
  );
};

export default HoverButton;