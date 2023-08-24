"use client";

import { Range } from 'react-date-range';
import {date} from "zod";
import Calendar from "@/app/components/inputs/Calendar";
import Button from "@/app/components/Button";

interface ListingReservationProps {
    price: number;
    totalPrice: number;
    onChangeDate: (value: Range) => void;
    dateRange: Range;
    onSubmit: () => void;
    disabled?: boolean;
    disabledDates: Date[]
}
const ListingReservation: React.FC<ListingReservationProps> = ({price, totalPrice, disabledDates, disabled, onChangeDate, dateRange, onSubmit}) => {
    return (
        <div className="bg-white rounded-xl border-[1px] border-neutral-200 overflow-hidden">
            <div className="flex items-center gap-1 p-4">
                <div className="text-2xl font-semibold">
                    &#8377; {price}
                </div>
                <div className="font-light text-neutral-600">
                    per night
                </div>
            </div>
            <hr/>
            <Calendar value={dateRange} disabledDates={disabledDates} onChange={(value) => onChangeDate(value.selection)} />
            <hr/>
            <div className="p-4">
                <Button label="Reserve" onClick={onSubmit} disabled={disabled} />
            </div>
            <div className="p-4 flex items-center justify-between text-lg">
                <div>
                    Total
                </div>
                <div>
                    &#8377; {totalPrice}
                </div>
            </div>
        </div>
    );
};

export default ListingReservation;