import { io, Socket } from 'socket.io-client';
import { Capacitor } from '@capacitor/core';

// Socket instance (singleton)
let socket: Socket | null = null;

// Get the appropriate socket URL based on platform
function getSocketUrl(): string {
    const isNative = Capacitor.isNativePlatform();
    
    if (isNative) {
        // Android emulator uses 10.0.2.2 to access localhost
        return import.meta.env.ANROID_SOCKET_API_URL;
    }
    
    // Web uses the configured API URL or localhost
    return import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3000';
}

/**
 * Get or create socket connection
 */
export function getSocket(): Socket {
    if (!socket) {
        const url = getSocketUrl();
        
        socket = io(url, {
            transports: ['websocket', 'polling'],
            autoConnect: true,
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
        });

        socket.on('connect', () => {
            console.log('[Socket] Connected:', socket?.id);
        });

        socket.on('disconnect', (reason) => {
            console.log('[Socket] Disconnected:', reason);
        });

        socket.on('connect_error', (error) => {
            console.error('[Socket] Connection error:', error.message);
        });
    }

    return socket;
}

/**
 * Join a room channel to receive inventory updates
 */
export function joinRoom(roomId: string): void {
    const s = getSocket();
    s.emit('join-room', roomId);
    console.log(`[Socket] Joining room: ${roomId}`);
}

/**
 * Leave a room channel
 */
export function leaveRoom(roomId: string): void {
    const s = getSocket();
    s.emit('leave-room', roomId);
    console.log(`[Socket] Leaving room: ${roomId}`);
}

/**
 * Subscribe to inventory updates for a room
 * @returns Cleanup function to unsubscribe
 */
export function subscribeToInventoryUpdates(
    callback: (data: InventoryUpdateData) => void
): () => void {
    const s = getSocket();
    
    const handler = (data: InventoryUpdateData) => {
        console.log('[Socket] Received inventory update:', data);
        callback(data);
    };

    s.on('inventory-update', handler);

    // Return cleanup function
    return () => {
        s.off('inventory-update', handler);
    };
}

/**
 * Disconnect socket
 */
export function disconnectSocket(): void {
    if (socket) {
        socket.disconnect();
        socket = null;
        console.log('[Socket] Disconnected manually');
    }
}

// Types
export interface InventoryUpdateData {
    roomId: string;
    updates: Array<{
        date: string;
        inventory: number;
        price: number;
    }>;
    timestamp: string;
}

export default {
    getSocket,
    joinRoom,
    leaveRoom,
    subscribeToInventoryUpdates,
    disconnectSocket
};
