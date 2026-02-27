import React, { useState } from 'react';
import { Form, Radio, Divider, Space, Alert } from 'antd';
import { PaymentMethod, PaymentOption, DEPOSIT_PERCENT } from '@/types/booking';

const PaymentMethodForm: React.FC = () => {
    const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>(PaymentMethod.ONSITE);
    const [selectedGateway, setSelectedGateway] = useState<string>('vnpay');
    const [selectedPaymentOption, setSelectedPaymentOption] = useState<PaymentOption>(PaymentOption.FULL);

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
                    onChange={(e) => {
                        setSelectedMethod(e.target.value);
                        // Reset deposit state when switching payment method
                        if (e.target.value !== PaymentMethod.ONLINE) {
                            setSelectedPaymentOption(PaymentOption.FULL);
                        } else {
                            // Switching back to online — reset to FULL to stay in sync with form initialValue
                            setSelectedPaymentOption(PaymentOption.FULL);
                            setSelectedGateway('vnpay');
                        }
                    }}
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
                    {/* Payment Option: Full vs Deposit */}
                    <Form.Item
                        name="paymentOption"
                        initialValue={PaymentOption.FULL}
                        rules={[{ required: true, message: 'Vui lòng chọn hình thức thanh toán!' }]}
                        className="!mb-0"
                    >
                        <Radio.Group
                            onChange={(e) => setSelectedPaymentOption(e.target.value)}
                            className="w-full"
                        >
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                                <div className={`border rounded-lg transition-colors cursor-pointer ${selectedPaymentOption === PaymentOption.FULL ? 'border-[#D4902A] bg-orange-50' : 'border-gray-200 hover:border-[#D4902A]'}`}>
                                    <Radio value={PaymentOption.FULL} className="!ml-4 w-full">
                                        <div className="p-3 cursor-pointer">
                                            <div className="font-medium">Thanh toán 100%</div>
                                            <div className="text-xs text-gray-500 mt-1">Thanh toán toàn bộ số tiền</div>
                                        </div>
                                    </Radio>
                                </div>
                                <div className={`border rounded-lg transition-colors cursor-pointer ${selectedPaymentOption === PaymentOption.DEPOSIT ? 'border-[#D4902A] bg-orange-50' : 'border-gray-200 hover:border-[#D4902A]'}`}>
                                    <Radio value={PaymentOption.DEPOSIT} className="!ml-4 w-full">
                                        <div className="p-3 cursor-pointer">
                                            <div className="font-medium">Đặt cọc {DEPOSIT_PERCENT}%</div>
                                            <div className="text-xs text-gray-500 mt-1">Phần còn lại thanh toán tại quầy</div>
                                        </div>
                                    </Radio>
                                </div>
                            </div>
                        </Radio.Group>
                    </Form.Item>

                    {selectedPaymentOption === PaymentOption.DEPOSIT && (
                        <Alert
                            message="Lưu ý về đặt cọc"
                            description={
                                <ul className="list-disc pl-4 !mb-0 text-sm">
                                    <li>Tiền cọc <strong>không được hoàn lại</strong> trong mọi trường hợp</li>
                                    <li>Đơn đặt cọc <strong>không thể hủy</strong></li>
                                    <li>Phần còn lại ({100 - DEPOSIT_PERCENT}%) thanh toán tại quầy khi nhận phòng</li>
                                </ul>
                            }
                            type="warning"
                            showIcon
                            className="!mb-4"
                        />
                    )}

                    {/* Payment Gateway Selection */}
                    <Form.Item
                        name="paymentGateway"
                        initialValue={selectedGateway}
                        rules={[{ required: true, message: 'Vui lòng chọn cổng thanh toán!' }]}
                    >
                        <Radio.Group 
                            onChange={(e) => setSelectedGateway(e.target.value)}
                            className="w-full"
                        >
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className={`border rounded-lg transition-colors cursor-pointer ${selectedGateway === 'vnpay' ? 'border-[#D4902A] bg-orange-50' : 'border-gray-200 hover:border-[#D4902A]'}`}>
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
                                <div className={`border rounded-lg transition-colors cursor-pointer ${selectedGateway === 'momo' ? 'border-[#D4902A] bg-orange-50' : 'border-gray-200 hover:border-[#D4902A]'}`}>
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
                    </Form.Item>
                </div>
            )}
        </div>
    );
};

export default PaymentMethodForm;
