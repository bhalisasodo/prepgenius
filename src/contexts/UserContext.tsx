import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export interface UserTier {
    type: 'free' | 'full';
    interviewsRemaining: number;
    maxInterviews: number;
}

interface UserContextType {
    tier: UserTier;
    useInterview: () => boolean; // Returns true if interview can proceed
    canAccessFeedback: () => boolean;
    canAccessScenario: (role: string, scenarioId: string) => boolean;
    upgradeToPaid: () => void;
    resetFreeUsage: () => void;
}

const FREE_TIER: UserTier = {
    type: 'free',
    interviewsRemaining: 1,
    maxInterviews: 1
};

const FULL_ACCESS_TIER: UserTier = {
    type: 'full',
    interviewsRemaining: 5,
    maxInterviews: 5
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [tier, setTier] = useState<UserTier>(() => {
        const stored = localStorage.getItem('prepgenius_user');
        if (stored) {
            try {
                return JSON.parse(stored) as UserTier;
            } catch {
                return { ...FREE_TIER };
            }
        }
        return { ...FREE_TIER };
    });

    useEffect(() => {
        localStorage.setItem('prepgenius_user', JSON.stringify(tier));
    }, [tier]);

    const useInterview = (): boolean => {
        if (tier.interviewsRemaining <= 0) {
            return false;
        }
        setTier(prev => ({
            ...prev,
            interviewsRemaining: prev.interviewsRemaining - 1
        }));
        return true;
    };

    const canAccessFeedback = (): boolean => {
        return tier.type === 'full';
    };

    const canAccessScenario = (role: string, scenarioId: string): boolean => {
        if (tier.type === 'full') return true;
        // Free tier: only Inbound Customer Support + General scenario
        return role === 'Inbound Customer Support' && scenarioId === 'General';
    };

    const upgradeToPaid = () => {
        setTier({ ...FULL_ACCESS_TIER });
    };

    const resetFreeUsage = () => {
        setTier({ ...FREE_TIER });
    };

    return (
        <UserContext.Provider value={{
            tier,
            useInterview,
            canAccessFeedback,
            canAccessScenario,
            upgradeToPaid,
            resetFreeUsage
        }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = (): UserContextType => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};
