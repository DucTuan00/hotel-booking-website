import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import ApiError from '../utils/apiError.js';

const getUserById = async (_id) => {
    if (!_id) {
        throw new Error('Do not have _id');
    }
    const user = await User.findOne({ _id, active: true }, { _id: 0, password: 0 });
    if (!user) {
        throw new Error('Failed finding user with _id: ' + _id);
    }
    return user;
};

const getAllUsers = async (filter, page, pageSize) => {
    const skip = (page - 1) * pageSize;
    const users = await User.find({ ...filter, active: true }, { password: 0 })
        .skip(skip)
        .limit(pageSize);
    
    if (!users) {
        throw new Error('Failed finding all users');
    }

    const totalUsers = await User.countDocuments({ ...filter, active: true});
    if (!totalUsers) {
        throw new ApiError('Failed to get total users', 500);
    }
    return {
        users: users,
        total: totalUsers,
        currentPage: page,
        pageSize: pageSize
    };
};

const createUser = async (email, password, name, phone, role) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
        email,
        password: hashedPassword,
        name,
        phone,
        role
    });
    const user = await newUser.save();
    return {
        message: 'User register successfully'
    };
};

const updateUser = async (_id, email, name, phone) => {
    if (!_id) {
        throw new Error('Do not have _id');
    }
    const updatedUser = await User.findByIdAndUpdate(_id, {
        name,
        phone,
        email,
    }, {
        new: true,
        runValidators: true
    })
    .select('-password'); // Remove password to response
    if (!updatedUser) {
        throw new Error('Failed finding user to update with _id: ' + _id);
    }
    return updatedUser;
};

const updateUserById = async (_id, email, name, phone, role) => {
    if (!_id) {
        throw new Error('Do not have _id');
    }
    const updatedUser = await User.findByIdAndUpdate(_id, {
        name,
        phone,
        email,
        role,
    }, {
        new: true,
        runValidators: true
    })
    .select('-password'); // Remove password to response
    if (!updatedUser) {
        throw new Error('Failed finding user to update with _id: ' + _id);
    }
    return updatedUser;
};

const updatePassword = async (_id, oldPassword, newPassword) => {
    if (!_id) {
        throw new Error('Do not have _id')
    }
    const user = await User.findById(_id);
    if(!user) {
        throw new Error('User not found');
    }

    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
        throw new Error('Old password does not match');
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    await user.save();

    return {
        message: 'Password updated successfully'
    };
};

const deleteUser = async (_id) => {
    if (!_id) {
        throw new Error('Do not have _id');
    }
    const user = await User.findByIdAndUpdate(
        _id,
        { active: false },
        { new: true }
    );
    if (!user) {
        throw new Error('Failed to delete user with _id: ' + _id);
    }
    return { message: 'User deleted successfully'};
};

export default {
    getUserById,
    getAllUsers,
    updateUser,
    updatePassword,
    deleteUser,
    createUser,
    updateUserById,
};