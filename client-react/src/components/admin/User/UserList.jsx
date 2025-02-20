import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, message, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import UserForm from './UserForm'; // Import form component
import DeleteConfirm from '../Common/DeleteConfirm'; // Import component xác nhận xóa

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [deleteUserId, setDeleteUserId] = useState(null); // ID user cần xóa
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false); // Modal xác nhận xóa

    // Dữ liệu mẫu (thay bằng API call sau)
    const dummyUsers = [
        { id: 1, name: 'John Doe', email: 'john.doe@example.com', role: 'Admin' },
        { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', role: 'Editor' },
        // ... more dummy users
    ];

    useEffect(() => {
        // Gọi API để lấy danh sách users (thay dummyUsers)
        setLoading(true);
        setTimeout(() => { // Mô phỏng API call
            setUsers(dummyUsers);
            setLoading(false);
        }, 500);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const columns = [
        { title: 'ID', dataIndex: 'id', key: 'id' },
        { title: 'Name', dataIndex: 'name', key: 'name' },
        { title: 'Email', dataIndex: 'email', key: 'email' },
        { title: 'Role', dataIndex: 'role', key: 'role' },
        {
            title: 'Actions',
            key: 'actions',
            render: (text, record) => (
                <Space size="middle">
                    <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} size="small">Edit</Button>
                    <Popconfirm
                        title="Bạn chắc chắn muốn xóa user này?"
                        onConfirm={() => handleDeleteConfirm(record.id)}
                        onCancel={handleDeleteCancel}
                        okText="Có"
                        cancelText="Không"
                    >
                        <Button danger icon={<DeleteOutlined />} size="small">Delete</Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    const showModal = () => {
        setIsModalVisible(true);
        setEditingUser(null); // Reset editing user khi mở modal thêm mới
    };

    const handleEdit = (user) => {
        setIsModalVisible(true);
        setEditingUser(user);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleFormSubmit = (values) => {
        // Xử lý submit form (gọi API create/update)
        setLoading(true);
        setTimeout(() => {
            if (editingUser) {
                // Logic update user (gọi API PUT/PATCH)
                const updatedUsers = users.map(user => user.id === editingUser.id ? { ...editingUser, ...values } : user); // Ví dụ update local state
                setUsers(updatedUsers);
                message.success('User updated successfully!');
            } else {
                // Logic create user (gọi API POST)
                const newUser = { id: users.length + 1, ...values }; // Ví dụ tạo ID mới
                setUsers([...users, newUser]);
                message.success('User created successfully!');
            }
            setIsModalVisible(false);
            setLoading(false);
        }, 500);
    };

    const handleDeleteConfirm = (userId) => {
        setDeleteUserId(userId);
        setIsDeleteModalVisible(true); // Hiển thị modal xác nhận xóa
    };

    const handleDeleteCancel = () => {
        setIsDeleteModalVisible(false);
    };

    const confirmDeleteUser = () => {
        setLoading(true);
        setTimeout(() => {
            // Gọi API delete user dựa trên deleteUserId
            const updatedUsers = users.filter(user => user.id !== deleteUserId); // Ví dụ xóa local state
            setUsers(updatedUsers);
            message.success('User deleted successfully!');
            setIsDeleteModalVisible(false);
            setLoading(false);
        }, 500);
    };


    return (
        <div>
            <div style={{ marginBottom: 16, textAlign: 'right' }}>
                <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
                    Add New User
                </Button>
            </div>
            <Table columns={columns} dataSource={users} loading={loading} rowKey="id" />

            <Modal
                title={editingUser ? "Edit User" : "Add New User"}
                visible={isModalVisible}
                onCancel={handleCancel}
                footer={null} // Tự tùy chỉnh footer trong form
            >
                <UserForm
                    onCancel={handleCancel}
                    onSubmit={handleFormSubmit}
                    initialValues={editingUser} // Truyền initialValues nếu là edit
                    loading={loading}
                />
            </Modal>

            <DeleteConfirm
                visible={isDeleteModalVisible}
                onConfirm={confirmDeleteUser}
                onCancel={handleDeleteCancel}
                itemName="user" // Tên item để hiển thị trong modal
                loading={loading}
            />
        </div>
    );
};

export default UserList;