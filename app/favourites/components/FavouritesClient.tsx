import React from 'react';
import Heading from "@/app/components/Heading";
import Container from "@/app/components/Container";
import {Listing, User} from "@prisma/client";
import ListingCard from "@/app/components/listings/ListingCard";

interface FavouriteClientProps {
    favourites: Listing[];
    currentUser: User | null;
}

const FavouritesClient: React.FC<FavouriteClientProps> = ({favourites, currentUser}) => {
    return (
        <Container>
            <Heading title={"Your favourite listings"} subtitle={"Here are your favourite pages"} />
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
                {
                    favourites.map((favourite) => (
                        <ListingCard data={favourite} currentUser={currentUser} key={favourite.id} />
                    ))
                }
            </div>
        </Container>
    );
};

export default FavouritesClient;