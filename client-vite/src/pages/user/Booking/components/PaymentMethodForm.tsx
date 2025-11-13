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

            {/* Sub-options for online payment */}
            {selectedMethod === PaymentMethod.ONLINE && (
                <div className="mt-3">
                    <Radio.Group 
                        value={selectedGateway}
                        onChange={(e) => setSelectedGateway(e.target.value)}
                        className="w-full"
                    >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="border border-gray-200 rounded-lg">
                                <Radio value="vnpay" className="!ml-4 w-full">
                                    <div className="flex items-center justify-center gap-2 p-4 cursor-pointer w-full">
                                        <img 
                                            src="/images/vnpay.png" 
                                            alt="VNPay"
                                            className="w-12 h-12 object-contain"
                                        />
                                        <span className="font-medium">VNPAY</span>
                                    </div>
                                </Radio>
                            </div>
                            <div className="border border-gray-200 rounded-lg">
                                <Radio value="momo" className="!ml-4 w-full">
                                    <div className="flex items-center justify-center gap-2 p-4 cursor-pointer w-full">
                                        <img 
                                            src="/images/momo.png" 
                                            alt="MoMo"
                                            className="w-12 h-12 object-contain"
                                        />
                                        <span className="font-medium">MOMO</span>
                                    </div>
                                </Radio>
                            </div>
                        </div>
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
