// MARK: Input
export interface CreateCelebrateItemInput {
    name: string;
    description?: string;
    price: number;
    imagePath?: string;
}

export interface UpdateCelebrateItemInput extends CreateCelebrateItemInput {
    id: string;
}

export interface CelebrateItemIdInput {
    id: string;
}

// MARK: Response
export interface GetAllCelebrateItemsResponse {
    items: CelebrateItem[];
    total?: number;
    currentPage?: number;
    pageSize?: number;
}

// MARK: Interface
export interface CelebrateItem {
    id: string;
    name: string;
    description?: string;
    price: number;
    imagePath?: string;
    createdAt: Date;
    updatedAt: Date;
}
