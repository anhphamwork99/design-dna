import { useState, useEffect, useCallback } from 'react';

/**
 * Shared state for whether studio is actively in use (past goal picker).
 * Uses custom DOM events so AppShell (outside studio) can react.
 */

const EVENT_NAME = 'studio-active-change';

// Called by StudioScreen to signal active state
export function setStudioActive(active: boolean) {
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: active }));
}

// Called by AppShell to subscribe to active state
export function useStudioActive(): boolean {
    const [active, setActive] = useState(false);

    const handler = useCallback((e: Event) => {
        setActive((e as CustomEvent<boolean>).detail);
    }, []);

    useEffect(() => {
        window.addEventListener(EVENT_NAME, handler);
        return () => {
            window.removeEventListener(EVENT_NAME, handler);
            // Reset when component unmounts (navigating away from studio)
            setActive(false);
        };
    }, [handler]);

    return active;
}
