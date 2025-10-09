import React from 'react';
import { Button, Card, Col, Image } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { RestaurantImage } from '@/types/restaurant';

interface ImageItemsProps {
    existingImages: RestaurantImage[];
    onDeleteExisting: (imageId: string) => void;

    newImages: File[];
    onDeleteNew: (index: number) => void;

    deletedImageIds: string[];
    onRestoreExisting: (imageId: string) => void;

    loading?: boolean;
}

const ImageItems: React.FC<ImageItemsProps> = ({
    existingImages,
    onDeleteExisting,
    newImages,
    onDeleteNew,
    deletedImageIds,
    onRestoreExisting,
    loading = false
}) => {
    // Filter existing images (exclude deleted ones for main display)
    const visibleExistingImages = existingImages.filter(img => !deletedImageIds.includes(img.id));
    
    return (
        <>
            {/* Existing Images */}
            {visibleExistingImages.map((image) => (
                <Col xs={24} sm={12} md={8} lg={6} key={image.id}>
                    <Card
                        loading={loading}
                        bodyStyle={{ padding: 0 }}
                        cover={
                            <div style={{ height: '250px', overflow: 'hidden', position: 'relative' }}>
                                <Image
                                    alt="Restaurant image"
                                    src={`http://localhost:3000/${image.imagePath}`}
                                    style={{ 
                                        width: '100%', 
                                        height: '100%', 
                                        objectFit: 'cover' 
                                    }}
                                />
                            </div>
                        }
                        actions={[
                            <Button 
                                key="delete"
                                type="link" 
                                icon={<DeleteOutlined />} 
                                onClick={() => onDeleteExisting(image.id)}
                                danger
                                title="Xóa"
                            />
                        ]}
                        style={{ border: '1px solid #d9d9d9' }}
                    />
                </Col>
            ))}

            {/* New Images Preview */}
            {newImages.map((file, index) => (
                <Col xs={24} sm={12} md={8} lg={6} key={`new-${index}`}>
                    <Card
                        bodyStyle={{ padding: 0 }}
                        cover={
                            <div style={{ height: '250px', overflow: 'hidden', position: 'relative' }}>
                                <img
                                    alt="New image preview"
                                    src={URL.createObjectURL(file)}
                                    style={{ 
                                        width: '100%', 
                                        height: '100%', 
                                        objectFit: 'cover' 
                                    }}
                                />
                                <div style={{
                                    position: 'absolute',
                                    top: '8px',
                                    left: '8px',
                                    backgroundColor: 'rgba(24, 144, 255, 0.8)',
                                    color: 'white',
                                    padding: '2px 8px',
                                    borderRadius: '4px',
                                    fontSize: '12px'
                                }}>
                                    Mới
                                </div>
                            </div>
                        }
                        actions={[
                            <Button 
                                key="delete"
                                type="link" 
                                icon={<DeleteOutlined />} 
                                onClick={() => onDeleteNew(index)}
                                danger
                                title="Xóa"
                            />
                        ]}
                        style={{ border: '2px solid #1890ff' }}
                    />
                </Col>
            ))}

            {/* Deleted Images */}
            {deletedImageIds.map((imageId) => {
                const image = existingImages.find(img => img.id === imageId);
                if (!image) return null;
                
                return (
                    <Col xs={24} sm={12} md={8} lg={6} key={`deleted-${image.id}`}>
                        <Card
                            bodyStyle={{ padding: 0 }}
                            cover={
                                <div style={{ height: '250px', overflow: 'hidden', position: 'relative' }}>
                                    <Image
                                        alt="Deleted image"
                                        src={`http://localhost:3000/${image.imagePath}`}
                                        style={{ 
                                            width: '100%', 
                                            height: '100%', 
                                            objectFit: 'cover',
                                            opacity: 0.5,
                                            filter: 'grayscale(100%)'
                                        }}
                                    />
                                    <div style={{
                                        position: 'absolute',
                                        top: '8px',
                                        left: '8px',
                                        backgroundColor: 'rgba(255, 77, 79, 0.8)',
                                        color: 'white',
                                        padding: '2px 8px',
                                        borderRadius: '4px',
                                        fontSize: '12px'
                                    }}>
                                        Sẽ xóa
                                    </div>
                                </div>
                            }
                            actions={[
                                <Button 
                                    key="restore"
                                    type="link"
                                    onClick={() => onRestoreExisting(image.id)}
                                    style={{ color: '#1890ff' }}
                                >
                                    Khôi phục
                                </Button>
                            ]}
                            style={{ border: '2px solid #ff4d4f', opacity: 0.7 }}
                        />
                    </Col>
                );
            })}
        </>
    );
};

export default ImageItems;
