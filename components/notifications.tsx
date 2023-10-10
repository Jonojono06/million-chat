'use client'

import { CONFIG } from "@/app/config"
import { Button } from "./ui/button"
import { BellRing } from "lucide-react"

const notificationsSupported = () =>
    'Notification' in window &&
    'serviceWorker' in navigator &&
    'PushManager' in window

export default function Notifications() {
    return <>
        <Button onClick={subscribe} className="bg-transparent border-0" variant="outline" size="icon">
            <BellRing className="group-hover:text-white transition text-emerald-500" size={25} />
        </Button>
    </>
}

export const unregisterServiceWorkers = async () => {
    const registrations = await navigator.serviceWorker.getRegistrations()
    await Promise.all(registrations.map((r) => r.unregister()))
}

const registerServiceWorker = async () => {
    return navigator.serviceWorker.register('/service.js')
}

const subscribe = async () => {
    await unregisterServiceWorkers()

    const swRegistration = await registerServiceWorker()
    await window?.Notification.requestPermission()

    try {
        const options = {
            applicationServerKey: CONFIG.PUBLIC_KEY,
            userVisibleOnly: true,
        }
        const subscription = await swRegistration.pushManager.subscribe(options)

        await saveSubscription(subscription)

        console.log({ subscription })
    } catch (err) {
        console.error('Error', err)
    }
}

const saveSubscription = async (subscription: PushSubscription) => {
    const ORIGIN = window.location.origin
    const BACKEND_URL = `${ORIGIN}/api/push`

    const response = await fetch(BACKEND_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(subscription),
    })
    return response.json()
}