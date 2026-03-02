import React, { useState, useEffect, useRef } from 'react';
import { Card, Button, Typography, DatePicker, List, Segmented, Collapse, Skeleton } from 'antd';
import { StarOutlined, CalendarOutlined, HistoryOutlined, FormOutlined, FileTextOutlined, RocketOutlined } from '@ant-design/icons';
import PreferenceSelector from './components/PreferenceSelector';
import ItineraryDisplay from './components/ItineraryDisplay';
import aiPlannerService from '@/services/aiPlanner/aiPlannerService';
import { TravelPlan, GroupType, BudgetLevel, UserPreferences } from '@/types/aiPlanner';
import { Message } from '@/types/message';
import Notification from '@/components/Notification';
import dayjs, { Dayjs } from 'dayjs';
import authService from '@/services/auth/authService';
import { useNavigate } from 'react-router-dom';
import '@/pages/user/AIPlanner/AIPlanner.css';
import { TYPOGRAPHY } from '@/config/constants';


const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

// Loading messages to cycle through
const loadingMessages = [
    'Đang phân tích sở thích của bạn...',
    'Đang tìm kiếm địa điểm phù hợp...',
    'Đang lên lịch trình chi tiết...',
    'Đang tính toán chi phí...',
    'Sắp hoàn thành rồi...',
];

