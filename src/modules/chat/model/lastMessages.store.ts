import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';


export interface LastMessage {
    text: string;
    time: string;
}

const STORAGE_KEY = 'chat:lastMessages';
const store = new Map<number, LastMessage>();
const listeners = new Set<() => void>();

function notify(): void {
    listeners.forEach(fn => fn());
}

async function persist(): Promise<void> {
    const obj: Record<string, LastMessage> = {};
    store.forEach((msg, id) => { obj[String(id)] = msg; });
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
}

export async function initLastMessages(): Promise<void> {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const parsed: Record<string, LastMessage> = JSON.parse(raw);
    Object.entries(parsed).forEach(([id, msg]) => store.set(Number(id), msg));
    notify();
}

export function setLastMessage(chatId: number, text: string, time: string): void {
    store.set(chatId, { text, time });
    notify();
    persist();
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