import React, { useState, useEffect } from 'react';
import { Timeline, Tag, Collapse, Divider, Skeleton } from 'antd';
import {
    ClockCircleOutlined,
    EnvironmentOutlined,
    DollarOutlined,
    InfoCircleOutlined,
} from '@ant-design/icons';
import { GeneratedPlan, ActivityCategory } from '@/types/aiPlanner';
import { formatPrice } from '@/utils/formatPrice';
import '@/pages/user/AIPlanner/AIPlanner.css';

interface ItineraryDisplayProps {
    plan: GeneratedPlan;
    isNewPlan?: boolean; // Flag to trigger progressive animation
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

const ItineraryDisplay: React.FC<ItineraryDisplayProps> = ({ plan, isNewPlan = false }) => {
    // Progressive reveal state
    const [visibleDays, setVisibleDays] = useState<number>(isNewPlan ? 0 : plan.days.length);
    const [showSummary, setShowSummary] = useState<boolean>(!isNewPlan);
    const [showSuggestions, setShowSuggestions] = useState<boolean>(!isNewPlan);
    const [showHanoiTips, setShowHanoiTips] = useState<boolean>(!isNewPlan);

    // Progressive animation effect
    useEffect(() => {
        if (!isNewPlan) {
            setVisibleDays(plan.days.length);
            setShowSummary(true);
            setShowSuggestions(true);
            setShowHanoiTips(true);
            return;
        }

        // Reset for new plan
        setVisibleDays(0);
        setShowSummary(false);
        setShowSuggestions(false);
        setShowHanoiTips(false);

        // Reveal days one by one
        const dayTimers: NodeJS.Timeout[] = [];
        plan.days.forEach((_, index) => {
            const timer = setTimeout(() => {
                setVisibleDays(index + 1);
            }, (index + 1) * 600); // 600ms delay between each day
            dayTimers.push(timer);
        });

        // Show summary after all days
        const summaryTimer = setTimeout(() => {
            setShowSummary(true);
        }, (plan.days.length + 1) * 600);

        // Show suggestions
        const suggestionsTimer = setTimeout(() => {
            setShowSuggestions(true);
        }, (plan.days.length + 1.5) * 600);

        // Show Hanoi tips
        const hanoiTipsTimer = setTimeout(() => {
            setShowHanoiTips(true);
        }, (plan.days.length + 2) * 600);

        return () => {
            dayTimers.forEach(clearTimeout);
            clearTimeout(summaryTimer);
            clearTimeout(suggestionsTimer);
            clearTimeout(hanoiTipsTimer);
        };
    }, [plan, isNewPlan]);

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

    // Only show visible days
    const visiblePlanDays = plan.days.slice(0, visibleDays);

    // Animation class helper - only animate for new plans
    const animateFadeIn = isNewPlan ? 'ai-planner-animate-fadeIn' : '';
    const animateSlideIn = isNewPlan ? 'ai-planner-animate-slideIn' : '';

    const items = visiblePlanDays.map((day) => ({
        key: day.dayNumber,
        label: (
            <div className={`font-semibold text-lg ${animateFadeIn}`}>
                Ngày {day.dayNumber} - {formatDate(day.date)}
            </div>
        ),
        children: (
            <Timeline
                items={day.activities.map((activity) => ({
                    color: categoryColors[activity.category],
                    children: (
                        <div className={`mb-4 ${animateSlideIn}`}>
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

    // Skeleton for upcoming days
    const skeletonDays = isNewPlan && visibleDays < plan.days.length ? (
        <div className="mt-4 space-y-4">
            {Array.from({ length: Math.min(2, plan.days.length - visibleDays) }).map((_, i) => (
                <div key={`skeleton-${i}`} className="border rounded-lg p-4">
                    <Skeleton active paragraph={{ rows: 3 }} />
                </div>
            ))}
        </div>
    ) : null;

    return (
        <div className="space-y-4">
            {items.length > 0 && (
                <Collapse 
                    items={items} 
                    defaultActiveKey={visiblePlanDays.map(d => d.dayNumber)} 
                    accordion={false} 
                />
            )}
            
            {skeletonDays}

            {showSummary && (
                <>
                    <Divider className={animateFadeIn} />
                    <div className={`p-4 mb-4 ${animateFadeIn}`}>
                        <div className="flex items-center justify-between">
                            <span className="text-xl font-semibold text-gray-800">
                                Tổng Chi Phí Ước Tính
                            </span>
                            <span className="text-xl font-bold">
                                {formatPrice(plan.totalEstimatedCost)}
                            </span>
                        </div>
                    </div>
                </>
            )}

            {showSuggestions && plan.suggestions && plan.suggestions.length > 0 && (
                <>
                    <Divider className={animateFadeIn} />
                    <div className={`mb-4 ${animateFadeIn}`}>
                        <p className="font-semibold text-lg !mb-2 flex items-center gap-2">
                            <InfoCircleOutlined />
                            Lời Khuyên Chung
                        </p>
                        <ul className="list-disc list-inside space-y-1 text-gray-700">
                            {plan.suggestions.map((tip, index) => (
                                <li key={index} className={animateSlideIn} style={isNewPlan ? { animationDelay: `${index * 100}ms` } : undefined}>
                                    {tip}
                                </li>
                            ))}
                        </ul>
                    </div>
                </>
            )}

            {showHanoiTips && plan.hanoiTips && plan.hanoiTips.length > 0 && (
                <div className={animateFadeIn}>
                    <p className="font-semibold text-lg !mb-2 flex items-center gap-2">
                        <InfoCircleOutlined />
                        Lời Khuyên Về Hà Nội
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                        {plan.hanoiTips.map((tip, index) => (
                            <li key={index} className={animateSlideIn} style={isNewPlan ? { animationDelay: `${index * 100}ms` } : undefined}>
                                {tip}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default ItineraryDisplay;
