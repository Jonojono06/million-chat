"use client"
import React from 'react';
import useDisablePinchZoom from '@/hooks/use-disable-zoom';

interface ClientOnlyProps {
    children: React.ReactNode;
}

const ClientOnly: React.FC<ClientOnlyProps> = ({ children }) => {
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