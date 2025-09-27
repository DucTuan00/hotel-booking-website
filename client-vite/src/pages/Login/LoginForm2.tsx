import React, { useState } from "react";
import {
    Card,
    Input,
    Button,
    Tabs,
    Divider,
    Typography,
    Row,
    Col,
    message,
} from "antd";
import {
    UserOutlined,
    LockOutlined,
    PhoneOutlined,
    MailOutlined,
    GoogleOutlined,
    FacebookOutlined,
    GithubOutlined,
    LinkedinOutlined,
} from "@ant-design/icons";
import { COLORS, TYPOGRAPHY } from "@/config/constants";

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

    const socialLoginButtons = [
        { icon: <GoogleOutlined />, color: "#DB4437", name: "Google" },
        { icon: <FacebookOutlined />, color: "#4267B2", name: "Facebook" },
        { icon: <GithubOutlined />, color: "#333", name: "Github" },
        { icon: <LinkedinOutlined />, color: "#0077B5", name: "LinkedIn" },
    ];

    return (
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

                    {/* Social Login */}
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

                    <Row gutter={[12, 12]} className="mb-6">
                        {socialLoginButtons.map((social, index) => (
                            <Col xs={12} sm={6} key={index}>
                                <Button
                                    icon={social.icon}
                                    className="w-full h-12 rounded-lg border-2 hover:border-opacity-80 transition-all duration-200"
                                    style={{
                                        borderColor: social.color,
                                        color: social.color,
                                    }}
                                    onClick={() =>
                                        message.info(
                                            `Đăng nhập với ${social.name}`
                                        )
                                    }
                                >
                                    <span className="hidden sm:inline ml-2">
                                        {social.name}
                                    </span>
                                </Button>
                            </Col>
                        ))}
                    </Row>
                </Card>
            </div>
        </div>
    );
};

export default LoginForm2;
