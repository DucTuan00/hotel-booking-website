// MARK: Input
export interface CreateReviewInput {
    bookingId: string;
    userId: string;
    roomId: string;
    rating: number;
    comment?: string;
}

export interface GetReviewsByRoomInput {
    roomId: string;
    page?: number;
    pageSize?: number;
}

export interface CheckReviewEligibilityInput {
    userId: string;
    bookingId: string;
}

// MARK: Response
export interface ReviewResponse {
    id: string;
    bookingId: string;
    userId: {
        id: string;
        name: string;
    };
    roomId: string;
    rating: number;
    comment?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface ReviewsListResponse {
    reviews: ReviewResponse[];
    total: number;
    currentPage: number;
    pageSize: number;
    averageRating: number;
}

export interface ReviewEligibilityResponse {
    canReview: boolean;
    reason?: string;
    booking?: {
        id: string;
        roomName: string;
        checkOutDate: Date;
    };
}

export interface RoomRatingInfo {
    averageRating: number;
    totalReviews: number;
}

// MARK: Admin
export interface GetAllReviewsInput {
    page?: number;
    pageSize?: number;
    search?: string;
    rating?: number;
}

export interface AdminReviewResponse {
    id: string;
    bookingId: {
        id: string;
    };
    userId: {
        id: string;
        name: string;
        email: string;
    };
    roomId: {
        id: string;
        name: string;
        roomType: string;
    };
    rating: number;
    comment?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface AdminReviewsListResponse {
    reviews: AdminReviewResponse[];
    total: number;
    currentPage: number;
    pageSize: number;
}
