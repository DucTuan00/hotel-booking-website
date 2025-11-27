import crypto from 'crypto';
import https from 'https';
import { momoConfig } from '@/config/momo';
import { MomoPaymentRequest, MomoPaymentResponse } from '@/types/momo';

const generateSignature = (rawSignature: string): string => {
    return crypto
        .createHmac('sha256', momoConfig.secretKey)
        .update(rawSignature)
        .digest('hex');
};

export async function createPayment(paymentData: MomoPaymentRequest): Promise<MomoPaymentResponse> {
    const { amount, orderInfo, extraData = '' } = paymentData;

    // Generate unique IDs
    const orderId = momoConfig.partnerCode + new Date().getTime();
    const requestId = orderId;

    // Create raw signature string
    const rawSignature = `accessKey=${momoConfig.accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${momoConfig.ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${momoConfig.partnerCode}&redirectUrl=${momoConfig.redirectUrl}&requestId=${requestId}&requestType=${momoConfig.requestType}`;

    // Generate signature
    const signature = generateSignature(rawSignature);

    // Create request body
    const requestBody = JSON.stringify({
        partnerCode: momoConfig.partnerCode,
        partnerName: momoConfig.partnerName,
        storeId: momoConfig.storeId,
        requestId,
        amount,
        orderId,
        orderInfo,
        redirectUrl: momoConfig.redirectUrl,
        ipnUrl: momoConfig.ipnUrl,
        lang: momoConfig.lang,
        requestType: momoConfig.requestType,
        autoCapture: momoConfig.autoCapture,
        extraData,
        orderGroupId: '',
        signature
    });

    // Make HTTPS request to MoMo
    return new Promise((resolve, reject) => {
        const options = {
            hostname: momoConfig.apiEndpoint.replace('https://', ''),
            port: momoConfig.apiPort,
            path: momoConfig.apiPath,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(requestBody)
            }
        };

        const req = https.request(options, (res) => {

            let data = '';

            res.setEncoding('utf8');
            res.on('data', (chunk) => {
                data += chunk;
                console.log('Body chunk: ', chunk);
            });

            res.on('end', () => {
                console.log('No more data in response.');
                try {
                    const response = JSON.parse(data);

                    if (response.resultCode === 0) {
                        resolve(response);
                    } else {
                        reject(new Error(response.message || 'MoMo payment failed'));
                    }
                } catch (error) {
                    reject(error);
                }
            });
        });

        req.on('error', (error) => {
            console.log(`Problem with request: ${error.message}`);
            reject(error);
        });

        console.log('Sending....');
        req.write(requestBody);
        req.end();
    });
};

export function verifySignature(data: Record<string, any>): boolean {
    const {
        partnerCode,
        orderId,
        requestId,
        amount,
        orderInfo,
        orderType,
        transId,
        resultCode,
        message,
        payType,
        responseTime,
        extraData,
        signature
    } = data;

    const rawSignature = `accessKey=${momoConfig.accessKey}&amount=${amount}&extraData=${extraData}&message=${message}&orderId=${orderId}&orderInfo=${orderInfo}&orderType=${orderType}&partnerCode=${partnerCode}&payType=${payType}&requestId=${requestId}&responseTime=${responseTime}&resultCode=${resultCode}&transId=${transId}`;

    const calculatedSignature = generateSignature(rawSignature);

    return signature === calculatedSignature;
};
