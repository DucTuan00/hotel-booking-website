import React, { useState } from 'react';
import { Form, Radio, Divider, Space } from 'antd';
import { PaymentMethod } from '@/types/booking';

const PaymentMethodForm: React.FC = () => {
    const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>(PaymentMethod.ONSITE);
    const [selectedGateway, setSelectedGateway] = useState<string>('vnpay');

    return (
        <div className="mb-6">
            <Divider />
            <h3 className="text-lg font-medium mb-4">Phương thức thanh toán</h3>
            
            <Form.Item
                name="paymentMethod"
                rules={[{ required: true, message: 'Vui lòng chọn phương thức thanh toán!' }]}
            >
                <Radio.Group 
                    size="large"
                    onChange={(e) => setSelectedMethod(e.target.value)}
                >
                    <Space direction="vertical" style={{ width: '100%' }}>
                        {/* Thanh toán tại quầy */}
                        <Radio value={PaymentMethod.ONSITE}>
                            <Space>
                                <span>Thanh toán tại quầy</span>
                            </Space>
                        </Radio>

                        {/* Thanh toán online */}
                        <Radio value={PaymentMethod.ONLINE}>
                            <Space>
                                <span>Thanh toán online</span>
                            </Space>
                        </Radio>
                    </Space>
                </Radio.Group>
            </Form.Item>

            {/* Sub-options for online payment - full width like celebration items */}
            {selectedMethod === PaymentMethod.ONLINE && (
                <div className="mt-3 p-3 sm:p-4 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-600 mb-3">Chọn cổng thanh toán:</p>
                    <Radio.Group 
                        value={selectedGateway}
                        onChange={(e) => setSelectedGateway(e.target.value)}
                        className="w-full"
                    >
                        <Space direction="vertical" style={{ width: '100%' }} size="small">
                            <Radio value="vnpay" className="w-full">
                                <div className="flex items-center gap-2">
                                    <img 
                                        src="/images/vnpay.png" 
                                        alt="VNPay"
                                        className="w-10 h-10 object-contain"
                                    />
                                    <span>VNPay</span>
                                </div>
                            </Radio>
                            <Radio value="momo" className="w-full">
                                <div className="flex items-center gap-2">
                                    <img 
                                        src="/images/momo.png" 
                                        alt="MoMo"
                                        className="w-10 h-10 object-contain"
                                    />
                                    <span>MoMo</span>
                                </div>
                            </Radio>
                        </Space>
                    </Radio.Group>
                </div>
            )}

            {/* Hidden field to store selected gateway */}
            {selectedMethod === PaymentMethod.ONLINE && (
                <Form.Item name="paymentGateway" hidden initialValue="vnpay">
                    <input type="hidden" value={selectedGateway} />
                </Form.Item>
            )}
        </div>
    );
};

export default PaymentMethodForm;
