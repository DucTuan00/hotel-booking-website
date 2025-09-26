import User from '@/models/User';
import bcrypt from 'bcryptjs';
import ApiError from '@/utils/apiError';
import { mapId, mapIds } from '@/utils/mapId';
import {
    UserIdInput,
    GetAllUsersInput,
    InputCreateUser,
    InputUpdateUser,
    InputUpdatePassword
} from '@/types/user';

const getUserById = async (arg: UserIdInput) => {
    const { id } = arg;

    if (!id) {
        throw new Error('Do not have id');
    }
    const user = await User.findOne({ _id: id, active: true }, { password: 0 });
    if (!user) {
        throw new Error('Failed finding user with id: ' + id);
    }
    return mapId(user);
};

const getAllUsers = async (args: GetAllUsersInput) => {
    const { filter = {}, page = 1, pageSize = 10 } = args;

    const buildQuery = () => {
        let query = User.find({ active: true });

        if (filter.search) {
            query = query.or([
                { name: new RegExp(filter.search, 'i') }, // 'i' for case-insensitive
                { email: new RegExp(filter.search, 'i') },
                { phone: new RegExp(filter.search, 'i') }
            ]);
        }

        return query;
    };

    const skip = (page - 1) * pageSize;
    const [users, totalUsers] = await Promise.all([
        buildQuery().select('-password').skip(skip).limit(pageSize),
        buildQuery().countDocuments()
    ]);
    
    if (!users) {
        throw new Error('Failed finding all users');
    }
    
    return {
        users: mapIds(users),
        total: totalUsers,
        currentPage: page,
        pageSize: pageSize
    };
};

const createUser = async (data: InputCreateUser) => {
    const { email, password, name, phone, role } = data;
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

const updateUser = async (data: InputUpdateUser) => {
    const { id, email, name, phone } = data;
    if (!id) {
        throw new Error('Do not have id');
    }
    const updatedUser = await User.findByIdAndUpdate(id, {
        name,
        phone,
        email,
    }, {
        new: true,
        runValidators: true
    })
    .select('-password'); // Remove password to response
    if (!updatedUser) {
        throw new Error('Failed finding user to update with _id: ' + id);
    }
    return mapId(updatedUser);
};

const updateUserById = async (data: InputUpdateUser) => {
    const { id, email, name, phone, role } = data;
    if (!id) {
        throw new Error('Do not have id');
    }
    const updatedUser = await User.findByIdAndUpdate(id, {
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
        throw new Error('Failed finding user to update with _id: ' + id);
    }
    return mapId(updatedUser);
};

const updatePassword = async (data: InputUpdatePassword) => {
    const { id, oldPassword, newPassword } = data;
    if (!id) {
        throw new Error('Do not have id')
    }
    const user = await User.findById(id);
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

const deleteUser = async (id: string) => {
    if (!id) {
        throw new Error('Do not have id');
    }
    const user = await User.findByIdAndUpdate(
        id,
        { active: false },
        { new: true }
    );
    if (!user) {
        throw new Error('Failed to delete user with id: ' + id);
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