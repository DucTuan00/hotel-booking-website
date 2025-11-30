import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { App as CapacitorApp } from '@capacitor/app';
import api from '@/services/api';

const DeepLinkHandler: React.FC = () => {
    const navigate = useNavigate();

    /**
     * Verify payment result from deep link and update booking
     * Parse all payment params and send to backend for verification
     */
    const verifyPaymentFromDeepLink = useCallback(async (url: URL, gateway: string) => {
        try {
            console.log(`Verifying ${gateway} payment from deep link...`);

            // Extract all params from deep link URL
            const params = new URLSearchParams(url.search);
            const bookingId = params.get('bookingId');

            if (!bookingId) {
                throw new Error('Missing bookingId in deep link');
            }

            // Convert URLSearchParams to object for API call
            const paymentParams: Record<string, string> = {};
            params.forEach((value, key) => {
                paymentParams[key] = value;
            });

            console.log('Sending payment params to backend for verification...');

            // Call backend API to verify signature and update booking
            const endpoint = gateway === 'vnpay'
                ? '/vnpay/verify-and-update'
                : '/momo/verify-and-update';

            const response = await api.post(endpoint, paymentParams);

            console.log('Payment verified:', response.data);

            // Navigate to complete page with success
            if (response.data.success) {
                navigate(`/booking/complete?success=true&bookingId=${bookingId}`);
            } else {
                navigate(`/booking/complete?success=false&message=${encodeURIComponent(response.data.message || 'Thanh toán thất bại')}&bookingId=${bookingId}`);
            }
        } catch (error: any) {
            console.error('Error verifying payment:', error);

            const errorMessage = error.response?.data?.message || error.message || 'Lỗi xác thực thanh toán';
            const bookingId = new URLSearchParams(url.search).get('bookingId');

            navigate(`/booking/complete?success=false&message=${encodeURIComponent(errorMessage)}&bookingId=${bookingId || ''}`);
        }
    }, [navigate]);

    useEffect(() => {
        let listenerHandle: any;

        // Listen for app URL open (deep link)
        const setupListener = async () => {
            listenerHandle = await CapacitorApp.addListener('appUrlOpen', (event) => {
                console.log('Deep link opened:', event.url);

                try {
                    // Parse URL: hotelboutique://payment-result?bookingId=xxx&gateway=vnpay&vnp_...
                    const url = new URL(event.url);

                    if (url.hostname === 'payment-result') {
                        const params = new URLSearchParams(url.search);
                        const gateway = params.get('gateway');

                        if (gateway === 'vnpay' || gateway === 'momo') {
                            // Show loading state
                            navigate('/booking/complete?loading=true');

                            // Verify payment and update booking
                            verifyPaymentFromDeepLink(url, gateway);
                        } else {
                            // Unknown gateway
                            navigate('/booking/complete?success=false&message=' + encodeURIComponent('Gateway không hợp lệ'));
                        }
                    }
                } catch (error) {
                    console.error('Error parsing deep link:', error);
                    navigate('/booking/complete?success=false&message=' + encodeURIComponent('Lỗi xử lý deep link'));
                }
            });
        };

        setupListener();

        return () => {
            if (listenerHandle) {
                listenerHandle.remove();
            }
        };
    }, [navigate, verifyPaymentFromDeepLink]);

    return null;
};

export default DeepLinkHandler;
