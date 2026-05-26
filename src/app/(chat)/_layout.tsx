import { useEffect } from "react";
import { Stack } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ClientSocket } from "@/shared/api";


export default function ChatLayout() {
    useEffect(() => {
        async function connectSocket() {
            const token = await AsyncStorage.getItem("token");
            if (!token || ClientSocket.connected) return;
            ClientSocket.auth = { token: `Bearer ${token}` };
            ClientSocket.connect();
        }

        function onConnection() {
            console.log("Socket connected");
        }

        function onDisconnection() {
            console.log("Socket disconnected");
        }

        function onConnectionError(error: Error) {
            console.error("Socket connection error:", error);
        }

        connectSocket();
        ClientSocket.on("connect", onConnection);
        ClientSocket.on("disconnect", onDisconnection);
        ClientSocket.on("connect_error", onConnectionError);

        return () => {
            ClientSocket.off("connect", onConnection);
            ClientSocket.off("disconnect", onDisconnection);
            ClientSocket.off("connect_error", onConnectionError);
        };
    }, []);

    const screenOptions = { headerShown: false, animation: "none" as const };

    return (
        <Stack screenOptions={screenOptions}>
            <Stack.Screen name="chat" />
            <Stack.Screen name="conversation/[id]" />
            <Stack.Screen name="group/[id]" />
        </Stack>
    );
}