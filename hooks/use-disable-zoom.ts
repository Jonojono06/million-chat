import { useEffect } from 'react';

const useDisablePinchZoom = () => {
    useEffect(() => {
        const handleTouchMove = (event: any) => {
            if (event.scale !== 1) {
                event.preventDefault();
            }
        };

        document.addEventListener('touchmove', handleTouchMove, { passive: false });

        // Cleanup listener on component unmount
        return () => {
            document.removeEventListener('touchmove', handleTouchMove);
        };
    }, []);
}

export default useDisablePinchZoom;