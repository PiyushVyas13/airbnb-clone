"use client";

import React, {useCallback, useMemo, useState} from 'react';
import Modal from "@/app/components/modals/Modal";
import useFilterModal from "@/app/hooks/useFilterModal";
import {useRouter, useSearchParams} from "next/navigation";
import {Range} from "react-date-range";
import dynamic from "next/dynamic";
import CountrySelect, {CountrySelectValue} from "@/app/components/inputs/CountrySelect";
import qs from "query-string";
import {formatISO} from "date-fns";
import Heading from "@/app/components/Heading";
import Calendar from "@/app/components/inputs/Calendar";
import Counter from "@/app/components/inputs/Counter";

enum STEPS {
    LOCATION = 0,
    DATE = 1,
    INFO = 2
}

const FilterModal = () => {
    const router = useRouter();
    const params = useSearchParams();
    const filterModal = useFilterModal();
    const [step, setStep] = useState(STEPS.LOCATION)
    const [guestCount, setGuestCount] = useState(1)
    const [roomCount, setRoomCount] = useState(1)
    const [bathroomCount, setBathroomCount] = useState(1)
    const [dateRange, setDateRange] = useState<Range>({
        startDate: new Date(),
        endDate: new Date(),
        key: 'selection'
    })
    const [location, setLocation] = useState<CountrySelectValue>()

    const Map = useMemo(() => dynamic(() => import('../Map'), {
        ssr: false
    }), [location]);

    const onBack = useCallback(() => {
        setStep((value) => value-1)
    }, []);

    const onNext = useCallback(() => {
        setStep((value) => value+1)
    }, []);

    const onSubmit = useCallback(async () => {
        if(step !== STEPS.INFO) {
            return onNext();
        }
        let currentQuery = {};

        if(params) {
            currentQuery = qs.parse(params.toString())
        }

        const updatedQuery: any ={
            ...currentQuery,
            locationValue: location?.value,
            guestCount,
            roomCount,
            bathroomCount,
        }

        if(dateRange.startDate) {
            updatedQuery.startDate = formatISO(dateRange.startDate);
        }
        if(dateRange.endDate) {
            updatedQuery.endDate = formatISO(dateRange.endDate);
        }

        const url = qs.stringifyUrl({
            url: '/',
            query: updatedQuery
        }, {skipNull: true})

        setStep(STEPS.LOCATION)
        filterModal.onClose()
        router.push(url);

    }, [filterModal, step, location, router, guestCount, roomCount, bathroomCount, dateRange, onNext, params]);

    const actionLabel = useMemo(() => {
        if(step === STEPS.INFO) {
            return 'Search'
        }

        return 'Next'
    }, [step]);

    const secondaryActionLabel = useMemo(() => {
        if(step === STEPS.LOCATION) {
            return undefined;
        }
        return 'Back'
    }, [step]);

    let bodyContent = (
        <div className="flex flex-col gap-8">
            <Heading title={"Where do you want to go?"} subtitle={"Select the best place!"} />
            <CountrySelect onChange={(value) => setLocation(value as CountrySelectValue) } value={location} />
            <hr/>
            <Map center={location?.latlng}/>
        </div>
    )

    if(step === STEPS.DATE) {
        bodyContent = (
            <div className="flex flex-col gap-8">
                <Heading title={"When do you want to go?"} subtitle={"Select a date range"} />
                <Calendar value={dateRange} onChange={(value) => setDateRange(value.selection)} />
            </div>
        )
    }

    if(step === STEPS.INFO) {
        bodyContent = (
            <div className="flex flex-col gap-8">
                <Heading title={"What are your requirements?"} subtitle={"Select as per your choice"} />
                <Counter title={"Guests"} subtitle={"How many guests are coming?"} value={guestCount} onChange={(value) => setGuestCount(value)}   />
                <Counter title={"Rooms"} subtitle={"How many rooms do you need?"} value={roomCount} onChange={(value) => setRoomCount(value)}   />
                <Counter title={"Bathrooms"} subtitle={"How many bathrooms do you need?"} value={bathroomCount} onChange={(value) => setBathroomCount(value)}   />
            </div>
        )
    }


    return (
        <Modal title={"Filter"} isOpen={filterModal.isOpen} actionLabel={actionLabel} onSubmit={onSubmit} onClose={filterModal.onClose} body={bodyContent} secondaryAction={onBack} secondaryLabel={secondaryActionLabel}/>
    );
};

export default FilterModal;