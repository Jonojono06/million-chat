import { NextResponse } from "next/server";
import { MemberRole } from "@prisma/client";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

export async function PATCH(req: Request) {
    try {
        const { name, imageUrl } = await req.json();

        let updatedImageUrl = imageUrl;

        if (!updatedImageUrl) {
            const avatarIcon = await db.avatarIcon.findFirst({
                where: {
                    name: "AvatarLogo", 
                },
            });

            if (avatarIcon) {
                updatedImageUrl = avatarIcon.imageUrl; 
            }
        }

        const profile = await currentProfile();

        if (!profile) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const firstServer = await db.server.findFirst({
            orderBy: {
                createdAt: "asc",
            },
        });

        if (!firstServer) {
            return new NextResponse("No server found", { status: 404 });
        }

        const serverIdToJoin = firstServer.id;

        const isMember = await db.member.findFirst({
            where: {
                profileId: profile.id,
                serverId: serverIdToJoin,
            },
        });

        if (!isMember) {
            await db.member.create({
                data: {
                    role: MemberRole.GUEST,
                    profile: { connect: { id: profile.id } },
                    server: { connect: { id: serverIdToJoin } },
                },
            });
        }

        const profileUpdate = await db.profile.update({
            where: { id: profile.id },
            data: {
                name,
                imageUrl: updatedImageUrl,
            },
        });

        return NextResponse.json(profileUpdate);
    } catch (error) {
        console.log("[NICKNAME_PROFILE_PATCH]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
