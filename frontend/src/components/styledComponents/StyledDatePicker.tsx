import React from "react";
import "flatpickr/dist/themes/airbnb.css";
import Flatpickr from "react-flatpickr";
import StyledInput from './StyledInput';
import dateformat from 'dateformat';

interface StyledDatePickerProps {
    inputClass?: string;
    value: Date;
    onChange: (date: Date) => void;
    className?: string;
    style?: React.CSSProperties;
}

const StyledDatePicker: React.FC<StyledDatePickerProps> = (props) => {
    const { className, style, inputClass, value, onChange } = props;

    const handleDateChange = (dates: Date[]) => {
        onChange?.(dates[0]);
    };

    return (
        <Flatpickr
            className={className}
            value={value}
            onChange={handleDateChange}
            options={{
                enableTime: false,
                dateFormat: 'm/d/Y'
            }}
            render={
                ({ defaultValue, value, ...props }, ref) => {
                    return <StyledInput
                        inputClass={inputClass}
                        style={style}
                        value={dateformat(value as Date, 'mm/dd/yyyy')}
                        defaultValue={defaultValue}
                        inputRef={ref}
                    />
                }
            }
        />
    );
};

export default StyledDatePicker;