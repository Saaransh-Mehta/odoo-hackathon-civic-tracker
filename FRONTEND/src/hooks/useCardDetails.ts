import { useCardStore } from '../store/useCardStore';
import type { Issue } from '../types/issue';

/**
 * Custom hook for common card operations and utilities
 */
export const useCardDetails = () => {
  const {
    selectedCard,
    isModalOpen,
    cardHistory,
    openModal,
    closeModal,
    selectCard,
    clearSelectedCard,
    addToHistory,
    updateCardStatus,
    updateCardVotes,
  } = useCardStore();

  // Quick card actions
  const viewCard = (card: Issue) => {
    openModal(card);
  };

  const quickView = (card: Issue) => {
    selectCard(card);
    addToHistory(card);
  };

  // Card status helpers
  const isCardActive = (card: Issue) => {
    return card.status === 'Open' || card.status === 'pending';
  };

  const isCardResolved = (card: Issue) => {
    return card.status === 'Resolved' || card.status === 'resolved';
  };

  const getCardPriority = (card: Issue) => {
    return card.priority || 'medium';
  };

  // Card interaction helpers
  const voteOnCard = (cardId: string | number, increment: boolean = true) => {
    const card = selectedCard || cardHistory.find((c: Issue) => c.id === cardId);
    if (!card || typeof card.votes !== 'number') return false;
    
    const newVotes = increment ? card.votes + 1 : Math.max(0, card.votes - 1);
    updateCardVotes(cardId, newVotes);
    return true;
  };

  const changeCardStatus = (cardId: string | number, newStatus: Issue['status']) => {
    updateCardStatus(cardId, newStatus);
  };

  // History helpers
  const getRecentCards = (limit: number = 5) => {
    return cardHistory.slice(0, limit);
  };

  const hasViewedCard = (cardId: string | number) => {
    return cardHistory.some((card: Issue) => card.id === cardId);
  };

  const removeFromHistory = (cardId: string | number) => {
    useCardStore.setState((state: any) => ({
      cardHistory: state.cardHistory.filter((card: Issue) => card.id !== cardId)
    }));
  };

  // Card data helpers
  const getCardSummary = (card: Issue) => ({
    id: card.id,
    title: card.title,
    status: card.status,
    category: card.category,
    priority: card.priority || 'medium',
    votes: card.votes || 0,
    hasLocation: !!card.location,
    hasImages: !!(card.image || card.images?.length),
    reportedDate: card.reportedDate,
    distance: card.distance,
  });

  const formatCardDistance = (distance: string) => {
    return distance.replace(/(\d+\.?\d*)\s*(km|m)/i, '$1 $2');
  };

  const formatCardDate = (dateString: string) => {
    if (dateString.includes('ago')) {
      return dateString;
    }
    
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInMs = now.getTime() - date.getTime();
      const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
      
      if (diffInDays === 0) {
        return 'Today';
      } else if (diffInDays === 1) {
        return 'Yesterday';
      } else if (diffInDays < 7) {
        return `${diffInDays} days ago`;
      } else if (diffInDays < 30) {
        const weeks = Math.floor(diffInDays / 7);
        return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
      } else {
        const months = Math.floor(diffInDays / 30);
        return `${months} month${months > 1 ? 's' : ''} ago`;
      }
    } catch {
      return dateString;
    }
  };

  return {
    // State
    selectedCard,
    isModalOpen,
    cardHistory,
    
    // Actions
    viewCard,
    quickView,
    closeModal,
    clearSelectedCard,
    
    // Status helpers
    isCardActive,
    isCardResolved,
    getCardPriority,
    
    // Interaction helpers
    voteOnCard,
    changeCardStatus,
    
    // History helpers
    getRecentCards,
    hasViewedCard,
    removeFromHistory,
    
    // Data helpers
    getCardSummary,
    formatCardDistance,
    formatCardDate,
  };
};
