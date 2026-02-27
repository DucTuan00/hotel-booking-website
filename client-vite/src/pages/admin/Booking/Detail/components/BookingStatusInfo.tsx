import React, { useState } from 'react';
import { Alert, Select, Button, Modal, Input, Space } from 'antd';
import { ExclamationCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
import BaseDetailRow from '@/components/BaseDetail';
import DetailSection from '@/pages/admin/Booking/Detail/components/DetailSection';
import { Booking, BookingStatus } from '@/types/booking';
import { calculateCancellationFee } from '@/utils/cancellationHelper';
import { formatPrice } from '@/utils/formatPrice';

const { TextArea } = Input;

interface BookingStatusInfoProps {
    booking: Booking;
    status?: BookingStatus;
    onStatusChange?: (status: BookingStatus) => void;
    onCancel?: (cancellationReason: string) => Promise<void>;
}

const getStatusText = (status: BookingStatus) => {
    switch (status) {
        case BookingStatus.CONFIRMED:
            return 'Đã xác nhận';
        case BookingStatus.PENDING:
            return 'Chờ xác nhận';
        case BookingStatus.REJECTED:
            return 'Đã từ chối';
        case BookingStatus.CANCELLED:
            return 'Đã hủy';
        case BookingStatus.CHECKED_IN:
            return 'Đã check-in';
        case BookingStatus.CHECKED_OUT:
            return 'Đã check-out';
        default:
            return status;
    }
};

const BookingStatusInfo: React.FC<BookingStatusInfoProps> = ({ booking, status, onStatusChange, onCancel }) => {
    const displayStatus = status || booking.status;
    const [isCancelModalVisible, setIsCancelModalVisible] = useState(false);
    const [cancellationReason, setCancellationReason] = useState('');
    const [submitting, setSubmitting] = useState(false);

    // Lấy các trạng thái có thể chuyển đến từ trạng thái hiện tại
    const getAvailableStatusTransitions = (): BookingStatus[] => {
        switch (booking.status) {
            case BookingStatus.PENDING:
                return [BookingStatus.PENDING, BookingStatus.CONFIRMED, BookingStatus.REJECTED];
            case BookingStatus.CONFIRMED:
                return [BookingStatus.CONFIRMED, BookingStatus.CHECKED_IN, BookingStatus.REJECTED];
            case BookingStatus.CHECKED_IN:
                return [BookingStatus.CHECKED_IN, BookingStatus.CHECKED_OUT];
            case BookingStatus.CHECKED_OUT:
            case BookingStatus.CANCELLED:
            case BookingStatus.REJECTED:
                // Các trạng thái cuối cùng không thể thay đổi
                return [booking.status];
            default:
                return [booking.status];
        }
    };

    const handleStatusChange = (newStatus: BookingStatus) => {
        if (onStatusChange) {
            onStatusChange(newStatus);
        }
    };

    const handleCancelClick = () => {
        const cancellationInfo = calculateCancellationFee(booking);
        
        if (!cancellationInfo.canCancel) {
            Modal.warning({
                title: 'Không thể hủy',
                content: cancellationInfo.reason,
                icon: <ExclamationCircleOutlined />,
            });
            return;
        }

        setIsCancelModalVisible(true);
    };

    const handleConfirmCancel = async () => {
        if (!onCancel) return;

        setSubmitting(true);
        try {
            await onCancel(cancellationReason);
            setIsCancelModalVisible(false);
            setCancellationReason('');
        } catch (error) {
            console.error('Error cancelling booking:', error);
        } finally {
            setSubmitting(false);
        }
    };

    const cancellationInfo = calculateCancellationFee(booking);
    
    // Check if booking is a deposit booking
    const isDepositBooking = booking.snapshot?.paymentOption?.type === 'deposit';

    // Check if current time is before check-in time (14:00)
    const checkInDateTime = new Date(booking.checkIn);
    checkInDateTime.setHours(14, 0, 0, 0);
    const now = new Date();
    const isBeforeCheckIn = now < checkInDateTime;
    
    const canShowCancelButton = !isDepositBooking &&
                                booking.status !== BookingStatus.CANCELLED && 
                                booking.status !== BookingStatus.REJECTED &&
                                booking.status !== BookingStatus.CHECKED_OUT &&
                                isBeforeCheckIn &&
                                onCancel;

    return (
        <>
            <DetailSection title="Trạng thái đặt phòng">
                <BaseDetailRow
                    label="Trạng thái hiện tại"
                    value={
                        <Space>
                            {onStatusChange ? (
                                <Select
                                    value={displayStatus}
                                    onChange={handleStatusChange}
                                    style={{ minWidth: '200px' }}
                                    disabled={getAvailableStatusTransitions().length === 1}
                                    options={getAvailableStatusTransitions().map((s) => ({
                                        value: s,
                                        label: getStatusText(s)
                                    }))}
                                />
                            ) : (
                                <>
                                    {getStatusText(displayStatus)}
                                </>
                            )}
                            {canShowCancelButton && (
                                <Button
                                    type="primary"
                                    danger
                                    size="small"
                                    icon={<CloseCircleOutlined />}
                                    onClick={handleCancelClick}
                                >
                                    Hủy đơn
                                </Button>
                            )}
                        </Space>
                    }
                />
            {booking.confirmedAt && (
                <BaseDetailRow
                    label="Ngày xác nhận"
                    value={moment(booking.confirmedAt).format('DD/MM/YYYY HH:mm')}
                />
            )}
            {booking.checkedInAt && (
                <BaseDetailRow
                    label="Ngày check-in"
                    value={moment(booking.checkedInAt).format('DD/MM/YYYY HH:mm')}
                />
            )}
            {booking.checkedOutAt && (
                <BaseDetailRow
                    label="Ngày check-out"
                    value={moment(booking.checkedOutAt).format('DD/MM/YYYY HH:mm')}
                />
            )}
            {booking.rejectedAt && (
                <BaseDetailRow
                    label="Ngày từ chối"
                    value={moment(booking.rejectedAt).format('DD/MM/YYYY HH:mm')}
                />
            )}
            {booking.cancelledAt && (
                <BaseDetailRow
                    label="Ngày hủy"
                    value={moment(booking.cancelledAt).format('DD/MM/YYYY HH:mm')}
                />
            )}
            {booking.cancellationReason && (
                <BaseDetailRow
                    label="Lý do hủy"
                    value={booking.cancellationReason}
                />
            )}
            <BaseDetailRow
                label="Ngày tạo"
                value={
                    booking.createdAt
                        ? moment(booking.createdAt).format('DD/MM/YYYY HH:mm')
                        : '-'
                }
            />
            <BaseDetailRow
                label="Cập nhật lần cuối"
                value={
                    booking.updatedAt
                        ? moment(booking.updatedAt).format('DD/MM/YYYY HH:mm')
                        : '-'
                }
            />
        </DetailSection>

        {/* Cancel Modal */}
        <Modal
            title="Xác nhận hủy đơn đặt phòng"
            open={isCancelModalVisible}
            onOk={handleConfirmCancel}
            onCancel={() => {
                setIsCancelModalVisible(false);
                setCancellationReason('');
            }}
            confirmLoading={submitting}
            okText="Xác nhận hủy"
            cancelText="Đóng"
            okButtonProps={{ danger: true }}
            width={600}
        >
            <div style={{ marginBottom: '20px' }}>
                <Alert
                    message="Thông tin phí hủy"
                    description={
                        <div>
                            <p>
                                <strong>Thời gian hủy:</strong>{' '}
                                {cancellationInfo.hoursBeforeCheckIn < 24
                                    ? `${Math.floor(cancellationInfo.hoursBeforeCheckIn)} giờ trước ngày nhận phòng`
                                    : `${cancellationInfo.daysBeforeCheckIn} ngày trước ngày nhận phòng`}
                            </p>
                            <p><strong>Phí hủy:</strong> {cancellationInfo.feePercentage}% = {formatPrice(cancellationInfo.fee)}</p>
                            <p><strong>Số tiền hoàn lại:</strong> {formatPrice(cancellationInfo.refundAmount)}</p>
                            <p><strong>Khôi phục phòng:</strong> {cancellationInfo.restoreInventory ? 'Có' : 'Không'}</p>
                        </div>
                    }
                    type="warning"
                    showIcon
                    icon={<ExclamationCircleOutlined />}
                />
            </div>
            <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                    Lý do hủy (tùy chọn):
                </label>
                <TextArea
                    rows={4}
                    value={cancellationReason}
                    onChange={(e) => setCancellationReason(e.target.value)}
                    placeholder="Nhập lý do hủy đơn đặt phòng..."
                />
            </div>
        </Modal>
    </>
    );
};

export default BookingStatusInfo;
