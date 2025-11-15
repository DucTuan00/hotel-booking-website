import React, { useState } from "react";
import {
    Card,
    Input,
    Button,
    Tabs,
    Divider,
    Typography,
} from "antd";
import {
    UserOutlined,
    LockOutlined,
    PhoneOutlined,
    MailOutlined,
} from "@ant-design/icons";
import { COLORS, TYPOGRAPHY } from "@/config/constants";
import Notification from "@/components/Notification";
import { Message } from '@/types/message';

const { Text } = Typography;
const { TabPane } = Tabs;

interface FormData {
    name: string;
    phone: string;
    email: string;
    password: string;
}

interface LoginFormProps {
    onSubmit: (
        type: "login" | "register"
    ) => (e: React.FormEvent<HTMLFormElement>) => void;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    formData: FormData;
    isRegister: boolean;
    toggleAuthMode: () => void;
    error: string;
}

const LoginForm2: React.FC<LoginFormProps> = ({
    onSubmit,
    onChange,
    formData,
    isRegister,
    toggleAuthMode,
    error,
}) => {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<Message | null>(null);

    const handleFormSubmit = (type: "login" | "register") => {
        return (e: React.FormEvent<HTMLFormElement>) => {
            setLoading(true);
            try {
                onSubmit(type)(e);
            } catch (err) {
                console.error("Login/Register error:", err);
            } finally {
                setTimeout(() => setLoading(false), 1000);
            }
        };
    };

    const handleGoogleLogin = () => {
        const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
        const backendUrl = apiBaseUrl.replace('/api', ''); 
        window.location.href = `${backendUrl}/api/auth/google`;
    };

    return (
        <>
            <Notification
                message={message}
                onClose={() => setMessage(null)}
            />

            <div className="flex justify-center p-10 bg-gradient-to-br from-gray-50 to-gray-100">

                {/* Main Content */}
                <div className="relative z-10 w-full max-w-md">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div
                            className="text-4xl md:text-5xl font-bold mb-2"
                            style={{
                                fontFamily: TYPOGRAPHY.fontFamily.primary,
                                color: COLORS.primary,
                            }}
                        >
                            LION
                        </div>
                        <Text
                            className="text-lg md:text-xl"
                            style={{
                                fontFamily: TYPOGRAPHY.fontFamily.secondary,
                                color: COLORS.gray[600],
                            }}
                        >
                            Boutique Hotel
                        </Text>
                    </div>

                    {/* Login Card */}
                    <Card
                        className="shadow-2xl border-0 rounded-2xl overflow-hidden"
                        style={{
                            background: "rgba(255, 255, 255, 0.95)",
                            backdropFilter: "blur(10px)",
                        }}
                        bodyStyle={{ padding: "2rem" }}
                    >
                        <Tabs
                            activeKey={isRegister ? "register" : "login"}
                            onChange={(key) => {
                                if (
                                    (key === "register" && !isRegister) ||
                                    (key === "login" && isRegister)
                                ) {
                                    toggleAuthMode();
                                }
                            }}
                            centered
                            size="large"
                            tabBarGutter={40}
                            className="mb-6"
                        >
                            {/* Login Tab */}
                            <TabPane tab="Đăng nhập" key="login">
                                <form onSubmit={handleFormSubmit("login")}>
                                    <div className="space-y-4">
                                        <div>
                                            <Input
                                                prefix={
                                                    <MailOutlined
                                                        style={{
                                                            color: COLORS.primary,
                                                        }}
                                                    />
                                                }
                                                placeholder="Email của bạn"
                                                name="email"
                                                type="email"
                                                value={formData.email}
                                                onChange={onChange}
                                                className="rounded-lg h-12"
                                                style={{
                                                    fontSize: "16px",
                                                    fontFamily:
                                                        TYPOGRAPHY.fontFamily
                                                            .secondary,
                                                }}
                                                required
                                            />
                                        </div>

                                        <div>
                                            <Input.Password
                                                prefix={
                                                    <LockOutlined
                                                        style={{
                                                            color: COLORS.primary,
                                                        }}
                                                    />
                                                }
                                                placeholder="Mật khẩu"
                                                name="password"
                                                value={formData.password}
                                                onChange={onChange}
                                                className="rounded-lg h-12"
                                                style={{
                                                    fontSize: "16px",
                                                    fontFamily:
                                                        TYPOGRAPHY.fontFamily
                                                            .secondary,
                                                }}
                                                required
                                            />
                                        </div>

                                        {!isRegister && error && (
                                            <div className="text-red-500 text-sm mt-2">
                                                {error}
                                            </div>
                                        )}

                                        <div className="flex justify-between items-center mb-6">
                                            <Button
                                                type="link"
                                                className="p-0 text-sm"
                                                style={{ color: COLORS.gray[500] }}
                                            >
                                                Quên mật khẩu?
                                            </Button>
                                        </div>

                                        <Button
                                            type="primary"
                                            htmlType="submit"
                                            loading={loading}
                                            block
                                            size="large"
                                            className="h-12 rounded-lg font-semibold text-base"
                                            style={{
                                                background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryDark} 100%)`,
                                                border: "none",
                                                fontFamily:
                                                    TYPOGRAPHY.fontFamily.secondary,
                                            }}
                                        >
                                            Đăng nhập
                                        </Button>
                                    </div>
                                </form>
                            </TabPane>

                            {/* Register Tab */}
                            <TabPane tab="Đăng ký" key="register">
                                <form onSubmit={handleFormSubmit("register")}>
                                    <div className="space-y-4">
                                        <div>
                                            <Input
                                                prefix={
                                                    <UserOutlined
                                                        style={{
                                                            color: COLORS.primary,
                                                        }}
                                                    />
                                                }
                                                placeholder="Họ và tên"
                                                name="name"
                                                value={formData.name}
                                                onChange={onChange}
                                                className="rounded-lg h-12"
                                                style={{
                                                    fontSize: "16px",
                                                    fontFamily:
                                                        TYPOGRAPHY.fontFamily
                                                            .secondary,
                                                }}
                                                required
                                            />
                                        </div>

                                        <div>
                                            <Input
                                                prefix={
                                                    <PhoneOutlined
                                                        style={{
                                                            color: COLORS.primary,
                                                        }}
                                                    />
                                                }
                                                placeholder="Số điện thoại"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={onChange}
                                                className="rounded-lg h-12"
                                                style={{
                                                    fontSize: "16px",
                                                    fontFamily:
                                                        TYPOGRAPHY.fontFamily
                                                            .secondary,
                                                }}
                                                required
                                            />
                                        </div>

                                        <div>
                                            <Input
                                                prefix={
                                                    <MailOutlined
                                                        style={{
                                                            color: COLORS.primary,
                                                        }}
                                                    />
                                                }
                                                placeholder="Email của bạn"
                                                name="email"
                                                type="email"
                                                value={formData.email}
                                                onChange={onChange}
                                                className="rounded-lg h-12"
                                                style={{
                                                    fontSize: "16px",
                                                    fontFamily:
                                                        TYPOGRAPHY.fontFamily
                                                            .secondary,
                                                }}
                                                required
                                            />
                                        </div>

                                        <div>
                                            <Input.Password
                                                prefix={
                                                    <LockOutlined
                                                        style={{
                                                            color: COLORS.primary,
                                                        }}
                                                    />
                                                }
                                                placeholder="Mật khẩu"
                                                name="password"
                                                value={formData.password}
                                                onChange={onChange}
                                                className="rounded-lg h-12"
                                                style={{
                                                    fontSize: "16px",
                                                    fontFamily:
                                                        TYPOGRAPHY.fontFamily
                                                            .secondary,
                                                }}
                                                required
                                            />
                                        </div>

                                        {isRegister && error && (
                                            <div className="text-red-500 text-sm mt-2">
                                                {error}
                                            </div>
                                        )}

                                        <Button
                                            type="primary"
                                            htmlType="submit"
                                            loading={loading}
                                            block
                                            size="large"
                                            className="h-12 rounded-lg font-semibold text-base mt-6"
                                            style={{
                                                background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryDark} 100%)`,
                                                border: "none",
                                                fontFamily:
                                                    TYPOGRAPHY.fontFamily.secondary,
                                            }}
                                        >
                                            Đăng ký
                                        </Button>
                                    </div>
                                </form>
                            </TabPane>
                        </Tabs>

                        {/* Google Login */}
                        <Divider className="my-6">
                            <Text
                                style={{
                                    color: COLORS.gray[500],
                                    fontFamily: TYPOGRAPHY.fontFamily.secondary,
                                }}
                            >
                                Hoặc đăng nhập với
                            </Text>
                        </Divider>

                        <Button
                            className="w-full h-14 rounded-full border-2 hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-3"
                            size="large"
                            style={{
                                borderColor: '#dadce0',
                                backgroundColor: '#fff',
                                color: '#3c4043',
                                fontSize: '16px',
                                fontWeight: 500,
                                fontFamily: TYPOGRAPHY.fontFamily.secondary,
                            }}
                            onClick={handleGoogleLogin}
                        >
                            <img 
                                src="/images/google.png" 
                                alt="Google" 
                                style={{ 
                                    width: '20px', 
                                    height: '20px',
                                    objectFit: 'contain'
                                }} 
                            />
                            <span>Đăng nhập bằng Google</span>
                        </Button>
                    </Card>
                </div>
            </div>
        </>
    );
};

export default LoginForm2;
