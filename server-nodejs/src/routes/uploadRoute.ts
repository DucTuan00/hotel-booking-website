import { Router } from 'express';
import multer from 'multer';
import * as uploadController from '@/controllers/upload/uploadController';
import authMiddleware from '@/middlewares/authMiddleware';
import { UserRole } from '@/types/user';

const router = Router();

// Use memory storage for Cloudinary
const storage = multer.memoryStorage();

const upload = multer({ 
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'));
        }
    },
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

router.post('/image', authMiddleware([UserRole.ADMIN]), upload.single('image'), uploadController.uploadImage);

router.post('/images', authMiddleware([UserRole.ADMIN]), upload.array('images', 10), uploadController.uploadMultipleImages);

router.delete('/image', authMiddleware([UserRole.ADMIN]), uploadController.deleteImage);

export default router;