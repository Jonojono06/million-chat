import { useEffect } from 'react';

const useDisablePinchZoom = (): void => {
    useEffect(() => {
        const handleTouchStart = (event: TouchEvent) => {
            if (event.touches.length > 1) {
                event.preventDefault();
            }
        };

        const handleTouchMove = (event: any) => {
            if (event.scale !== 1) {
                event.preventDefault();
            }
        };

        document.addEventListener('touchstart', handleTouchStart, { passive: false });
        document.addEventListener('touchmove', handleTouchMove, { passive: false });

        // Cleanup listeners on component unmount
        return () => {
            document.removeEventListener('touchstart', handleTouchStart);
            document.removeEventListener('touchmove', handleTouchMove);
        };
    }, []);
};

export default useDisablePinchZoom;