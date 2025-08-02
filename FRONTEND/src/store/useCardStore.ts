import { create } from 'zustand';
import type { Issue } from '../types/issue';

// Re-export Issue type for convenience
export type { Issue } from '../types/issue';

interface CardState {
  selectedCard: Issue | null;
  isModalOpen: boolean;
  cardHistory: Issue[];
  
  // Actions
  selectCard: (card: Issue) => void;
  openModal: (card: Issue) => void;
  closeModal: () => void;
  clearSelectedCard: () => void;
  addToHistory: (card: Issue) => void;
  clearHistory: () => void;
  updateCardStatus: (cardId: string | number, newStatus: Issue['status']) => void;
  updateCardVotes: (cardId: string | number, votes: number) => void;
}

export const useCardStore = create<CardState>((set) => ({
  selectedCard: null,
  isModalOpen: false,
  cardHistory: [],

  selectCard: (card) =>
    set(() => ({
      selectedCard: card,
    })),

  openModal: (card) =>
    set(() => ({
      selectedCard: card,
      isModalOpen: true,
    })),

  closeModal: () =>
    set(() => ({
      isModalOpen: false,
    })),

  clearSelectedCard: () =>
    set(() => ({
      selectedCard: null,
      isModalOpen: false,
    })),

  addToHistory: (card) =>
    set((state) => {
      // Avoid duplicates in history
      const existingIndex = state.cardHistory.findIndex(
        (historyCard) => historyCard.id === card.id
      );
      
      if (existingIndex !== -1) {
        // Move to front if already exists
        const updatedHistory = [...state.cardHistory];
        updatedHistory.splice(existingIndex, 1);
        updatedHistory.unshift(card);
        return { cardHistory: updatedHistory.slice(0, 10) }; // Keep only last 10
      }
      
      // Add to front
      return {
        cardHistory: [card, ...state.cardHistory].slice(0, 10), // Keep only last 10
      };
    }),

  clearHistory: () =>
    set(() => ({
      cardHistory: [],
    })),

  updateCardStatus: (cardId, newStatus) =>
    set((state) => {
      const updatedCard = state.selectedCard && state.selectedCard.id === cardId
        ? { ...state.selectedCard, status: newStatus }
        : state.selectedCard;

      const updatedHistory = state.cardHistory.map((card) =>
        card.id === cardId ? { ...card, status: newStatus } : card
      );

      return {
        selectedCard: updatedCard,
        cardHistory: updatedHistory,
      };
    }),

  updateCardVotes: (cardId, votes) =>
    set((state) => {
      const updatedCard = state.selectedCard && state.selectedCard.id === cardId
        ? { ...state.selectedCard, votes }
        : state.selectedCard;

      const updatedHistory = state.cardHistory.map((card) =>
        card.id === cardId ? { ...card, votes } : card
      );

      return {
        selectedCard: updatedCard,
        cardHistory: updatedHistory,
      };
    }),
}));
