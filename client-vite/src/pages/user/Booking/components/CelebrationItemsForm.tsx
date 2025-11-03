import React from 'react';
import { Checkbox, Divider } from 'antd';
import { CelebrateItem } from '@/types/celebrate';
import { formatPrice } from '@/utils/formatPrice';

interface CelebrationItemsFormProps {
    items: CelebrateItem[];
    selectedIds: string[];
    onSelectionChange: (selectedIds: string[]) => void;
}

const CelebrationItemsForm: React.FC<CelebrationItemsFormProps> = ({
    items,
    selectedIds,
    onSelectionChange
}) => {
    const handleCheckboxChange = (itemId: string, checked: boolean) => {
        if (checked) {
            onSelectionChange([...selectedIds, itemId]);
        } else {
            onSelectionChange(selectedIds.filter(id => id !== itemId));
        }
    };

    if (items.length === 0) {
        return null;
    }

    return (
        <div className="mb-6">
            <Divider />
            <h3 className="text-lg font-medium mb-4">Quà kỷ niệm (tùy chọn)</h3>
            
            <div className="space-y-4">
                {items.map((item) => (
                    <div 
                        key={item.id}
                        className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        <Checkbox
                            checked={selectedIds.includes(item.id)}
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
                                    <p className="text-base font-semibold text-[#D4902A]">
                                        {formatPrice(item.price)}
                                    </p>
                                </div>
                                
                                {item.imagePath && (
                                    <img
                                        src={item.imagePath}
                                        alt={item.name}
                                        className="w-20 h-20 object-cover rounded-lg"
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CelebrationItemsForm;
