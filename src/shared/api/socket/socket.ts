import { io } from 'socket.io-client';
import type { Socket } from 'socket.io-client';
import type { ServerEvents, ClientEvents } from './socket.contracts';


const WS_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://192.168.0.152:3000';

export const ClientSocket: Socket<ServerEvents, ClientEvents> = io(WS_URL, {
    autoConnect: false,
});