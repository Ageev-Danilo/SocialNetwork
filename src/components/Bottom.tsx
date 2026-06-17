import { TabBtn } from '../shared/ui/Button';
import { useUnreadFlags, useFriendRequestsCount } from '@/modules/chat/model/unread.store';
import { BASE } from '@/shared/consts';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGetFriendRequestsQuery } from '@/modules/friends';


export function Bottom() {
    const flags = useUnreadFlags();
    const { data: requests = [] } = useGetFriendRequestsQuery();

    const friendsBadge = requests.length > 99 ? '99+' : requests.length || undefined;
    const unreadChatsCount = [...flags.values()]
        .filter(Boolean)
        .length;

    const chatBadge =
        unreadChatsCount > 1000
            ? '1000+'
            : unreadChatsCount || undefined;

    return (
        <SafeAreaView style={[BASE.center, BASE.bottomBar, { backgroundColor: '#fff' }]} edges={['bottom']}>
            <TabBtn icon="home" label="Головна" href="/home" />
            <TabBtn icon="img" label="Мої публікації" href="/posts" />
            <TabBtn icon="group" label="Друзі" href="/friends" badge={friendsBadge} />
            <TabBtn icon="chat" label="Чати" href="/chat" badge={chatBadge} />
        </SafeAreaView>
    );
}