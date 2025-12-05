import Review from '@/models/Review';
import Booking from '@/models/Booking';
import Room from '@/models/Room';
import User from '@/models/User';
import ApiError from '@/utils/apiError';
import { mapId, mapIds } from '@/utils/mapId';
import mongoose from 'mongoose';
import {
    CreateReviewInput,
    GetReviewsByRoomInput,
    CheckReviewEligibilityInput,
    ReviewsListResponse,
    ReviewEligibilityResponse,
    RoomRatingInfo,
    GetAllReviewsInput,
    AdminReviewsListResponse,
    AdminReviewResponse
} from '@/types/review';
import { BookingStatus } from '@/types/booking';

/**
 * Check if user is eligible to review a booking
 * Rules:
 * 1. Booking must be checked out
 * 2. Within 14 days after checkout
 * 3. User hasn't reviewed this booking yet
 */
export async function checkReviewEligibility(args: CheckReviewEligibilityInput): Promise<ReviewEligibilityResponse> {
    const { userId, bookingId } = args;

    // Validate booking exists
    const booking = await Booking.findById(bookingId).populate('roomId', 'name');
    if (!booking) {
        return {
            canReview: false,
            reason: 'Booking not found'
        };
    }

    // Check if booking belongs to user
    if (booking.userId.toString() !== userId) {
        return {
            canReview: false,
            reason: 'This booking does not belong to you'
        };
    }

    // Check if booking is checked out
    if (booking.status !== BookingStatus.CHECKED_OUT) {
        return {
            canReview: false,
            reason: 'You can only review after checking out'
        };
    }

    // Check if within 14 days after checkout
    if (!booking.checkedOutAt) {
        return {
            canReview: false,
            reason: 'Checkout date not found'
        };
    }

    const now = new Date();
    const checkoutDate = new Date(booking.checkedOutAt);
    const daysSinceCheckout = Math.floor((now.getTime() - checkoutDate.getTime()) / (1000 * 60 * 60 * 24));

    if (daysSinceCheckout > 14) {
        return {
            canReview: false,
            reason: 'Review period has expired (14 days after checkout)'
        };
    }

    // Check if user has already reviewed this booking
    const existingReview = await Review.findOne({
        bookingId: bookingId,
        userId: userId,
        deletedAt: null
    });

    if (existingReview) {
        return {
            canReview: false,
            reason: 'You have already reviewed this booking'
        };
    }

    return {
        canReview: true,
        booking: {
            id: (booking as any)._id.toString(),
            roomName: (booking.roomId as any).name,
            checkOutDate: booking.checkedOutAt
        }
    };
}

/**
 * Create a new review
 */
export async function createReview(args: CreateReviewInput) {
    const { bookingId, userId, roomId, rating, comment } = args;

    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
        throw new ApiError('Rating must be between 1 and 5', 400);
    }

    // Check eligibility
    const eligibility = await checkReviewEligibility({ userId, bookingId });
    if (!eligibility.canReview) {
        throw new ApiError(eligibility.reason || 'Cannot create review', 400);
    }

    // Validate room
    const room = await Room.findById(roomId);
    if (!room || room.deletedAt) {
        throw new ApiError('Room not found', 404);
    }

    // Validate user
    const user = await User.findById(userId);
    if (!user || !user.active) {
        throw new ApiError('User not found or inactive', 404);
    }

    // Create review
    const newReview = new Review({
        bookingId,
        userId,
        roomId,
        rating,
        comment: comment?.trim() || undefined
    });

    const savedReview = await newReview.save();

    // Populate user info for response
    const populatedReview = await Review.findById(savedReview._id)
        .populate({ path: 'userId', select: 'name' });

    if (!populatedReview) {
        throw new ApiError('Failed to retrieve created review', 500);
    }

    return mapId(populatedReview);
}

/**
 * Get all reviews for a specific room
 */
