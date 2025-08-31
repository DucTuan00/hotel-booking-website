import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI as string;

async function migrateRoomImages() {
    try {
        // Connect to MongoDB
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB for migration');

        // Remove the images field from all room documents
        const db = mongoose.connection.db;
        if (!db) {
            throw new Error('Database connection not established');
        }
        
        const result = await db.collection('rooms').updateMany(
            { images: { $exists: true } },
            { $unset: { images: "" } }
        );

        console.log(`\n=== Migration Summary ===`);
        console.log(`Updated ${result.modifiedCount} room documents`);
        console.log(`Removed images field from Room collection`);
        console.log(`Room images will now be stored in the separate RoomImage collection`);
        console.log('\nMigration completed successfully!');

    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    } finally {
        await mongoose.connection.close();
        console.log('Database connection closed');
    }
}

migrateRoomImages();

export default migrateRoomImages;