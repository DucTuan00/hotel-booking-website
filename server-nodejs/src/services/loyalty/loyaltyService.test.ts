import test from 'node:test';
import assert from 'node:assert/strict';
import {
    calculateTierFromBookings,
    calculateDiscountAmount,
    calculateFinalPrice,
} from './loyaltyService';
import { LoyaltyTier } from '@/types/user';

test('calculateTierFromBookings returns BRONZE for 0 bookings', () => {
    const result = calculateTierFromBookings(0);

    assert.equal(result.tier, LoyaltyTier.BRONZE);
    assert.equal(result.discount, 0);
    assert.equal(result.nextTierAt, 3);
});

test('calculateTierFromBookings returns BRONZE for 2 bookings', () => {
    const result = calculateTierFromBookings(2);

    assert.equal(result.tier, LoyaltyTier.BRONZE);
    assert.equal(result.discount, 0);
    assert.equal(result.nextTierAt, 3);
});

test('calculateTierFromBookings returns SILVER for exactly 3 bookings', () => {
    const result = calculateTierFromBookings(3);

    assert.equal(result.tier, LoyaltyTier.SILVER);
    assert.equal(result.discount, 5);
    assert.equal(result.nextTierAt, 6);
});

test('calculateTierFromBookings returns SILVER for 5 bookings', () => {
    const result = calculateTierFromBookings(5);

    assert.equal(result.tier, LoyaltyTier.SILVER);
    assert.equal(result.discount, 5);
    assert.equal(result.nextTierAt, 6);
});

test('calculateTierFromBookings returns GOLD for exactly 6 bookings', () => {
    const result = calculateTierFromBookings(6);

    assert.equal(result.tier, LoyaltyTier.GOLD);
    assert.equal(result.discount, 10);
    assert.equal(result.nextTierAt, 10);
});

test('calculateTierFromBookings returns GOLD for 9 bookings', () => {
    const result = calculateTierFromBookings(9);

    assert.equal(result.tier, LoyaltyTier.GOLD);
    assert.equal(result.discount, 10);
    assert.equal(result.nextTierAt, 10);
});

test('calculateTierFromBookings returns DIAMOND for exactly 10 bookings', () => {
    const result = calculateTierFromBookings(10);

    assert.equal(result.tier, LoyaltyTier.DIAMOND);
    assert.equal(result.discount, 15);
    assert.equal(result.nextTierAt, -1);
});

test('calculateTierFromBookings returns DIAMOND for 100 bookings', () => {
    const result = calculateTierFromBookings(100);

    assert.equal(result.tier, LoyaltyTier.DIAMOND);
    assert.equal(result.discount, 15);
    assert.equal(result.nextTierAt, -1);
});

test('calculateDiscountAmount returns 0 for 0% discount', () => {
    assert.equal(calculateDiscountAmount(1000, 0), 0);
});

test('calculateDiscountAmount returns correct amount for 5% discount', () => {
    assert.equal(calculateDiscountAmount(1000, 5), 50);
});

test('calculateDiscountAmount returns correct amount for 10% discount', () => {
    assert.equal(calculateDiscountAmount(1000, 10), 100);
});

test('calculateDiscountAmount returns correct amount for 15% discount', () => {
    assert.equal(calculateDiscountAmount(1000000, 15), 150000);
});

test('calculateDiscountAmount rounds to nearest integer', () => {
    assert.equal(calculateDiscountAmount(999, 5), 50); // 49.95 -> 50
});

test('calculateFinalPrice returns original price for 0% discount', () => {
    assert.equal(calculateFinalPrice(1000, 0), 1000);
});

test('calculateFinalPrice returns discounted price for 5% discount', () => {
    assert.equal(calculateFinalPrice(1000, 5), 950);
});

test('calculateFinalPrice returns discounted price for 10% discount', () => {
    assert.equal(calculateFinalPrice(1000, 10), 900);
});

test('calculateFinalPrice returns discounted price for 15% discount', () => {
    assert.equal(calculateFinalPrice(1000000, 15), 850000);
});

test('calculateFinalPrice works with calculateDiscountAmount', () => {
    const originalPrice = 1500;
    const discountPercent = 10;
    const discountAmount = calculateDiscountAmount(originalPrice, discountPercent);
    const finalPrice = calculateFinalPrice(originalPrice, discountPercent);

    assert.equal(discountAmount, 150);
    assert.equal(finalPrice, 1350);
});
