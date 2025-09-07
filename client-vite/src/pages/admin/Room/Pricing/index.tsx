import React, { useState, useEffect, useCallback } from 'react';
import {
    Card,
    Table,
    InputNumber,
    Select,
    Button,
    message,
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
            message.error('Không thể tải dữ liệu phòng và giá');
        } finally {
            setLoading(false);
        }
    }, [generateDates]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    // Handle price change
    const handlePriceChange = (roomIndex: number, dayIndex: number, value: number | null) => {
        if (value === null || value < 0) return;

        const newData = [...roomPricingData];
        newData[roomIndex].days[dayIndex].price = value;
        newData[roomIndex].days[dayIndex].isModified = true;
        setRoomPricingData(newData);
    };

    // Handle inventory change
    const handleInventoryChange = (roomIndex: number, dayIndex: number, value: number) => {
        if (value < 0) return;

        const newData = [...roomPricingData];
        newData[roomIndex].days[dayIndex].inventory = value;
        newData[roomIndex].days[dayIndex].isModified = true;
        setRoomPricingData(newData);
    };

    // Save all changes
    const handleSaveAll = async () => {
        setSaving(true);
        try {
            const promises: Promise<any>[] = [];

            for (const roomData of roomPricingData) {
                for (const dayData of roomData.days) {
                    if (dayData.isModified) {
                        if (dayData.isNew) {
                            // Create new availability
                            promises.push(
                                roomAvailableService.createRoomAvailable({
                                    roomId: roomData.room.id,
                                    date: new Date(dayData.date),
                                    price: dayData.price,
                                    inventory: dayData.inventory
                                })
                            );
                        } else {
                            // Update existing availability
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
            message.success('Lưu tất cả thay đổi thành công!');
            loadData(); // Reload data
        } catch (error) {
            console.error('Error saving changes:', error);
            message.error('Không thể lưu thay đổi');
        } finally {
            setSaving(false);
        }
    };

    // Check if there are any changes to save
    const hasChanges = roomPricingData.some(roomData =>
        roomData.days.some(day => day.isModified)
    );

    // Table columns for each room
    const getColumnsForRoom = (roomIndex: number) => [
        {
            title: 'Ngày',
            dataIndex: 'displayDate',
            key: 'displayDate',
            width: 120,
            fixed: 'left' as const,
        },
        {
            title: 'Giá (VND)',
            dataIndex: 'price',
            key: 'price',
            width: 200,
            render: (price: number, _: any, dayIndex: number) => (
                <InputNumber
                    value={price}
                    min={0}
                    step={1000}
                    onChange={(value) => handlePriceChange(roomIndex, dayIndex, value)}
                    style={{ width: '100%' }}
                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                />
            )
        },
        {
            title: 'Số lượng',
            dataIndex: 'inventory',
            key: 'inventory',
            width: 150,
            render: (inventory: number, _: any, dayIndex: number) => (
                <Select
                    value={inventory}
                    onChange={(value) => handleInventoryChange(roomIndex, dayIndex, value)}
                    style={{ width: '100%' }}
                >
                    {Array.from({ length: 21 }, (_, i) => (
                        <Option key={i} value={i}>
                            {i}
                        </Option>
                    ))}
                </Select>
            )
        }
    ];

    return (
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
                            <Table
                                dataSource={roomData.days}
                                columns={getColumnsForRoom(roomIndex)}
                                pagination={false}
                                rowKey="date"
                                size="small"
                                scroll={{ x: 400, y: 300 }}
                                rowClassName={(record) =>
                                    record.isModified ? 'modified-row' : ''
                                }
                            />
                        </Card>
                    ))}
                </Space>
            </Spin>

            <style>{`
                .modified-row {
                    background-color: #fff7e6 !important;
                }
                .modified-row:hover {
                    background-color: #fff1e6 !important;
                }
            `}</style>
        </div>
    );
};

export default RoomPricing;
