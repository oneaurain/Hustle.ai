import { create } from 'zustand';

interface RatingState {
    visible: boolean;
    showRating: () => void;
    hideRating: () => void;
}

export const useRatingStore = create<RatingState>((set) => ({
    visible: false,
    showRating: () => set({ visible: true }),
    hideRating: () => set({ visible: false }),
}));
