import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/app/libs/prismadb";

export async function getSession() {
    return await getServerSession(authOptions);
}

export default async function getCurrentUser() {
    try {
        const session = await getSession();
        console.log("HELLO")
        if(!session?.user?.email) {
            console.log("GELLO")
            return null;
        }

        const currentUser = await prisma.user.findUnique({
            where: {
                email: session.user.email as string
            }
        })

        if(!currentUser) {
            console.log("MEELLO")
            return null;
        }

        return currentUser


    }catch (e: any) {
        return null;
    }
}