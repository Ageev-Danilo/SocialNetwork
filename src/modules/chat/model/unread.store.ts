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
    console.log('useUnreadFlags', unreadFlags);
    return unreadFlags;
}

export interface unreadMessage {
    senderId: number;
}

const store = new Map<number, unreadMessage>();

export function Unread(chatId: number, senderId: number): void {
    store.set(chatId, { senderId });
    listeners.forEach(fn => fn());
}

export function useUnreadMessages(): Map<number, unreadMessage> {
    const [, forceUpdate] = useState(0);
    useEffect(() => {
        const listener = () => forceUpdate(n => n + 1);
        listeners.add(listener);
        return () => { listeners.delete(listener); };
    }, []);
    console.log('useUnreadMessages', store);
    return store;
}

export function checkUnreadMessage(senderId: number) {
    const hasUnreadMessage = Array.from(store.values()).some(msg => msg.senderId === senderId);
    if (hasUnreadMessage) {
        console.log('Unread message found for sender:', senderId);
    } else {
        console.log('No unread messages found for sender:', senderId);
    }
}
