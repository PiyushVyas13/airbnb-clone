import {NextResponse} from "next/server";
import prisma from "@/app/libs/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";
interface IParams {
    reservationId: string;
}

export async function DELETE(Request: Request, { params }: { params: IParams }) {
    try {
       const reservationId = parseInt(params.reservationId);
       // const {reservationId} = params;
        const currentUser = await getCurrentUser();

       if(!reservationId || !currentUser) {
           return NextResponse.error()
       }

       const deletedReservation = await prisma.reservation.deleteMany({
           where: {
               id: reservationId,
               OR: [
                   {userId: currentUser.id},
                   {listing: { userId: currentUser.id }}
               ]
           }
       })

        return NextResponse.json(deletedReservation)

    }catch (e: any) {
        return NextResponse.error()
    }
}