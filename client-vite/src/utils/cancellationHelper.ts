import { Booking } from '@/types/booking';

export interface CancellationInfo {
    canCancel: boolean;
    feePercentage: number;
    fee: number;
    refundAmount: number;
    restoreInventory: boolean;
    reason?: string;
    daysBeforeCheckIn: number;
    hoursBeforeCheckIn: number;
}

export const calculateCancellationFee = (booking: Booking): CancellationInfo => {
    const now = new Date();
    
    // Set check-in time to 14:00 of the check-in date
    const checkInDate = new Date(booking.checkIn);
    checkInDate.setHours(14, 0, 0, 0);
    
    // Calculate difference in milliseconds
    const diffTime = checkInDate.getTime() - now.getTime();
    
    // Calculate hours before check-in for more accurate calculation
    const hoursBeforeCheckIn = diffTime / (1000 * 60 * 60);
    const daysBeforeCheckIn = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Cannot cancel after check-in time has passed
    if (diffTime <= 0) {
        return {
            canCancel: false,
            feePercentage: 0,
            fee: 0,
            refundAmount: 0,
            restoreInventory: false,
            reason: 'Không thể hủy sau thời gian check-in (14:00)',
            daysBeforeCheckIn: 0,
            hoursBeforeCheckIn: 0
        };
    }

    // Cannot cancel after check-in
    if (booking.status === 'CheckedIn' || booking.status === 'CheckedOut') {
        return {
            canCancel: false,
            feePercentage: 0,
            fee: 0,
            refundAmount: 0,
            restoreInventory: false,
            reason: 'Không thể hủy sau khi đã check-in',
            daysBeforeCheckIn,
            hoursBeforeCheckIn
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
            daysBeforeCheckIn,
            hoursBeforeCheckIn
        };
    }

    let feePercentage = 0;
    let restoreInventory = true;

    if (hoursBeforeCheckIn > 7 * 24) {
        // > 7 days (168 hours): 0% fee
        feePercentage = 0;
        restoreInventory = true;
    } else if (hoursBeforeCheckIn >= 3 * 24 && hoursBeforeCheckIn <= 7 * 24) {
        // 3-7 days (72-168 hours): 20% fee
        feePercentage = 20;
        restoreInventory = true;
    } else if (hoursBeforeCheckIn >= 24 && hoursBeforeCheckIn < 3 * 24) {
        // 1-3 days (24-72 hours): 50% fee
        feePercentage = 50;
        restoreInventory = true;
    } else {
        // < 24 hours: 100% fee
        feePercentage = 100;
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
        daysBeforeCheckIn,
        hoursBeforeCheckIn
    };
};
