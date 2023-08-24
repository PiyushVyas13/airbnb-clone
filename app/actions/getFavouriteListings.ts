import prisma from "@/app/libs/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";

export default async function getFavouriteListings() {
    try {
        const currentUser = await getCurrentUser();

        if(!currentUser) {
            return [];
        }

        const favouriteListings = await prisma.listing.findMany({
            where: {
                id: {
                    in: [...(currentUser.favouriteIds) || []]
                }

            }
        })

        return favouriteListings;

    }catch (e) {
        throw new Error()
    }
}