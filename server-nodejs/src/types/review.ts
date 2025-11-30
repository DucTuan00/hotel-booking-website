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
