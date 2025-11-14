import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BottomNavigation from '@/components/BottomNavigation';
import { isMobile } from '@/utils/auth';

interface UserLayoutProps {
    children?: React.ReactNode;
    headerTransparent?: boolean;
}

const UserLayout: React.FC<UserLayoutProps> = ({
    children,
    headerTransparent = false
}) => {
    const isNativeApp = isMobile();

    return (
        <div className="min-h-screen flex flex-col">
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