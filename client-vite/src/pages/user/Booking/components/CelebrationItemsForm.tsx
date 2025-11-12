import React from 'react';
import { Checkbox, Divider, Button } from 'antd';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { CelebrateItem } from '@/types/celebrate';
import { formatPrice } from '@/utils/formatPrice';

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

    return (
        <div className="mb-6">
            <Divider />
            <h3 className="text-lg font-medium mb-4">Quà kỷ niệm (tùy chọn)</h3>
            
            <div className="space-y-4">
                {items.map((item) => {
                    const isSelected = selectedItems.has(item.id);
                    const quantity = selectedItems.get(item.id) || 1;
                    
                    return (
                        <div 
                            key={item.id}
                            className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <Checkbox
                                checked={isSelected}
                                onChange={(e) => handleCheckboxChange(item.id, e.target.checked)}
                                className="mt-1"
                            />
                            
                            <div className="flex-1">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <h4 className="font-medium text-base mb-1">{item.name}</h4>
                                        {item.description && (
                                            <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                                        )}
                                        <p className="text-base font-semibold text-[#D4902A] mb-2">
                                            {formatPrice(item.price)}
                                        </p>
                                        
                                        {/* Quantity selector - only show when checked */}
                                        {isSelected && (
                                            <div className="flex items-center gap-2 mt-2">
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
                                        )}
                                    </div>
                                    
                                    {item.imagePath && (
                                        <img
                                            src={item.imagePath}
                                            alt={item.name}
                                            className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default CelebrationItemsForm;
