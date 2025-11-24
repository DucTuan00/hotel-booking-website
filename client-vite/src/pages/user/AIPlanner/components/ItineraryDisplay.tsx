import React from 'react';
import { Timeline, Tag, Collapse, Divider } from 'antd';
import {
    ClockCircleOutlined,
    EnvironmentOutlined,
    DollarOutlined,
    InfoCircleOutlined,
} from '@ant-design/icons';
import { GeneratedPlan, ActivityCategory } from '@/types/aiPlanner';
import { formatPrice } from '@/utils/formatPrice';

interface ItineraryDisplayProps {
    plan: GeneratedPlan;
}

const categoryColors: Record<ActivityCategory, string> = {
    [ActivityCategory.HOTEL]: '#8B1A1A',
    [ActivityCategory.DINING]: '#D4902A',
    [ActivityCategory.SPA]: '#a855f7',
    [ActivityCategory.SIGHTSEEING]: '#3b82f6',
    [ActivityCategory.SHOPPING]: '#ec4899',
    [ActivityCategory.CULTURE]: '#f59e0b',
    [ActivityCategory.NIGHTLIFE]: '#6366f1',
    [ActivityCategory.RELAXATION]: '#10b981',
};

const ItineraryDisplay: React.FC<ItineraryDisplayProps> = ({ plan }) => {
    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString('vi-VN', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
        });
    };

    const getCategoryLabel = (category: ActivityCategory): string => {
        const labels: Record<ActivityCategory, string> = {
            [ActivityCategory.HOTEL]: 'Khách sạn',
            [ActivityCategory.DINING]: 'Ẩm thực',
            [ActivityCategory.SPA]: 'Spa',
            [ActivityCategory.SIGHTSEEING]: 'Tham quan',
            [ActivityCategory.SHOPPING]: 'Mua sắm',
            [ActivityCategory.CULTURE]: 'Văn hóa',
            [ActivityCategory.NIGHTLIFE]: 'Giải trí',
            [ActivityCategory.RELAXATION]: 'Thư giãn',
        };
        return labels[category];
    };

    const items = plan.days.map((day) => ({
        key: day.dayNumber,
        label: (
            <div className="font-semibold text-lg">
                Ngày {day.dayNumber} - {formatDate(day.date)}
            </div>
        ),
        children: (
            <Timeline
                items={day.activities.map((activity) => ({
                    color: categoryColors[activity.category],
                    children: (
                        <div className="mb-4">
                            <div className="flex items-center gap-2 mb-2">
                                <ClockCircleOutlined className="text-gray-500" />
                                <span className="font-semibold">{activity.time}</span>
                                <Tag color={categoryColors[activity.category]}>
                                    {getCategoryLabel(activity.category)}
                                </Tag>
                            </div>
                            <p className="text-lg font-bold text-gray-800 !mb-2">
                                {activity.title}
                            </p>
                            <div className="flex items-center gap-2 mb-2 text-gray-600">
                                <EnvironmentOutlined />
                                <span>{activity.location}</span>
                            </div>
                            <p className="text-gray-700 mb-2">{activity.description}</p>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                                <span>{activity.duration} phút</span>
                                <span className="flex items-center gap-1">
                                    <DollarOutlined />
                                    {formatPrice(activity.estimatedCost)}
                                </span>
                            </div>
                        </div>
                    ),
                }))}
            />
        ),
    }));

    return (
        <div className="space-y-4">
            <Collapse items={items} defaultActiveKey={[1]} accordion={false} />

            <Divider />

            <div className="p-4 rounded-lg mb-4">
                <div className="flex items-center justify-between">
                    <span className="text-xl font-semibold text-gray-800">
                        Tổng Chi Phí Ước Tính
                    </span>
                    <span className="text-xl font-bold">
                        {formatPrice(plan.totalEstimatedCost)}
                    </span>
                </div>
            </div>

            <Divider />

            {plan.suggestions && plan.suggestions.length > 0 && (
                <div className="mb-4">
                    <p className="font-semibold text-lg !mb-2 flex items-center gap-2">
                        <InfoCircleOutlined className="text-[#D4902A]" />
                        Lời Khuyên Chung
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                        {plan.suggestions.map((tip, index) => (
                            <li key={index}>{tip}</li>
                        ))}
                    </ul>
                </div>
            )}

            {plan.hanoiTips && plan.hanoiTips.length > 0 && (
                <div>
                    <p className="font-semibold text-lg !mb-2 flex items-center gap-2">
                        <InfoCircleOutlined className="text-[#8B1A1A]" />
                        Lời Khuyên Về Hà Nội
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                        {plan.hanoiTips.map((tip, index) => (
                            <li key={index}>{tip}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default ItineraryDisplay;
