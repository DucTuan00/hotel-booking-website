import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI as string;

async function migrate() {
    await mongoose.connect(MONGODB_URI);

    const bookingCollection = mongoose.connection.collection('bookings');

    // user_id -> userId
    const renameUserId = await bookingCollection.updateMany(
        { user_id: { $exists: true } },
        [
            { $set: { userId: "$user_id" } },
            { $unset: "user_id" }
        ]
    );
    console.log(`Renamed user_id to userId:`, renameUserId.modifiedCount);

    // room_id -> roomId
    const renameRoomId = await bookingCollection.updateMany(
        { room_id: { $exists: true } },
        [
            { $set: { roomId: "$room_id" } },
            { $unset: "room_id" }
        ]
    );
    console.log(`Renamed room_id to roomId:`, renameRoomId.modifiedCount);

    // check_in -> checkIn
    const renameCheckIn = await bookingCollection.updateMany(
        { check_in: { $exists: true } },
        [
            { $set: { checkIn: "$check_in" } },
            { $unset: "check_in" }
        ]
    );
    console.log(`Renamed check_in to checkIn:`, renameCheckIn.modifiedCount);

    // check_out -> checkOut
    const renameCheckOut = await bookingCollection.updateMany(
        { check_out: { $exists: true } },
        [
            { $set: { checkOut: "$check_out" } },
            { $unset: "check_out" }
        ]
    );
    console.log(`Renamed check_out to checkOut:`, renameCheckOut.modifiedCount);

    // total_price -> totalPrice
    const renameTotalPrice = await bookingCollection.updateMany(
        { total_price: { $exists: true } },
        [
            { $set: { totalPrice: "$total_price" } },
            { $unset: "total_price" }
        ]
    );
    console.log(`Renamed total_price to totalPrice:`, renameTotalPrice.modifiedCount);

    await mongoose.disconnect();
}

migrate().then(() => {
    console.log('Migration completed!');
    process.exit(0);
}).catch(err => {
    console.error('Migration failed:', err);
    process.exit(1);
});