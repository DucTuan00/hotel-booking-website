export interface Amenity {
    id: string;
    name: string;
}

export interface GetAllAmenitiesInput {
    page?: number;
    pageSize?: number;
    filter?: Record<string, unknown>;
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