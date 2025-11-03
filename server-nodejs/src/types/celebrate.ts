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

export interface GetAllCelebrateItemsResponse {
    items: CelebrateItem[];
    total?: number;
    currentPage?: number;
    pageSize?: number;
}

export interface CelebrateItem {
    id: string;
    name: string;
    description?: string;
    price: number;
    imagePath?: string;
    createdAt: Date;
    updatedAt: Date;
}
