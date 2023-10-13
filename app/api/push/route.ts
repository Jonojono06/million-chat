import { NextResponse, NextRequest } from 'next/server'
import {
    getSubscriptionsFromDb,
    saveSubscriptionToDb,
} from '@/app/utils/in-memory-db'
import webpush, { PushSubscription } from 'web-push'
import { CONFIG } from '@/app/config'

webpush.setVapidDetails(
    'mailto:test@example.com',
    CONFIG.PUBLIC_KEY,
    CONFIG.PRIVATE_KEY
)

export async function POST(request: NextRequest) {
    const subscription = (await request.json()) as PushSubscription | null

    if (!subscription) {
        console.error('No subscription was provided!')
        return
    }

    const updatedDb = await saveSubscriptionToDb(subscription)

    return NextResponse.json({ message: 'success', updatedDb })
}

export async function GET(_: NextRequest) {
    const subscriptions = await getSubscriptionsFromDb();

    const results = [];

    for (const s of subscriptions) {
        const payload = JSON.stringify({
            title: 'WebPush Notification!',
            body: 'Hello World',
        });

        try {
            const result = await webpush.sendNotification(s, payload);
            results.push({
                subscription: s,
                status: 'success',
                result,
            });
        } catch (error) {
            results.push({
                subscription: s,
                status: 'error',
                error,
            });
        }
    }

    return NextResponse.json({
        message: `Messages sent!`,
        results,
    });
}