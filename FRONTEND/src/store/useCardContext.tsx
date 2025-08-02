import React, { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import { useCardStore } from './useCardStore';
import type { Issue } from '../types/issue';

interface CardContextType {
  selectedCard: Issue | null;
  isModalOpen: boolean;
  cardHistory: Issue[];
  
  selectCard: (card: Issue) => void;
  openModal: (card: Issue) => void;
  closeModal: () => void;
  clearSelectedCard: () => void;
  getRecentCards: (limit?: number) => Issue[];
  isCardInHistory: (cardId: string | number) => boolean;
  removeFromHistory: (cardId: string | number) => void;
}

const CardContext = createContext<CardContextType | undefined>(undefined);

interface CardProviderProps {
  children: ReactNode;
}

export const CardProvider: React.FC<CardProviderProps> = ({ children }) => {
  const cardStore = useCardStore();

  const getRecentCards = (limit: number = 5) => {
    return cardStore.cardHistory.slice(0, limit);
  };

  const isCardInHistory = (cardId: string | number) => {
    return cardStore.cardHistory.some(card => card.id === cardId);
  };

  const removeFromHistory = (cardId: string | number) => {
    useCardStore.setState((state) => ({
      cardHistory: state.cardHistory.filter(card => card.id !== cardId)
    }));
  };

  const contextValue: CardContextType = {
    ...cardStore,
    getRecentCards,
    isCardInHistory,
    removeFromHistory,
  };

  return (
    <CardContext.Provider value={contextValue}>
      {children}
    </CardContext.Provider>
  );
};

export const useCard = () => {
  const context = useContext(CardContext);
  if (context === undefined) {
    throw new Error('useCard must be used within a CardProvider');
  }
  return context;
};

export const useCardOperations = () => {
  const cardStore = useCardStore();
  
  const openCardDetails = (card: Issue) => {
    cardStore.openModal(card);
    cardStore.addToHistory(card);
  };

  const quickSelectCard = (card: Issue) => {
    cardStore.selectCard(card);
    cardStore.addToHistory(card);
  };

  const hasCardDetails = (card: Issue) => {
    return !!(card.description && (card.location || card.image || card.images));
  };

  const getCardSummary = (card: Issue) => {
    return {
      id: card.id,
      title: card.title,
      status: card.status,
      category: card.category,
      priority: card.priority,
      votes: card.votes || 0,
      reportedDate: card.reportedDate,
      hasLocation: !!card.location,
      hasImages: !!(card.image || card.images?.length),
    };
  };

  return {
    openCardDetails,
    quickSelectCard,
    hasCardDetails,
    getCardSummary,
    ...cardStore,
  };
};
