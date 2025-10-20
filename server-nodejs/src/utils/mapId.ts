import mongoose from 'mongoose';

export function mapId<T extends { _id?: any }>(doc: T): Omit<T, '_id'> & { id: string } {
    if (!doc) return doc as any;
    
    const obj = (typeof (doc as any).toObject === 'function') ? (doc as any).toObject() : { ...doc };
    
    // Map main document _id to id
    if (obj._id) {
        obj.id = obj._id?.toString?.() || obj._id;
        delete obj._id;
    }
    
    // Convert all ObjectId fields to strings
    for (const key in obj) {
        const value = obj[key];
        
        // Handle ObjectId directly
        if (value && mongoose.Types.ObjectId.isValid(value) && typeof value === 'object' && value.constructor.name === 'ObjectId') {
            obj[key] = value.toString();
        }
        // Handle objects
        else if (value && typeof value === 'object') {
            // Handle array of objects
            if (Array.isArray(value)) {
                obj[key] = value.map(item => {
                    // Convert ObjectId in array
                    if (item && mongoose.Types.ObjectId.isValid(item) && typeof item === 'object' && item.constructor.name === 'ObjectId') {
                        return item.toString();
                    }
                    // Handle nested object with _id
                    if (item && typeof item === 'object' && '_id' in item) {
                        const mappedItem = { ...item };
                        mappedItem.id = mappedItem._id?.toString?.() || mappedItem._id;
                        delete mappedItem._id;
                        return mappedItem;
                    }
                    return item;
                });
            } 
            // Handle single nested object with _id
            else if ('_id' in value) {
                obj[key] = { ...value };
                obj[key].id = obj[key]._id?.toString?.() || obj[key]._id;
                delete obj[key]._id;
            }
        }
    }
    
    return obj;
}

// Helper function for mapping arrays of documents
export function mapIds<T extends { _id?: any }>(docs: T[]): Array<Omit<T, '_id'> & { id: string }> {
    if (!Array.isArray(docs)) return docs as any;
    return docs.map(doc => mapId(doc));
}