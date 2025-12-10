import * as userService from "@/services/users/userService";
import ApiError from '@/utils/apiError';
import { Request, Response, NextFunction } from 'express';

export async function getUserInfo(req: Request, res: Response, next: NextFunction) {
    try {
        const id = req.user?.id;
        if (!id) {
            throw new ApiError('User ID is required', 400);
        }
        const user = await userService.getUserById({ id });
        res.json(user);
    } catch (error: any) {
        next(new ApiError(error.message, 400));
    }
};

export async function getUserById(req: Request, res: Response, next: NextFunction) {
    try {
        const id = req.params.id;
        const user = await userService.getUserById({ id });
        res.json(user);
    } catch (error: any) {
        next(new ApiError(error.message, 400));
    }
};

export async function getAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
        const { page = 1, pageSize = 10, search, role, sortBy, sortOrder, excludeCurrentUser } = req.query;
        
        const users = await userService.getAllUsers({
            search: search as string,
            role: role as any,
            sortBy: sortBy as any,
            sortOrder: sortOrder as any,
            page: parseInt(page as string), 
            pageSize: parseInt(pageSize as string),
            excludeCurrentUser: excludeCurrentUser === 'true',
            currentUserId: req.user?.id
        });
        res.json(users);
    } catch (error: any) {
        next(new ApiError(error.message, 400));
    }
};

export async function createUser(req: Request, res: Response, next: NextFunction) {
    try {
        const { email, password, name, phone, role } = req.body;
        const user = await userService.createUser({ email, password, name, phone, role });
        res.status(201).json(user);
    } catch (error: any) {
        if (error.message === 'User already exists') {
            return next(new ApiError(error.message, 400));
        }
        next(new ApiError(error.message, 400));
    }
};

export async function updateUser(req: Request, res: Response, next: NextFunction) {
    try {
        const id = req.user?.id;
        if (!id) {
            throw new ApiError('User ID is required', 400);
        }
        const { email, name, phone } = req.body;
        const updatedUser = await userService.updateUser({ id, email, name, phone });
        res.json({ 
            message: 'User updated successfully', 
            user: updatedUser 
        });
    } catch (error: any) {
        next(new ApiError(error.message, 400));
    }
};

export async function updateUserById(req: Request, res: Response, next: NextFunction) {
    try {
        const id = req.params.id;
        const { email, name, phone, role } = req.body;
        const updatedUser = await userService.updateUserById({ id, email, name, phone, role });
        res.json({ 
            message: 'User updated successfully', 
            user: updatedUser 
        });
    } catch (error: any) {
        next(new ApiError(error.message, 400));
    }
};

export async function updatePassword(req: Request, res: Response, next: NextFunction) {
    try {
        const id = req.user?.id;
        if (!id) {
            throw new ApiError('User ID is required', 400);
        }
        const { oldPassword, newPassword } = req.body;
        const result = await userService.updatePassword({ id, oldPassword, newPassword });
        res.json(result);
    } catch (error: any) {
        next(new ApiError(error.message, 400));
    }
};

export async function deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
        const _id = req.params.id;
        const result = await userService.deleteUser(_id);
        res.json(result);
    } catch (error: any) {
        next(new ApiError(error.message, 400));
    }
};
