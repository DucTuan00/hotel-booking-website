import { Router } from 'express';
import multer from 'multer';
import * as uploadController from '@/controllers/upload/uploadController';
import authMiddleware from '@/middlewares/authMiddleware';
import { UserRole } from '@/types/user';

const router = Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/'); 
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});

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
        fileSize: 5 * 1024 * 1024
    }
});

router.post('/image', authMiddleware([UserRole.ADMIN]), upload.single('image'), uploadController.uploadImage);
router.delete('/image/:filename', authMiddleware([UserRole.ADMIN]), uploadController.deleteImage);

export default router;