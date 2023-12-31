"use client";

import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {Listing, Reservation, User} from "@prisma/client";
import {categories} from "@/app/components/navbar/Categories";
import Container from "@/app/components/Container";
import ListingHead from "@/app/components/listings/ListingHead";
import ListingInfo from "@/app/components/listings/ListingInfo";
import useLoginModal from "@/app/hooks/useLoginModal";
import {useRouter} from "next/navigation";
import {differenceInCalendarDays, differenceInDays, eachDayOfInterval} from "date-fns";
import axios from "axios";
import toast from "react-hot-toast";
import {date} from "zod";
import ListingReservation from "@/app/components/listings/ListingReservation";
import {Range} from "react-date-range";


const initalDateRange = {
    startDate: new Date(),
    endDate: new Date(),
    key: 'selection'
}
interface ListingClientProps {
    listing: Listing & {user: User};
    currentUser?: User | null;
    reservations?: Reservation[];
}

const ListingClient: React.FC<ListingClientProps> = ({ listing, currentUser, reservations=[] }) => {
    const loginModal = useLoginModal();
    const router = useRouter();
    const disabledDates = useMemo(() => {
        let dates: Date[] = [];

        reservations.forEach((reservation) => {
            const range  = eachDayOfInterval({
                start: new Date(reservation.startDate),
                end: new Date(reservation.endDate)
            })
            dates = [...dates, ...range]
        })

        return dates;
    }, [reservations])

    const category = useMemo(() => {
        return categories.find((item) => item.label === listing.category);
    }, [listing.category])

    const [isLoading, setIsLoading] = useState(false);
    const [totalPrice, setTotalPrice] = useState(listing.price);
    const [dateRange, setDateRange] = useState<Range>(initalDateRange)

    const onCreateReservation = useCallback(() => {
        if(!currentUser) {
            return loginModal.onOpen()
        }

        setIsLoading(true);
        axios.post('/api/reservations', {
            totalPrice,
            startDate: dateRange.startDate,
            endDate: dateRange.endDate,
            listingId: listing?.id,
        })
            .then(() => {
                toast.success("Listing Reserved")
                setDateRange(initalDateRange)
                router.push('/trips')
            })
            .catch(() => {
                toast.error("Something went wrong")
            })
            .finally(() => setIsLoading(false))
    }, [dateRange, currentUser, totalPrice, loginModal, router, listing?.id])

    useEffect(() => {
        if(dateRange.startDate && dateRange.endDate) {
            const dateCount = differenceInCalendarDays(dateRange.endDate, dateRange.startDate)

            if(dateCount && listing.price) {
                setTotalPrice(dateCount * listing.price)
            } else {
                setTotalPrice(listing.price)
            }
        }
    }, [dateRange, listing.price]);

    return (
        <Container>
            <div className="max-w-screen-lg mx-auto">
                <div className="flex flex-col gap-6">
                    <ListingHead title={listing.title} imageSrc={listing.imageSrc} locationValue={listing.locationValue} id={listing.id} currentUser={currentUser}/>
                    <div className="grid grid-cols-1 md:grid-cols-7 md:gap-10 mt-6">
                        <ListingInfo user={listing.user} category={category} description={listing.description} roomCount={listing.roomCount} guestCount={listing.guestCount} bathroomCount={listing.bathroomCount} locationValue={listing.locationValue} />
                        <div className="order-first mb-10 md:order-last md:col-span-3">
                            <ListingReservation price={listing.price} totalPrice={totalPrice} onChangeDate={(value) => setDateRange(value)} dateRange={dateRange} onSubmit={onCreateReservation} disabled={isLoading} disabledDates={disabledDates}/>
                        </div>
                    </div>
                </div>
            </div>
        </Container>
    );
};

export default ListingClient;