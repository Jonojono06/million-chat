"use client"
import React from 'react';
import useDisablePinchZoom from '@/hooks/use-disable-zoom';

interface ClientOnlyProps {
    children: React.ReactNode;
}

const ClientOnly: React.FC<ClientOnlyProps> = ({ children }) => {
    useDisablePinchZoom();  // Add this line

    if (typeof window === "undefined") {
        return null;
    }

    return <>{children}</>;
};

export default ClientOnly;