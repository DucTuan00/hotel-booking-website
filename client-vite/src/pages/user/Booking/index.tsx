import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Form, Spin } from 'antd';
import dayjs from 'dayjs';
import { COLORS, TYPOGRAPHY } from '@/config/constants';
import roomService from '@/services/rooms/roomService';
import bookingService from '@/services/bookings/bookingService';
import userService from '@/services/users/userService';
import celebrateItemService from '@/services/celebrations/celebrateItemService';
import { createVNPayPaymentUrl } from '@/services/payment/vnpayService';
import { createMoMoPaymentUrl } from '@/services/payment/momoService';
import Notification from '@/components/Notification';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Message } from '@/types/message';
import { Room } from '@/types/room';
import { PaymentMethod, PreviewPriceResponse } from '@/types/booking';
import { User } from '@/types/user';
import { CelebrateItem } from '@/types/celebrate';
import GuestInfoForm from '@/pages/user/Booking/components/GuestInfoForm';
import NoteForm from '@/pages/user/Booking/components/NoteForm';
import PaymentMethodForm from '@/pages/user/Booking/components/PaymentMethodForm';
import BookingSummary from '@/pages/user/Booking/components/BookingSummary';
import CelebrationItemsForm from '@/pages/user/Booking/components/CelebrationItemsForm';

