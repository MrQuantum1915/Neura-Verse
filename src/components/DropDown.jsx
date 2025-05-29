import { forwardRef } from 'react';

const DropDown = forwardRef(({ itemsArray, selectItem }, ref) => {
  return (
    <div
      ref={ref}
      className="flex flex-col absolute left-1 -translate-x-1/2 top-10 z-50 text-white border-2 border-white/50 backdrop-blur-xs rounded-2xl w-auto min-w-fit max-w-max h-fit shadow-sm shadow-white whitespace-nowrap pointer-events-auto transition-all duration-300 ease-in-out"
    >
      {itemsArray.map((item) => (
        <div
          key={item.id}
          onClick={(e) => {
            selectItem(item);
            e.stopPropagation(); // prevents event from bubbling to the trigger because when we select item the event bubbles to the event handler on the button. Hence it togglles the Open state again, causing the dropdown to not close, as selecting item make Open = false, but the bubling causes the event handler of button to toglle it again causing Open = true.
          }}
          className="cursor-pointer text-white/75 hover:text-white/100 hover:bg-white/20 p-1 px-4 rounded transition-colors duration-150"
        >
          {item.itemName}
        </div>
      ))}
    </div>
  );
});

DropDown.displayName = 'DropDown';

export default DropDown;
