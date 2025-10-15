import api from '@/services/api';

export interface UploadResponse {
    url: string;
    publicId: string;
    width?: number;
    height?: number;
    format?: string;
}

export interface CloudinaryUploadResponse {
    message: string;
    url: string;
    publicId: string;
    width: number;
    height: number;
    format: string;
}

export interface CloudinaryMultipleUploadResponse {
    message: string;
    data: UploadResponse[];
}

const uploadImage = async (file: File): Promise<UploadResponse> => {
    try {
        const formData = new FormData();
        formData.append('image', file);
        
        const response = await api.post<CloudinaryUploadResponse>('/upload/image', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        
        return {
            url: response.data.url,
            publicId: response.data.publicId,
            width: response.data.width,
            height: response.data.height,
            format: response.data.format,
        };
    } catch (error) {
        console.error('Error uploading image:', error);
        throw error;
    }
};

const uploadMultipleImages = async (files: File[]): Promise<UploadResponse[]> => {
    try {
        const formData = new FormData();
        files.forEach((file) => {
            formData.append('images', file);
        });
        
        const response = await api.post<CloudinaryMultipleUploadResponse>(
            '/upload/images',
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        );
        
        return response.data.data;
    } catch (error) {
        console.error('Error uploading multiple images:', error);
        throw error;
    }
};

const deleteImage = async (publicId: string): Promise<{ message: string }> => {
    try {
        const response = await api.delete('/upload/image', {
            data: { publicId }
        });
        return response.data;
    } catch (error) {
        console.error('Error deleting image:', error);
        throw error;
    }
};

export default {
    uploadImage,
    uploadMultipleImages,
    deleteImage,
};