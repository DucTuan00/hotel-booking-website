import React from 'react';
import moment from 'moment';
import BaseDetailRow from '@/components/BaseDetail';
import DetailSection from '@/pages/admin/Booking/Detail/components/DetailSection';
import { Booking } from '@/types/booking';
import { formatPrice } from '@/utils/formatPrice';

interface PriceBreakdownProps {
    booking: Booking;
}

const PriceBreakdown: React.FC<PriceBreakdownProps> = ({ booking }) => {
    if (!booking.snapshot) return null;

    const { snapshot } = booking;

    return (
        <>
            {/* Daily Rates */}
            {snapshot.dailyRates && snapshot.dailyRates.length > 0 && (
                <>
                    <DetailSection title="Giá phòng theo ngày">
                        {snapshot.dailyRates.map((rate, index) => (
                            <BaseDetailRow
                                key={index}
                                label={moment(rate.date).format('DD/MM/YYYY')}
                                value={`${formatPrice(rate.price)}`}
                            />
                        ))}
                    </DetailSection>
                </>
            )}

            {/* Celebrate Items */}
            {snapshot.celebrateItems && snapshot.celebrateItems.length > 0 && (
                <DetailSection title="Giá quà kỷ niệm">
                    {snapshot.celebrateItems.map((item, index) => (
                        <BaseDetailRow
                            key={index}
                            label={`${item.name} (x${item.quantity})`}
                            value={
                                <div className="space-y-1">
                                    <div>{formatPrice(item.price)} / sản phẩm</div>
                                    <div className="font-medium text-gray-900">
                                        Tổng: {formatPrice(item.subtotal)}
                                    </div>
                                </div>
                            }
                        />
                    ))}
                </DetailSection>
            )}

            <DetailSection title="Thống kê giá">
                {/* Summary */}
                <BaseDetailRow
                    label="Giá phòng"
                    value={`${formatPrice(snapshot.pricing?.roomSubtotal) || 0}`}
                />
                {snapshot.pricing?.celebrateItemsSubtotal > 0 && (
                    <BaseDetailRow
                        label="Giá quà kỷ niệm"
                        value={`${formatPrice(snapshot.pricing.celebrateItemsSubtotal)}`}
                    />
                )}
                
                {/* Loyalty Discount */}
                {snapshot.loyaltyDiscount && snapshot.loyaltyDiscount.discountPercent > 0 && (
                    <>
                        <BaseDetailRow
                            label="Tạm tính"
                            value={formatPrice(snapshot.loyaltyDiscount.originalPrice)}
                        />
                        <BaseDetailRow
                            label={`Giảm giá (-${snapshot.loyaltyDiscount.discountPercent}%)`}
                            value={
                                    `-${formatPrice(snapshot.loyaltyDiscount.discountAmount)}`
                            }
                        />
                    </>
                )}
                
                <BaseDetailRow
                    label="Tổng cộng"
                    value={
                        <span className="font-bold text-lg">
                            {formatPrice(booking.totalPrice)}
                        </span>
                    }
                />
            </DetailSection>
        </>
    );
};

export default PriceBreakdown;
