export { ChatTabs } from './ui/ChatTabs';
export type { ChatTabId } from './ui/ChatTabs';
export { ChatListItem } from './ui/ChatListItem';
export { ContactListItem } from './ui/ContactListItem';
export { GroupListItem } from './ui/GroupListItem';
export { ChatSectionHeader } from './ui/ChatSectionHeader';
export { ChatSearchBar } from './ui/ChatSearchBar';
export { CreateGroupModal } from './ui/CreateGroupModal';
export { ChatThreadScreen } from './ui/ChatThreadScreen';
export { UserAddIcon, MessagesTabIcon, ContactsTabIcon, GroupsTabIcon } from './ui/ChatIcons';
export {
    useGetChatsQuery,
    useCreateChatMutation,
    useGetChatMessagesQuery,
    useAddMessageMutation,
} from './api';
export type { ChatDto, MessageDto, CreateChatPayload, CreateMessagePayload } from './api';
export {
    MOCK_CONTACTS,
    MOCK_CONVERSATIONS,
    MOCK_GROUP_CHATS,
    CHAT_TAB_BADGE,
    getConversationById,
    getGroupChatById,
    getDmThread,
    getGroupThread,
    getGroupSubtitle,
} from './model/mock-data';
export type { Contact, Conversation, GroupChat, ChatMessage, ThreadItem } from './model/mock-data';