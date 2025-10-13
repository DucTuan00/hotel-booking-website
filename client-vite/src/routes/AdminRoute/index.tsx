import React, { useEffect, useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import api from '@/services/api';

const AdminRoute: React.FC = () => {
    const navigate = useNavigate();
    const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

    useEffect(() => {
        const checkAdminAccess = async () => {
            try {
                const response = await api.get('/user/info');
                
                if (response.data.role === 'admin') {
                    setIsAdmin(true);
                    localStorage.setItem('isAuthenticated', 'true');
                } else {
                    setIsAdmin(false);
                    localStorage.removeItem('isAuthenticated');
                    navigate('/', { replace: true });
                }
            } catch (error) {
                console.error('Authentication failed:', error);
                setIsAdmin(false);
                localStorage.removeItem('isAuthenticated');
                navigate('/login', { replace: true });
            }
        };

        checkAdminAccess();
    }, [navigate]);

    if (!isAdmin) {
        return null;
    }

    return <Outlet />;
};

export default AdminRoute;