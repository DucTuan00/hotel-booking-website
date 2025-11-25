// MARK: Input
export interface CreateRestaurantServiceInput {
    title: string;
    description?: string;
    price?: number;
    imagePath?: string;
}

export interface UpdateRestaurantServiceInput extends CreateRestaurantServiceInput {
    id: string;
}

export interface RestaurantServiceIdInput {
    id: string;
}

export interface CreateRestaurantImageInput {
    imagePath: string;
    title?: string;
    description?: string;
}

// MARK: Response
export interface GetAllRestaurantServicesResponse {
    services: RestaurantService[];
    total?: number;
    currentPage?: number;
    pageSize?: number;
}

// MARK: Interface
export interface RestaurantService {
    id: string;
    restaurantId: string;
    title: string;
    description?: string;
    price?: number;
    imagePath?: string;
    createdAt: Date;
    updatedAt: Date;
}