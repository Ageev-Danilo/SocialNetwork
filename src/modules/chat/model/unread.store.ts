import { useState, useEffect } from 'react';


const unreadFlags = new Map<number, boolean>();
const listeners = new Set<() => void>();

function notify() {
    listeners.forEach(fn => fn());
}

export function markUnread(chatId: number): void {
    unreadFlags.set(chatId, true);
    notify();
}

export function markRead(chatId: number): void {
    unreadFlags.set(chatId, false);
    notify();
}

export function isUnread(chatId: number): boolean {
    return unreadFlags.get(chatId) ?? false;
}

export function hasAnyUnread(): boolean {
    return [...unreadFlags.values()].some(Boolean);
}

export function useUnreadFlags(): Map<number, boolean> {
    const [, forceUpdate] = useState(0);
    useEffect(() => {
        const listener = () => forceUpdate(n => n + 1);
        listeners.add(listener);
        return () => { listeners.delete(listener); };
    }, []);
    return unreadFlags;
}