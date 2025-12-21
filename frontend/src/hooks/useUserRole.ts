import { useEffect, useState } from 'react';
import api from '@/lib/api';

export function useUserRole() {
    const [userRole, setUserRole] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchUserRole() {
            try {
                const userData = await api.getMe();
                if (userData) {
                    const role = userData.user?.role || userData.data?.role;
                    setUserRole(role);
                }
            } catch (error) {
                console.error('Error fetching user role:', error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchUserRole();
    }, []);

    const isAdmin = userRole === 'admin';
    const isReadOnly = userRole === 'auditor'; // Only auditor has read-only access

    return {
        userRole,
        isAdmin,
        isReadOnly,
        isLoading
    };
}
