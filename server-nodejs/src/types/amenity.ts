export interface CreateAmenityInput {
    name: string;
}

export interface UpdateAmenityInput {
    id: string;
    name: string;
}

export interface GetAllAmenitiesInput {
    filter?: {
        search?: string; 
    };
    page?: number;
    pageSize?: number;
}

export interface GetAmenityByIdInput {
    id: string;
}