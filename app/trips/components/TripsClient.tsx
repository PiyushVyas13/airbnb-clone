"use client";

import React, {useCallback, useState} from 'react';
import {Reservation, User} from "@prisma/client";
import Container from "@/app/components/Container";
import Heading from "@/app/components/Heading";
import {useRouter} from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import ListingCard from "@/app/components/listings/ListingCard";

interface TripsClientProps {
    reservations: Reservation[];
    currentUser: User | null;
}

const TripsClient: React.FC<TripsClientProps> = ({ reservations, currentUser }) => {
    const router = useRouter();
    const [deletingId, setDeletingId] = useState(0);

    const onCancel = useCallback((id: number) => {
        setDeletingId(id);
        axios.delete(`/api/reservations/${id}`)
            .then(() => {
                toast.success("Reservation Canceled")
                router.refresh();

            })
            .catch((error) => {
                toast.error(error?.response?.data?.error)
            })
            .finally(() => setDeletingId(0))
    }, [router]);


    // @ts-ignore
    return (
        <Container>
            <Heading title={"Trips"} subtitle={"Where you've been and where you're going"} />
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
                {
                    reservations.map((reservation) => (
                        // @ts-ignore
                        <ListingCard reservation={reservation} key={reservation.id} data={reservation.listing} actionId={reservation.id} onAction={onCancel} disabled={deletingId === reservation.id} actionLabel="Cancel Reservation" currentUser={currentUser}/>
                    ))
                }
            </div>
        </Container>
    );
};

export default TripsClient;