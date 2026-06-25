import { io } from 'socket.io-client';
import type { Socket } from 'socket.io-client';
import type { ServerEvents, ClientEvents } from './socket.contracts';


const BASE_IP = '10.0.2.2';
const WS_URL = process.env.EXPO_PUBLIC_API_URL ?? `http://${BASE_IP}:3000`;

export const ClientSocket: Socket<ServerEvents, ClientEvents> = io(WS_URL, {
    autoConnect: false,
});