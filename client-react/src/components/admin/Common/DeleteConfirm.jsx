import React from 'react';
import { Modal, Spin } from 'antd';

const DeleteConfirm = ({ visible, onConfirm, onCancel, itemName, loading }) => {
    return (
        <Modal
            title="Xác nhận xóa"
            visible={visible}
            onOk={onConfirm}
            onCancel={onCancel}
            okText="Xóa"
            cancelText="Hủy"
            confirmLoading={loading}
        >
            <Spin spinning={loading}>
                <p>Bạn có chắc chắn muốn xóa {itemName} này không?</p>
            </Spin>
        </Modal>
    );
};

export default DeleteConfirm;