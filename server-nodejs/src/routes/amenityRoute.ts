import { Router } from 'express';
import amenityController from '@/controllers/amenityController';
import authMiddleware from '@/middlewares/authMiddleware';

const router: Router = Router();

router.post('/', authMiddleware(['admin']), amenityController.createAmenity);
router.get('/', amenityController.getAllAmenities);
router.get('/:id', amenityController.getAmenityById);
router.put('/:id', authMiddleware(['admin']), amenityController.updateAmenity);
router.delete('/:id', authMiddleware(['admin']), amenityController.deleteAmenity);

export default router;
