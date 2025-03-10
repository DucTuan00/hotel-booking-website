import userService from "../services/userService.js";
import ApiError from '../utils/apiError.js';

const getUserInfo = async (req, res, next) => {
    try {
        const _id = req.user.id;
        const user = await userService.getUserById(_id);
        res.json(user);
    } catch (error) {
        next(new ApiError(error.message, 400));
    }
};

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
        const { page = 1, pageSize = 10, ...filter} = req.query;
        const users = await userService.getAllUsers(filter, parseInt(page), parseInt(pageSize));
        res.json(users);
    } catch (error) {
        next(new ApiError(error.message, 400));
    }
};

const createUser = async (req, res, next) => {
    try {
        const { email, password, name, phone, role } = req.body;
        const user = await userService.createUser(email, password, name, phone, role);
        res.status(201).json(user);
    } catch (error) {
        if (error.message === 'User already exists') {
            return res.status(400).json({ error: error.message });
        }
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

const updateUserById = async (req, res, next) => {
    try {
        const _id = req.params.id;
        const { email, name, phone, role } = req.body;
        const updatedUser = await userService.updateUserById(_id, email, name, phone, role);
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
    getUserInfo,
    createUser,
    updateUserById,
};