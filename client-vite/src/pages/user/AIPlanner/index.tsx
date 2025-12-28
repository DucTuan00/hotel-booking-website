import React, { useState, useEffect, useRef } from 'react';
import { Card, Button, Typography, DatePicker, Spin, List, Segmented, Collapse } from 'antd';
import { StarOutlined, CalendarOutlined, HistoryOutlined, FormOutlined, FileTextOutlined } from '@ant-design/icons';
import PreferenceSelector from './components/PreferenceSelector';
import ItineraryDisplay from './components/ItineraryDisplay';
import aiPlannerService from '@/services/aiPlanner/aiPlannerService';
import { TravelPlan, GroupType, BudgetLevel, UserPreferences } from '@/types/aiPlanner';
import { Message } from '@/types/message';
import Notification from '@/components/Notification';
import dayjs, { Dayjs } from 'dayjs';
import authService from '@/services/auth/authService';
import { useNavigate } from 'react-router-dom';


const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

const AIPlanner: React.FC = () => {
    const navigate = useNavigate();
    const [plan, setPlan] = useState<TravelPlan | null>(null);
    const [userPlans, setUserPlans] = useState<TravelPlan[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadingPlans, setLoadingPlans] = useState(false);
    const [message, setMessage] = useState<Message | null>(null);
    
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
                const response = await aiPlannerService.getUserPlans({ limit: 10 });
                setUserPlans(response.plans);
            } catch (error) {
                console.error('Error fetching user plans:', error);
            } finally {
                setLoadingPlans(false);
            }
        };

        fetchUserPlans();
    }, []);

    const handleViewPlan = (existingPlan: TravelPlan) => {
        setPlan(existingPlan);
        
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
            setPlan(generatedPlan);
            
            // Refresh plans list
            const response = await aiPlannerService.getUserPlans({ limit: 10 });
            setUserPlans(response.plans);
            
            // On mobile, auto-switch to plan tab after generation
            setMobileTab('plan');
            
            setMessage({
                type: 'success',
                text: 'Kế hoạch đã được tạo thành công!',
            });
        } catch (error: any) {
            setMessage({
                type: 'error',
                text: error.response?.data?.message || 'Không thể tạo kế hoạch',
            });
        } finally {
            setLoading(false);
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
                        <div className="flex items-start gap-2 w-full">
                            <div className="flex-1">
                                <Text strong className={`block text-sm ${isActive ? 'text-[#D4902A]' : ''}`}>
                                    {checkIn} - {checkOut}
                                </Text>
                                <Text type="secondary" className="text-xs">
                                    {groupDisplay}
                                </Text>
                            </div>
                            {item.isFavorite && (
                                <StarOutlined className="text-base !text-[#D4902A] my-auto" />
                            )}
                        </div>
                    </List.Item>
                );
            }}
        />
    );

    // Helper to render plan display content
    const renderPlanDisplay = () => (
        <>
            {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <Spin size="large" />
                    <Text className="mt-4 text-lg text-gray-600">
                        Đang tạo kế hoạch cho bạn...
                    </Text>
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
                    <ItineraryDisplay plan={plan.generatedPlan} />
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
                    <Title level={2} className="mb-2 text-[#8B1A1A]">
                        Lập kế hoạch du lịch bằng AI Planner
                    </Title>
                    <Text type="secondary" className="text-lg">
                        Tạo lịch trình khám phá Hà Nội được cá nhân hóa cho bạn
                    </Text>
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
