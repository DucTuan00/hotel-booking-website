import React, { useState, useEffect, useCallback } from 'react';
import { Button, Row, Typography } from 'antd';
import { PlusOutlined, SaveOutlined } from '@ant-design/icons';
import Notification from '@/components/Notification';
import spaImageService from '@/services/spa/spaImageService';
import uploadService from '@/services/upload/uploadService';
import { SpaImage } from '@/types/spa';
import { Message } from '@/types/message';
import ImageItems from '@/pages/admin/Spa/Images/ImageItems';

const { Title } = Typography;

const SpaImageList: React.FC = () => {
    const [existingImages, setExistingImages] = useState<SpaImage[]>([]);
    const [newImages, setNewImages] = useState<File[]>([]);
    const [deletedImageIds, setDeletedImageIds] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [saving, setSaving] = useState<boolean>(false);
    const [message, setMessage] = useState<Message | null>(null);

    const fetchImages = useCallback(async () => {
        setLoading(true);
        try {
            const data = await spaImageService.getAllSpaImages();
            setExistingImages(data.images as SpaImage[]);
        } catch (error) {
            console.error("Error when fetch spa images:", error);
            setMessage({ type: 'error', text: 'Tải danh sách ảnh spa thất bại.' });
            setExistingImages([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchImages();
    }, [fetchImages]);

    const handleAddImages = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.multiple = true;
        input.accept = 'image/jpeg,image/png';
        input.onchange = (e) => {
            const files = Array.from((e.target as HTMLInputElement).files || []);
            if (files.length > 0) {
                // Validate file types and sizes
                const validFiles = files.filter(file => {
                    const isValidType = file.type === 'image/jpeg' || file.type === 'image/png';
                    const isValidSize = file.size <= 5 * 1024 * 1024;
                    
                    if (!isValidType) {
                        setMessage({ type: 'error', text: `File ${file.name}: Chỉ chấp nhận JPG/PNG` });
                        return false;
                    }
                    if (!isValidSize) {
                        setMessage({ type: 'error', text: `File ${file.name}: Kích thước phải < 5MB` });
                        return false;
                    }
                    return true;
                });
                
                setNewImages(prev => [...prev, ...validFiles]);
            }
        };
        input.click();
    };

    const handleDeleteExisting = (imageId: string) => {
        setDeletedImageIds(prev => [...prev, imageId]);
    };

    const handleRestoreExisting = (imageId: string) => {
        setDeletedImageIds(prev => prev.filter(id => id !== imageId));
    };

    const handleDeleteNew = (index: number) => {
        setNewImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const uploadedPaths: string[] = [];
            if (newImages.length > 0) {
                for (const file of newImages) {
                    const result = await uploadService.uploadImage(file);
                    uploadedPaths.push(result.url);
                }

                for (const imagePath of uploadedPaths) {
                    await spaImageService.createSpaImage({
                        imagePath,
                        title: '',
                        description: ''
                    });
                }
            }

            if (deletedImageIds.length > 0) {
                for (const imageId of deletedImageIds) {
                    await spaImageService.deleteSpaImage(imageId);
                }
            }

            setNewImages([]);
            setDeletedImageIds([]);
            await fetchImages();
            
            setMessage({ 
                type: 'success', 
                text: `Đã lưu thành công! ${uploadedPaths.length} ảnh mới, ${deletedImageIds.length} ảnh đã xóa.` 
            });
        } catch (error) {
            console.error("Error saving images:", error);
            setMessage({ type: 'error', text: 'Lưu ảnh thất bại.' });
        } finally {
            setSaving(false);
        }
    };

    // Filter existing images (exclude deleted ones)
    const visibleExistingImages = existingImages.filter(img => !deletedImageIds.includes(img.id));
    
    // Check if there are changes to save
    const hasChanges = newImages.length > 0 || deletedImageIds.length > 0;

    return (
        <div style={{ padding: '24px' }}>
            <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                marginBottom: '24px' 
            }}>
                <Title level={2} style={{ margin: 0 }}>Quản lý ảnh spa</Title>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <Button 
                        icon={<PlusOutlined />} 
                        onClick={handleAddImages}
                        size="large"
                    >
                        Thêm ảnh
                    </Button>
                    <Button 
                        type="primary"
                        icon={<SaveOutlined />} 
                        onClick={handleSave}
                        loading={saving}
                        disabled={!hasChanges}
                        size="large"
                    >
                        Lưu {hasChanges && `(${newImages.length + deletedImageIds.length})`}
                    </Button>
                </div>
            </div>

            {/* Summary of changes */}
            {hasChanges && (
                <div style={{
                    padding: '12px 16px',
                    backgroundColor: '#f6ffed',
                    border: '1px solid #b7eb8f',
                    borderRadius: '6px',
                    marginBottom: '16px'
                }}>
                    <div style={{ fontSize: '14px', color: '#389e0d' }}>
                        Thay đổi chưa lưu: 
                        {newImages.length > 0 && ` +${newImages.length} ảnh mới`}
                        {deletedImageIds.length > 0 && ` -${deletedImageIds.length} ảnh xóa`}
                    </div>
                </div>
            )}

            {/* Image Grid */}
            {visibleExistingImages.length === 0 && newImages.length === 0 && !loading ? (
                <div style={{
                    textAlign: 'center',
                    padding: '60px 20px',
                    backgroundColor: '#fafafa',
                    borderRadius: '8px',
                    border: '1px dashed #d9d9d9'
                }}>
                    <div style={{ fontSize: '16px', color: '#999' }}>
                        Chưa có ảnh spa nào. Hãy thêm ảnh đầu tiên!
                    </div>
                </div>
            ) : (
                <Row gutter={[16, 16]}>
                    <ImageItems
                        existingImages={existingImages}
                        onDeleteExisting={handleDeleteExisting}
                        newImages={newImages}
                        onDeleteNew={handleDeleteNew}
                        deletedImageIds={deletedImageIds}
                        onRestoreExisting={handleRestoreExisting}
                        loading={loading}
                    />
                </Row>
            )}

            {message && (
                <Notification
                    message={message}
                    onClose={() => setMessage(null)}
                />
            )}
        </div>
    );
};

export default SpaImageList;