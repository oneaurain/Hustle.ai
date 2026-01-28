import { create } from 'zustand';
import type { OnboardingData } from '../types';

interface OnboardingState extends OnboardingData {
    currentStep: number;
    isComplete: boolean;
    setSkills: (skills: string[]) => void;
    setHours: (hours: number) => void;
    setResources: (resources: string[]) => void;
    setGoals: (goals: string[]) => void;
    setInterests: (interests: string[]) => void;
    setLocationType: (locationType: string) => void;
    nextStep: () => void;
    previousStep: () => void;
    goToStep: (step: number) => void;
    reset: () => void;
    getData: () => OnboardingData;
}

const initialState: OnboardingData = {
    skills: [],
    available_hours_per_week: 0,
    resources: [],
    goals: [],
    interests: [],
    location_type: 'urban',
};

export const useOnboardingStore = create<OnboardingState>((set, get) => ({
    ...initialState,
    currentStep: 0,
    isComplete: false,

    setSkills: (skills) => set({ skills }),
    setHours: (hours) => set({ available_hours_per_week: hours }),
    setResources: (resources) => set({ resources }),
    setGoals: (goals) => set({ goals }),
    setInterests: (interests) => set({ interests }),
    setLocationType: (locationType) => set({ location_type: locationType }),

    nextStep: () => {
        const currentStep = get().currentStep;
        const nextStep = currentStep + 1;

        if (nextStep >= 4) {
            set({ isComplete: true });
        } else {
            set({ currentStep: nextStep });
        }
    },

    previousStep: () => {
        const currentStep = get().currentStep;
        if (currentStep > 0) {
            set({ currentStep: currentStep - 1, isComplete: false });
        }
    },

    goToStep: (step) => set({ currentStep: step, isComplete: false }),

    reset: () => set({ ...initialState, currentStep: 0, isComplete: false }),

    getData: () => {
        const state = get();
        return {
            skills: state.skills,
            available_hours_per_week: state.available_hours_per_week,
            resources: state.resources,
            goals: state.goals,
            interests: state.interests,
            location_type: state.location_type,
        };
    },
}));
