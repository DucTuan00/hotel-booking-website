import test from 'node:test';
import assert from 'node:assert/strict';
import {
    calculateCancellationFee,
    calculateNights,
    createBookingSnapshot,
    getBookingDates,
    normalizeDate,
} from './bookingHelpers';
import { BookingStatus } from '@/types/booking';

test('calculateNights returns the number of booking nights', () => {
    const checkIn = new Date('2026-05-10T15:00:00.000Z');
    const checkOut = new Date('2026-05-13T11:00:00.000Z');

    assert.equal(calculateNights(checkIn, checkOut), 3);
});

test('normalizeDate returns UTC start of day', () => {
    const normalized = normalizeDate(new Date('2026-05-10T15:30:45.123Z'));

    assert.equal(normalized.toISOString(), '2026-05-10T00:00:00.000Z');
});

test('getBookingDates returns each night and excludes checkout date', () => {
    const dates = getBookingDates(
        new Date('2026-05-10T15:00:00.000Z'),
        new Date('2026-05-13T11:00:00.000Z')
    );

    assert.deepEqual(
        dates.map(date => date.toISOString()),
        [
            '2026-05-10T00:00:00.000Z',
            '2026-05-11T00:00:00.000Z',
            '2026-05-12T00:00:00.000Z',
        ]
    );
});

test('calculateCancellationFee blocks bookings that are already checked in', () => {
    const result = calculateCancellationFee({
        status: BookingStatus.CHECKED_IN,
        checkIn: futureDate(10),
        totalPrice: 1000,
    });

    assert.equal(result.canCancel, false);
    assert.equal(result.restoreInventory, false);
    assert.equal(result.reason, 'Cannot cancel booking after check-in');
});

test('calculateCancellationFee applies free cancellation more than seven days before check-in', () => {
    const result = calculateCancellationFee({
        status: BookingStatus.CONFIRMED,
        checkIn: futureDate(10),
        totalPrice: 1000,
    });

    assert.equal(result.canCancel, true);
    assert.equal(result.feePercentage, 0);
    assert.equal(result.fee, 0);
    assert.equal(result.refundAmount, 1000);
    assert.equal(result.restoreInventory, true);
});

test('calculateCancellationFee applies full fee within 24 hours', () => {
    const result = calculateCancellationFee({
        status: BookingStatus.CONFIRMED,
        checkIn: futureHours(12),
        totalPrice: 1000,
    });

    assert.equal(result.canCancel, true);
    assert.equal(result.feePercentage, 100);
    assert.equal(result.fee, 1000);
    assert.equal(result.refundAmount, 0);
    assert.equal(result.restoreInventory, false);
});

test('createBookingSnapshot stores room, daily rate, item, and pricing details', async () => {
    const snapshot = await createBookingSnapshot(
        {
            _id: { toString: () => 'room-1' },
            name: 'Deluxe Room',
            roomType: 'Deluxe',
            roomArea: 35,
            description: 'City view',
            maxGuests: 2,
            price: 120,
        },
        [{ date: new Date('2026-05-10T00:00:00.000Z'), price: 150 }],
        [{ id: 'item-1', name: 'Cake', price: 20, quantity: 2, subtotal: 40 }],
        { roomSubtotal: 150, celebrateItemsSubtotal: 40, totalPrice: 190 }
    );

    assert.deepEqual(snapshot.room, {
        id: 'room-1',
        name: 'Deluxe Room',
        roomType: 'Deluxe',
        roomArea: 35,
        description: 'City view',
        maxGuests: 2,
        basePrice: 120,
    });
    assert.deepEqual(snapshot.dailyRates, [{ date: '2026-05-10', price: 150 }]);
    assert.deepEqual(snapshot.celebrateItems, [
        { id: 'item-1', name: 'Cake', price: 20, quantity: 2, subtotal: 40 },
    ]);
    assert.deepEqual(snapshot.pricing, {
        roomSubtotal: 150,
        celebrateItemsSubtotal: 40,
        total: 190,
    });
    assert.ok(snapshot.bookingDate instanceof Date);
});

function futureDate(days: number): Date {
    return futureHours(days * 24);
}

function futureHours(hours: number): Date {
    return new Date(Date.now() + hours * 60 * 60 * 1000);
}

// ========================================
// Edge Cases - calculateNights
// ========================================

