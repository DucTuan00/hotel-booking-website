import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';

const getUserById = async (_id) => {
    try {
        if (!_id) {
            throw new Error('Do not have _id');
        }
        const user = await User.findOne({ _id, active: true }, { _id: 0, password: 0 });
        if (!user) {
            throw new Error('Failed finding user with _id: ' + _id);
        }
        return user;
    } catch (error) {
        console.error(error);
        throw new Error(error.message || 'Can not get user');
    }
};

const getAllUsers = async () => {
    try {
        const users = await User.find({ active: true }, { password: 0 });
        
        if (!users) {
            throw new Error('Failed finding all users');
        }
        return users;
    } catch (error) {
        console.error(error);
        throw new Error(error.message || 'Can not get all users');
    }
};

const updateUser = async (_id, email, name, phone) => {
    try {
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
    } catch (error) {
        console.error(error);
        throw new Error(error.message || 'Can not update user');
    }
};

const updatePassword = async (_id, oldPassword, newPassword) => {
    try {
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
    } catch (error) {
        console.error(error);
        throw new Error(error.message || 'Can not update password');
    }
};

const deleteUser = async (_id) => {
    try {
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
    } catch (error) {
        console.error(error);
        throw new Error(error.message || 'Can not delete user');
    }
};

export default {
    getUserById,
    getAllUsers,
    updateUser,
    updatePassword,
    deleteUser,
};