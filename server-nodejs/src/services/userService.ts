import User from '@/models/User';
import bcrypt from 'bcryptjs';
import ApiError from '@/utils/apiError';

interface InputCreateUser {
    email: string;
    password: string;
    name: string;
    phone: string;
    role: string;
}

interface InputUpdateUser {
    _id: string;
    email?: string;
    name?: string;
    phone?: string;
    role?: string;
}

interface InputUpdatePassword {
    _id: string;
    oldPassword: string;
    newPassword: string;
}

interface UserIdInput {
    _id: string;
}

interface GetAllUsersInput {
    filter?: Record<string, any>;
    page?: number;
    pageSize?: number;
}

const getUserById = async (arg: UserIdInput) => {
    const { _id } = arg;

    if (!_id) {
        throw new Error('Do not have _id');
    }
    const user = await User.findOne({ _id, active: true }, { _id: 0, password: 0 });
    if (!user) {
        throw new Error('Failed finding user with _id: ' + _id);
    }
    return user;
};

const getAllUsers = async (args: GetAllUsersInput) => {
    const { filter = {}, page = 1, pageSize = 10 } = args;

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
    const { _id, email, name, phone } = data;
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

const updateUserById = async (data: InputUpdateUser) => {
    const { _id, email, name, phone, role } = data;
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

const updatePassword = async (data: InputUpdatePassword) => {
    const { _id, oldPassword, newPassword } = data;
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

const deleteUser = async (_id: string) => {
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