import userService from "../services/userService.js";
import ApiError from '../utils/apiError.js';

const getUserById = async (req, res, next) => {
    try {
        const _id = req.params.id;
        const user = await userService.getUserById(_id);
        res.json(user);
    } catch (error) {
        next(new ApiError(error.message, 400));
    }
};

const getAllUsers = async (req, res, next) => {
    try {
        const users = await userService.getAllUsers();
        res.json(users);
    } catch (error) {
        next(new ApiError(error.message, 400));
    }
};

const updateUser = async (req, res, next) => {
    try {
        const _id = req.params.id;
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
        const _id = req.params.id;
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