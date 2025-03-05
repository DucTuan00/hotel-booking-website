import userService from "../services/userService.js";
import ApiError from '../utils/apiError.js';

const getUserById = async (req, res, next) => {
    try {
        const _id = req.user.id;
        const user = await userService.getUserById(_id);
        res.json(user);
    } catch (error) {
        next(new ApiError(error.message, 400));
    }
};

const getAllUsers = async (req, res, next) => {
    try {
        const { page = 1, pageSize = 10, ...filter} = req.query;
        const users = await userService.getAllUsers(filter, parseInt(page), parseInt(pageSize));
        res.json(users);
    } catch (error) {
        next(new ApiError(error.message, 400));
    }
};

const updateUser = async (req, res, next) => {
    try {
        const _id = req.user.id;
        const { email, name, phone } = req.body;
        const updatedUser = await userService.updateUser(_id, email, name, phone);
        res.json({ 
            message: 'User updated successfully', 
            user: updatedUser 
        });
    } catch (error) {
        next(new ApiError(error.message, 400));
    }
};

const updatePassword = async (req, res, next) => {
    try {
        const _id = req.user.id;
        const { oldPassword, newPassword } = req.body;
        const result = await userService.updatePassword(_id, oldPassword, newPassword);
        res.json(result);
    } catch (error) {
        next(new ApiError(error.message, 400));
    }
};

const deleteUser = async (req, res, next) => {
    try {
        const _id = req.params.id;
        const result = await userService.deleteUser(_id);
        res.json(result);
    } catch (error) {
        next(new ApiError(error.message, 400));
    }
};

export default {
    getUserById,
    getAllUsers,
    updateUser,
    updatePassword,
    deleteUser,
}