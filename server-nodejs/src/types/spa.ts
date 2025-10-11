export interface Spa {
    information: string;
}

export interface CreateSpaServiceInput {
    title: string;
    description?: string;
    price?: number;
    imagePath?: string;
}

export interface UpdateSpaServiceInput extends CreateSpaServiceInput {
    id: string;
}

export interface SpaService {
    spaId: string;
    title: string;
    description?: string;
    price?: number;
    imagePath?: string;
    deletedAt?: Date;
}

export interface CreateSpaImageInput {
    imagePath: string;
    title?: string;
    description?: string;
}

export interface SpaImage {
    spaId: string;
    imagePath: string;
    title?: string;
    description?: string;
    deletedAt?: Date;
}