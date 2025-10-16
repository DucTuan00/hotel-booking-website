import React, { useRef } from 'react';
import { Image, Button } from 'antd';
import { PlusOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd';

interface ImageItemsProps {
    fileList: UploadFile[];
    onChange: (fileList: UploadFile[]) => void;
    maxCount?: number;
}

const ImageItems: React.FC<ImageItemsProps> = ({ fileList, onChange, maxCount = 5 }) => {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        const newFiles: UploadFile[] = [];
        
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            
            // Create preview URL
            const preview = await new Promise<string>((resolve) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => resolve(reader.result as string);
            });

            newFiles.push({
                uid: `new-${Date.now()}-${i}`,
                name: file.name,
                status: 'done',
                originFileObj: file as any,
                preview: preview,
            });
        }

        onChange([...fileList, ...newFiles]);
        
        // Reset input
        if (inputRef.current) {
            inputRef.current.value = '';
        }
    };

    const handleRemove = (uid: string) => {
        const newFileList = fileList.filter(file => file.uid !== uid);
        onChange(newFileList);
    };

    const handleUploadClick = () => {
        inputRef.current?.click();
    };

    return (
        <>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {fileList.map((file) => {
                    const imageUrl = file.url || file.preview;
                    
                    return (
                        <div
                            key={file.uid}
                            style={{
                                position: 'relative',
                                width: '104px',
                                height: '104px',
                                border: '1px solid #d9d9d9',
                                borderRadius: '8px',
                                overflow: 'hidden',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: '#fafafa',
                            }}
                        >
                            <Image
                                src={imageUrl}
                                alt={file.name}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                }}
                                preview={{
                                    mask: <EyeOutlined style={{ fontSize: '18px' }} />
                                }}
                            />
                            <Button
                                type="text"
                                danger
                                icon={<DeleteOutlined />}
                                size="small"
                                style={{
                                    position: 'absolute',
                                    top: '4px',
                                    right: '4px',
                                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                    zIndex: 1,
                                }}
                                onClick={() => handleRemove(file.uid)}
                            />
                        </div>
                    );
                })}
                
                {fileList.length < maxCount && (
                    <div
                        style={{
                            width: '104px',
                            height: '104px',
                            border: '1px dashed #d9d9d9',
                            borderRadius: '8px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            backgroundColor: '#fafafa',
                            transition: 'border-color 0.3s',
                        }}
                        onClick={handleUploadClick}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = '#1890ff';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = '#d9d9d9';
                        }}
                    >
                        <PlusOutlined style={{ fontSize: '20px', color: '#999' }} />
                        <div style={{ marginTop: '8px', fontSize: '12px', color: '#999' }}>
                            Tải ảnh
                        </div>
                    </div>
                )}
            </div>
            
            <input
                ref={inputRef}
                type="file"
                accept="image/png, image/jpeg, image/jpg"
                multiple
                style={{ display: 'none' }}
                onChange={handleFileSelect}
            />
            
            <p style={{ color: '#666', fontSize: '12px', marginTop: '8px', marginBottom: 0 }}>
                Tối đa {maxCount} hình ảnh. Định dạng: JPG, PNG
            </p>
        </>
    );
};

export default ImageItems;
