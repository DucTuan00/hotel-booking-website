import React, { useEffect, useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import api from '../../api';
import { ClipLoader } from 'react-spinners';

const AdminRoute = () => {
    const navigate = useNavigate();

    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    const [isLoading, setIsLoading] = useState(!isAuthenticated);
    const [isAdmin, setIsAdmin] = useState(isAuthenticated);

    useEffect(() => {

        const verifyToken = async () => {
            
            if (isAuthenticated) {
                return;
            }

            try {
                const response = await api.post('/auth/verify-token', {
                    withCredentials: true, // Send cookie HttpOnly
                });

                if (response.data.role === 'admin') {
                    setIsAdmin(true);
                    localStorage.setItem('isAuthenticated', true);
                } else {
                    navigate('/'); 
                }
            } catch (error) {
                console.error('Lỗi xác thực token:', error.response ? error.response.data : error.message);
                navigate('/login'); 
            } finally {
                setIsLoading(false);
            }
        };

        verifyToken();
    }, [navigate]);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
                <ClipLoader color="#3498db" size={50} />
                <p className="mt-4 text-gray-600 text-lg font-semibold">
                    Đang kiểm tra xác thực...
                </p>
            </div>
        );
    }

    if (!isAdmin) {
        return <div>Bạn không có quyền truy cập trang này.</div>; 
    }

    return <Outlet />;
};

export default AdminRoute;