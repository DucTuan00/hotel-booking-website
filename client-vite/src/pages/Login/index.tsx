import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
// import LoginForm from '@/pages/Login/LoginForm';
import LoginForm2 from "@/pages/Login/LoginForm2";
import authService from "@/services/auth/authService";
import { useNavigate, useSearchParams } from "react-router-dom";
import Notification from "@/components/Notification";
import { Message } from "@/types/message";

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
    const [message, setMessage] = useState<Message | null>(null);
    const navigate = useNavigate(); 
    const [searchParams] = useSearchParams();

    useEffect(() => {
        localStorage.setItem("isRegister", String(isRegister));
    }, [isRegister]);

    useEffect(() => {
        const errorParam = searchParams.get('error');

        if (errorParam) {
            switch (errorParam) {
                case 'oauth_error':
                    setMessage({ type: 'error', text: 'Lỗi xác thực Google. Vui lòng thử lại.' });
                    break;
                case 'oauth_failed':
                    setMessage({ type: 'error', text: 'Đăng nhập Google thất bại. Vui lòng thử lại.' });
                    break;
                case 'server_error':
                    setMessage({ type: 'error', text: 'Lỗi server. Vui lòng thử lại sau.' });
                    break;
                default:
                    setMessage({ type: 'error', text: 'Có lỗi xảy ra. Vui lòng thử lại.' });
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
                    setMessage({ type: 'success', text: 'Đăng ký thành công! Vui lòng đăng nhập.' });
                    setIsRegister(false);
                } else if (type === "login") {
                    const userData = await authService.login({
                        email: formData.email,
                        password: formData.password,
                    });

                    if (userData.role === "admin") {
                        navigate("/dashboard?auth=success");
                    } else {
                        navigate("/?auth=success");
                    }
                }
            } catch (err: any) {
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
        <>
            <Notification
                message={message}
                onClose={() => setMessage(null)}
            />
            <LoginForm2
                onSubmit={handleSubmit}
                onChange={handleChange}
                formData={formData}
                isRegister={isRegister}
                toggleAuthMode={toggleAuthMode}
                error={error}
            />
        </>
    );
};

export default Login;
