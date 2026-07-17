import { useState, useEffect } from 'react';
import { AuthService } from '../services/auth.service';

export function useAuth() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUser = async () => {
            try {
                const userData = await AuthService.getCurrentUser();
                setUser(userData);
            } catch (error) {
                console.error("Failed to load user", error);
            } finally {
                setLoading(false);
            }
        };

        if (AuthService.isAuthenticated()) {
            loadUser();
        } else {
            setLoading(false);
        }
    }, []);

    return { user, loading };
}
