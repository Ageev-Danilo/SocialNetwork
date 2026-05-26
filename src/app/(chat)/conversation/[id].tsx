import { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { ClientSocket } from "@/shared/api";
import { ChatThreadScreen, getConversationById, getDmThread } from "@/modules/chat";
import { CHAT_COLORS } from "@/modules/chat/ui/chat-theme";


export default function ConversationScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const chatId = Number(id);
    const conversation = getConversationById(id);
    const items = getDmThread(id);

    useEffect(() => {
        ClientSocket.emit("joinChat", { chatId }, (response) => {
            if (response.status === "ok") {
                console.log("Joined chat:", chatId);
            } else {
                console.error("Failed to join chat:", response.message);
            }
        });

        return () => {
            ClientSocket.emit("leaveChat", { chatId });
        };
    }, [chatId]);

    if (!conversation) {
        return (
            <View style={styles.error}>
                <Text style={styles.errorText}>Чат не знайдено</Text>
            </View>
        );
    }

    return (
        <ChatThreadScreen
            title={conversation.contactName}
            avatarUri={conversation.avatarUri}
            items={items}
        />
    );
}

const styles = StyleSheet.create({
    error: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: CHAT_COLORS.screenBg,
    },
    errorText: {
        color: CHAT_COLORS.textLight,
        fontSize: 16,
    },
});