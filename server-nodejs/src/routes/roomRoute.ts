import { Router } from 'express';
import * as roomController from '@/controllers/rooms/roomController';
import * as roomAvailableController from '@/controllers/rooms/roomAvailableController';
import authMiddleware from '@/middlewares/authMiddleware';
import { UserRole } from "@/types/user";

const router = Router();

router.post('/', authMiddleware([UserRole.ADMIN]), roomController.createRoom);
router.get('/', roomController.getAllRooms);
router.get('/:id', roomController.getRoomById);
router.put('/:id', authMiddleware([UserRole.ADMIN]), roomController.updateRoom);
router.delete('/:id', authMiddleware([UserRole.ADMIN]), roomController.deleteRoom);
router.delete('/image/:imageId', authMiddleware([UserRole.ADMIN]), roomController.deleteRoomImage);

// Room availability routes
router.post('/availability', authMiddleware([UserRole.ADMIN]), roomAvailableController.createRoomAvailable);
router.post('/availability/bulk', authMiddleware([UserRole.ADMIN]), roomAvailableController.createBulkRoomAvailable);
router.get('/availability', roomAvailableController.getRoomAvailable);
router.get('/availability/all', roomAvailableController.getAllRoomsAvailability);
router.put('/availability/:roomId/:date', authMiddleware([UserRole.ADMIN]), roomAvailableController.updateRoomAvailable);
router.delete('/availability/:roomId/:date', authMiddleware([UserRole.ADMIN]), roomAvailableController.deleteRoomAvailable);

export default router;