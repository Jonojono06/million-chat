"use client";
import type { Metadata } from 'next'
import { useTheme } from 'next-themes';
import { useEffect } from 'react';

export const metadata: Metadata = {
    themeColor: '#313338'
};

export default function ClientSideEffects() {
    const { theme } = useTheme();

    useEffect(() => {
        if (theme === 'dark') {
            metadata.themeColor = '#313338'; // Dark mode color
        } else {
            metadata.themeColor = '#fff'; // Light mode color
        }
    }, [theme]);

    return null;
}
