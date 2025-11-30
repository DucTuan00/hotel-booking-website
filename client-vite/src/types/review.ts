export interface CreateReviewInput {
    bookingId: string;
    roomId: string;
    rating: number;
    comment?: string;
}

export interface Review {
    id: string;
    bookingId: string;
    userId: {
        id: string;
        name: string;
    };
    roomId: string;
    rating: number;
    comment?: string;
    createdAt: string;
    updatedAt: string;
}

export interface GetReviewsByRoomResponse {
    reviews: Review[];
    total: number;
    currentPage: number;
    pageSize: number;
    averageRating: number;
}

export interface ReviewEligibility {
    canReview: boolean;
    reason?: string;
    booking?: {
        id: string;
        roomName: string;
        checkOutDate: string;
    };
}

export interface RoomRating {
    averageRating: number;
    totalReviews: number;
}

export interface EligibleBooking {
    id: string;
    roomId: {
        id: string;
        name: string;
        roomType: string;
    };
    checkIn: string;
    checkOut: string;
    checkedOutAt: string;
    hasReview: boolean;
}
