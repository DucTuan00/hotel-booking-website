export const momoConfig = {
    accessKey: process.env.MOMO_ACCESS_KEY || '',
    secretKey: process.env.MOMO_SECRET_KEY || '',
    partnerCode: 'MOMO',
    partnerName: 'Test',
    storeId: 'MomoTestStore',
    redirectUrl: process.env.MOMO_REDIRECT_URL,
    ipnUrl: process.env.MOMO_IPN_URL,
    requestType: 'payWithMethod',
    lang: 'vi',
    autoCapture: true,
    apiEndpoint: 'https://test-payment.momo.vn',
    apiPath: '/v2/gateway/api/create',
    apiPort: 443
};
