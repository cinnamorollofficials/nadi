import { useState, useEffect } from 'react';

/**
 * Hook to check if current user has specific permissions
 * @returns {Object} object containing hasPermission function
 */
export const usePermission = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            try {
                setUser(JSON.parse(userData));
            } catch (e) {
                console.error('Failed to parse user data', e);
            }
        }
    }, []);

    const hasPermission = (permission) => {
        if (!user) return false;
        
        // Superadmin bypass (Role ID 1)
        if (user.role_id === 1) return true;
        
        if (!user.permissions_mask) return false;
        
        const mask = BigInt(user.permissions_mask);

        if (typeof permission === 'bigint') {
            return (mask & permission) !== 0n;
        }

        if (Array.isArray(permission)) {
            return permission.some(p => (mask & BigInt(p)) !== 0n);
        }

        return false;
    };

    return { hasPermission, user };
};
