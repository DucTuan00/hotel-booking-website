import React, { useEffect, useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import api from '@/services/api';
import { useAuthToken } from '@/hooks/useAuthToken';

interface VerifyTokenResponse {
    role: string;
}

const AdminRoute: React.FC = () => {
    const navigate = useNavigate();
    const { refreshTokenIfNeeded } = useAuthToken();
    
    const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

    useEffect(() => {
        const verifyToken = async () => {
            
            try {
                const response = await api.post<VerifyTokenResponse>('/auth/verify-token');
                
                if (response.data.role === 'admin') {
                    setIsAdmin(true);
                    localStorage.setItem('isAuthenticated', 'true');
                } else {
                    setIsAdmin(false);
                    localStorage.removeItem('isAuthenticated');
                }
            } catch {
                // Try to refresh token first
                try {
                    await refreshTokenIfNeeded();
                    // Retry verification after refresh
                    const retryResponse = await api.post<VerifyTokenResponse>('/auth/verify-token');
                    if (retryResponse.data.role === 'admin') {
                        setIsAdmin(true);
                        localStorage.setItem('isAuthenticated', 'true');
                    } else {
                        setIsAdmin(false);
                        localStorage.removeItem('isAuthenticated');
                        navigate('/');
                    }
                } catch (refreshError) {
                    console.error('Token refresh failed:', refreshError);
                    setIsAdmin(false);
                    localStorage.removeItem('isAuthenticated');
                    navigate('/login');
                }
            }
        };

        verifyToken();
    }, [navigate, refreshTokenIfNeeded]);

    if (!isAdmin) {
        return <div>Bạn không có quyền truy cập trang này.</div>;
    }

    return <Outlet />;
};

export default AdminRoute;