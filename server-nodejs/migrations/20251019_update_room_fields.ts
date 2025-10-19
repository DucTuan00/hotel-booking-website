import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI as string;

async function migrateRoomFields() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        const db = mongoose.connection.db;
        if (!db) {
            throw new Error('Database connection not established');
        }

        const roomsCollection = db.collection('rooms');

        // 1. Rename field deleteAt to deletedAt (if exists)
        const roomsWithDeleteAt = await roomsCollection.countDocuments({ 
            deleteAt: { $exists: true } 
        });
        
        if (roomsWithDeleteAt > 0) {
            console.log(`Found ${roomsWithDeleteAt} rooms with 'deleteAt' field`);
            const result = await roomsCollection.updateMany(
                { deleteAt: { $exists: true } },
                { 
                    $rename: { deleteAt: 'deletedAt' }
                }
            );
            console.log(`Renamed 'deleteAt' to 'deletedAt' for ${result.modifiedCount} rooms`);
        } else {
            console.log('No rooms with old field name "deleteAt" found');
        }

        // 2. Set deletedAt to null for rooms that don't have it
        const roomsWithoutDeletedAt = await roomsCollection.countDocuments({ 
            deletedAt: { $exists: false } 
        });
        
        if (roomsWithoutDeletedAt > 0) {
            console.log(`Found ${roomsWithoutDeletedAt} rooms without 'deletedAt' field`);
            const result = await roomsCollection.updateMany(
                { deletedAt: { $exists: false } },
                { 
                    $set: { deletedAt: null }
                }
            );
            console.log(`Set deletedAt to null for ${result.modifiedCount} rooms`);
        } else {
            console.log('All rooms already have deletedAt field');
        }

        // 3. Ensure all rooms have roomArea field (set to null if not exists)
        const roomsWithoutRoomArea = await roomsCollection.countDocuments({ 
            roomArea: { $exists: false } 
        });
        
        if (roomsWithoutRoomArea > 0) {
            console.log(`Found ${roomsWithoutRoomArea} rooms without 'roomArea' field`);
            const result = await roomsCollection.updateMany(
                { roomArea: { $exists: false } },
                { 
                    $set: { roomArea: null }
                }
            );
            console.log(`Set roomArea to null for ${result.modifiedCount} rooms`);
        } else {
            console.log('All rooms already have roomArea field');
        }

        // 4. Ensure all rooms have active field (default to false for new logic)
        const roomsWithoutActive = await roomsCollection.countDocuments({ 
            active: { $exists: false } 
        });
        
        if (roomsWithoutActive > 0) {
            console.log(`Found ${roomsWithoutActive} rooms without 'active' field`);
            const result = await roomsCollection.updateMany(
                { active: { $exists: false } },
                { 
                    $set: { active: false }
                }
            );
            console.log(`Set active to false for ${result.modifiedCount} rooms`);
        } else {
            console.log('All rooms already have active field');
        }

        // 5. Summary
        const totalRooms = await roomsCollection.countDocuments({});
        const activeRooms = await roomsCollection.countDocuments({ active: true });
        const deletedRooms = await roomsCollection.countDocuments({ 
            deletedAt: { $ne: null } 
        });
        const roomsWithArea = await roomsCollection.countDocuments({ 
            roomArea: { $ne: null } 
        });

        console.log('\n=== Migration Summary ===');
        console.log(`Total rooms: ${totalRooms}`);
        console.log(`Active rooms: ${activeRooms}`);
        console.log(`Deleted rooms (soft delete): ${deletedRooms}`);
        console.log(`Rooms with area defined: ${roomsWithArea}`);
        console.log('========================\n');

        console.log('✓ Migration completed successfully');
    } catch (error) {
        console.error('Migration failed:', error);
        throw error;
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}

// Run migration if this script is executed directly (ES modules)
migrateRoomFields()
    .then(() => {
        console.log('Script finished');
        process.exit(0);
    })
    .catch((error) => {
        console.error('Script failed:', error);
        process.exit(1);
    });

export default migrateRoomFields;
