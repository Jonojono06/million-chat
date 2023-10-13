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
    const { subscription, profileId } = await request.json();
    const profile = await currentProfile();
    if (!subscription || !profileId || !profile) {
        console.error('No subscription or profile ID was provided!');
        return NextResponse.json('Invalid payload', { status: 400 });
    }

    try {
        await db.subscription.create({
            data: {
                endpoint: subscription.endpoint,
                p256dh: subscription.keys.p256dh,
                auth: subscription.keys.auth,
                profileId: profile.id,
            }
        });

       
        return NextResponse.json({ message: 'success' });
    } catch (error) {
        console.error('Error saving subscription to database:', subscription);
        // return NextResponse.json({ message: 'error', detail: 'Failed to save subscription' }).status(500);
        return NextResponse.json('Failed to save subscription', { status: 500 });
    }
}



