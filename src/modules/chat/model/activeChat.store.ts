let activeChatId: number | null = null;

export function setActiveChatId(id: number | null): void {
    activeChatId = id;
}

export function getActiveChatId(): number | null {
    return activeChatId;
}