import { useEffect } from 'react';

export default function HomeScreen() {
    useEffect(() => {
        document.title = 'DesignDNA — Home';
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <h1 className="text-[32px] font-bold tracking-tight text-text-primary mb-3">
                Welcome to DesignDNA
            </h1>
            <p className="text-[14px] text-text-secondary max-w-[400px]">
                Home dashboard coming soon. Use the sidebar to navigate to your tools.
            </p>
        </div>
    );
}
