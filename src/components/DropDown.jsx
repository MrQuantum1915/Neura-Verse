
function DropDown({title, itemsArray, isOpen, children}) {
  return (
    <div >

        {/* the parent button of dropdown which is wraped in dropdown */}
        {children}
        
        {/* dropdown */}
        <div className="relative z-50 backdrop-blur-xs w-fit h-fit m-8 p-4 box-shadow-">
        
        </div>
    </div>
  )
}

export default DropDown
