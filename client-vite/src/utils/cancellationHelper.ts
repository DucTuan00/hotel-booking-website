import { Booking } from '@/types/booking';

export interface CancellationInfo {
    canCancel: boolean;
    feePercentage: number;
    fee: number;
    refundAmount: number;
    restoreInventory: boolean;
    reason?: string;
    daysBeforeCheckIn: number;
}

export const calculateCancellationFee = (booking: Booking): CancellationInfo => {
    const now = new Date();
    const checkInDate = new Date(booking.checkIn);
    const diffTime = checkInDate.getTime() - now.getTime();
    const daysBeforeCheckIn = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Cannot cancel after check-in
    if (booking.status === 'CheckedIn' || booking.status === 'CheckedOut') {
        return {
            canCancel: false,
            feePercentage: 0,
            fee: 0,
            refundAmount: 0,
            restoreInventory: false,
            reason: 'Không thể hủy sau khi đã check-in',
            daysBeforeCheckIn
        };
    }

    // Already cancelled or rejected
    if (booking.status === 'Cancelled' || booking.status === 'Rejected') {
        return {
            canCancel: false,
            feePercentage: 0,
            fee: 0,
            refundAmount: 0,
            restoreInventory: false,
            reason: 'Booking đã bị hủy hoặc từ chối',
            daysBeforeCheckIn
        };
    }

    let feePercentage = 0;
    let restoreInventory = true;

    if (daysBeforeCheckIn > 7) {
        // > 7 days: 0% fee
        feePercentage = 0;
        restoreInventory = true;
    } else if (daysBeforeCheckIn >= 3 && daysBeforeCheckIn <= 7) {
        // 3-7 days: 20% fee
        feePercentage = 20;
        restoreInventory = true;
    } else if (daysBeforeCheckIn >= 1 && daysBeforeCheckIn < 3) {
        // 24h-3 days: 50% fee
        feePercentage = 50;
        restoreInventory = true;
    } else {
        // < 24h: 80% fee
        feePercentage = 80;
        restoreInventory = false;
    }

    const fee = Math.round((booking.totalPrice * feePercentage) / 100);
    const refundAmount = booking.totalPrice - fee;

    return {
        canCancel: true,
        feePercentage,
        fee,
        refundAmount,
        restoreInventory,
        daysBeforeCheckIn
    };
};
