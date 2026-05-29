import test from 'node:test';
import assert from 'node:assert/strict';
import mongoose from 'mongoose';
import { mapId, mapIds } from './mapId';

test('mapId maps top-level _id to id', () => {
    const objectId = new mongoose.Types.ObjectId();
    const result = mapId({ _id: objectId, name: 'Room' });

    assert.equal(result.id, objectId.toString());
    assert.equal(result.name, 'Room');
    assert.equal('_id' in result, false);
});

test('mapId supports mongoose-like documents with toObject', () => {
    const objectId = new mongoose.Types.ObjectId();
    const result = mapId({
        toObject: () => ({ _id: objectId, name: 'User' }),
    } as any);

    assert.deepEqual(result, {
        id: objectId.toString(),
        name: 'User',
    });
});

test('mapId maps nested objects and object id arrays', () => {
    const amenityId = new mongoose.Types.ObjectId();
    const roomId = new mongoose.Types.ObjectId();
    const result = mapId({
        _id: roomId,
        owner: { _id: new mongoose.Types.ObjectId(), email: 'owner@example.com' },
        amenities: [amenityId, { _id: new mongoose.Types.ObjectId(), name: 'Pool' }],
    });

    const owner = result.owner as unknown as { id: string; email: string };
    const amenities = result.amenities as unknown as Array<string | { id: string; name: string }>;

    assert.equal(result.id, roomId.toString());
    assert.equal('_id' in owner, false);
    assert.equal(typeof owner.id, 'string');
    assert.equal(amenities[0], amenityId.toString());
    assert.equal(typeof (amenities[1] as { id: string }).id, 'string');
    assert.equal((amenities[1] as { name: string }).name, 'Pool');
});

test('mapIds maps each document in an array', () => {
    const firstId = new mongoose.Types.ObjectId();
    const secondId = new mongoose.Types.ObjectId();

    const result = mapIds([
        { _id: firstId, name: 'First' },
        { _id: secondId, name: 'Second' },
    ]);

    assert.deepEqual(
        result.map(item => item.id),
        [firstId.toString(), secondId.toString()]
    );
});
