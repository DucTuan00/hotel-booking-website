import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { App as CapacitorApp } from '@capacitor/app';
import api from '@/services/api';

const DeepLinkHandler: React.FC = () => {
    const navigate = useNavigate();

    /**
     * Verify payment result from deep link and update booking
     * Deep link now contains ALL payment gateway params for signature verification
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

            console.log('Sending payment params to backend for verification:', paymentParams);

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

            // Fallback: Check if booking was already updated by backend return handler
            const bookingId = new URLSearchParams(url.search).get('bookingId');
            
            // Try to get booking status as fallback
            try {
                if (bookingId) {
                    const bookingResponse = await api.get(`/booking/${bookingId}`);
                    if (bookingResponse.data?.data?.paymentStatus === 'paid') {
                        console.log('Fallback: Booking already paid, redirecting to success');
                        navigate(`/booking/complete?success=true&bookingId=${bookingId}`);
                        return;
                    }
                }
            } catch (fallbackError) {
                console.error('Fallback check failed:', fallbackError);
            }

            const errorMessage = error.response?.data?.message || error.message || 'Lỗi xác thực thanh toán';
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
                    // Parse URL: hotelboutique://payment-result?gateway=vnpay&bookingId=xxx&vnp_...
                    const url = new URL(event.url);

                    if (url.hostname === 'payment-result') {
                        const params = new URLSearchParams(url.search);
                        const gateway = params.get('gateway');

                        if (gateway === 'vnpay' || gateway === 'momo') {
                            // Show loading state while verifying
                            navigate('/booking/complete?loading=true');

                            // Verify payment signature and update booking
                            verifyPaymentFromDeepLink(url, gateway);
                        } else {
                            // Unknown or missing gateway - fallback to simple params
                            const success = params.get('success');
                            const message = params.get('message');
                            const bookingId = params.get('bookingId');

                            console.log('No gateway specified, using simple params:', { success, message, bookingId });

                            if (success === 'true') {
                                navigate(`/booking/complete?success=true&bookingId=${bookingId || ''}`);
                            } else {
                                navigate(`/booking/complete?success=false&message=${encodeURIComponent(message || 'Thanh toán thất bại')}&bookingId=${bookingId || ''}`);
                            }
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