const Booking: React.FC = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [room, setRoom] = useState<Room | null>(null);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [pricePreview, setPricePreview] = useState<PreviewPriceResponse | null>(null);
    const [message, setMessage] = useState<Message | null>(null);
    const [celebrateItems, setCelebrateItems] = useState<CelebrateItem[]>([]);
    const [selectedCelebrateItems, setSelectedCelebrateItems] = useState<Map<string, number>>(new Map());
    
    const roomId = searchParams.get('roomId');
    const checkIn = searchParams.get('checkIn');
    const checkOut = searchParams.get('checkOut');
    const quantity = parseInt(searchParams.get('quantity') || '1');
    const adults = parseInt(searchParams.get('adults') || '2');
    const children = parseInt(searchParams.get('children') || '0');

    useEffect(() => {
        if (!roomId || !checkIn || !checkOut) {
            setMessage({
                type: 'error',
                text: 'Thiếu thông tin đặt phòng. Vui lòng chọn lại.'
            });
            setTimeout(() => navigate('/rooms'), 2000);
            return;
        }

        loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [roomId, checkIn, checkOut]);

    const loadData = async () => {
        if (!roomId || !checkIn || !checkOut) return;

        setLoading(true);
        try {
            // Load user data
            try {
                const userData = await userService.getUserInfo();
                setCurrentUser(userData);
                
                // Pre-fill form with user data
                form.setFieldsValue({
                    firstName: userData.name?.split(' ')[0] || '',
                    lastName: userData.name?.split(' ').slice(1).join(' ') || '',
                    email: userData.email,
                    phoneNumber: userData.phone || '',
                });
            } catch {
                // User not logged in, that's okay
                console.log('User not logged in');
            }

            // Load room data
            const roomData = await roomService.getRoomById(roomId);
            setRoom(roomData);

            // Load celebration items
            const celebrateData = await celebrateItemService.getAllCelebrateItems();
            setCelebrateItems(celebrateData.items);

            // Load price preview - Format dates to YYYY-MM-DD
            const formattedCheckIn = dayjs(checkIn).format('YYYY-MM-DD');
            const formattedCheckOut = dayjs(checkOut).format('YYYY-MM-DD');
            
            const preview = await bookingService.previewBookingPrice({
                roomId,
                checkIn: formattedCheckIn,
                checkOut: formattedCheckOut,
                quantity
            });
            setPricePreview(preview);

            // Set initial form values with URL params
            form.setFieldsValue({
                paymentMethod: PaymentMethod.ONSITE,
                paymentGateway: 'vnpay'
            });
        } catch (error) {
            console.error('Error loading booking data:', error);
            setMessage({
                type: 'error',
                text: 'Không thể tải thông tin đặt phòng. Vui lòng thử lại.'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (values: any) => {
        if (!roomId || !checkIn || !checkOut) return;

        setSubmitting(true);
        try {
            // Get or create user ID (for guest booking, we could use a placeholder)
            const userId = currentUser?.id || 'guest'; // You might want to handle guest differently

            // Format dates to YYYY-MM-DD before sending to API
            const formattedCheckIn = dayjs(checkIn).format('YYYY-MM-DD');
            const formattedCheckOut = dayjs(checkOut).format('YYYY-MM-DD');

            // Prepare celebration items if any selected
            const celebrateItemsData = selectedCelebrateItems.size > 0 
                ? Array.from(selectedCelebrateItems.entries()).map(([id, quantity]) => {
                    const item = celebrateItems.find(c => c.id === id);
                    return {
                        celebrateItemId: id,
                        quantity: quantity,
                        price: item?.price || 0
                    };
                })
                : undefined;

            const bookingData = {
                userId,
                roomId,
                checkIn: formattedCheckIn,
                checkOut: formattedCheckOut,
                guests: {
                    adults: adults,
                    children: children
                },
                quantity: quantity,
                firstName: values.firstName,
                lastName: values.lastName,
                email: values.email,
                phoneNumber: values.phoneNumber,
                note: values.note,
                paymentMethod: values.paymentMethod,
                ...(celebrateItemsData && { celebrateItems: celebrateItemsData })
            };

            console.log('Submitting booking data:', bookingData);

            // Create booking
            const booking = await bookingService.createBooking(bookingData);

            setIsProcessing(true);

            // Check payment method
            if (values.paymentMethod === PaymentMethod.ONLINE) {
                // Redirect to payment gateway
                try {
                    const paymentGateway = values.paymentGateway || 'vnpay';
                    
                    if (paymentGateway === 'vnpay') {
                        const paymentResponse = await createVNPayPaymentUrl({
                            bookingId: booking.id,
                            locale: 'vn'
                        });

                        // Redirect to VNPay
                        window.location.href = paymentResponse.data.paymentUrl;
                    } else if (paymentGateway === 'momo') {
                        const paymentResponse = await createMoMoPaymentUrl({
                            bookingId: booking.id,
                        });

                        // Redirect to MoMo
                        window.location.href = paymentResponse.data.payUrl;
                    } else {
                        setMessage({
                            type: 'error',
                            text: 'Cổng thanh toán này chưa được hỗ trợ.'
                        });
                        setIsProcessing(false);
                    }
                } catch (paymentError: any) {
                    console.error('Error creating payment URL:', paymentError);
                    setMessage({
                        type: 'error',
                        text: 'Không thể tạo link thanh toán. Vui lòng thử lại.'
                    });
                    setIsProcessing(false);
                }
            } else {
                // Onsite payment - redirect to complete page
                await new Promise(resolve => setTimeout(resolve, 2000));
                navigate('/booking/complete');
            }
        } catch (error: any) {
            console.error('Error creating booking:', error);
            const errorMessage = error?.response?.data?.message || 'Có lỗi xảy ra khi đặt phòng. Vui lòng thử lại.';
            setMessage({
                type: 'error',
                text: errorMessage
            });
            setIsProcessing(false);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Spin size="large" />
            </div>
        );
    }

    if (isProcessing) {
        return (
            <LoadingSpinner 
                message="Đang xử lý đơn đặt phòng của bạn..." 
                size="large"
                style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.98)',
                    backdropFilter: 'blur(10px)'
                }}
            />
        );
    }

    if (!room || !pricePreview || !checkIn || !checkOut) {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen">
                <Notification message={message} onClose={() => setMessage(null)} />
                <p className="text-gray-600">Không tìm thấy thông tin đặt phòng</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <Notification message={message} onClose={() => setMessage(null)} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 
                        className="text-3xl md:text-4xl font-bold mb-2"
                        style={{ 
                            fontFamily: TYPOGRAPHY.fontFamily.primary,
                            color: COLORS.primary 
                        }}
                    >
                        ĐẶT PHÒNG
                    </h1>
                    <div className="w-24 h-1 bg-[#D4902A] mx-auto"></div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left column - Booking Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white p-6 border border-gray-200 rounded-lg">
                            <Form
                                form={form}
                                layout="vertical"
                                onFinish={handleSubmit}
                            >
                                {/* Guest Information */}
                                <GuestInfoForm />

                                {/* Note */}
                                <NoteForm />

                                {/* Celebration Items */}
                                <CelebrationItemsForm
                                    items={celebrateItems}
                                    selectedItems={selectedCelebrateItems}
                                    onSelectionChange={setSelectedCelebrateItems}
                                />

                                {/* Payment Method */}
                                <PaymentMethodForm />
                            </Form>
                        </div>
                    </div>

                    {/* Right column - Booking Summary */}
                    <div className="lg:col-span-1">
                        <BookingSummary 
                            room={room}
                            checkIn={checkIn}
                            checkOut={checkOut}
                            pricePreview={pricePreview}
                            quantity={quantity}
                            adults={adults}
                            children={children}
                            selectedCelebrations={celebrateItems.filter(item => selectedCelebrateItems.has(item.id))}
                            selectedCelebrationQuantities={selectedCelebrateItems}
                            onSubmit={() => form.submit()}
                            submitting={submitting}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Booking;
