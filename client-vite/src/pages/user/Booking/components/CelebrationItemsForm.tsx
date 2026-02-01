import React, { useRef } from 'react';
import { Checkbox, Divider, Button, Carousel } from 'antd';
import { MinusOutlined, PlusOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
import { CelebrateItem } from '@/types/celebrate';
import { formatPrice } from '@/utils/formatPrice';
import type { CarouselRef } from 'antd/es/carousel';

interface CelebrationItemsFormProps {
    items: CelebrateItem[];
    selectedItems: Map<string, number>;
    onSelectionChange: (selectedItems: Map<string, number>) => void;
}

const CelebrationItemsForm: React.FC<CelebrationItemsFormProps> = ({
    items,
    selectedItems,
    onSelectionChange
}) => {
    const carouselRef = useRef<CarouselRef>(null);

    const handleCheckboxChange = (itemId: string, checked: boolean) => {
        const newSelectedItems = new Map(selectedItems);
        if (checked) {
            newSelectedItems.set(itemId, 1); // Default quantity is 1
        } else {
            newSelectedItems.delete(itemId);
        }
        onSelectionChange(newSelectedItems);
    };

    const handleQuantityChange = (itemId: string, delta: number) => {
        const newSelectedItems = new Map(selectedItems);
        const currentQty = newSelectedItems.get(itemId) || 1;
        const newQty = Math.max(1, Math.min(10, currentQty + delta)); // Clamp between 1-10
        newSelectedItems.set(itemId, newQty);
        onSelectionChange(newSelectedItems);
    };

    if (items.length === 0) {
        return null;
    }

    const hasMultipleSlides = items.length > 1;

    const renderItem = (item: CelebrateItem) => {
        const isSelected = selectedItems.has(item.id);
        const quantity = selectedItems.get(item.id) || 1;

        return (
            <div 
                key={item.id}
                className="flex flex-col h-[410px] border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors p-4"
            >
                <div className="flex items-start gap-2 mb-3">
                    <Checkbox
                        checked={isSelected}
                        onChange={(e) => handleCheckboxChange(item.id, e.target.checked)}
                        className="mt-1"
                    />
                    <h4 className="font-medium text-base flex-1">{item.name}</h4>
                </div>

                {item.imagePath && (
                    <img
                        src={item.imagePath}
                        alt={item.name}
                        className="w-full !h-[200px] object-cover rounded-lg mb-3"
                    />
                )}

                {item.description && (
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2 h-[40px]">{item.description}</p>
                )}

                <p className="text-base font-semibold text-[#D4902A] mb-3">
                    {formatPrice(item.price)}
                </p>

                {/* Quantity selector - only show when checked */}
                {isSelected && (
                    <div className="mt-auto">
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">Số lượng:</span>
                            <div className="flex items-center border border-gray-300 rounded-md">
                                <Button
                                    type="text"
                                    size="small"
                                    icon={<MinusOutlined />}
                                    onClick={() => handleQuantityChange(item.id, -1)}
                                    disabled={quantity <= 1}
                                    className="px-2"
                                />
                                <span className="px-3 text-sm font-medium min-w-[2rem] text-center">
                                    {quantity}
                                </span>
                                <Button
                                    type="text"
                                    size="small"
                                    icon={<PlusOutlined />}
                                    onClick={() => handleQuantityChange(item.id, 1)}
                                    disabled={quantity >= 10}
                                    className="px-2"
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="mb-6">
            <Divider />
            <h3 className="text-lg font-medium mb-4">Quà kỷ niệm (tùy chọn)</h3>
            
            <div className="relative">
                {/* Navigation buttons - only show if there are multiple slides */}
                {hasMultipleSlides && (
                    <>
                        <div
                            onClick={() => carouselRef.current?.prev()}
                            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 -translate-x-1/2 w-10 h-10 rounded-full flex items-center justify-center cursor-pointer"
                        >
                            <LeftOutlined className="text-gray-700" />
                        </div>
                        <div
                            onClick={() => carouselRef.current?.next()}
                            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 translate-x-1/2 w-10 h-10 rounded-full flex items-center justify-center cursor-pointer"
                        >
                            <RightOutlined className="text-gray-700" />
                        </div>
                    </>
                )}

                <Carousel
                    ref={carouselRef}
                    dots={hasMultipleSlides}
                    infinite={false}
                    draggable={hasMultipleSlides}
                    slidesToShow={3}
                    responsive={[
                        {
                            breakpoint: 1024,
                            settings: {
                                slidesToShow: 2,
                                slidesToScroll: 1,
                            }
                        },
                        {
                            breakpoint: 768,
                            settings: {
                                slidesToShow: 1,
                                slidesToScroll: 1,
                            }
                        }
                    ]}
                >
                    {items.map(item => (
                        <div key={item.id} className="px-2">
                            {renderItem(item)}
                        </div>
                    ))}
                </Carousel>
            </div>
        </div>
    );
};

export default CelebrationItemsForm;
