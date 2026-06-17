import { TabBtn } from '../shared/ui/Button';
import { useUnreadCount } from '@/modules/chat/model/unread.store';
import { BASE } from '@/shared/consts';
import { SafeAreaView } from 'react-native-safe-area-context';


export function Bottom() {
    const totalUnread = useUnreadCount();
    const chatBadge = totalUnread > 0 ? totalUnread : undefined;

    return (
        <SafeAreaView style={[BASE.center, BASE.bottomBar, { backgroundColor: '#fff' }]} edges={['bottom']}>
            <TabBtn icon="home" label="Головна" href="/home" />
            <TabBtn icon="img" label="Мої публікації" href="/posts" />
            <TabBtn icon="group" label="Друзі" href="/friends" />
            <TabBtn icon="chat" label="Чати" href="/chat" badge={chatBadge} />
        </SafeAreaView>
    );
}