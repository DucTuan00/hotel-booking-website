import React, { useEffect, useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import api from '@/services/api';
import { isMobile, getAuthToken } from '@/utils/auth';

interface VerifyTokenResponse {
    role: string;
}

const AdminRoute: React.FC = () => {
    const navigate = useNavigate();

    const checkInitialAuth = () => {
        if (isMobile()) {
            return getAuthToken() !== null;
        } else {
            return localStorage.getItem('isAuthenticated') === 'true';
        }
    };

    const isAuthenticated = checkInitialAuth();
    const [isAdmin, setIsAdmin] = useState<boolean>(isAuthenticated);

    useEffect(() => {

        const verifyToken = async () => {

            if (isAuthenticated) {
                return;
            }

            try {
                const response = await api.post<VerifyTokenResponse>('/auth/verify-token', {
                    withCredentials: true, 
                });

                if (response.data.role === 'admin') {
                    setIsAdmin(true);
                    localStorage.setItem('isAuthenticated', 'true');
                } else {
                    navigate('/');
                }
            } catch (error: unknown) {
                if (typeof error === 'object' && error !== null && 'response' in error) {
                    const err = error as { response?: { data?: unknown } };
                    console.error('Lỗi xác thực token:', err.response?.data);
                } else {
                    console.error('Lỗi xác thực token:', (error as Error).message);
                }
                navigate('/login');
            }
        };

        verifyToken();
    }, [navigate, isAuthenticated]);

    if (!isAdmin) {
        return <div>Bạn không có quyền truy cập trang này.</div>;
    }

    return <Outlet />;
};

export default AdminRoute;