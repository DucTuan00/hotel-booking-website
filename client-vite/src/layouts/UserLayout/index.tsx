import React, { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BottomNavigation from '@/components/BottomNavigation';
import Notification from '@/components/Notification';
import { isNativeMobile } from '@/utils/auth';
import { Message } from '@/types/message';

interface UserLayoutProps {
    children?: React.ReactNode;
    headerTransparent?: boolean;
}

const UserLayout: React.FC<UserLayoutProps> = ({
    children,
    headerTransparent = false
}) => {
    const isNativeApp = isNativeMobile();
    const location = useLocation();
    const [message, setMessage] = useState<Message | null>(null);

    // Handle auth success notification for mobile (Header is hidden on mobile)
    useEffect(() => {
        if (!isNativeApp) return; // Only for mobile, web uses Header

        const searchParams = new URLSearchParams(location.search);
        const authParam = searchParams.get('auth');

        if (authParam === 'success') {
            setMessage({ type: 'success', text: 'Đăng nhập thành công!' });
            // Clean up URL
            window.history.replaceState({}, '', location.pathname);
        }
    }, [location.search, location.pathname, isNativeApp]);

    return (
        <div className="min-h-screen flex flex-col">
            {/* Notification for mobile auth success */}
            {isNativeApp && (
                <Notification message={message} onClose={() => setMessage(null)} />
            )}
            
            {/* Show Header on web, hide on mobile app (replaced by bottom nav) */}
            {!isNativeApp && <Header transparent={headerTransparent} />}
            
            <main 
                className="flex-1" 
                style={isNativeApp ? { paddingBottom: '65px' } : {}}
            >
                {children || <Outlet />}
            </main>
            
            {/* Hide footer on mobile app for better native experience */}
            {!isNativeApp && <Footer />}
            
            {/* Show Bottom Navigation only on mobile app */}
            {isNativeApp && <BottomNavigation />}
        </div>
    );
};

export default UserLayout;