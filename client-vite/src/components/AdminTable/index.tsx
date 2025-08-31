import React from 'react';
import { Table, Card, Button, Typography, Modal, TableProps } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const { Title } = Typography;

interface AdminTableProps<T> extends Omit<TableProps<T>, 'title'> {
    title: string;
    onAdd?: () => void;
    addButtonText?: string;
    showAddButton?: boolean;
    children?: React.ReactNode;
    modalTitle?: string;
    modalVisible?: boolean;
    onModalCancel?: () => void;
}

function AdminTable<T = unknown>({
    title,
    onAdd,
    addButtonText = 'Thêm mới',
    showAddButton = true,
    children,
    modalTitle,
    modalVisible = false,
    onModalCancel,
    ...tableProps
}: AdminTableProps<T>) {
    return (
        <div style={{ padding: '24px' }}>
            <Card>
                <div style={{ 
                    marginBottom: '16px', 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center' 
                }}>
                    <Title level={3} style={{ margin: 0 }}>{title}</Title>
                    {showAddButton && onAdd && (
                        <Button 
                            type="primary" 
                            icon={<PlusOutlined />} 
                            onClick={onAdd}
                            size="large"
                        >
                            {addButtonText}
                        </Button>
                    )}
                </div>

                <Table
                    {...tableProps}
                    pagination={{
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total, range) => 
                            `${range[0]}-${range[1]} của ${total} bản ghi`,
                        ...tableProps.pagination,
                    }}
                />

                {children && modalTitle && (
                    <Modal
                        title={modalTitle}
                        open={modalVisible}
                        onCancel={onModalCancel}
                        footer={null}
                        destroyOnClose
                    >
                        {children}
                    </Modal>
                )}
            </Card>
        </div>
    );
}

export default AdminTable;
