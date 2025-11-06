import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';
import { COLORS, TYPOGRAPHY } from '@/config/constants';

const BookingComplete: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-start justify-center py-8">
            <style>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px) blur(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) blur(0);
                    }
                }
                .fade-in-up {
                    animation: fadeInUp 1.5s ease-out forwards;
                }
            `}</style>
            <div 
                className={`max-w-2xl w-full px-4 fade-in-up`}
            >
                <div className=" overflow-hidden">

                    {/* Content */}
                    <div className="px-6 sm:px-8 py-12 sm:py-16 text-center">
                        {/* Icon */}
                        <div className="mb-8 flex justify-center">
                            <div 
                                className="rounded-full p-6"
                                style={{ backgroundColor: `${COLORS.primary}15` }}
                            >
                                <CheckCircleOutlined 
                                    style={{
                                        fontSize: '64px',
                                        color: COLORS.primary
                                    }}
                                />
                            </div>
                        </div>

                        {/* Main heading */}
                        <h1 
                            className="text-3xl sm:text-4xl font-bold mb-4"
                            style={{
                                fontFamily: TYPOGRAPHY.fontFamily.primary,
                                color: COLORS.primary
                            }}
                        >
                            Cảm ơn đã đặt phòng!
                        </h1>

                        {/* Description */}
                        <div className="mb-8 space-y-4">
                            <p className="text-lg text-gray-600">
                                Chúng tôi đã nhận được yêu cầu đặt phòng của bạn
                            </p>
                        </div>

                        {/* Action buttons */}
                        <div className="space-y-3 sm:space-y-0 sm:space-x-4 flex flex-col sm:flex-row justify-center gap-4">
                            <Button
                                type="primary"
                                size="large"
                                onClick={() => navigate('/dashboard/bookings')}
                                style={{
                                    backgroundColor: COLORS.primary,
                                    borderColor: COLORS.primary,
                                    height: '48px',
                                    fontSize: '16px',
                                    fontWeight: 600,
                                    minWidth: '200px'
                                }}
                            >
                                Xem đơn đặt phòng
                            </Button>
                            <Button
                                size="large"
                                onClick={() => navigate('/')}
                                style={{
                                    height: '48px',
                                    fontSize: '16px',
                                    fontWeight: 600,
                                    minWidth: '200px'
                                }}
                            >
                                Về trang chủ
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Additional support info */}
                <div className="mt-2 text-center text-gray-500 text-sm">
                    <p>
                        Nếu có thắc mắc, vui lòng liên hệ với chúng tôi qua email admin@lionhotel.com
                    </p>
                </div>
            </div>
        </div>
    );
};

export default BookingComplete;
