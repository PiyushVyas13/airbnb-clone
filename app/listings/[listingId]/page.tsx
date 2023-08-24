import React from 'react';
import getListingById from "@/app/actions/getListingById";
import EmptyState from "@/app/components/EmptyState";
import getCurrentUser from "@/app/actions/getCurrentUser";
import ListingClient from "@/app/listings/[listingId]/components/ListingClient";
import getReservations from "@/app/actions/getReservations";

interface IParams {
    listingId: string;
}

const ListingPage = async ({params} : {params: IParams}) => {
    const listing = await getListingById({listingId: parseInt(params.listingId)})
    const reservations = await getReservations({listingId: parseInt(params.listingId)});
    const currentUser = await getCurrentUser();
    if(!listing) {
        return <EmptyState />
    }

    return (
        <div>
           <ListingClient listing={listing} currentUser={currentUser} reservations={reservations}/>
        </div>
    );
};

export default ListingPage;