import { NextResponse, NextRequest } from 'next/server';
import webpush, { PushSubscription } from 'web-push';
import { CONFIG } from '@/app/config';
import { currentProfile } from '@/lib/current-profile';
import { db } from "@/lib/db";


webpush.setVapidDetails(
    'mailto:test@example.com',
    CONFIG.PUBLIC_KEY,
    CONFIG.PRIVATE_KEY
);



export async function POST(request: NextRequest) {
    const { message, recipientId } = await request.json();
    const profile = await currentProfile();

    try {
        // Get subscriptions only for the recipient
        const subscriptions = await db.subscription.findMany({
            where: {
                profileId: recipientId
            }
        });

        subscriptions.forEach(async (sub) => {
            const pushSubscription: PushSubscription = {
                endpoint: sub.endpoint,
                keys: {
                    p256dh: sub.p256dh,
                    auth: sub.auth
                }
            };
            const payload = JSON.stringify({
                title: `${profile?.name}`,
                body: message,
            });
            await webpush.sendNotification(pushSubscription, payload);
        });

        return NextResponse.json({
            message: `${subscriptions.length} messages sent!`,
        });
    } catch (error) {
        console.error('Error sending notifications:', error);
        return NextResponse.json('Failed to send notifications', { status: 500 });
    }
}


