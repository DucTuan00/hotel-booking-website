import React from 'react';
import { Card, Progress, Tooltip } from 'antd';
import { RiseOutlined, GiftOutlined } from '@ant-design/icons';
import { LoyaltyInfo, LoyaltyTier, LOYALTY_CONFIG } from '@/types/user';
import { COLORS, TYPOGRAPHY } from '@/config/constants';
import { formatPrice } from '@/utils/formatPrice';

interface LoyaltyCardProps {
    loyaltyInfo: LoyaltyInfo;
}

const TIER_NAMES: Record<LoyaltyTier, string> = {
    [LoyaltyTier.BRONZE]: 'Đồng',
    [LoyaltyTier.SILVER]: 'Bạc',
    [LoyaltyTier.GOLD]: 'Vàng',
    [LoyaltyTier.DIAMOND]: 'Kim Cương',
};

const LoyaltyCard: React.FC<LoyaltyCardProps> = ({ loyaltyInfo }) => {
    const { tier, totalBookings, totalSpent, currentDiscount, nextTierAt, bookingsToNextTier } = loyaltyInfo;
    
    // Calculate progress to next tier
    const isMaxTier = nextTierAt === -1;
    const progressPercent = isMaxTier 
        ? 100 
        : Math.round((totalBookings / nextTierAt) * 100);

    // Get next tier info
    const getNextTier = (): LoyaltyTier | null => {
        if (tier === LoyaltyTier.BRONZE) return LoyaltyTier.SILVER;
        if (tier === LoyaltyTier.SILVER) return LoyaltyTier.GOLD;
        if (tier === LoyaltyTier.GOLD) return LoyaltyTier.DIAMOND;
        return null;
    };

    const nextTier = getNextTier();
    const nextTierDiscount = nextTier ? LOYALTY_CONFIG[nextTier].discount : null;

    return (
        <Card
            style={{
                borderRadius: '12px',
                border: `1px solid ${COLORS.gray[200]}`,
            }}
        >
            {/* Header with accent border */}
            <div 
                className="flex items-center justify-between mb-2 pb-4"
            >
                <div>
                    <p
                        className="text-sm !mb-1"
                        style={{
                            fontFamily: TYPOGRAPHY.fontFamily.secondary,
                            color: COLORS.gray[500],
                        }}
                    >
                        Hạng thành viên
                    </p>
                    <p
                        className="text-2xl font-semibold !mb-0"
                        style={{
                            color: COLORS.primary,
                        }}
                    >
                        {TIER_NAMES[tier]}
                    </p>
                </div>

                {/* Discount badge */}
                {currentDiscount > 0 && (
                    <Tooltip title="Giảm giá áp dụng cho mỗi lần đặt phòng">
                        <div
                            className="flex items-center gap-2 px-4 py-2 rounded-full"
                            style={{
                                backgroundColor: COLORS.secondary,
                                color: 'white',
                            }}
                        >
                            <GiftOutlined />
                            <span
                                className="font-semibold"
                                style={{ fontFamily: TYPOGRAPHY.fontFamily.secondary }}
                            >
                                -{currentDiscount}%
                            </span>
                        </div>
                    </Tooltip>
                )}
            </div>

            {/* Stats */}
            <div
                className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 p-4 rounded-lg bg-gray-50 border border-gray-200"
            >
                <div className="text-center">
                    <p
                        className="text-sm !mb-1"
                        style={{
                            fontFamily: TYPOGRAPHY.fontFamily.secondary,
                            color: COLORS.gray[500],
                        }}
                    >
                        Lượt đặt phòng
                    </p>
                    <p
                        className="text-2xl font-bold !mb-0"
                        style={{
                            fontFamily: TYPOGRAPHY.fontFamily.secondary,
                            color: COLORS.primary,
                        }}
                    >
                        {totalBookings}
                    </p>
                </div>
                <div className="text-center">
                    <p
                        className="text-sm !mb-1"
                        style={{
                            fontFamily: TYPOGRAPHY.fontFamily.secondary,
                            color: COLORS.gray[500],
                        }}
                    >
                        Tổng chi tiêu
                    </p>
                    <p
                        className="text-2xl font-bold !mb-0"
                        style={{
                            fontFamily: TYPOGRAPHY.fontFamily.secondary,
                            color: COLORS.primary,
                        }}
                    >
                        {formatPrice(totalSpent)}
                    </p>
                </div>
            </div>

            {/* Progress to next tier */}
            {!isMaxTier ? (
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <span
                            className="text-sm"
                            style={{
                                fontFamily: TYPOGRAPHY.fontFamily.secondary,
                                color: COLORS.gray[600],
                            }}
                        >
                            <RiseOutlined/> Tiến độ lên hạng {nextTier && TIER_NAMES[nextTier]}
                        </span>
                        <span
                            className="text-sm font-semibold"
                            style={{
                                fontFamily: TYPOGRAPHY.fontFamily.secondary,
                                color: COLORS.primary,
                            }}
                        >
                            {totalBookings}/{nextTierAt}
                        </span>
                    </div>
                    <Progress
                        percent={progressPercent}
                        strokeColor={COLORS.primary}
                        trailColor={COLORS.gray[200]}
                        showInfo={false}
                        style={{ marginBottom: '12px' }}
                    />
                    <p
                        className="text-sm mb-0 text-center"
                        style={{
                            fontFamily: TYPOGRAPHY.fontFamily.secondary,
                            color: COLORS.gray[600],
                        }}
                    >
                        Còn <strong style={{ color: COLORS.primary }}>{bookingsToNextTier}</strong> lượt đặt phòng 
                        để lên hạng <strong>{nextTier && TIER_NAMES[nextTier]}</strong>
                        {nextTierDiscount && (
                            <span style={{ color: COLORS.secondary, fontWeight: 600 }}> (giảm {nextTierDiscount}% khi đặt phòng)</span>
                        )}
                    </p>
                </div>
            ) : (
                <div
                    className="p-4 rounded-lg text-center bg-gray-50 border border-gray-200"
                >
                    <span
                        className="font-semibold"
                        style={{
                            fontFamily: TYPOGRAPHY.fontFamily.secondary,
                            color: COLORS.primary,
                        }}
                    >
                        Chúc mừng! Bạn đã đạt hạng cao nhất
                    </span>
                </div>
            )}

            {/* Tip */}
            <div
                className="mt-4 p-3 rounded-lg bg-gray-50 border border-gray-200"
            >
                <p
                    className="text-xs !mb-0"
                    style={{
                        fontFamily: TYPOGRAPHY.fontFamily.secondary,
                        color: COLORS.gray[500],
                    }}
                >
                    * Mỗi lần đặt phòng hoàn thành sẽ được tính để thăng hạng. Hạng càng cao, giảm giá càng nhiều!
                </p>
            </div>
        </Card>
    );
};

export default LoyaltyCard;
