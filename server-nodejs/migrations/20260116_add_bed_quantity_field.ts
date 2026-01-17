/**
 * Migration: Add bedQuantity field to rooms
 * Date: 2026-01-16
 * Description: Adds bedQuantity field to Room collection with default value of 1
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hotel-boutique';

async function migrate() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        const db = mongoose.connection.db;
        if (!db) {
            throw new Error('Database connection not established');
        }

        const roomsCollection = db.collection('rooms');

        // Check if any rooms exist without bedQuantity field
        const roomsWithoutBedQuantity = await roomsCollection.countDocuments({
            bedQuantity: { $exists: false }
        });

        if (roomsWithoutBedQuantity === 0) {
            console.log('All rooms already have bedQuantity field. Skipping migration.');
            return;
        }

        console.log(`Found ${roomsWithoutBedQuantity} rooms without bedQuantity field`);

        // Update all rooms that don't have bedQuantity field
        const result = await roomsCollection.updateMany(
            { bedQuantity: { $exists: false } },
            { $set: { bedQuantity: 1 } }
        );

        console.log(`Updated ${result.modifiedCount} rooms with default bedQuantity = 1`);

    } catch (error) {
        console.error('Migration failed:', error);
        throw error;
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}

// Run migration
migrate()
    .then(() => {
        console.log('Migration completed successfully');
        process.exit(0);
    })
    .catch((error) => {
        console.error('Migration failed:', error);
        process.exit(1);
    });
