import React from 'react';
import getCurrentUser from "@/app/actions/getCurrentUser";
import EmptyState from "@/app/components/EmptyState";
import getReservations from "@/app/actions/getReservations";
import ReservationClient from "@/app/reservations/components/ReservationClient";

const ReservationPage = async () => {
    const currentUser = await getCurrentUser();
    if(!currentUser) {
        return <EmptyState title={"Unauthorized"} subtitle={"Please Login"} />
    }
    const reservations = await getReservations({authorId: currentUser.id})
    if(reservations.length === 0) {
        return <EmptyState title={"No reservations found"} subtitle={"Looks like you don't have any reservations on your listings"} />
    }
    return (
        <div>
            <ReservationClient reservations={reservations} currentUser={currentUser} />
        </div>
    );
};

export default ReservationPage;