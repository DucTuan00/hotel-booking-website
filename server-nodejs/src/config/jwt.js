const secret = process.env.JWT_SECRET;
const accessExpire = process.env.JWT_ACCESS_EXPIRE;
const refreshExpire = process.env.JWT_REFRESH_EXPIRE;

export default {
    secret,
    accessExpire,
    refreshExpire
}