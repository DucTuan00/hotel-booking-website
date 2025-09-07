import api from '@/services/api';
import {
    RoomAvailableData,
    RoomAvailableInput,
    GetRoomAvailableInput,
    UpdateRoomAvailableInput,
    RoomAvailableResponse,
    RoomAvailabilityData
} from '@/types/room';

const createRoomAvailable = async (data: RoomAvailableData): Promise<RoomAvailableResponse> => {
    try {
        const response = await api.post('/room/availability', {
            roomId: data.roomId,
            date: data.date.toISOString(),
            price: data.price,
            inventory: data.inventory
        });
        return response.data;
    } catch (error) {
        console.error('Error creating room availability:', error);
        throw error;
    }
};

const createBulkRoomAvailable = async (data: RoomAvailableInput): Promise<{success: boolean, insertedCount: number, message: string}> => {
    try {
        const response = await api.post('/room/availability/bulk', {
            roomId: data.roomId,
            startDate: data.startDate.toISOString(),
            endDate: data.endDate.toISOString(),
            price: data.price,
            inventory: data.inventory
        });
        return response.data;
    } catch (error) {
        console.error('Error creating bulk room availability:', error);
        throw error;
    }
};

const getRoomAvailable = async (params: GetRoomAvailableInput): Promise<{
    roomAvailables: RoomAvailableResponse[];
    total: number;
    currentPage: number;
    pageSize: number;
}> => {
    try {
        const queryParams: any = {
            page: params.page || 1,
            pageSize: params.pageSize || 100
        };

        if (params.roomId) {
            queryParams.roomId = params.roomId;
        }

        if (params.startDate) {
            queryParams.startDate = params.startDate.toISOString();
        }

        if (params.endDate) {
            queryParams.endDate = params.endDate.toISOString();
        }

        const response = await api.get('/room/availability', { params: queryParams });
        return response.data;
    } catch (error) {
        console.error('Error getting room availability:', error);
        throw error;
    }
};

const updateRoomAvailable = async (data: UpdateRoomAvailableInput): Promise<RoomAvailableResponse> => {
    try {
        const response = await api.put(`/room/availability/${data.roomId}/${data.date.toISOString()}`, {
            price: data.price,
            inventory: data.inventory
        });
        return response.data;
    } catch (error) {
        console.error('Error updating room availability:', error);
        throw error;
    }
};

const deleteRoomAvailable = async (roomId: string, date: Date): Promise<{message: string}> => {
    try {
        const response = await api.delete(`/room/availability/${roomId}/${date.toISOString()}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting room availability:', error);
        throw error;
    }
};

const getAllRoomsAvailability = async (startDate: Date, endDate: Date): Promise<RoomAvailabilityData[]> => {
    try {
        const response = await api.get('/room/availability/all', {
            params: {
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString()
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error getting all rooms availability:', error);
        throw error;
    }
};

export default {
    createRoomAvailable,
    createBulkRoomAvailable,
    getRoomAvailable,
    updateRoomAvailable,
    deleteRoomAvailable,
    getAllRoomsAvailability
};
