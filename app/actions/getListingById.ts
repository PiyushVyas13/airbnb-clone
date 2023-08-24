import prisma from "@/app/libs/prismadb";

interface IParams {
    listingId?: number;
}

export default async function getListingById(params: IParams) {
    try{
        if(!params.listingId) {
            return null;
        }
        const {listingId} = params

        const listing = await prisma.listing.findUnique({
            where: {
                id: listingId,
            },
            include: {
                user: true
            }
        })

        if(!listing) {
            return null;
        }

        return listing;
    }catch (error) {
        console.log(error)
    }
}