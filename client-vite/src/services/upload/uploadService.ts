import api from '@/services/api';

export interface UploadResponse {
    url: string;
    filename: string;
}

const uploadImage = async (file: File): Promise<UploadResponse> => {
    try {
        const formData = new FormData();
        formData.append('image', file);
        
        const response = await api.post('/upload/image', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        
        return response.data;
    } catch (error) {
        console.error('Error uploading image:', error);
        throw error;
    }
};

const deleteImage = async (filename: string): Promise<{ message: string }> => {
    try {
        const response = await api.delete(`/upload/image/${filename}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting image:', error);
        throw error;
    }
};

export default {
    uploadImage,
    deleteImage,
};