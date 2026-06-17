import { useState, useEffect } from 'react';

const unreadFlags = new Map<number, boolean>();
const unreadCounts = new Map<number, number>();
const listeners = new Set<() => void>();

function notify() {
    listeners.forEach(fn => fn());
}

export function markUnread(chatId: number): void {
    unreadFlags.set(chatId, true);
    unreadCounts.set(chatId, (unreadCounts.get(chatId) ?? 0) + 1);
    notify();
}

export function markRead(chatId: number): void {
    unreadFlags.set(chatId, false);
    unreadCounts.set(chatId, 0);
    notify();
}

export function isUnread(chatId: number): boolean {
    return unreadFlags.get(chatId) ?? false;
}

export function hasAnyUnread(): boolean {
    return [...unreadFlags.values()].some(Boolean);
}

export function getTotalUnreadCount(): number {
    return [...unreadCounts.values()].reduce((sum, n) => sum + n, 0);
}

export function getUnreadCount(chatId: number): number {
    return unreadCounts.get(chatId) ?? 0;
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

export function useUnreadCounts(): Map<number, number> {
    const [, forceUpdate] = useState(0);
    useEffect(() => {
        const listener = () => forceUpdate(n => n + 1);
        listeners.add(listener);
        return () => { listeners.delete(listener); };
    }, []);
    return unreadCounts;
}

export function useUnreadCount(): number {
    const [, forceUpdate] = useState(0);
    useEffect(() => {
        const listener = () => forceUpdate(n => n + 1);
        listeners.add(listener);
        return () => { listeners.delete(listener); };
    }, []);
    return getTotalUnreadCount();
}