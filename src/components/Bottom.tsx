import { TabBtn } from '../shared/ui/Button';
import { useUnreadFlags, useFriendRequestsCount } from '@/modules/chat/model/unread.store';
import { BASE } from '@/shared/consts';
import { SafeAreaView } from 'react-native-safe-area-context';


export function Bottom() {
    const flags = useUnreadFlags();
    const friendRequests = useFriendRequestsCount();

    const friendsBadge = friendRequests > 0 ? friendRequests : undefined;
    const chatBadge = [...flags.values()].some(Boolean) ? 1 : undefined;

    return (
        <SafeAreaView style={[BASE.center, BASE.bottomBar, { backgroundColor: '#fff' }]} edges={['bottom']}>
            <TabBtn icon="home" label="Головна" href="/home" />
            <TabBtn icon="img" label="Мої публікації" href="/posts" />
            <TabBtn icon="group" label="Друзі" href="/friends" badge={friendsBadge} />
            <TabBtn icon="chat" label="Чати" href="/chat" badge={chatBadge} />
        </SafeAreaView>
    );
}