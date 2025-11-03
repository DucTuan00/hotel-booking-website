import React from 'react';
import { Form, Radio, Divider } from 'antd';
import { PaymentMethod } from '@/types/booking';

const PaymentMethodForm: React.FC = () => {
    return (
        <div className="mb-6">
            <Divider />
            <h3 className="text-lg font-medium mb-4">Phương thức thanh toán</h3>
            
            <Form.Item
                name="paymentMethod"
                rules={[{ required: true, message: 'Vui lòng chọn phương thức thanh toán!' }]}
            >
                <Radio.Group size="large">
                    <Radio value={PaymentMethod.ONSITE} className="mb-2">
                        Thanh toán tại quầy
                    </Radio>
                    <Radio value={PaymentMethod.ONLINE}>
                        Thanh toán online
                    </Radio>
                </Radio.Group>
            </Form.Item>
        </div>
    );
};

export default PaymentMethodForm;
