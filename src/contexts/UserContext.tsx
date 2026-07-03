import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export interface UserTier {
    type: 'free' | 'full';
    interviewsRemaining: number;
    maxInterviews: number;
}

export interface UserProfile {
    role: string;
    experience: string;
    scenario: string;
}

export interface PracticeSessionSummary {
    id: string;
    role: string;
    scenario: string;
    score: number;
    category: 'Not Ready' | 'Borderline' | 'Interview Ready';
    completedAt: string;
}

interface UserContextType {
    tier: UserTier;
    profile: UserProfile;
    sessions: PracticeSessionSummary[];
    useInterview: () => boolean; // Returns true if interview can proceed
    canAccessFeedback: () => boolean;
    canAccessScenario: (role: string, scenarioId: string) => boolean;
    upgradeToPaid: () => void;
    resetFreeUsage: () => void;
    updateProfile: (profile: UserProfile) => void;
    addSession: (session: PracticeSessionSummary) => void;
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

    const [profile, setProfile] = useState<UserProfile>(() => {
        const stored = localStorage.getItem('prepgenius_profile');
        if (stored) {
            try {
                return JSON.parse(stored) as UserProfile;
            } catch {
                return { role: 'Inbound Customer Support', experience: '0-1 years', scenario: 'General' };
            }
        }
        return { role: 'Inbound Customer Support', experience: '0-1 years', scenario: 'General' };
    });

    const [sessions, setSessions] = useState<PracticeSessionSummary[]>(() => {
        const stored = localStorage.getItem('prepgenius_sessions');
        if (stored) {
            try {
                return JSON.parse(stored) as PracticeSessionSummary[];
            } catch {
                return [];
            }
        }
        return [];
    });

    useEffect(() => {
        localStorage.setItem('prepgenius_user', JSON.stringify(tier));
    }, [tier]);

    useEffect(() => {
        localStorage.setItem('prepgenius_profile', JSON.stringify(profile));
    }, [profile]);

    useEffect(() => {
        localStorage.setItem('prepgenius_sessions', JSON.stringify(sessions));
    }, [sessions]);

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
        // TODO: Enable paywall after testing
        // return tier.type === 'full';
        return true; // Allow all access for testing
    };

    const canAccessScenario = (_role: string, _scenarioId: string): boolean => {
        // TODO: Uncomment tier restrictions after testing
        // if (tier.type === 'full') return true;
        // Free tier: only Inbound Customer Support + General scenario
        // return role === 'Inbound Customer Support' && scenarioId === 'General';
        return true; // Allow all scenarios for testing
    };

    const upgradeToPaid = () => {
        setTier({ ...FULL_ACCESS_TIER });
    };

    const resetFreeUsage = () => {
        setTier({ ...FREE_TIER });
    };

    const updateProfile = (nextProfile: UserProfile) => {
        setProfile(nextProfile);
    };

    const addSession = (session: PracticeSessionSummary) => {
        setSessions(prev => [...prev, session].slice(-8));
    };

    return (
        <UserContext.Provider value={{
            tier,
            profile,
            sessions,
            useInterview,
            canAccessFeedback,
            canAccessScenario,
            upgradeToPaid,
            resetFreeUsage,
            updateProfile,
            addSession
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
