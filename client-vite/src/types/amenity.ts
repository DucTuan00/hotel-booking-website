export interface Amenity {
    id: string;
    name: string;
}

export type AmenitySortField = 'name' | 'createdAt';
export type SortOrder = 'asc' | 'desc';

export interface GetAllAmenitiesInput {
    search?: string;
    sortBy?: AmenitySortField;
    sortOrder?: SortOrder;
    page?: number;
    pageSize?: number;
}

export interface GetAllAmenitiesResponse {
    amenities: Amenity[];
    total?: number;
    currentPage?: number;
    pageSize?: number;
}

export interface CreateAmenityInput {
    name: string;
}

export interface UpdateAmenityInput {
    id: string;
    name: string;
}

export interface AmenityIdInput {
    id: string;
}

export interface DeleteAmenityResponse {
    message: string;
}