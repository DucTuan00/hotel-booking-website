import React from 'react';
import { Form, Input, Divider } from 'antd';

const { TextArea } = Input;

const NoteForm: React.FC = () => {
    return (
        <div className="mb-6">
            <Divider />
            <h3 className="text-lg font-medium mb-4">Chú thích (tùy chọn)</h3>
            
            <Form.Item
                name="note"
                label="Ghi chú thêm"
                tooltip="Nếu bạn có yêu cầu đặc biệt nào, vui lòng ghi chú tại đây"
            >
                <TextArea
                    size="large"
                    placeholder="Ví dụ: Yêu cầu phòng tầng cao, view thoáng đãng, ..."
                    rows={4}
                    maxLength={500}
                    showCount
                />
            </Form.Item>
        </div>
    );
};

export default NoteForm;