export async function getReviewsByRoom(args: GetReviewsByRoomInput): Promise<ReviewsListResponse> {
    const { roomId, page = 1, pageSize = 10 } = args;

    const skip = (page - 1) * pageSize;

    // Get reviews with pagination
    const [reviews, totalReviews] = await Promise.all([
        Review.find({ roomId, deletedAt: null })
            .populate({ path: 'userId', select: 'name' })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(pageSize),
        Review.countDocuments({ roomId, deletedAt: null })
    ]);

    // Calculate average rating
    const ratingStats = await Review.aggregate([
        { $match: { roomId: new mongoose.Types.ObjectId(roomId), deletedAt: null } },
        {
            $group: {
                _id: null,
                averageRating: { $avg: '$rating' },
                totalReviews: { $sum: 1 }
            }
        }
    ]);

    const averageRating = ratingStats.length > 0 ? Math.round(ratingStats[0].averageRating * 10) / 10 : 0;

    return {
        reviews: mapIds(reviews) as any, // mapId utility handles the transformation
        total: totalReviews,
        currentPage: page,
        pageSize: pageSize,
        averageRating
    };
}

/**
 * Get room rating statistics
 */
export async function getRoomRating(roomId: string): Promise<RoomRatingInfo> {
    const ratingStats = await Review.aggregate([
        { $match: { roomId: new mongoose.Types.ObjectId(roomId), deletedAt: null } },
        {
            $group: {
                _id: null,
                averageRating: { $avg: '$rating' },
                totalReviews: { $sum: 1 }
            }
        }
    ]);

    if (ratingStats.length === 0) {
        return {
            averageRating: 0,
            totalReviews: 0
        };
    }

    return {
        averageRating: Math.round(ratingStats[0].averageRating * 10) / 10,
        totalReviews: ratingStats[0].totalReviews
    };
}

/**
 * Get eligible bookings for review by user
 */
export async function getEligibleBookingsForReview(userId: string) {
    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

    // Find checked out bookings within 14 days
    const eligibleBookings = await Booking.find({
        userId,
        status: BookingStatus.CHECKED_OUT,
        checkedOutAt: { $gte: fourteenDaysAgo }
    })
        .populate({ path: 'roomId', select: 'name roomType' })
        .sort({ checkedOutAt: -1 });

    // Filter out already reviewed bookings
    const bookingsWithReviewStatus = await Promise.all(
        eligibleBookings.map(async (booking) => {
            const existingReview = await Review.findOne({
                bookingId: booking._id,
                userId,
                deletedAt: null
            });

            return {
                ...mapId(booking),
                hasReview: !!existingReview
            };
        })
    );

    return bookingsWithReviewStatus.filter(b => !b.hasReview);
}

/**
 * Get all reviews for admin
 */
export async function getAllReviews(args: GetAllReviewsInput): Promise<AdminReviewsListResponse> {
    const { page = 1, pageSize = 10, search, rating } = args;
    const skip = (page - 1) * pageSize;

    // Build query
    const query: any = { deletedAt: null };

    // Filter by rating
    if (rating && rating >= 1 && rating <= 5) {
        query.rating = rating;
    }

    // Get total count first
    let totalReviews = await Review.countDocuments(query);

    // Get reviews with pagination
    let reviews = await Review.find(query)
        .populate({ path: 'userId', select: 'name email' })
        .populate({ path: 'roomId', select: 'name roomType' })
        .populate({ path: 'bookingId', select: '_id' })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(pageSize);

    // If search is provided, filter by user name, room name, or comment
    if (search && search.trim()) {
        const searchLower = search.toLowerCase().trim();
        reviews = reviews.filter((review: any) => {
            const userName = review.userId?.name?.toLowerCase() || '';
            const userEmail = review.userId?.email?.toLowerCase() || '';
            const roomName = review.roomId?.name?.toLowerCase() || '';
            const comment = review.comment?.toLowerCase() || '';
            return userName.includes(searchLower) || 
                   userEmail.includes(searchLower) ||
                   roomName.includes(searchLower) || 
                   comment.includes(searchLower);
        });
        totalReviews = reviews.length;
    }

    return {
        reviews: mapIds(reviews) as unknown as AdminReviewResponse[],
        total: totalReviews,
        currentPage: page,
        pageSize: pageSize
    };
}

/**
 * Delete review (soft delete) for admin
 */
export async function deleteReview(reviewId: string): Promise<void> {
    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
        throw new ApiError('Invalid review ID', 400);
    }

    const review = await Review.findOne({ _id: reviewId, deletedAt: null });

    if (!review) {
        throw new ApiError('Review not found', 404);
    }

    review.deletedAt = new Date();
    await review.save();
}
