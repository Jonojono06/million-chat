"use client";
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export default function ClientSideEffects() {
    const { theme } = useTheme();
    const [currentThemeColor, setCurrentThemeColor] = useState('#313338'); // initial value

    useEffect(() => {
        if (theme === 'dark') {
            setCurrentThemeColor('#313338'); // Dark mode color
        } else {
            setCurrentThemeColor('#fff'); // Light mode color
        }
    }, [theme]);

    // Dynamically set the meta tag for theme color
    useEffect(() => {
        const metaThemeColor = document.querySelector("meta[name=theme-color]");
        if (metaThemeColor) {
            metaThemeColor.setAttribute("content", currentThemeColor);
        }
    }, [currentThemeColor]);

    return null;
}
