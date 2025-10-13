import { useState, useEffect, useCallback } from 'react';
import { hasAuthToken } from '@/utils/auth';
import authService from '@/services/auth/authService';

export const useAuthToken = () => {
    const [isTokenValid, setIsTokenValid] = useState<boolean>(hasAuthToken());
    const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

    const refreshTokenIfNeeded = useCallback(async () => {
        if (isRefreshing) return;
        
        setIsRefreshing(true);
        try {
            await authService.refreshToken();
            setIsTokenValid(true);
        } catch {
            setIsTokenValid(false);
            // Redirect to login will be handled by interceptor
        } finally {
            setIsRefreshing(false);
        }
    }, [isRefreshing]);

    const checkTokenPeriodically = useCallback(() => {
        // Check token every 30 minutes
        const interval = setInterval(async () => {
            try {
                await authService.verifyToken();
            } catch {
                await refreshTokenIfNeeded();
            }
        }, 30 * 60 * 1000);

        return () => clearInterval(interval);
    }, [refreshTokenIfNeeded]);

    useEffect(() => {
        if (hasAuthToken()) {
            return checkTokenPeriodically();
        }
    }, [checkTokenPeriodically]);

    return {
        isTokenValid,
        isRefreshing,
        refreshTokenIfNeeded,
    };
};