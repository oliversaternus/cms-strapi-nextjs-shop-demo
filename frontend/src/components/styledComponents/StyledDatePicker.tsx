import React, { useEffect, useRef, useState } from "react";
import StyledInput from './StyledInput';
import dynamic from 'next/dynamic';
const Flatpickr = dynamic(() => import('react-flatpickr'));

type DateformatFunction = (date?: string | number | Date | undefined, mask?: string | undefined, utc?: boolean | undefined, gmt?: boolean | undefined) => string;

interface StyledDatePickerProps {
    inputClass?: string;
    value: Date;
    onChange?: (date: Date) => void;
    className?: string;
    style?: React.CSSProperties;
}

const StyledDatePicker: React.FC<StyledDatePickerProps> = (props) => {
    const { className, style, inputClass, value, onChange } = props;
    const dateformatRef = useRef<DateformatFunction | null>(null);
    const [initialized, setInitialized] = useState(false);

    useEffect(() => {
        const initialize = async () => {
            // dynamically import flatpickr CSS
            import('flatpickr/dist/themes/airbnb.css');
            // dynamically import dateformat library
            await import('dateformat').then(df => {
                dateformatRef.current = df.default;
            })
            setInitialized(true);
        };
        initialize();
    }, []);

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
                dateFormat: 'm/d/Y',
                monthSelectorType: 'static'
            }}
            render={
                ({ defaultValue, value, ...props }, ref) => {
                    return <StyledInput
                        inputClass={inputClass}
                        style={style}
                        value={initialized ? dateformatRef.current?.(value as Date, 'mm/dd/yyyy') : ''}
                        defaultValue={defaultValue}
                        inputRef={ref}
                    />
                }
            }
        />
    );
};

export default StyledDatePicker;