const AIPlanner: React.FC = () => {
    const navigate = useNavigate();
    const [plan, setPlan] = useState<TravelPlan | null>(null);
    const [userPlans, setUserPlans] = useState<TravelPlan[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadingPlans, setLoadingPlans] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMorePlans, setHasMorePlans] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const PLANS_PER_PAGE = 10;
    const [message, setMessage] = useState<Message | null>(null);
    const [isNewPlan, setIsNewPlan] = useState(false); // Track if plan is newly generated
    const [loadingMessage, setLoadingMessage] = useState(loadingMessages[0]);
    
    // Mobile tab state
    const [mobileTab, setMobileTab] = useState<string>('preferences');
    const planDisplayRef = useRef<HTMLDivElement>(null);

    // Preference state
    const [travelDates, setTravelDates] = useState<[Dayjs, Dayjs] | null>(null);
    const [groupType, setGroupType] = useState<GroupType | undefined>();
    const [groupSize, setGroupSize] = useState<number | undefined>();
    const [budget, setBudget] = useState<BudgetLevel | undefined>();
    const [interests, setInterests] = useState<string[]>([]);
    const [dietaryRestrictions, setDietaryRestrictions] = useState<string[]>([]);

    // Fetch user's existing plans on mount
    useEffect(() => {
        const fetchUserPlans = async () => {
            setLoadingPlans(true);
            try {
                const response = await aiPlannerService.getUserPlans({ limit: PLANS_PER_PAGE, page: 1 });
                setUserPlans(response.plans);
                setHasMorePlans(response.plans.length === PLANS_PER_PAGE && response.pagination.total > PLANS_PER_PAGE);
                setCurrentPage(1);
            } catch (error) {
                console.error('Error fetching user plans:', error);
            } finally {
                setLoadingPlans(false);
            }
        };

        fetchUserPlans();
    }, []);

    // Load more plans handler
    const handleLoadMorePlans = async () => {
        if (loadingMore || !hasMorePlans) return;
        
        setLoadingMore(true);
        try {
            const nextPage = currentPage + 1;
            const response = await aiPlannerService.getUserPlans({ limit: PLANS_PER_PAGE, page: nextPage });
            setUserPlans(prev => [...prev, ...response.plans]);
            setCurrentPage(nextPage);
            setHasMorePlans(response.plans.length === PLANS_PER_PAGE && (nextPage * PLANS_PER_PAGE) < response.pagination.total);
        } catch (error) {
            console.error('Error loading more plans:', error);
        } finally {
            setLoadingMore(false);
        }
    };

    const handleViewPlan = (existingPlan: TravelPlan) => {
        setPlan(existingPlan);
        setIsNewPlan(false); // Not a new plan, no animation
        
        // Populate form with plan's preferences
        if (existingPlan.preferences.travelDates) {
            setTravelDates([
                dayjs(existingPlan.preferences.travelDates.checkIn),
                dayjs(existingPlan.preferences.travelDates.checkOut)
            ]);
        }
        if (existingPlan.preferences.groupType) setGroupType(existingPlan.preferences.groupType);
        if (existingPlan.preferences.groupSize) setGroupSize(existingPlan.preferences.groupSize);
        if (existingPlan.preferences.budget) setBudget(existingPlan.preferences.budget);
        if (existingPlan.preferences.interests) setInterests(existingPlan.preferences.interests);
        if (existingPlan.preferences.dietaryRestrictions) setDietaryRestrictions(existingPlan.preferences.dietaryRestrictions);
        
        // On mobile, switch to plan tab when viewing a plan
        setMobileTab('plan');
    };

    const handleGeneratePlan = async () => {
        if (!travelDates || !groupType || !budget || interests.length === 0) {
            setMessage({
                type: 'error',
                text: 'Vui lòng điền đầy đủ thông tin: ngày đi, loại nhóm, ngân sách và sở thích',
            });
            return;
        }

        // Check authentication before proceeding
        try {
            setLoading(true);
            await authService.verifyToken();
        } catch {
            setLoading(false);
            setMessage({
                type: 'error',
                text: 'Vui lòng đăng nhập để tiếp tục đặt phòng'
            });
            
            setTimeout(() => {
                navigate('/login', { 
                    state: { 
                        from: window.location.pathname,
                        returnUrl: window.location.pathname + window.location.search
                    } 
                });
            }, 3000);
            return;
        }

        setLoading(true);
        // On mobile, switch to plan tab immediately to show loading
        setMobileTab('plan');
        
        // Start cycling loading messages
        let messageIndex = 0;
        const messageInterval = setInterval(() => {
            messageIndex = (messageIndex + 1) % loadingMessages.length;
            setLoadingMessage(loadingMessages[messageIndex]);
        }, 2500);

        try {
            const preferences: UserPreferences = {
                travelDates: {
                    checkIn: travelDates[0].format('YYYY-MM-DD'),
                    checkOut: travelDates[1].format('YYYY-MM-DD'),
                },
                groupType,
                groupSize,
                budget,
                interests,
                dietaryRestrictions,
            };

            const generatedPlan = await aiPlannerService.generatePlan({
                preferences,
            });
            
            clearInterval(messageInterval);
            setIsNewPlan(true); // Enable progressive animation
            setPlan(generatedPlan);
            
            // Refresh plans list and reset pagination
            const response = await aiPlannerService.getUserPlans({ limit: PLANS_PER_PAGE, page: 1 });
            setUserPlans(response.plans);
            setCurrentPage(1);
            setHasMorePlans(response.plans.length === PLANS_PER_PAGE && response.pagination.total > PLANS_PER_PAGE);
            
            setMessage({
                type: 'success',
                text: 'Kế hoạch đã được tạo thành công!',
            });
        } catch (error: any) {
            clearInterval(messageInterval);
            setMessage({
                type: 'error',
                text: error.response?.data?.message || 'Không thể tạo kế hoạch',
            });
        } finally {
            setLoading(false);
            setLoadingMessage(loadingMessages[0]);
        }
    };

    const handleToggleFavorite = async () => {
        if (!plan) return;

        try {
            const newFavoriteStatus = !plan.isFavorite;
            await aiPlannerService.updateFavorite(plan.id, newFavoriteStatus);
            
            // Update local plan state
            setPlan({ ...plan, isFavorite: newFavoriteStatus });
            
            // Update userPlans list
            setUserPlans(prevPlans => 
                prevPlans.map(p => 
                    p.id === plan.id ? { ...p, isFavorite: newFavoriteStatus } : p
                )
            );
            
            setMessage({
                type: 'success',
                text: newFavoriteStatus ? 'Đã thêm vào yêu thích!' : 'Đã bỏ yêu thích!',
            });
        } catch {
            setMessage({
                type: 'error',
                text: 'Không thể cập nhật yêu thích',
            });
        }
    };

    const handleReset = () => {
        setPlan(null);
        setTravelDates(null);
        setGroupType(undefined);
        setGroupSize(undefined);
        setBudget(undefined);
        setInterests([]);
        setDietaryRestrictions([]);
        // On mobile, switch back to preferences tab
        setMobileTab('preferences');
    };

    // Helper to render preference form content
    const renderPreferenceForm = () => (
        <div className="space-y-4">
            <div>
                <Text strong className="block mb-2">
                    Ngày đi
                </Text>
                {/* Desktop - RangePicker */}
                <div className="hidden md:block">
                    <RangePicker
                        className="w-full"
                        value={travelDates}
                        onChange={(dates) => setTravelDates(dates as [Dayjs, Dayjs])}
                        format="DD/MM/YYYY"
                        placeholder={['Ngày đến', 'Ngày về']}
                        disabledDate={(current) => current && current < dayjs().startOf('day')}
                    />
                </div>
                {/* Mobile - 2 separate DatePickers */}
                <div className="md:hidden grid grid-cols-2 gap-2">
                    <DatePicker
                        className="w-full"
                        value={travelDates?.[0]}
                        onChange={(date) => {
                            if (date) {
                                setTravelDates(prev => [date, prev?.[1] || null] as [Dayjs, Dayjs]);
                            } else {
                                setTravelDates(prev => prev ? [null as unknown as Dayjs, prev[1]] : null);
                            }
                        }}
                        format="DD/MM/YYYY"
                        placeholder="Ngày đến"
                        disabledDate={(current) => current && current < dayjs().startOf('day')}
                        inputReadOnly
                    />
                    <DatePicker
                        className="w-full"
                        value={travelDates?.[1]}
                        onChange={(date) => {
                            if (date) {
                                setTravelDates(prev => [prev?.[0] || null, date] as [Dayjs, Dayjs]);
                            } else {
                                setTravelDates(prev => prev ? [prev[0], null as unknown as Dayjs] : null);
                            }
                        }}
                        format="DD/MM/YYYY"
                        placeholder="Ngày về"
                        disabledDate={(current) => {
                            if (current && current < dayjs().startOf('day')) return true;
                            if (travelDates?.[0] && current.isBefore(travelDates[0], 'day')) return true;
                            return false;
                        }}
                        inputReadOnly
                    />
                </div>
            </div>

            <PreferenceSelector
                groupType={groupType}
                groupSize={groupSize}
                budget={budget}
                interests={interests}
                dietaryRestrictions={dietaryRestrictions}
                onGroupTypeChange={setGroupType}
                onGroupSizeChange={setGroupSize}
                onBudgetChange={setBudget}
                onInterestsChange={setInterests}
                onDietaryRestrictionsChange={setDietaryRestrictions}
            />

            {!plan ? (
                <Button
                    type="primary"
                    size="large"
                    onClick={handleGeneratePlan}
                    loading={loading}
                    disabled={!travelDates || !groupType || !budget || interests.length === 0}
                    className="w-full bg-[#D4902A] hover:bg-[#bf8125] border-none"
                >
                    Lên Kế Hoạch
                </Button>
            ) : (
                <Button
                    type="default"
                    size="large"
                    onClick={handleReset}
                    className="w-full"
                >
                    Tạo Kế Hoạch Mới
                </Button>
            )}
        </div>
    );

    // Helper to render previous plans list
    const renderPreviousPlans = () => (
        <div className="max-h-[400px] overflow-y-auto pr-1 custom-scrollbar">
            <List
                loading={loadingPlans}
                dataSource={userPlans}
                locale={{ emptyText: 'Chưa có kế hoạch nào' }}
                renderItem={(item) => {
                    const checkIn = item.preferences.travelDates?.checkIn 
                        ? dayjs(item.preferences.travelDates.checkIn).format('DD/MM/YYYY')
                        : 'N/A';
                    const checkOut = item.preferences.travelDates?.checkOut
                        ? dayjs(item.preferences.travelDates.checkOut).format('DD/MM/YYYY')
                        : 'N/A';
                    
                    // Format group type display
                    let groupDisplay = '';
                    if (item.preferences.groupType) {
                        const size = item.preferences.groupSize || 1;
                        switch(item.preferences.groupType) {
                            case 'solo':
                                groupDisplay = 'Một mình';
                                break;
                            case 'couple':
                                groupDisplay = 'Cặp đôi';
                                break;
                            case 'family':
                                groupDisplay = `Gia đình (${size} người)`;
                                break;
                            case 'friends':
                                groupDisplay = `Bạn bè (${size} người)`;
                                break;
                        }
                    }

                    // Check if this plan is currently being viewed
                    const isActive = plan?.id === item.id;
                    
                    return (
                        <List.Item
                            className={`!px-2 cursor-pointer rounded transition-colors ${
                                isActive 
                                    ? 'bg-[#D4902A]/10 border-l-2 border-[#D4902A] !pl-2' 
                                    : 'hover:bg-gray-50'
                            }`}
                            onClick={() => handleViewPlan(item)}
                        >
                            <div className="relative w-full">
                                <div className={`${item.isFavorite ? 'pr-5' : ''}`}>
                                    <Text strong className={`block text-sm ${isActive ? 'text-[#D4902A]' : ''}`}>
                                        {checkIn} - {checkOut}
                                    </Text>
                                    <Text type="secondary" className="text-xs">
                                        {groupDisplay}
                                    </Text>
                                </div>
                                {item.isFavorite && (
                                    <StarOutlined className="absolute top-1 right-0 text-sm !text-[#D4902A]" />
                                )}
                            </div>
                        </List.Item>
                    );
                }}
            />
            {hasMorePlans && (
                <div className="text-center mt-3 sticky bottom-0 bg-white py-2">
                    <Button
                        type="link"
                        onClick={handleLoadMorePlans}
                        loading={loadingMore}
                        className="text-[#D4902A] hover:text-[#bf8125]"
                    >
                        Xem thêm
                    </Button>
                </div>
            )}
        </div>
    );

    // Helper to render plan display content
    const renderPlanDisplay = () => (
        <>
            {loading ? (
                <div className="space-y-6">
                    {/* Animated loading header */}
                    <div className="text-center py-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 mb-4 animate-pulse">
                            <RocketOutlined className="text-3xl text-white animate-bounce" />
                        </div>
                        <Title level={4} className="text-gray-700 mb-2">
                            AI đang lên kế hoạch cho bạn
                        </Title>
                        <Text className="text-gray-500 animate-pulse">
                            {loadingMessage}
                        </Text>
                    </div>
                    
                    {/* Skeleton cards */}
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div 
                                key={i} 
                                className="border rounded-lg p-4 animate-pulse"
                                style={{ animationDelay: `${i * 200}ms` }}
                            >
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                                    <div className="h-5 bg-gray-200 rounded w-40"></div>
                                </div>
                                <Skeleton active paragraph={{ rows: 2 }} />
                            </div>
                        ))}
                    </div>
                    
                    {/* Progress indicator */}
                    <div className="flex justify-center gap-2 pt-4">
                        {[0, 1, 2, 3, 4].map((i) => (
                            <div
                                key={i}
                                className="w-2 h-2 rounded-full bg-[#D4902A] animate-bounce"
                                style={{ animationDelay: `${i * 150}ms` }}
                            ></div>
                        ))}
                    </div>
                </div>
            ) : plan && plan.generatedPlan ? (
                <div ref={planDisplayRef}>
                    <div className="flex justify-between items-center mb-6">
                        <Title level={3} className="mb-0">
                            Kế Hoạch Du Lịch Của Bạn
                        </Title>
                        <Button
                            icon={<StarOutlined />}
                            onClick={handleToggleFavorite}
                            className={plan.isFavorite 
                                ? "bg-[#D4902A] text-white hover:bg-[#bf8125] border-none" 
                                : ""}
                            type={plan.isFavorite ? "primary" : "default"}
                        >
                            {plan.isFavorite ? 'Yêu thích' : 'Yêu thích'}
                        </Button>
                    </div>
                    <ItineraryDisplay plan={plan.generatedPlan} isNewPlan={isNewPlan} />
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <CalendarOutlined className="text-6xl text-gray-300 mb-4" />
                    <Title level={4} className="text-gray-500">
                        Lên kế hoạch đi chơi ngay thôi!
                    </Title>
                    <Text className="text-gray-400 max-w-md">
                        Chọn sở thích của bạn ở bên trái và nhấn "Lên Kế Hoạch" để tạo
                        lịch trình du lịch Hà Nội được cá nhân hóa
                    </Text>
                </div>
            )}
        </>
    );

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <Notification message={message} onClose={() => setMessage(null)} />

            <div className="max-w-7xl mx-auto">
                <div className="mb-6 text-center">
                    <h2
                        className="text-3xl lg:text-3xl font-bold text-gray-900 mb-4"
                        style={{ fontFamily: TYPOGRAPHY.fontFamily.primary }}
                    >
                        Lập kế hoạch du lịch bằng AI Planner
                    </h2>
                    <p
                        className="text-sm text-gray-600 max-w-2xl mx-auto"
                        style={{ fontFamily: TYPOGRAPHY.fontFamily.secondary }}
                    >
                        Tạo lịch trình khám phá Hà Nội được cá nhân hóa
                    </p>
                </div>

                {/* Mobile Layout - Tabs */}
                <div className="lg:hidden">
                    <div className="sticky top-0 z-10 bg-gray-50 pb-2 -mx-4 px-4 pt-1">
                        <Segmented
                            block
                            value={mobileTab}
                            onChange={(value) => setMobileTab(value as string)}
                            options={[
                                {
                                    label: (
                                        <div className="flex items-center gap-1 py-1">
                                            <FormOutlined />
                                            <span>Sở thích</span>
                                        </div>
                                    ),
                                    value: 'preferences',
                                },
                                {
                                    label: (
                                        <div className="flex items-center gap-1 py-1">
                                            <HistoryOutlined />
                                            <span>Lịch sử</span>
                                            {userPlans.length > 0 && (
                                                <span className="bg-[#D4902A] text-white text-xs px-1.5 pb-0.5 rounded-full">
                                                    {userPlans.length}
                                                </span>
                                            )}
                                        </div>
                                    ),
                                    value: 'history',
                                },
                                {
                                    label: (
                                        <div className="flex items-center gap-1 py-1">
                                            <FileTextOutlined />
                                            <span>Kế hoạch</span>
                                            {plan && (
                                                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                            )}
                                        </div>
                                    ),
                                    value: 'plan',
                                },
                            ]}
                            className="shadow-sm"
                        />
                    </div>

                    {/* Mobile Tab Contents */}
                    {mobileTab === 'preferences' && (
                        <Card
                            title={
                                <div className="flex items-center gap-2">
                                    <CalendarOutlined className="text-[#D4902A]" />
                                    <span>Sở Thích Của Bạn</span>
                                </div>
                            }
                        >
                            {renderPreferenceForm()}
                        </Card>
                    )}

                    {mobileTab === 'history' && (
                        <Card
                            title={
                                <div className="flex items-center gap-2">
                                    <HistoryOutlined className="text-[#D4902A]" />
                                    <span>Kế Hoạch Trước Đây</span>
                                </div>
                            }
                        >
                            {userPlans.length > 0 ? (
                                renderPreviousPlans()
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    <HistoryOutlined className="text-4xl mb-2 text-gray-300" />
                                    <p>Bạn chưa có kế hoạch nào</p>
                                </div>
                            )}
                        </Card>
                    )}

                    {mobileTab === 'plan' && (
                        <Card className="min-h-[400px]">
                            {renderPlanDisplay()}
                        </Card>
                    )}
                </div>

                {/* Desktop Layout - Original Grid */}
                <div className="hidden lg:grid lg:grid-cols-12 gap-6">
                    {/* Sidebar - Preference Selector */}
                    <div className="lg:col-span-3">
                        <Card
                            className=""
                            title={
                                <div className="flex items-center gap-2">
                                    <CalendarOutlined className="text-[#D4902A]" />
                                    <span>Sở Thích Của Bạn</span>
                                </div>
                            }
                        >
                            {renderPreferenceForm()}

                            {/* Previous Plans List - Desktop only in sidebar */}
                            {userPlans.length > 0 && (
                                <div className="mt-6 pt-4 border-t border-gray-200">
                                    <Collapse
                                        ghost
                                        items={[
                                            {
                                                key: 'history',
                                                label: (
                                                    <Text strong className="flex items-center gap-2">
                                                        Kế Hoạch Trước Đây ({userPlans.length})
                                                    </Text>
                                                ),
                                                children: renderPreviousPlans(),
                                            }
                                        ]}
                                    />
                                </div>
                            )}
                        </Card>
                    </div>

                    {/* Main Content - Plan Display */}
                    <div className="lg:col-span-9">
                        <Card className="min-h-[600px]">
                            {renderPlanDisplay()}
                        </Card>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default AIPlanner;
