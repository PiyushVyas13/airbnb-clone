import getCurrentUser from "@/app/actions/getCurrentUser";
import EmptyState from "@/app/components/EmptyState";
import getReservations from "@/app/actions/getReservations";
import TripsClient from "@/app/trips/components/TripsClient";

const TripPage = async () => {
    const currentUser = await getCurrentUser();

    if(!currentUser) {
        return <EmptyState title={"Unauthorized"} subtitle="Please Login"/>
    }

    const reservations = await getReservations({userId: currentUser.id})
    // console.log("Total Reservations are: " + reservations.length)

    if(reservations.length === 0) {
        return <EmptyState title={"No trips found"} subtitle={"Looks like you haven't reserved any trips"}/>
    }

    return (
        <TripsClient reservations={reservations} currentUser={currentUser}/>
    )
}

export default TripPage;