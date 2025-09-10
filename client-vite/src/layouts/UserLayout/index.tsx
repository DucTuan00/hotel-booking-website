import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface UserLayoutProps {
    children?: React.ReactNode;
    headerTransparent?: boolean;
}

const UserLayout: React.FC<UserLayoutProps> = ({
    children,
    headerTransparent = false
}) => {
    return (
        <div className="min-h-screen flex flex-col">
            <Header transparent={headerTransparent} />
            <main className="flex-1">
                {children || <Outlet />}
            </main>
            <Footer />
        </div>
    );
};

export default UserLayout;