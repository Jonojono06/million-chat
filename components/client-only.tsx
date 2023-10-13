"use client"
import React, { useEffect } from 'react';
import useDisablePinchZoom from '@/hooks/use-disable-zoom';

interface ClientOnlyProps {
    children: React.ReactNode;
}

const ClientOnly: React.FC<ClientOnlyProps> = ({ children }) => {
    useEffect(() => {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', function () {
                navigator.serviceWorker.register('/sw.js').then(function (registration) {
                    console.log('ServiceWorker registration successful with scope: ', registration.scope);
                }, function (err) {
                    console.log('ServiceWorker registration failed: ', err);
                });
            });
        }
    }, []);
    useDisablePinchZoom();  

    const [isClient, setIsClient] = React.useState(false);
    React.useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) {
        return <div style={{ display: 'none' }}>{children}</div>;
    }

    // if (typeof window === "undefined") {
    //     return null;
    // }

    return <>{children}</>;
};

export default ClientOnly;