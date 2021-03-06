import React, { HTMLAttributes } from "react"
import ReactDatePicker from "react-datepicker"
import { useColorMode } from "@chakra-ui/react"

const DatePicker = ({
  selectedDate,
  onChange,
  isClearable = false,
  showPopperArrow = false,
  ...props
}) => {
  const isLight = useColorMode().colorMode === "light" //you can check what theme you are using right now however you want
  return (
    <div className={isLight ? "light-theme" : "dark-theme"}>
      <ReactDatePicker
        selected={selectedDate}
        onChange={onChange}
        isClearable={isClearable}
        showPopperArrow={showPopperArrow}
        className="react-datapicker__input-text" //input is white by default and there is no already defined class for it so I created a new one
        {...props}
      />
    </div>
  )
}
export default DatePicker
