"use client";

import React, {useCallback, useState} from 'react';
import {Listing, Reservation, User} from "@prisma/client";
import Container from "@/app/components/Container";
import Heading from "@/app/components/Heading";
import {useRouter} from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import ListingCard from "@/app/components/listings/ListingCard";

interface TripsClientProps {
    properties: Listing[];
    currentUser: User | null;
}

const PropertiesClient: React.FC<TripsClientProps> = ({ properties, currentUser }) => {
    const router = useRouter();
    const [deletingId, setDeletingId] = useState(0);

    const onCancel = useCallback((id: number) => {
        setDeletingId(id);
        axios.delete(`/api/listings/${id}`)
            .then(() => {
                toast.success("Property Deleted")
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
            <Heading title={"Properties"} subtitle={"Your properties on Airbnb"} />
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
                {
                    properties.map((property) => (
                        // @ts-ignore
                        <ListingCard key={property.id} data={property}  disabled={deletingId === property.id} currentUser={currentUser} onAction={onCancel} actionId={property.id} actionLabel={"Delete Property"}/>
                    ))
                }
            </div>
        </Container>
    );
};

export default PropertiesClient;