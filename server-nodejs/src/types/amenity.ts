// MARK: Type
export type AmenitySortField = 'name' | 'createdAt';
export type SortOrder = 'asc' | 'desc';

// MARK: Input
export interface CreateAmenityInput {
    name: string;
}

export interface UpdateAmenityInput {
    id: string;
    name: string;
}

export interface GetAllAmenitiesInput {
    search?: string;
    sortBy?: AmenitySortField;
    sortOrder?: SortOrder;
    page?: number;
    pageSize?: number;
}

export interface GetAmenityByIdInput {
    id: string;
}