const secret = process.env.JWT_SECRET;
const accessExpire = process.env.JWT_ACCESS_EXPIRE;
const refreshExpire = process.env.JWT_REFRESH_EXPIRE;

if (!secret) {
    throw new Error('JWT_SECRET environment variable is not set.');
}

if (!accessExpire) {
    throw new Error('JWT_ACCESS_EXPIRE environment variable is not set.');
}

if (!refreshExpire) {
    throw new Error('JWT_REFRESH_EXPIRE environment variable is not set.');
}

export default {
    secret: secret as string,
    accessExpire: accessExpire as string,
    refreshExpire: refreshExpire as string
};
