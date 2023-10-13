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


// { "message": "Messages sent!", "results": [{ "subscription": { "endpoint": "https://web.push.apple.com/QKWyy_FFZezqMwvLFxnBrlRmcosbC6MxVLNG75rjRaehn8WzOLQ8GzCZCMOaYHzd2KF8D0MneFNY0qNv2iSj8pfsdRMwtzX3iy1N-Sdk2Nr9MPJ4IKRhg37kyhMMJ7zmIQlXfjDI6MVa-RJJh2fz8rRtRFCrTk2Rv248p92qdj0", "keys": { "p256dh": "BD_rd3JGKyJxgkMofyLMf10UWtmHWg7nz1f9n0nGHFlu3CQ35wwuCnma7si6Ga75faBb5XBHRdhsoJijjf0jbT0", "auth": "ifNoJNUWftNs-aP4KHvmpg" } }, "status": "success", "result": { "statusCode": 201, "body": "", "headers": { "content-type": "text/plain; charset=UTF-8", "content-length": "0", "apns-id": "37F817BD-F626-3A18-04A4-D52F0FF6ECAA" } } }] }
// { "message": "Messages sent!", "results": [{ "subscription": { "endpoint": "https://fcm.googleapis.com/fcm/send/d93C2mawyRQ:APA91bGq39yz2E01xK1eniDj1-VxNDbmWGaYr2yqRPXXNpbhQJJFLd3BpZJ3Cwz9xvnQtYEfjZ49O3dRZEpIGOtMmfcLn_rKjt4ehHMYSY8DCQfAheAWP-yt50jnCZnhLOIVnI8QtTVY", "expirationTime": null, "keys": { "p256dh": "BGZ8DaI_-f5rS74ZzQNTZuAkNIJ075P07YRMJ8dbUxjYZpQv4adQX97rLd7QPLxJSteF7I5uiDznoyWjj-I06xk", "auth": "TLRa1CnQpAaSWe_RyOhvZA" } }, "status": "success", "result": { "statusCode": 201, "body": "", "headers": { "location": "https://fcm.googleapis.com/0:1697158213918612%e609af1cf9fd7ecd", "x-content-type-options": "nosniff", "x-frame-options": "SAMEORIGIN", "x-xss-protection": "0", "date": "Fri, 13 Oct 2023 00:50:13 GMT", "content-length": "0", "content-type": "text/html; charset=UTF-8", "alt-svc": "h3=\":443\"; ma=2592000,h3-29=\":443\"; ma=2592000", "connection": "close" } } }] }