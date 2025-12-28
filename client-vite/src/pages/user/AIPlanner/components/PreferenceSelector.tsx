import React from 'react';
import { Select, InputNumber, Typography, Divider, Tag, Space } from 'antd';
import { GroupType, BudgetLevel } from '@/types/aiPlanner';

const { Text } = Typography;

interface PreferenceSelectorProps {
    groupType?: GroupType;
    groupSize?: number;
    budget?: BudgetLevel;
    interests: string[];
    dietaryRestrictions: string[];
    onGroupTypeChange: (value: GroupType) => void;
    onGroupSizeChange: (value: number | undefined) => void;
    onBudgetChange: (value: BudgetLevel) => void;
    onInterestsChange: (values: string[]) => void;
    onDietaryRestrictionsChange: (values: string[]) => void;
}

const PreferenceSelector: React.FC<PreferenceSelectorProps> = ({
    groupType,
    groupSize,
    budget,
    interests,
    dietaryRestrictions,
    onGroupTypeChange,
    onGroupSizeChange,
    onBudgetChange,
    onInterestsChange,
    onDietaryRestrictionsChange,
}) => {
    const groupTypeOptions = [
        { value: GroupType.SOLO, label: 'Đi một mình' },
        { value: GroupType.COUPLE, label: 'Đi cặp đôi' },
        { value: GroupType.FAMILY, label: 'Đi gia đình' },
        { value: GroupType.FRIENDS, label: 'Đi với bạn bè' },
    ];

    const budgetOptions = [
        { value: BudgetLevel.ECONOMY, label: 'Tiết kiệm' },
        { value: BudgetLevel.STANDARD, label: 'Trung bình' },
        { value: BudgetLevel.LUXURY, label: 'Sang trọng' },
    ];

    const interestOptions = [
        { value: 'ẩm thực', label: 'Ẩm thực' },
        { value: 'tham quan', label: 'Tham quan' },
        { value: 'mua sắm', label: 'Mua sắm' },
        { value: 'giải trí', label: 'Giải trí' },
        { value: 'thư giãn', label: 'Thư giãn' },
    ];

    const dietaryOptions = [
        { value: 'chay', label: 'Chay' },
        { value: 'halal', label: 'Halal' },
        { value: 'không gluten', label: 'Không gluten' },
        { value: 'không lactose', label: 'Không lactose' },
    ];

    const toggleInterest = (value: string) => {
        if (interests.includes(value)) {
            onInterestsChange(interests.filter((i) => i !== value));
            // Clear dietary restrictions if "ẩm thực" is deselected
            if (value === 'ẩm thực' && dietaryRestrictions.length > 0) {
                onDietaryRestrictionsChange([]);
            }
        } else {
            onInterestsChange([...interests, value]);
        }
    };

    const toggleDietary = (value: string) => {
        if (dietaryRestrictions.includes(value)) {
            onDietaryRestrictionsChange(dietaryRestrictions.filter((i) => i !== value));
        } else {
            onDietaryRestrictionsChange([...dietaryRestrictions, value]);
        }
    };

    // Check if "ẩm thực" is selected
    const isFoodSelected = interests.includes('ẩm thực');

    return (
        <div className="space-y-4">
            <div>
                <Text strong className="block mb-2">
                    Loại nhóm *
                </Text>
                <Select
                    className="w-full"
                    value={groupType}
                    onChange={onGroupTypeChange}
                    placeholder="Chọn loại nhóm"
                    options={groupTypeOptions}
                />
            </div>

            {groupType && groupType !== GroupType.SOLO && groupType !== GroupType.COUPLE && (
                <div>
                    <Text strong className="block mb-2">
                        Số người
                    </Text>
                    <InputNumber
                        className="w-full"
                        min={2}
                        max={20}
                        value={groupSize}
                        onChange={(value) => onGroupSizeChange(value ?? undefined)}
                        placeholder="Nhập số người"
                    />
                </div>
            )}

            <Divider className="my-4" />

            <div>
                <Text strong className="block mb-2">
                    Ngân sách *
                </Text>
                <Select
                    className="w-full"
                    value={budget}
                    onChange={onBudgetChange}
                    placeholder="Chọn mức ngân sách"
                    options={budgetOptions}
                />
            </div>

            <Divider className="my-4" />

            <div>
                <Text strong className="block mb-2">
                    Sở thích * (chọn ít nhất 1)
                </Text>
                <Space wrap className="w-full">
                    {interestOptions.map((option) => (
                        <Tag.CheckableTag
                            key={option.value}
                            checked={interests.includes(option.value)}
                            onChange={() => toggleInterest(option.value)}
                            className="px-3 py-1 text-sm cursor-pointer"
                            style={{
                                backgroundColor: interests.includes(option.value) ? '#D4902A' : undefined,
                                borderColor: interests.includes(option.value) ? '#D4902A' : undefined,
                                color: interests.includes(option.value) ? 'white' : undefined,
                            }}
                        >
                            {option.label}
                        </Tag.CheckableTag>
                    ))}
                </Space>
            </div>

            <Divider className="my-4" />

            <div className={!isFoodSelected ? 'opacity-50' : ''}>
                <Text strong className="block mb-2">
                    Hạn chế ăn uống (tùy chọn)
                </Text>
                <Space wrap className="w-full">
                    {dietaryOptions.map((option) => (
                        <Tag.CheckableTag
                            key={option.value}
                            checked={dietaryRestrictions.includes(option.value)}
                            onChange={() => isFoodSelected && toggleDietary(option.value)}
                            className={`px-3 py-1 text-sm ${isFoodSelected ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                            style={{
                                backgroundColor: dietaryRestrictions.includes(option.value) ? '#8B1A1A' : undefined,
                                borderColor: dietaryRestrictions.includes(option.value) ? '#8B1A1A' : undefined,
                                color: dietaryRestrictions.includes(option.value) ? 'white' : undefined,
                            }}
                        >
                            {option.label}
                        </Tag.CheckableTag>
                    ))}
                </Space>
            </div>
        </div>
    );
};

export default PreferenceSelector;