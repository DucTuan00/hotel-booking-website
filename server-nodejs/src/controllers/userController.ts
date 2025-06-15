import userService from "@/services/userService";
import ApiError from '@/utils/apiError';
import { Request, Response, NextFunction } from 'express';

const getUserInfo = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const _id = req.user?.id;
        if (!_id) {
            throw new ApiError('User ID is required', 400);
        }
        const user = await userService.getUserById({ _id });
        res.json(user);
    } catch (error: any) {
        next(new ApiError(error.message, 400));
    }
};

const getUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const _id = req.params.id;
        const user = await userService.getUserById({ _id });
        res.json(user);
    } catch (error: any) {
        next(new ApiError(error.message, 400));
    }
};

const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { page = 1, pageSize = 10, ...filter} = req.query;
        const users = await userService.getAllUsers({
            ...filter, 
            page: parseInt(page as string), 
            pageSize: parseInt(pageSize as string)
        });
        res.json(users);
    } catch (error: any) {
        next(new ApiError(error.message, 400));
    }
};

const createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password, name, phone, role } = req.body;
        const user = await userService.createUser({ email, password, name, phone, role });
        res.status(201).json(user);
    } catch (error: any) {
        if (error.message === 'User already exists') {
            return res.status(400).json({ error: error.message });
        }
        next(new ApiError(error.message, 400));
    }
};

const updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const _id = req.user?.id;
        if (!_id) {
            throw new ApiError('User ID is required', 400);
        }
        const { email, name, phone } = req.body;
        const updatedUser = await userService.updateUser({ _id, email, name, phone });
        res.json({ 
            message: 'User updated successfully', 
            user: updatedUser 
        });
    } catch (error: any) {
        next(new ApiError(error.message, 400));
    }
};

const updateUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const _id = req.params.id;
        const { email, name, phone, role } = req.body;
        const updatedUser = await userService.updateUserById({ _id, email, name, phone, role });
        res.json({ 
            message: 'User updated successfully', 
            user: updatedUser 
        });
    } catch (error: any) {
        next(new ApiError(error.message, 400));
    }
};

const updatePassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const _id = req.user?.id;
        if (!_id) {
            throw new ApiError('User ID is required', 400);
        }
        const { oldPassword, newPassword } = req.body;
        const result = await userService.updatePassword({ _id, oldPassword, newPassword });
        res.json(result);
    } catch (error: any) {
        next(new ApiError(error.message, 400));
    }
};

const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const _id = req.params.id;
        const result = await userService.deleteUser(_id);
        res.json(result);
    } catch (error: any) {
        next(new ApiError(error.message, 400));
    }
};

type Controller = (req: Request, res: Response, next: NextFunction) => Promise<any>;

export default {
    getUserById,
    getAllUsers,
    updateUser,
    updatePassword,
    deleteUser,
    getUserInfo,
    createUser,
    updateUserById,
} as Record<string, Controller>;
