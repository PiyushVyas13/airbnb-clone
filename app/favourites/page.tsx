import React from 'react';
import getFavouriteListings from "@/app/actions/getFavouriteListings";
import Container from "@/app/components/Container";
import Heading from "@/app/components/Heading";
import EmptyState from "@/app/components/EmptyState";
import getCurrentUser from "@/app/actions/getCurrentUser";
import FavouritesClient from "@/app/favourites/components/FavouritesClient";

const FavouritesPage = async () => {
    const favouriteListings = await getFavouriteListings();
    const currentUser = await getCurrentUser();
    if(favouriteListings.length === 0) {
        return <EmptyState title={"No favourites found"} subtitle={"Looks like you don't hav any favourites"}/>
    }
    return (
        <FavouritesClient favourites={favouriteListings} currentUser={currentUser}/>
    );
};

export default FavouritesPage;