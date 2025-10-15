import cloudinary from '@/config/cloudinary';
import { UploadApiResponse } from 'cloudinary';
import ApiError from '@/utils/apiError';

export async function uploadImageToCloudinary(
    fileBuffer: Buffer,
): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                resource_type: 'image',
                upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET,
            },
            (error, result) => {
                if (error) {
                    return reject(new ApiError(`Cloudinary upload failed: ${error.message}`, 500));
                }
                resolve(result as UploadApiResponse);
            }
        );

        uploadStream.end(fileBuffer);
    });
}

export async function uploadMultipleImagesToCloudinary(
    fileBuffers: Buffer[],
): Promise<UploadApiResponse[]> {
    const uploadPromises = fileBuffers.map((buffer) =>
        uploadImageToCloudinary(buffer)
    );
    return Promise.all(uploadPromises);
}

export async function deleteImageFromCloudinary(publicId: string): Promise<any> {
    try {
        const result = await cloudinary.uploader.destroy(publicId);
        
        if (result.result !== 'ok' && result.result !== 'not found') {
            throw new ApiError(`Failed to delete image: ${result.result}`, 500);
        }
        
        return result;
    } catch (error: any) {
        throw new ApiError(`Cloudinary delete failed: ${error.message}`, 500);
    }
}

export async function deleteMultipleImagesFromCloudinary(publicIds: string[]): Promise<any> {
    try {
        const result = await cloudinary.api.delete_resources(publicIds);
        return result;
    } catch (error: any) {
        throw new ApiError(`Cloudinary batch delete failed: ${error.message}`, 500);
    }
}

export function getOptimizedImageUrl(
    publicId: string,
    width: number = 800,
    height: number = 600
): string {
    return cloudinary.url(publicId, {
        width,
        height,
        crop: 'limit',
        format: 'jpg',
        quality: 'auto',
    });
}
