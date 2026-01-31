import React, { useState, useEffect, useCallback } from 'react';
import { Button, Space, Tag, Switch } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import AdminTable from '@/components/AdminTable';
import SearchTableAdmin, { SearchFilters } from '@/components/SearchTableAdmin';
import UserForm, { UserFormValues } from '@/pages/admin/User/Form';
import userService from '@/services/users/userService';
import Notification from '@/components/Notification';
import { UserRole, LoyaltyTier, User } from '@/types/user';
import { Message } from '@/types/message';
import { TYPOGRAPHY } from '@/config/constants';

const getLoyaltyTierLabel = (tier: LoyaltyTier) => {
    switch (tier) {
        case LoyaltyTier.BRONZE:
            return { label: 'Đồng', color: '#CD7F32' };
        case LoyaltyTier.SILVER:
            return { label: 'Bạc', color: '#C0C0C0' };
        case LoyaltyTier.GOLD:
            return { label: 'Vàng', color: '#FFD700' };
        case LoyaltyTier.DIAMOND:
            return { label: 'Kim cương', color: '#B9F2FF' };
        default:
            return { label: 'Đồng', color: '#CD7F32' };
    }
};

const UserList: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [totalUsers, setTotalUsers] = useState<number>(0);
    const [message, setMessage] = useState<Message | null>(null);
    const [currentSearchParams, setCurrentSearchParams] = useState<any>({});

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        try {
            const params: any = { 
                page: currentPage, 
                pageSize: pageSize,
                excludeCurrentUser: true,
                ...currentSearchParams
            };

            const data = await userService.getAllUsers(params);
            setUsers(data.users);
            setTotalUsers(data.total ?? 0);
        } catch (error) {
            console.error("Error when fetch users:", error);
            setMessage({ type: 'error', text: 'Tải danh sách người dùng thất bại.' });
            setUsers([]);
            setTotalUsers(0);
        } finally {
            setLoading(false);
        }
    }, [currentPage, pageSize, currentSearchParams]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleSearch = (filters: SearchFilters) => {
        setCurrentPage(1); 
        
        if (!filters.searchText || !filters.searchText.trim()) {
            setCurrentSearchParams({});
            return;
        }
        
        const searchText = filters.searchText.trim();
        const searchParams: any = {
            search: searchText  
        };
        
        setCurrentSearchParams(searchParams);
    };

    const showModal = () => {
        setIsModalVisible(true);
        setEditingUser(null);
    };

    const handleEdit = (user: User) => {
        setIsModalVisible(true);
        setEditingUser(user);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleFormSubmit = async (values: UserFormValues) => {
        setLoading(true);
        try {
            if (editingUser) {
                // when editing, don't need password
                const updateData = {
                    email: values.email,
                    name: values.name,
                    phone: values.phone,
                    role: values.role
                };
                await userService.updateUser(editingUser.id, updateData);
                setMessage({ type: 'success', text: 'Cập nhật người dùng thành công!' });
            } else {
                // when creating, password is required
                if (!values.password || values.password.trim() === '') {
                    setMessage({ type: 'error', text: 'Mật khẩu là bắt buộc khi tạo người dùng mới.' });
                    setLoading(false);
                    return;
                }
                const createData = {
                    email: values.email,
                    name: values.name,
                    phone: values.phone,
                    role: values.role,
                    password: values.password
                };
                await userService.createUser(createData);
                setMessage({ type: 'success', text: 'Tạo người dùng thành công!' });
            }
            fetchUsers(); 
            setIsModalVisible(false);
        } catch (error) {
            console.error("Error when submit form:", error);
            setMessage({ type: 'error', text: editingUser ? 'Cập nhật người dùng thất bại.' : 'Tạo người dùng thất bại.' });
        } finally {
            setLoading(false);
        }
    };

    const handleToggleActive = async (userId: string, currentActive: boolean) => {
        setLoading(true);
        try {
            await userService.toggleUserActive(userId);
            setMessage({ 
                type: 'success', 
                text: `Người dùng đã được ${currentActive ? 'vô hiệu hóa' : 'kích hoạt'} thành công!` 
            });
            fetchUsers();
        } catch (error) {
            console.error("Error toggling user active:", error);
            setMessage({ type: 'error', text: 'Thay đổi trạng thái người dùng thất bại.' });
        } finally {
            setLoading(false);
        }
    };

    const columns: ColumnsType<User> = [
        {
            title: 'Tên người dùng',
            dataIndex: 'name',
            key: 'name',
            width: '18%',
            sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            width: '20%',
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phone',
            key: 'phone',
            width: '12%',
        },
        {
            title: 'Thứ hạng',
            dataIndex: 'loyaltyTier',
            key: 'loyaltyTier',
            width: '10%',
            align: 'center',
            render: (tier: LoyaltyTier) => {
                const { label, color } = getLoyaltyTierLabel(tier);
                return (
                    <Tag color={color} style={{ color: tier === LoyaltyTier.GOLD ? '#000' : undefined }}>
                        {label}
                    </Tag>
                );
            },
        },
        {
            title: 'Vai trò',
            dataIndex: 'role',
            key: 'role',
            width: '12%',
            render: (role: string) => (
                <Tag color={role === UserRole.ADMIN ? 'red' : 'blue'}>
                    {role === UserRole.ADMIN ? 'Quản trị viên' : 'Người dùng'}
                </Tag>
            ),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'active',
            key: 'active',
            align: 'center',
            width: '12%',
            render: (active: boolean, record) => (
                <Switch
                    checked={active}
                    onChange={() => handleToggleActive(record.id, active)}
                    checkedChildren="Bật"
                    unCheckedChildren="Tắt"
                />
            ),
        },
        {
            title: 'Hành động',
            key: 'actions',
            width: '10%',
            render: (_, record) => (
                <Space>
                    <Button 
                        type="link" 
                        icon={<EditOutlined />} 
                        onClick={() => handleEdit(record)}
                        size="small"
                    >
                        Sửa
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <>
            <Notification
                message={message}
                onClose={() => setMessage(null)}
            />

            <SearchTableAdmin
                onSearch={handleSearch}
                placeholder="Tìm kiếm theo tên, email hoặc số điện thoại..."
            />

            <AdminTable<User>
                title="Quản lý Người dùng"
                columns={columns}
                dataSource={users}
                rowKey="id"
                loading={loading}
                onAdd={showModal}
                addButtonText="Thêm người dùng mới"
                modalTitle={(
                    <div style={{ fontFamily: TYPOGRAPHY.fontFamily.secondary }}>
                        {editingUser ? 'Cập nhật người dùng' : 'Thêm người dùng mới'}
                    </div>
                ) as unknown as string}
                modalVisible={isModalVisible}
                onModalCancel={handleCancel}
                pagination={{
                    current: currentPage,
                    pageSize: pageSize,
                    total: totalUsers,
                    showSizeChanger: true,
                    showQuickJumper: false,
                    onChange: (page: number, size?: number) => {
                        setCurrentPage(page);
                        if (size !== pageSize) {
                            setPageSize(size || 10);
                        }
                    },
                    onShowSizeChange: (_current: number, size: number) => {
                        setCurrentPage(1);
                        setPageSize(size);
                    },
                }}
            >
                <UserForm
                    visible={isModalVisible}
                    onCancel={handleCancel}
                    onSubmit={handleFormSubmit}
                    initialValues={editingUser || undefined}
                    loading={loading}
                />
            </AdminTable>
        </>
    );
};

export default UserList;
