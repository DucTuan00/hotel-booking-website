import { Router } from 'express';
import * as amenityController from '@/controllers/amenities/amenityController';
import authMiddleware from '@/middlewares/authMiddleware';
import { UserRole } from "@/types/user";

const router: Router = Router();

router.post('/', authMiddleware([UserRole.ADMIN]), amenityController.createAmenity);
router.get('/', amenityController.getAllAmenities);
router.get('/:id', amenityController.getAmenityById);
router.put('/:id', authMiddleware([UserRole.ADMIN]), amenityController.updateAmenity);
router.delete('/:id', authMiddleware([UserRole.ADMIN]), amenityController.deleteAmenity);

export default router;
