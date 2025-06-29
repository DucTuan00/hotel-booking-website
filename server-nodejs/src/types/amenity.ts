export interface CreateAmenityInput {
    name: string;
}

export interface UpdateAmenityInput {
    id: string;
    name: string;
}

export interface GetAllAmenitiesInput {
    filter?: Record<string, any>;
    page?: number;
    pageSize?: number;
}

export interface GetAmenityByIdInput {
    id: string;
}