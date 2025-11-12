import { Router } from 'express';
import * as roomController from '@/controllers/rooms/roomController';
import * as roomAvailableController from '@/controllers/rooms/roomAvailableController';
import * as roomSearchController from '@/controllers/rooms/roomSearchController';
import authMiddleware from '@/middlewares/authMiddleware';
import { UserRole } from "@/types/user";

const router = Router();

// Room search route (public)
router.get('/search', roomSearchController.searchAvailableRooms);

// Room availability routes
router.post('/availability', authMiddleware([UserRole.ADMIN]), roomAvailableController.createRoomAvailable);
router.post('/availability/bulk', authMiddleware([UserRole.ADMIN]), roomAvailableController.createBulkRoomAvailable);
router.get('/availability', roomAvailableController.getRoomAvailable);
router.get('/availability/all', roomAvailableController.getAllRoomsAvailability);
router.put('/availability/:roomId/:date', authMiddleware([UserRole.ADMIN]), roomAvailableController.updateRoomAvailable);
router.delete('/availability/:roomId/:date', authMiddleware([UserRole.ADMIN]), roomAvailableController.deleteRoomAvailable);

router.get('/all-rooms', authMiddleware([UserRole.ADMIN]), roomController.getAllRoomsWithoutPagination);
router.get('/active', roomController.getActiveRooms);
router.post('/', authMiddleware([UserRole.ADMIN]), roomController.createRoom);
router.get('/', authMiddleware([UserRole.ADMIN]), roomController.getAllRooms);
router.put('/:id', authMiddleware([UserRole.ADMIN]), roomController.updateRoom);
router.patch('/:id/toggle-active', authMiddleware([UserRole.ADMIN]), roomController.toggleRoomActive);
router.delete('/:id', authMiddleware([UserRole.ADMIN]), roomController.deleteRoom);
router.delete('/image/:imageId', authMiddleware([UserRole.ADMIN]), roomController.deleteRoomImage);

router.get('/:id', roomController.getRoomById); // Always keep this at the end

export default router;