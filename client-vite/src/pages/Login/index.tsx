import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
// import LoginForm from '@/pages/Login/LoginForm';
import LoginForm2 from "@/pages/Login/LoginForm2";
import authService from "@/services/auth/authService";
import { useNavigate, useSearchParams } from "react-router-dom";
import { message } from "antd";

interface FormData {
    name: string;
    phone: string;
    email: string;
    password: string;
}

const Login: React.FC = () => {
    const [isRegister, setIsRegister] = useState<boolean>(
        () => localStorage.getItem("isRegister") === "true"
    );
    const [formData, setFormData] = useState<FormData>({
        name: "",
        phone: "",
        email: "",
        password: "",
    });
    const [error, setError] = useState<string>("");
    const navigate = useNavigate(); // Hook for navigation
    const [searchParams] = useSearchParams();

    useEffect(() => {
        localStorage.setItem("isRegister", String(isRegister));
    }, [isRegister]);

    useEffect(() => {
        const authParam = searchParams.get('auth');
        const errorParam = searchParams.get('error');

        if (authParam === 'success') {
            message.success('Đăng nhập thành công!');
            // Check user role and redirect
            authService.verifyToken()
                .then((userData) => {
                    if (userData.role === 'admin') {
                        navigate('/dashboard');
                    } else {
                        navigate('/');
                    }
                })
                .catch(() => {
                    navigate('/');
                });
        } else if (errorParam) {
            switch (errorParam) {
                case 'oauth_error':
                    message.error('Lỗi xác thực Google. Vui lòng thử lại.');
                    break;
                case 'oauth_failed':
                    message.error('Đăng nhập Google thất bại. Vui lòng thử lại.');
                    break;
                case 'server_error':
                    message.error('Lỗi server. Vui lòng thử lại sau.');
                    break;
                default:
                    message.error('Có lỗi xảy ra. Vui lòng thử lại.');
            }
            navigate('/login', { replace: true });
        }
    }, [searchParams, navigate]);

    const toggleAuthMode = () => {
        setIsRegister((prevState) => !prevState);
        setError("");
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit =
        (type: "login" | "register") =>
        async (e: FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            setError("");

            try {
                if (type === "register") {
                    await authService.register({
                        name: formData.name,
                        phone: formData.phone,
                        email: formData.email,
                        password: formData.password,
                    });
                    console.log("Register successfully");
                    setIsRegister(false); // Set to false to show login form
                } else if (type === "login") {
                    const userData = await authService.login({
                        email: formData.email,
                        password: formData.password,
                    });

                    if (userData.role === "admin") {
                        navigate("/dashboard"); // Navigate to dashboard
                    } else {
                        navigate("/"); // Navigate to home
                    }
                }
            } catch (err: unknown) {
                const errorObj = err as { error?: string; message?: string };
                console.error("Lỗi:", err);
                setError(errorObj.error || errorObj.message || "Có lỗi xảy ra");
            }
        };

    return (
        // <LoginForm
        //     onSubmit={handleSubmit}
        //     onChange={handleChange}
        //     formData={formData}
        //     isRegister={isRegister}
        //     toggleAuthMode={toggleAuthMode}
        //     error={error}
        // />
        <LoginForm2
            onSubmit={handleSubmit}
            onChange={handleChange}
            formData={formData}
            isRegister={isRegister}
            toggleAuthMode={toggleAuthMode}
            error={error}
        />
    );
};

export default Login;
