import React, { useState, useEffect, useCallback } from 'react';
import {
    Card,
    InputNumber,
    Select,
    Button,
    Typography,
    Row,
    Col,
    Spin,
    Space
} from 'antd';
import { SaveOutlined, ReloadOutlined } from '@ant-design/icons';
import roomAvailableService from '@/services/rooms/roomAvailableService';
import roomService from '@/services/rooms/roomService';
import { Room } from '@/types/room';
import dayjs from 'dayjs';
import Notification from '@/components/Notification';
import { Message } from '@/types/message';

const { Title } = Typography;
const { Option } = Select;

interface DayPricingData {
    date: string;
    displayDate: string;
    price: number;
    inventory: number;
    isModified: boolean;
    isNew: boolean;
}

interface RoomPricingData {
    room: Room;
    days: DayPricingData[];
}

const RoomPricing: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [roomPricingData, setRoomPricingData] = useState<RoomPricingData[]>([]);
    const [message, setMessage] = useState<Message | null>(null);

    // Generate dates from today to 1 month later
    const generateDates = useCallback(() => {
        const dates: { date: string; displayDate: string }[] = [];
        const startDate = dayjs();

        for (let i = 0; i < 30; i++) {
            const currentDate = startDate.add(i, 'day');
            dates.push({
                date: currentDate.format('YYYY-MM-DD'),
                displayDate: currentDate.format('DD/MM/YYYY')
            });
        }

        return dates;
    }, []);

    // Load rooms and pricing data
    const loadData = useCallback(async () => {
        setLoading(true);
        try {
            // Get all rooms
            const roomsResponse = await roomService.getAllRooms({
                page: 1,
                pageSize: 100
            });

            const startDate = dayjs().startOf('day').toDate();
            const endDate = dayjs().add(1, 'month').endOf('day').toDate();

            // Get all rooms availability
            const availabilityData = await roomAvailableService.getAllRoomsAvailability(
                startDate,
                endDate
            );

            const dates = generateDates();

            // Transform data for display
            const transformedData: RoomPricingData[] = roomsResponse.rooms.map(room => {
                const roomAvailability = availabilityData.find(av => av.id === room.id);

                const days: DayPricingData[] = dates.map(({ date, displayDate }) => {
                    const existingAvailability = roomAvailability?.availability.find(
                        av => dayjs(av.date).format('YYYY-MM-DD') === date
                    );

                    return {
                        date,
                        displayDate,
                        price: existingAvailability?.price || room.price,
                        inventory: existingAvailability?.inventory || room.quantity,
                        isModified: false,
                        isNew: !existingAvailability
                    };
                });

                return {
                    room,
                    days
                };
            });

            setRoomPricingData(transformedData);
        } catch (error) {
            console.error('Error loading data:', error);
            setMessage({ type: 'error', text: 'Không thể tải dữ liệu' });
        } finally {
            setLoading(false);
        }
    }, [generateDates]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handlePriceChange = (roomIndex: number, dayIndex: number, value: number | null) => {
        if (value === null || value < 0) return;

        const newData = [...roomPricingData];
        newData[roomIndex].days[dayIndex].price = value;
        newData[roomIndex].days[dayIndex].isModified = true;
        setRoomPricingData(newData);
    };

    const handleInventoryChange = (roomIndex: number, dayIndex: number, value: number) => {
        if (value < 0) return;

        const newData = [...roomPricingData];
        newData[roomIndex].days[dayIndex].inventory = value;
        newData[roomIndex].days[dayIndex].isModified = true;
        setRoomPricingData(newData);
    };

    const handleSaveAll = async () => {
        setSaving(true);
        try {
            const promises: Promise<any>[] = [];

            for (const roomData of roomPricingData) {
                for (const dayData of roomData.days) {
                    if (dayData.isModified) {
                        if (dayData.isNew) {
                            promises.push(
                                roomAvailableService.createRoomAvailable({
                                    roomId: roomData.room.id,
                                    date: new Date(dayData.date),
                                    price: dayData.price,
                                    inventory: dayData.inventory
                                })
                            );
                        } else {
                            promises.push(
                                roomAvailableService.updateRoomAvailable({
                                    roomId: roomData.room.id,
                                    date: new Date(dayData.date),
                                    price: dayData.price,
                                    inventory: dayData.inventory
                                })
                            );
                        }
                    }
                }
            }

            await Promise.all(promises);
            setMessage({ type: 'success', text: 'Lưu thay đổi thành công!' });
            loadData();
        } catch (error) {
            console.error('Error saving changes:', error);
            setMessage({ type: 'error', text: 'Lưu thay đổi thất bại.' });
        } finally {
            setSaving(false);
        }
    };

    // Check if there are any changes to save
    const hasChanges = roomPricingData.some(roomData =>
        roomData.days.some(day => day.isModified)
    );

    return (
        <>
            <Notification
                message={message}
                onClose={() => setMessage(null)}
            />

            <div style={{ padding: '24px' }}>
                <div
                    style={{
                        marginBottom: 24,
                    }}
                >
                    <Title level={3}>Tùy chỉnh giá phòng theo ngày</Title>
                    <p style={{ color: '#666', marginBottom: '16px' }}>
                        Thiết lập giá và số lượng phòng cho 30 ngày tới (từ hôm nay đến {dayjs().add(29, 'day').format('DD/MM/YYYY')})
                    </p>

                    <Row gutter={16}>
                        <Col>
                            <Button
                                icon={<ReloadOutlined />}
                                onClick={loadData}
                                loading={loading}
                            >
                                Tải lại dữ liệu
                            </Button>
                        </Col>
                        <Col>
                            <Button
                                type="primary"
                                icon={<SaveOutlined />}
                                onClick={handleSaveAll}
                                loading={saving}
                                disabled={!hasChanges}
                            >
                                Lưu tất cả thay đổi
                            </Button>
                        </Col>
                    </Row>
                </div>

                <Spin spinning={loading}>
                    <Space direction="vertical" style={{ width: '100%' }} size="large">
                        {roomPricingData.map((roomData, roomIndex) => (
                            <Card
                                key={roomData.room.id}
                                title={
                                    <div>
                                        <strong>{roomData.room.name}</strong>
                                        <span style={{ marginLeft: '8px', color: '#666' }}>
                                            ({roomData.room.roomType})
                                        </span>
                                        <span style={{ marginLeft: '16px', color: '#52c41a' }}>
                                            Giá mặc định: {roomData.room.price.toLocaleString('vi-VN')} VND
                                        </span>
                                        <span style={{ marginLeft: '16px', color: '#1890ff' }}>
                                            Số lượng mặc định: {roomData.room.quantity}
                                        </span>
                                    </div>
                                }
                                size="small"
                            >
                                <div className="excel-table-container" style={{
                                    border: '1px solid #d9d9d9',
                                    borderRadius: '6px',
                                    overflow: 'hidden',
                                    position: 'relative'
                                }}>
                                    <div style={{
                                        overflowX: 'auto',
                                        overflowY: 'hidden'
                                    }}>
                                        {/* Header row with dates */}
                                        <div style={{
                                            display: 'flex',
                                            borderBottom: '2px solid #f0f0f0',
                                            minWidth: `${120 + roomData.days.length * 120}px`
                                        }}>
                                            <div className="sticky-column" style={{
                                                minWidth: '120px',
                                                width: '120px',
                                                padding: '8px',
                                                fontWeight: 'bold',
                                                backgroundColor: '#fafafa',
                                                borderRight: '2px solid #d9d9d9',
                                                position: 'sticky',
                                                left: 0,
                                                zIndex: 10
                                            }}>
                                                Ngày
                                            </div>
                                            {roomData.days.map((day) => (
                                                <div
                                                    key={day.date}
                                                    style={{
                                                        minWidth: '120px',
                                                        width: '120px',
                                                        padding: '8px',
                                                        textAlign: 'center',
                                                        backgroundColor: '#fafafa',
                                                        borderRight: '1px solid #d9d9d9',
                                                        fontSize: '12px',
                                                        fontWeight: 'bold'
                                                    }}
                                                >
                                                    {day.displayDate}
                                                </div>
                                            ))}
                                        </div>

                                        {/* Price row */}
                                        <div style={{
                                            display: 'flex',
                                            borderBottom: '1px solid #f0f0f0',
                                            minWidth: `${120 + roomData.days.length * 120}px`
                                        }}>
                                            <div className="sticky-column" style={{
                                                minWidth: '120px',
                                                width: '120px',
                                                padding: '8px',
                                                fontWeight: 'bold',
                                                backgroundColor: '#fff7e6',
                                                borderRight: '2px solid #d9d9d9',
                                                display: 'flex',
                                                alignItems: 'center',
                                                position: 'sticky',
                                                left: 0,
                                                zIndex: 10
                                            }}>
                                                Giá (VND)
                                            </div>
                                            {roomData.days.map((day, dayIndex) => (
                                                <div
                                                    key={`price-${day.date}`}
                                                    style={{
                                                        minWidth: '120px',
                                                        width: '120px',
                                                        padding: '4px',
                                                        borderRight: '1px solid #d9d9d9',
                                                        backgroundColor: day.isModified ? '#fff1e6' : '#fff'
                                                    }}
                                                >
                                                    <InputNumber
                                                        value={day.price}
                                                        min={0}
                                                        step={1000}
                                                        onChange={(value) => handlePriceChange(roomIndex, dayIndex, value)}
                                                        style={{ width: '100%' }}
                                                        size="small"
                                                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                                    />
                                                </div>
                                            ))}
                                        </div>

                                        {/* Inventory row */}
                                        <div style={{
                                            display: 'flex',
                                            minWidth: `${120 + roomData.days.length * 120}px`
                                        }}>
                                            <div className="sticky-column" style={{
                                                minWidth: '120px',
                                                width: '120px',
                                                padding: '8px',
                                                fontWeight: 'bold',
                                                backgroundColor: '#e6f7ff',
                                                borderRight: '2px solid #d9d9d9',
                                                display: 'flex',
                                                alignItems: 'center',
                                                position: 'sticky',
                                                left: 0,
                                                zIndex: 10
                                            }}>
                                                Số lượng
                                            </div>
                                            {roomData.days.map((day, dayIndex) => (
                                                <div
                                                    key={`inventory-${day.date}`}
                                                    style={{
                                                        minWidth: '120px',
                                                        width: '120px',
                                                        padding: '4px',
                                                        borderRight: '1px solid #d9d9d9',
                                                        backgroundColor: day.isModified ? '#e6f4ff' : '#fff'
                                                    }}
                                                >
                                                    <Select
                                                        value={day.inventory}
                                                        onChange={(value) => handleInventoryChange(roomIndex, dayIndex, value)}
                                                        style={{ width: '100%' }}
                                                        size="small"
                                                    >
                                                        {Array.from({ length: 21 }, (_, i) => (
                                                            <Option key={i} value={i}>
                                                                {i}
                                                            </Option>
                                                        ))}
                                                    </Select>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </Space>
                </Spin>

                <style>{`
                .excel-table-container {
                    position: relative;
                }
                
                .excel-table-container > div::-webkit-scrollbar {
                    height: 12px;
                }
                
                .excel-table-container > div::-webkit-scrollbar-track {
                    background: #f1f1f1;
                    border-radius: 6px;
                    margin: 0 4px;
                }
                
                .excel-table-container > div::-webkit-scrollbar-thumb {
                    background: #c1c1c1;
                    border-radius: 6px;
                    border: 2px solid #f1f1f1;
                }
                
                .excel-table-container > div::-webkit-scrollbar-thumb:hover {
                    background: #a8a8a8;
                }

                .excel-table-container > div::-webkit-scrollbar-corner {
                    background: #f1f1f1;
                }

                .sticky-column {
                    box-shadow: 2px 0 4px rgba(0, 0, 0, 0.1);
                }

                .excel-table-container > div:not([style*="transform"]) .sticky-column {
                    box-shadow: none;
                }

                .ant-input-number {
                    border-radius: 2px;
                }

                .ant-select {
                    border-radius: 2px;
                }

                .ant-select-selector {
                    border-radius: 2px !important;
                }

                /* Ẩn scrollbar trên các hàng riêng lẻ */
                .excel-table-container div[style*="display: flex"] {
                    scrollbar-width: none;
                    -ms-overflow-style: none;
                }

                /* Đảm bảo sticky column luôn hiển thị trên top */
                .sticky-column {
                    position: sticky !important;
                    left: 0 !important;
                    z-index: 10 !important;
                }
            `}</style>
            </div>
        </>
    );
};

export default RoomPricing;
