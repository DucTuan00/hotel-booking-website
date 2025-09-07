import { Router } from 'express';
import multer from 'multer';
import roomController from '@/controllers/rooms/roomController';
import roomAvailableController from '@/controllers/rooms/roomAvailableController';
import authMiddleware from '@/middlewares/authMiddleware';

const router = Router();

// Config Multer to upload images
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/'); // Image folder
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname); // Original image's name
    },
});

const upload = multer({ storage: storage });

router.post('/', authMiddleware(['admin']), upload.array('images', 5), roomController.createRoom);
router.get('/', roomController.getAllRooms);
router.get('/:id', roomController.getRoomById);
router.put('/:id', authMiddleware(['admin']), upload.array('images', 5), roomController.updateRoom);
router.delete('/:id', authMiddleware(['admin']), roomController.deleteRoom);
router.delete('/image/:imageId', authMiddleware(['admin']), roomController.deleteRoomImage);

// Room availability routes
router.post('/availability', authMiddleware(['admin']), roomAvailableController.createRoomAvailable);
router.post('/availability/bulk', authMiddleware(['admin']), roomAvailableController.createBulkRoomAvailable);
router.get('/availability', roomAvailableController.getRoomAvailable);
router.get('/availability/all', roomAvailableController.getAllRoomsAvailability);
router.put('/availability/:roomId/:date', authMiddleware(['admin']), roomAvailableController.updateRoomAvailable);
router.delete('/availability/:roomId/:date', authMiddleware(['admin']), roomAvailableController.deleteRoomAvailable);

export default router;