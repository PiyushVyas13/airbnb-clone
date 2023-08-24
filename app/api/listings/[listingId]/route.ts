import {NextResponse} from "next/server";
import prisma from "@/app/libs/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";
interface IParams {
    listingId: string;
}

export async function DELETE(Request: Request, { params }: { params: IParams }) {
    try {
        const listingId = parseInt(params.listingId);
        const currentUser = await getCurrentUser();

        if(!listingId || !currentUser) {
            return NextResponse.error()
        }

        const deletedListing = await prisma.listing.deleteMany({
            where: {
                id: listingId,
                userId: currentUser.id
            }
        })

        return NextResponse.json(deletedListing)
    }catch (e: any) {
        return NextResponse.error()
    }
}