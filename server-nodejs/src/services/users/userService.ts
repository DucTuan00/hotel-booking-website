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

export async function getUserById(arg: UserIdInput) {
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

export async function getAllUsers(args: GetAllUsersInput) {
    const { search, role, sortBy, sortOrder, page = 1, pageSize = 10, excludeCurrentUser, currentUserId } = args;

    const buildQuery = () => {
        let query: any = { active: true };

        if (search) {
            query.$or = [
                { name: new RegExp(search, 'i') },
                { email: new RegExp(search, 'i') },
                { phone: new RegExp(search, 'i') }
            ];
        }

        if (role) {
            query.role = role;
        }

        // Query to exclude current user
        if (excludeCurrentUser && currentUserId) {
            query._id = { $ne: currentUserId };
        }

        return query;
    };

    // Build sort object
    const buildSort = (): Record<string, 1 | -1> => {
        if (!sortBy || !sortOrder) {
            return { createdAt: -1 };
        }

        const order = sortOrder === 'asc' ? 1 : -1;
        return { [sortBy]: order };
    };

    const queryConditions = buildQuery();
    const sortConditions = buildSort();
    const skip = (page - 1) * pageSize;

    const [users, totalUsers] = await Promise.all([
        User.find(queryConditions).select('-password').sort(sortConditions).skip(skip).limit(pageSize),
        User.countDocuments(queryConditions)
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

export async function createUser(data: InputCreateUser) {
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

export async function updateUser(data: InputUpdateUser) {
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

export async function updateUserById(data: InputUpdateUser) {
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

export async function updatePassword(data: InputUpdatePassword) {
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

export async function deleteUser(id: string) {
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