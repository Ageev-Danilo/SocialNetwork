import { useState, useEffect } from 'react';


export interface LastMessage {
    text: string;
    time: string;
}

const store = new Map<number, LastMessage>();
const listeners = new Set<() => void>();

export function setLastMessage(chatId: number, text: string, time: string): void {
    store.set(chatId, { text, time });
    listeners.forEach(fn => fn());
}

export function useLastMessages(): Map<number, LastMessage> {
    const [, forceUpdate] = useState(0);
    useEffect(() => {
        const listener = () => forceUpdate(n => n + 1);
        listeners.add(listener);
        return () => { listeners.delete(listener); };
    }, []);
    return store;
}