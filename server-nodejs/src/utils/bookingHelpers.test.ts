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
