import React, { forwardRef } from "react";
import Image from "next/image";

const DropDown = forwardRef(({ top, right, left, bottom, itemsArray, selectItem, currentSelectedItemID, color = "cyan-400", width}, ref) => {

  const style = {
    ...(top !== undefined ? { top } : {}),
    ...(right !== undefined ? { right } : {}),
    ...(left !== undefined ? { left } : {}),
    ...(bottom !== undefined ? { bottom } : {}),
    position: "absolute",
  };

  const dynamicClass = `font-bold hover:bg-${color}/20 hover:text-${color} transition-all duration-200 ease-in-out px-2 p-1 `
  const currentSelectedItemClass = `font-bold bg-${color}/20 text-${color}`

  return (
    <div
      ref={ref}
      style={style}
      className={`flex flex-col z-[1000] text-white border-1 border-white/50 bg-black rounded-lg ${width} h-fit whitespace-wrap pointer-events-auto transition-all duration-300 ease-in-out`}
      role="menu"
    >
      {itemsArray.map((item) => (
        <div key={item.id} className={`flex flex-row items-center gap-2 ${(item.id === currentSelectedItemID) ? (currentSelectedItemClass) : ("")} ${dynamicClass}`}>
          <Image src={item.icon} width={20} height={20} alt="icon" />
          <div
            type="div"
            onClick={(e) => {
              selectItem(item);
              e.stopPropagation();
            }}
            role="menuitem"
          >
            {item.itemName}
          </div>
        </div>
      ))}
    </div>
  );
}
);

DropDown.displayName = "DropDown";

export default DropDown;
