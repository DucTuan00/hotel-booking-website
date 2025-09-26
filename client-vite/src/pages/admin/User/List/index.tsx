import React, { useState, useEffect, useCallback } from 'react';
import { Button, Space, Popconfirm, Tag } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import AdminTable from '@/components/AdminTable';
import SearchTableAdmin, { SearchFilters } from '@/components/SearchTableAdmin';
import UserForm, { UserFormValues } from '@/pages/admin/User/Form';
import userService from '@/services/users/userService';
import Notification from '@/components/Notification';

interface User {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: 'user' | 'admin';
}

interface Message {
    type: 'success' | 'error';
    text: string;
}

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

    const handleDelete = async (userId: string) => {
        try {
            await userService.deleteUser(userId);
            setMessage({ type: 'success', text: 'Xóa người dùng thành công!' });
            
            // If deleting the last item on current page and not on first page, go to previous page
            if (users.length === 1 && currentPage > 1) {
                setCurrentPage(currentPage - 1);
            } else {
                await fetchUsers();
            }
        } catch (error) {
            console.error("Error when delete user:", error);
            setMessage({ type: 'error', text: 'Xóa người dùng thất bại.' });
        }
    };

    const columns: ColumnsType<User> = [
        {
            title: 'Tên người dùng',
            dataIndex: 'name',
            key: 'name',
            width: '25%',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            width: '25%',
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phone',
            key: 'phone',
            width: '20%',
        },
        {
            title: 'Vai trò',
            dataIndex: 'role',
            key: 'role',
            width: '15%',
            render: (role: string) => (
                <Tag color={role === 'admin' ? 'red' : 'blue'}>
                    {role === 'admin' ? 'Quản trị viên' : 'Người dùng'}
                </Tag>
            ),
        },
        {
            title: 'Hành động',
            key: 'actions',
            width: '15%',
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
                    <Popconfirm
                        title="Xác nhận xóa"
                        description="Bạn có chắc chắn muốn xóa người dùng này?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Xóa"
                        cancelText="Hủy"
                        okType="danger"
                    >
                        <Button
                            type="link" 
                            danger 
                            icon={<DeleteOutlined />}
                            size="small"
                        >
                            Xóa
                        </Button>
                    </Popconfirm>
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
                modalTitle={editingUser ? 'Cập nhật người dùng' : 'Thêm người dùng mới'}
                modalVisible={isModalVisible}
                onModalCancel={handleCancel}
                pagination={{
                    current: currentPage,
                    pageSize: pageSize,
                    total: totalUsers,
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
