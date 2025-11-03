import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Form, Spin } from 'antd';
import dayjs from 'dayjs';
import { COLORS, TYPOGRAPHY } from '@/config/constants';
import roomService from '@/services/rooms/roomService';
import bookingService from '@/services/bookings/bookingService';
import userService from '@/services/users/userService';
import celebrateItemService from '@/services/celebrations/celebrateItemService';
import Notification from '@/components/Notification';
import { Message } from '@/types/message';
import { Room } from '@/types/room';
import { PaymentMethod, PreviewPriceResponse } from '@/types/booking';
import { User } from '@/types/user';
import { CelebrateItem } from '@/types/celebrate';
import GuestInfoForm from '@/pages/user/Booking/components/GuestInfoForm';
import PaymentMethodForm from '@/pages/user/Booking/components/PaymentMethodForm';
import BookingSummary from '@/pages/user/Booking/components/BookingSummary';
import CelebrationItemsForm from '@/pages/user/Booking/components/CelebrationItemsForm';

const Booking: React.FC = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [room, setRoom] = useState<Room | null>(null);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [pricePreview, setPricePreview] = useState<PreviewPriceResponse | null>(null);
    const [message, setMessage] = useState<Message | null>(null);
    const [celebrateItems, setCelebrateItems] = useState<CelebrateItem[]>([]);
    const [selectedCelebrateIds, setSelectedCelebrateIds] = useState<string[]>([]);
    
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
                paymentMethod: PaymentMethod.ONSITE
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
            const celebrateItemsData = selectedCelebrateIds.length > 0 
                ? selectedCelebrateIds.map(id => {
                    const item = celebrateItems.find(c => c.id === id);
                    return {
                        celebrateItemId: id,
                        quantity: 1,
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
                paymentMethod: values.paymentMethod,
                ...(celebrateItemsData && { celebrateItems: celebrateItemsData })
            };

            console.log('Submitting booking data:', bookingData);

            await bookingService.createBooking(bookingData);

            setMessage({
                type: 'success',
                text: 'Đặt phòng thành công! Chúng tôi sẽ liên hệ với bạn sớm nhất.'
            });

            setTimeout(() => {
                navigate('/');
            }, 2000);
        } catch (error: any) {
            console.error('Error creating booking:', error);
            const errorMessage = error?.response?.data?.message || 'Có lỗi xảy ra khi đặt phòng. Vui lòng thử lại.';
            setMessage({
                type: 'error',
                text: errorMessage
            });
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
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-xl font-semibold mb-6">Thông tin đặt phòng</h2>

                            <Form
                                form={form}
                                layout="vertical"
                                onFinish={handleSubmit}
                            >
                                {/* Guest Information */}
                                <GuestInfoForm />

                                {/* Celebration Items */}
                                <CelebrationItemsForm
                                    items={celebrateItems}
                                    selectedIds={selectedCelebrateIds}
                                    onSelectionChange={setSelectedCelebrateIds}
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
                            selectedCelebrations={celebrateItems.filter(item => selectedCelebrateIds.includes(item.id))}
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
