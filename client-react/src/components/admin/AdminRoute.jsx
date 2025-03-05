import React, { useEffect, useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import Cookies from 'js-cookie';
import api from '../../api';
import { ClipLoader } from "react-spinners";

const AdminRoute = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {

        const verifyToken = async () => {
            try {
                const response = await api.get('/auth/verify-token', {
                    withCredentials: true, // Send cookie HttpOnly
                });

                if (response.data.role === 'admin') {
                    setIsAdmin(true);
                } else {
                    navigate('/'); 
                }
            } catch (error) {
                console.error("Lỗi xác thực token:", error);
                Cookies.remove('accessToken'); 
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
        return null; 
    }

    return <Outlet />;
};

export default AdminRoute;