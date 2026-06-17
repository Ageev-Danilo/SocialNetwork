import { ClientSocket } from '@/shared/api';
import {
    incrementFriendRequest,
    decrementFriendRequest,
    setFriendRequests,
} from '@/modules/chat/model/unread.store';

export function initFriendsSocket() {
    // Запрос начального количества отправленных запросов при подключении
    ClientSocket.emit('friends:get-sent-requests-count');

    // Слушатели для обновления счетчика
    ClientSocket.on('friends:sent-requests-count', (count: number) => {
        console.log('[Friends] Sent requests count:', count);
        setFriendRequests(count);
    });

    ClientSocket.on('friends:request-sent', () => {
        console.log('[Friends] Request sent');
        incrementFriendRequest();
    });

    ClientSocket.on('friends:request-accepted', () => {
        console.log('[Friends] Request accepted');
        decrementFriendRequest();
    });

    ClientSocket.on('friends:request-declined', () => {
        console.log('[Friends] Request declined');
        decrementFriendRequest();
    });
}

export function cleanupFriendsSocket() {
    ClientSocket.off('friends:sent-requests-count');
    ClientSocket.off('friends:request-sent');
    ClientSocket.off('friends:request-accepted');
    ClientSocket.off('friends:request-declined');
}
