
import React from "react";
import logo from "../assets/logo.png";

const CodeEagleLogo = ({
  size = "md",
  showText = true,
  className = ""
}) => {

  const sizes = {
    sm: "h-8",
    md: "h-12",
    lg: "h-20"
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <img
        src={logo}
        alt="Company Logo"
        className={`${sizes[size] || sizes.md} w-auto object-contain`}
      />

      {showText && (
        <span className="font-bold text-lg">
          Code Eagle Info Solution Pvt ltd
        </span>
      )}
    </div>
  );
};

export default CodeEagleLogo;
