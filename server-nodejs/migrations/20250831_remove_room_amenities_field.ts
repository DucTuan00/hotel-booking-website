import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI as string;

async function migrateRoomAmenities() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB for migration');

        const db = mongoose.connection.db;
        if (!db) {
            throw new Error('Database connection not established');
        }
        
        const result = await db.collection('rooms').updateMany(
            { amenities: { $exists: true } },
            { $unset: { amenities: "" } }
        );

        console.log(`\n=== Migration Summary ===`);
        console.log(`Updated ${result.modifiedCount} room documents`);
        console.log('\nMigration completed successfully!');

    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    } finally {
        await mongoose.connection.close();
        console.log('Database connection closed');
    }
}

migrateRoomAmenities();

export default migrateRoomAmenities;