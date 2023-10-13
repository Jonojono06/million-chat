// import { PrismaClient } from '@prisma/client';
// const prisma = new PrismaClient();

// async function saveSubscription(profileId: string, subscription: any) {
//     return await prisma.subscription.create({
//         data: {
//             endpoint: subscription.endpoint,
//             expirationTime: subscription.expirationTime,
//             p256dh: subscription.keys.p256dh,
//             auth: subscription.keys.auth,
//             profileId: profileId
//         }
//     });
// }

// const exampleProfileId = 'some-uuid'; 
// const exampleSubscription = {
//     endpoint: "some-endpoint-url",
//     expirationTime: null,
//     keys: {
//         p256dh: "some-p256dh-key",
//         auth: "some-auth-key"
//     }
// };

// saveSubscription(exampleProfileId, exampleSubscription)
//     .then(sub => console.log('Subscription saved:', sub))
//     .catch(err => console.error('Error saving subscription:', err));

// import { PushSubscription } from 'web-push'

// type DummyDb = {
//     subscriptions: PushSubscription[]
// }

// export const dummyDb: DummyDb = { subscriptions: [] }

// // fake Promise to simulate async call
// export const saveSubscriptionToDb = async (
//     subscription: PushSubscription
// ): Promise<DummyDb> => {
//     dummyDb.subscriptions.push(subscription)
//     return Promise.resolve(dummyDb)
// }

// export const getSubscriptionsFromDb = () => {
//     return Promise.resolve(dummyDb.subscriptions)
// }