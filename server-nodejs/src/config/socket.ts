import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import RoomAvailable from '@/models/RoomAvailable';
import mongoose from 'mongoose';

let io: Server | null = null;

/**
 * Socket.IO Events:
 * - 'join-room': Client joins a room channel to receive inventory updates
 * - 'leave-room': Client leaves a room channel
 * - 'inventory-update': Server broadcasts inventory changes to room subscribers
 */

export function initializeSocket(httpServer: HttpServer): Server {
    const allowedOrigins = [
        process.env.FRONTEND_URL || 'http://localhost:5173',
        'http://10.0.2.2:5173', // Android emulator
        'http://localhost:5173', // Web dev
        'http://localhost', // Capacitor webview
    ].filter(Boolean);

    io = new Server(httpServer, {
        cors: {
            origin: allowedOrigins,
            methods: ['GET', 'POST'],
            credentials: true
        },
        transports: ['websocket', 'polling']
    });

    io.on('connection', (socket: Socket) => {
        console.log(`[Socket] Client connected: ${socket.id}`);

        // Client joins a room channel to receive inventory updates
        socket.on('join-room', (roomId: string) => {
            if (roomId && mongoose.Types.ObjectId.isValid(roomId)) {
                socket.join(`room:${roomId}`);
                console.log(`[Socket] Client ${socket.id} joined room:${roomId}`);
            }
        });

        // Client leaves a room channel
        socket.on('leave-room', (roomId: string) => {
            if (roomId) {
                socket.leave(`room:${roomId}`);
                console.log(`[Socket] Client ${socket.id} left room:${roomId}`);
            }
        });

        socket.on('disconnect', () => {
            console.log(`[Socket] Client disconnected: ${socket.id}`);
        });
    });

    console.log('[Socket] Socket.IO initialized');
    return io;
}

export function getIO(): Server | null {
    return io;
}

/**
 * Get updated inventory data for a room within a date range
 */
async function getInventoryData(
    roomId: string,
    startDate: Date,
    endDate: Date
): Promise<Array<{ date: string; inventory: number; price: number }>> {
    const roomAvailables = await RoomAvailable.find({
        roomId: new mongoose.Types.ObjectId(roomId),
        date: {
            $gte: startDate,
            $lt: endDate
        }
    }).sort({ date: 1 });

    return roomAvailables.map(item => ({
        date: item.date.toISOString().split('T')[0],
        inventory: item.inventory,
        price: item.price
    }));
}

/**
 * Emit inventory update to all clients subscribed to a room
 * Called after successful booking/cancellation
 */
export async function emitInventoryUpdate(
    roomId: string,
    checkIn: Date,
    checkOut: Date
): Promise<void> {
    if (!io) {
        console.warn('[Socket] Socket.IO not initialized, skipping inventory emit');
        return;
    }

    try {
        // Get updated inventory for the affected date range
        const inventoryData = await getInventoryData(roomId, checkIn, checkOut);

        // Broadcast to all clients in this room channel
        io.to(`room:${roomId}`).emit('inventory-update', {
            roomId,
            updates: inventoryData,
            timestamp: new Date().toISOString()
        });

        console.log(`[Socket] Emitted inventory update for room ${roomId}:`, inventoryData);
    } catch (error) {
        console.error('[Socket] Failed to emit inventory update:', error);
    }
}

/**
 * Emit inventory update for multiple rooms (batch)
 */
export async function emitBatchInventoryUpdate(
    updates: Array<{ roomId: string; checkIn: Date; checkOut: Date }>
): Promise<void> {
    for (const update of updates) {
        await emitInventoryUpdate(update.roomId, update.checkIn, update.checkOut);
    }
}
