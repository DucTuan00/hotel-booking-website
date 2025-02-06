import { Router } from 'express';
import roomController from '../controllers/roomController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = Router();

router.post('/', authMiddleware(['admin']), roomController.createRoom);
router.get('/', roomController.getAllRooms);
router.get('/:id', roomController.getRoomById);
router.put('/:id', authMiddleware(['admin']), roomController.updateRoom);
router.delete('/:id', authMiddleware(['admin']), roomController.deleteRoom);

export default router;