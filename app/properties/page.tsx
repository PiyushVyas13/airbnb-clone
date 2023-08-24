import getCurrentUser from "@/app/actions/getCurrentUser";
import EmptyState from "@/app/components/EmptyState";
import getReservations from "@/app/actions/getReservations";
import PropertiesClient from "@/app/properties/components/PropertiesClient";
import getListings from "@/app/actions/getListings";

const PropertiesPage = async () => {
    const currentUser = await getCurrentUser();

    if(!currentUser) {
        return <EmptyState title={"Unauthorized"} subtitle="Please Login"/>
    }

    const properties = await getListings({userId: currentUser.id})
    // console.log("Total Reservations are: " + reservations.length)

    if(properties.length === 0) {
        return <EmptyState title={"No properties found"} subtitle={"Looks like you haven't added any properties"}/>
    }

    return (
        <PropertiesClient properties={properties} currentUser={currentUser}/>
    )
}

export default PropertiesPage;