// import { PrismaClient } from '@prisma/client';
// import { NextResponse, NextRequest } from 'next/server';
// import webpush, { PushSubscription } from 'web-push';
// import { CONFIG } from '@/app/config';
// import { currentProfile } from '@/lib/current-profile';
// import { db } from "@/lib/db";

// const prisma = new PrismaClient();

// webpush.setVapidDetails(
//     'mailto:test@example.com',
//     CONFIG.PUBLIC_KEY,
//     CONFIG.PRIVATE_KEY
// );

// // export async function POST(request: NextRequest) {
// //     const { subscription, profileId } = await request.json();
// //     const profile = await currentProfile();
// //     if (!subscription || !profileId || !profile) {
// //         console.error('No subscription or profile ID was provided!');
// //         // return NextResponse.json({ message: 'error', detail: 'Invalid payload' }).status(400);
// //         return NextResponse.json('Invalid payload', { status: 400 });
// //     }

// //     try {
// //         // await prisma.subscription.create({
// //         //     data: {
// //         //         endpoint: subscription.endpoint,
// //         //         expirationTime: subscription.expirationTime,
// //         //         p256dh: subscription.keys.p256dh,
// //         //         auth: subscription.keys.auth,
// //         //         profileId: profile.id,
// //         //     }
// //         // });

// //         await db.subscription.create({
// //             data: {
// //                 endpoint: subscription.endpoint,
// //                 expirationTime: subscription.expirationTime,
// //                 p256dh: subscription.keys.p256dh,
// //                 auth: subscription.keys.auth,
// //                 profileId: profile.id,
// //             }
// //         });

       
// //         return NextResponse.json({ message: 'success' });
// //     } catch (error) {
// //         console.error('Error saving subscription to database:', error);
// //         // return NextResponse.json({ message: 'error', detail: 'Failed to save subscription' }).status(500);
// //         return NextResponse.json('Failed to save subscription', { status: 500 });
// //     }
// // }

// // export async function POST(request: NextRequest) {
// //     const { message } = await request.json();
// //     const profile = await currentProfile();
// //     try {
// //         const subscriptions = await prisma.subscription.findMany();

// //         subscriptions.forEach(async (sub) => {
// //             const pushSubscription: PushSubscription = {
// //                 endpoint: sub.endpoint,
// //                 // expirationTime: sub.expirationTime,
// //                 keys: {
// //                     p256dh: sub.p256dh,
// //                     auth: sub.auth
// //                 }
// //             };
// //             const payload = JSON.stringify({
// //                 title: `${profile?.name}`,
// //                 body: message,
// //             });
// //             await webpush.sendNotification(pushSubscription, payload);
// //         });

// //         return NextResponse.json({
// //             message: `${subscriptions.length} messages sent!`,
// //         });
// //     } catch (error) {
// //         console.error('Error sending notifications:', error);
// //         // return NextResponse.json({ message: 'error', detail: 'Failed to send notifications' }).status(500);
// //         return NextResponse.json('Failed to send notifications', { status: 500 });
// //     }
// // }

// export async function GET(request: NextRequest) {
//     const { name, message, recipientId } = await request.json();

//     try {
//         // Get subscriptions only for the recipient
//         const subscriptions = await prisma.subscription.findMany({
//             where: {
//                 profileId: recipientId
//             }
//         });

//         subscriptions.forEach(async (sub) => {
//             const pushSubscription: PushSubscription = {
//                 endpoint: sub.endpoint,
//                 keys: {
//                     p256dh: sub.p256dh,
//                     auth: sub.auth
//                 }
//             };
//             const payload = JSON.stringify({
//                 title: `${name}`,
//                 body: message,
//             });
//             await webpush.sendNotification(pushSubscription, payload);
//         });

//         return NextResponse.json({
//             message: `${subscriptions.length} messages sent!`,
//         });
//     } catch (error) {
//         console.error('Error sending notifications:', error);
//         return NextResponse.json('Failed to send notifications', { status: 500 });
//     }
// }

