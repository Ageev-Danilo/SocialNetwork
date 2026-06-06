import { useState, useEffect } from 'react';


let activeChatId: number | null = null;
const listeners = new Set<() => void>();

function notify(): void {
    listeners.forEach(fn => fn());
}

export function setActiveChatId(id: number | null): void {
    activeChatId = id;
    notify();
}

export function getActiveChatId(): number | null {
    return activeChatId;
}

export function useActiveChatId(): number | null {
    const [, forceUpdate] = useState(0);
    useEffect(() => {
        const listener = () => forceUpdate(n => n + 1);
        listeners.add(listener);
        return () => { listeners.delete(listener); };
    }, []);
    return activeChatId;
}