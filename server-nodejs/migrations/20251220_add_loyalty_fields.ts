/**
 * Migration: Add loyalty fields to existing users
 * Date: 2025-12-20
 * 
 * This migration:
 * 1. Adds loyalty fields to all existing users with default values
 * 2. Calculates totalBookings and totalSpent from existing CheckedOut bookings
 * 3. Updates loyalty tier based on completed bookings
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config();

// Loyalty configuration
enum LoyaltyTier {
    BRONZE = 'Bronze',
    SILVER = 'Silver',
    GOLD = 'Gold',
    DIAMOND = 'Diamond',
}

const LOYALTY_CONFIG = {
    [LoyaltyTier.BRONZE]: { minBookings: 0, discount: 0, nextTierAt: 3 },
    [LoyaltyTier.SILVER]: { minBookings: 3, discount: 5, nextTierAt: 6 },
    [LoyaltyTier.GOLD]: { minBookings: 6, discount: 10, nextTierAt: 10 },
    [LoyaltyTier.DIAMOND]: { minBookings: 10, discount: 15, nextTierAt: -1 },
};

function calculateTierFromBookings(totalBookings: number) {
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

async function migrate() {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
        console.error('MONGODB_URI is not set in .env');
        process.exit(1);
    }

    try {
        await mongoose.connect(mongoUri);
        console.log('Connected to MongoDB');

        const db = mongoose.connection.db;
        if (!db) {
            throw new Error('Database connection not established');
        }

        const usersCollection = db.collection('users');
        const bookingsCollection = db.collection('bookings');

        // Step 1: Add default loyalty fields to all users who don't have them
        console.log('\n[Step 1] Adding default loyalty fields to users...');
        const usersWithoutLoyalty = await usersCollection.countDocuments({
            loyaltyTier: { $exists: false }
        });
        
        if (usersWithoutLoyalty > 0) {
            const result = await usersCollection.updateMany(
                { loyaltyTier: { $exists: false } },
                {
                    $set: {
                        loyaltyTier: LoyaltyTier.BRONZE,
                        loyaltyTotalBookings: 0,
                        loyaltyTotalSpent: 0,
                        loyaltyCurrentDiscount: 0,
                        loyaltyNextTierAt: 3,
                    }
                }
            );
            console.log(`  Updated ${result.modifiedCount} users with default loyalty fields`);
        } else {
            console.log('  All users already have loyalty fields');
        }

        // Step 2: Calculate stats from existing CheckedOut bookings
        console.log('\n[Step 2] Calculating loyalty stats from existing bookings...');
        
        const users = await usersCollection.find({}).toArray();
        let updatedCount = 0;

        for (const user of users) {
            // Count completed bookings
            const completedBookings = await bookingsCollection.countDocuments({
                userId: user._id,
                status: 'CheckedOut'
            });

            // Calculate total spent
            const spentAggregation = await bookingsCollection.aggregate([
                { $match: { userId: user._id, status: 'CheckedOut' } },
                { $group: { _id: null, total: { $sum: '$totalPrice' } } }
            ]).toArray();

            const totalSpent = spentAggregation[0]?.total || 0;

            // Calculate tier based on bookings
            const { tier, discount, nextTierAt } = calculateTierFromBookings(completedBookings);

            // Update user
            if (completedBookings > 0 || totalSpent > 0) {
                await usersCollection.updateOne(
                    { _id: user._id },
                    {
                        $set: {
                            loyaltyTier: tier,
                            loyaltyTotalBookings: completedBookings,
                            loyaltyTotalSpent: totalSpent,
                            loyaltyCurrentDiscount: discount,
                            loyaltyNextTierAt: nextTierAt,
                            loyaltyLastUpdateAt: new Date(),
                        }
                    }
                );
                updatedCount++;
                console.log(`  User ${user.email}: ${completedBookings} bookings, ${tier} tier, ${discount}% discount`);
            }
        }

        console.log(`\n  Updated ${updatedCount} users with calculated loyalty stats`);

        // Summary
        console.log('\n========== Migration Summary ==========');
        const tierStats = await usersCollection.aggregate([
            { $group: { _id: '$loyaltyTier', count: { $sum: 1 } } },
            { $sort: { _id: 1 } }
        ]).toArray();

        console.log('Users by loyalty tier:');
        for (const stat of tierStats) {
            console.log(`  ${stat._id}: ${stat.count} users`);
        }

        console.log('\n Migration completed successfully!');

    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    } finally {
        await mongoose.disconnect();
        console.log('\nDisconnected from MongoDB');
    }
}

migrate();
