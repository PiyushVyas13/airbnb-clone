import prisma from "@/app/libs/prismadb";

export interface ListingParams {
    userId?: number;
    guestCount?: number;
    roomCount?: number;
    bathroomCount?: number;
    startDate?: string;
    endDate?: string;
    locationValue?: string;
    category?: string;
}

export default async function getListings (params: ListingParams) {
    try {
        const { userId, endDate, startDate, category, roomCount, bathroomCount, guestCount, locationValue } = params;
        const query: any = {}

        if(userId) {
            query.userId = userId;
        }

        if(category) {
            console.log("Category" + category)
            query.category = category;
        }

        if(roomCount) {
            query.roomCount = {
                gte: +roomCount
            }
        }

        if(guestCount) {
            query.guestCount = {
                gte: +guestCount
            }
        }

        if(bathroomCount) {
            query.bathroomCount = {
                gte: +bathroomCount
            }
        }

        if(locationValue) {
            query.locationValue = locationValue
        }

        if(startDate && endDate) {
            query.NOT = {
                reservations: {
                    some: {
                        OR: [
                            {
                                endDate: { gte: startDate },
                                startDate: { lte: startDate }
                            },
                            {
                                startDate: { lte: endDate },
                                endDate: { gte: endDate }
                            }
                        ]
                    }
                }
            }
        }

        console.log(query)

        return await prisma.listing.findMany({
            where: query,
            orderBy: {
                createdAt: 'desc'
            }
        });
    }catch (e: any) {
        throw new Error(e)
    }
}