test('calculateNights returns 1 for same-day booking', () => {
    const checkIn = new Date('2026-05-10T00:00:00.000Z');
    const checkOut = new Date('2026-05-10T23:59:59.000Z');

    assert.equal(calculateNights(checkIn, checkOut), 1);
});

test('calculateNights handles 30-day booking', () => {
    const checkIn = new Date('2026-05-01T14:00:00.000Z');
    const checkOut = new Date('2026-05-31T10:00:00.000Z');

    assert.equal(calculateNights(checkIn, checkOut), 30);
});

// ========================================
// Edge Cases - normalizeDate
// ========================================

test('normalizeDate handles midnight UTC', () => {
    const normalized = normalizeDate(new Date('2026-05-10T00:00:00.000Z'));

    assert.equal(normalized.toISOString(), '2026-05-10T00:00:00.000Z');
});

test('normalizeDate handles end of day local time', () => {
    const normalized = normalizeDate(new Date('2026-05-10T23:59:59.999Z'));

    assert.equal(normalized.toISOString(), '2026-05-10T00:00:00.000Z');
});

// ========================================
// Edge Cases - getBookingDates
// ========================================

test('getBookingDates returns empty array for same-day check-in/out', () => {
    const checkIn = new Date('2026-05-10T14:00:00.000Z');
    const checkOut = new Date('2026-05-10T12:00:00.000Z');

    const dates = getBookingDates(checkIn, checkOut);

    assert.deepEqual(dates, []);
});

test('getBookingDates handles 7-night stay', () => {
    const dates = getBookingDates(
        new Date('2026-05-01T14:00:00.000Z'),
        new Date('2026-05-08T11:00:00.000Z')
    );

    assert.equal(dates.length, 7);
    assert.equal(dates[0].toISOString(), '2026-05-01T00:00:00.000Z');
    assert.equal(dates[6].toISOString(), '2026-05-07T00:00:00.000Z');
});

// ========================================
// Edge Cases - calculateCancellationFee
// ========================================

test('calculateCancellationFee blocks already checked-out bookings', () => {
    const result = calculateCancellationFee({
        status: BookingStatus.CHECKED_OUT,
        checkIn: futureDate(10),
        totalPrice: 1000,
    });

    assert.equal(result.canCancel, false);
    assert.equal(result.restoreInventory, false);
    assert.equal(result.reason, 'Cannot cancel completed booking');
});

test('calculateCancellationFee blocks past check-in date', () => {
    const result = calculateCancellationFee({
        status: BookingStatus.CONFIRMED,
        checkIn: pastDate(1),
        totalPrice: 1000,
    });

    assert.equal(result.canCancel, false);
    assert.equal(result.restoreInventory, false);
});

test('calculateCancellationFee applies 20% fee between 3-7 days', () => {
    const result = calculateCancellationFee({
        status: BookingStatus.CONFIRMED,
        checkIn: futureDate(5),
        totalPrice: 1000,
    });

    assert.equal(result.canCancel, true);
    assert.equal(result.feePercentage, 20);
    assert.equal(result.fee, 200);
    assert.equal(result.refundAmount, 800);
    assert.equal(result.restoreInventory, true);
});

test('calculateCancellationFee applies 50% fee between 24h-3 days', () => {
    const result = calculateCancellationFee({
        status: BookingStatus.CONFIRMED,
        checkIn: futureDate(2),
        totalPrice: 1000,
    });

    assert.equal(result.canCancel, true);
    assert.equal(result.feePercentage, 50);
    assert.equal(result.fee, 500);
    assert.equal(result.refundAmount, 500);
    assert.equal(result.restoreInventory, true);
});

test('calculateCancellationFee handles pending status', () => {
    const result = calculateCancellationFee({
        status: BookingStatus.PENDING,
        checkIn: futureDate(10),
        totalPrice: 1000,
    });

    assert.equal(result.canCancel, true);
    assert.equal(result.feePercentage, 0);
    assert.equal(result.restoreInventory, true);
});

test('calculateCancellationFee handles zero price booking', () => {
    const result = calculateCancellationFee({
        status: BookingStatus.CONFIRMED,
        checkIn: futureDate(10),
        totalPrice: 0,
    });

    assert.equal(result.canCancel, true);
    assert.equal(result.fee, 0);
    assert.equal(result.refundAmount, 0);
});

function pastDate(days: number): Date {
    return new Date(Date.now() - days * 24 * 60 * 60 * 1000);
}
