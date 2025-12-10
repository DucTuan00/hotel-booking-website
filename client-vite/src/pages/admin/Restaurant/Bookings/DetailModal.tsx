import React from 'react';
import { Modal } from 'antd';
import { RestaurantBooking } from '@/types/restaurant';
import BaseDetailRow from '@/components/BaseDetail';
import moment from 'moment';

interface RestaurantBookingDetailModalProps {
    visible: boolean;
    onCancel: () => void;
    booking: RestaurantBooking | null;
}

const RestaurantBookingDetailModal: React.FC<RestaurantBookingDetailModalProps> = ({
    visible,
    onCancel,
    booking
}) => {
    if (!booking) return null;

    return (
        <Modal
            title={null}
            open={visible}
            onCancel={onCancel}
            footer={null}
            width={700}
            destroyOnClose
            styles={{
                body: {
                    maxHeight: 'calc(90vh - 110px)',
                    overflowY: 'auto',
                }
            }}
            style={{
                top: 50
            }}
        >
            <div className="space-y-6">
                <p className="text-xl font-semibold mb-4 break-words">
                    Chi tiết đặt bàn {booking.id}
                </p>
                {/* Thông tin khách hàng */}
                <div>
                    <p className="text-base font-semibold mb-3 text-gray-700">
                        Thông tin khách hàng
                    </p>
                    <div className="border border-gray-200 rounded overflow-hidden">
                        <BaseDetailRow 
                            label="Họ và tên" 
                            value={<span className="font-semibold">{booking.fullName}</span>}
                        />
                        <BaseDetailRow 
                            label="Số điện thoại" 
                            value={booking.phone}
                        />
                    </div>
                </div>

                {/* Thông tin đặt bàn */}
                <div>
                    <p className="text-base font-semibold mb-3 text-gray-700">
                        Thông tin đặt bàn
                    </p>
                    <div className="border border-gray-200 rounded overflow-hidden">
                        <BaseDetailRow 
                            label="Ngày đặt" 
                            value={moment(booking.bookingDate).format('DD/MM/YYYY')}
                        />
                        <BaseDetailRow 
                            label="Nội dung yêu cầu" 
                            value={
                                booking.content ? (
                                    <div className="whitespace-pre-wrap">{booking.content}</div>
                                ) : (
                                    <span className="text-gray-400 italic">Không có yêu cầu đặc biệt</span>
                                )
                            }
                        />
                        <BaseDetailRow 
                            label="Ngày tạo đơn" 
                            value={moment(booking.createdAt).format('DD/MM/YYYY HH:mm')}
                        />
                        <BaseDetailRow 
                            label="Cập nhật lần cuối" 
                            value={moment(booking.updatedAt).format('DD/MM/YYYY HH:mm')}
                        />
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default RestaurantBookingDetailModal;
