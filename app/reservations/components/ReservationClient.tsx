"use client"

import React, {useCallback, useState} from 'react';
import {Reservation, User} from "@prisma/client";
import Container from "@/app/components/Container";
import Heading from "@/app/components/Heading";
import ListingCard from "@/app/components/listings/ListingCard";
import {useRouter} from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";

interface ReservationClientProps {
    reservations: Reservation[];
    currentUser: User | null;
}

const ReservationClient: React.FC<ReservationClientProps> = ({ reservations, currentUser }) => {
    const router = useRouter();
    const [deletingId, setDeletingId] = useState(0);

    const onCancel = useCallback((id: number) => {
        setDeletingId(id);
        axios.delete(`/api/reservations/${id}`)
            .then(() => {
                toast.success("Reservation Deleted")
                router.refresh()
            })
            .catch((error) => {
                toast.error(error?.response?.data?.error)
            })
            .finally(() => setDeletingId(0))
    }, [router]);

    return (
       <Container>
           <Heading title={"Reservations"} subtitle={"Bookings on your properties"} />
           <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
               {
                   reservations.map((reservation) => (
                       // @ts-ignore
                       <ListingCard data={reservation.listing} currentUser={currentUser} reservation={reservation} key={reservation.id} onAction={onCancel} actionId={reservation.id} actionLabel={"Cancel guest Reservation"}/>
                   ))
               }
           </div>

       </Container>
    );
};

export default ReservationClient;