import User from '@/models/User';
import { LoyaltyTier, LOYALTY_CONFIG } from '@/types/user';

/**
 * Calculate the appropriate tier based on total completed bookings
 */
export function calculateTierFromBookings(totalBookings: number): {
    tier: LoyaltyTier;
    discount: number;
    nextTierAt: number;
} {
    if (totalBookings >= LOYALTY_CONFIG[LoyaltyTier.DIAMOND].minBookings) {
        return {
            tier: LoyaltyTier.DIAMOND,
            discount: LOYALTY_CONFIG[LoyaltyTier.DIAMOND].discount,
            nextTierAt: LOYALTY_CONFIG[LoyaltyTier.DIAMOND].nextTierAt,
        };
    }
    if (totalBookings >= LOYALTY_CONFIG[LoyaltyTier.GOLD].minBookings) {
        return {
            tier: LoyaltyTier.GOLD,
            discount: LOYALTY_CONFIG[LoyaltyTier.GOLD].discount,
            nextTierAt: LOYALTY_CONFIG[LoyaltyTier.GOLD].nextTierAt,
        };
    }
    if (totalBookings >= LOYALTY_CONFIG[LoyaltyTier.SILVER].minBookings) {
        return {
            tier: LoyaltyTier.SILVER,
            discount: LOYALTY_CONFIG[LoyaltyTier.SILVER].discount,
            nextTierAt: LOYALTY_CONFIG[LoyaltyTier.SILVER].nextTierAt,
        };
    }
    return {
        tier: LoyaltyTier.BRONZE,
        discount: LOYALTY_CONFIG[LoyaltyTier.BRONZE].discount,
        nextTierAt: LOYALTY_CONFIG[LoyaltyTier.BRONZE].nextTierAt,
    };
}

/**
 * Update user loyalty tier based on their total completed bookings
 * Called after a booking is marked as CheckedOut
 */
export async function updateUserLoyaltyTier(userId: string): Promise<{
    upgraded: boolean;
    previousTier: LoyaltyTier;
    newTier: LoyaltyTier;
    newDiscount: number;
}> {
    const user = await User.findById(userId);
    if (!user) {
        throw new Error('User not found');
    }

    const previousTier = user.loyaltyTier || LoyaltyTier.BRONZE;
    const totalBookings = user.loyaltyTotalBookings || 0;

    const { tier: newTier, discount, nextTierAt } = calculateTierFromBookings(totalBookings);

    const upgraded = newTier !== previousTier;

    // Update user loyalty info
    await User.findByIdAndUpdate(userId, {
        loyaltyTier: newTier,
        loyaltyCurrentDiscount: discount,
        loyaltyNextTierAt: nextTierAt,
        loyaltyLastUpdateAt: new Date(),
    });

    return {
        upgraded,
        previousTier,
        newTier,
        newDiscount: discount,
    };
}

/**
 * Increment user booking stats after a successful checkout
 */
export async function incrementUserBookingStats(
    userId: string,
    bookingAmount: number
): Promise<void> {
    await User.findByIdAndUpdate(userId, {
        $inc: {
            loyaltyTotalBookings: 1,
            loyaltyTotalSpent: bookingAmount,
        },
    });
}

/**
 * Get user's current discount percentage
 */
export async function getUserDiscount(userId: string): Promise<number> {
    const user = await User.findById(userId).select('loyaltyCurrentDiscount');
    return user?.loyaltyCurrentDiscount || 0;
}

/**
 * Get user's loyalty information
 */
export async function getUserLoyaltyInfo(userId: string): Promise<{
    tier: LoyaltyTier;
    totalBookings: number;
    totalSpent: number;
    currentDiscount: number;
    nextTierAt: number;
    bookingsToNextTier: number;
} | null> {
    const user = await User.findById(userId).select(
        'loyaltyTier loyaltyTotalBookings loyaltyTotalSpent loyaltyCurrentDiscount loyaltyNextTierAt'
    );

    if (!user) {
        return null;
    }

    const totalBookings = user.loyaltyTotalBookings || 0;
    const nextTierAt = user.loyaltyNextTierAt || 3;
    const bookingsToNextTier = nextTierAt === -1 ? 0 : Math.max(0, nextTierAt - totalBookings);

    return {
        tier: user.loyaltyTier || LoyaltyTier.BRONZE,
        totalBookings,
        totalSpent: user.loyaltyTotalSpent || 0,
        currentDiscount: user.loyaltyCurrentDiscount || 0,
        nextTierAt,
        bookingsToNextTier,
    };
}

/**
 * Calculate discount amount from original price
 */
export function calculateDiscountAmount(originalPrice: number, discountPercent: number): number {
    return Math.round(originalPrice * (discountPercent / 100));
}

/**
 * Calculate final price after discount
 */
export function calculateFinalPrice(originalPrice: number, discountPercent: number): number {
    const discountAmount = calculateDiscountAmount(originalPrice, discountPercent);
    return originalPrice - discountAmount;
}
