import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI as string;

async function migrate() {
    await mongoose.connect(MONGODB_URI);

    const roomCollection = mongoose.connection.collection('rooms');

    // room_type -> roomType
    const renameRoomType = await roomCollection.updateMany(
        { room_type: { $exists: true } },
        [
            {
                $set: { roomType: "$room_type" }
            },
            {
                $unset: "room_type"
            }
        ]
    );
    console.log(`Renamed room_type to roomType:`, renameRoomType.modifiedCount);

    // max_guest -> maxGuests
    const renameMaxGuest = await roomCollection.updateMany(
        { max_guest: { $exists: true } },
        [
            {
                $set: { maxGuests: "$max_guest" }
            },
            {
                $unset: "max_guest"
            }
        ]
    );
    console.log(`Renamed max_guest to maxGuests:`, renameMaxGuest.modifiedCount);

    await mongoose.disconnect();
}

migrate().then(() => {
    console.log('Migration completed!');
    process.exit(0);
}).catch(err => {
    console.error('Migration failed:', err);
    process.exit(1);
});