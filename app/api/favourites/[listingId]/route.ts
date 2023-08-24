import { NextResponse } from "next/server";
import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";

interface IParams {
    listingId: string;
}
export async function POST(request: Request, { params }: { params: IParams }) {
    const user = await getCurrentUser();

    if(!user) {
        return NextResponse.error();
    }

    const listingId = parseInt(params.listingId)

    if(!listingId || typeof listingId !== 'number') {
        throw new Error('Invalid Id')
    }

    let favouriteIds = [...(user.favouriteIds || [])]
    favouriteIds.push(listingId);

    const updatedUser = await prisma.user.update({
        where: {
            id: user.id
        },
        data: {
            favouriteIds: favouriteIds
        }
    })

    return NextResponse.json(updatedUser);
}

export async function DELETE(request: Request, {params}: {params:IParams}) {
    const currentUser = await getCurrentUser();

    if(!currentUser) {
        return NextResponse.error();
    }

    const listingId = parseInt(params.listingId!) || undefined;

    if(!listingId || typeof listingId !== 'number') {
        throw new Error('Invalid ID')
    }

    let favouriteIds = [...(currentUser.favouriteIds || [])]

    favouriteIds = favouriteIds.filter((id) => id !== listingId);

    const user = await prisma.user.update({
        where: {
            id: currentUser.id
        },
        data: {
            favouriteIds: favouriteIds
        }
    })

    return NextResponse.json(user);
}