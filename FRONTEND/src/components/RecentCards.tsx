import React from 'react';
import { Card } from './Card';
import { useCardOperations } from '../store/useCardContext';

interface RecentCardsProps {
  limit?: number;
  showTitle?: boolean;
  compact?: boolean;
}

export const RecentCards: React.FC<RecentCardsProps> = ({ 
  limit = 5, 
  showTitle = true,
  compact = true 
}) => {
  const { cardHistory, openCardDetails, clearHistory } = useCardOperations();

  const recentCards = cardHistory.slice(0, limit);

  if (recentCards.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-4">
      {showTitle && (
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-800">Recently Viewed</h3>
          <button
            onClick={clearHistory}
            className="text-sm text-slate-500 hover:text-slate-700 transition-colors"
          >
            Clear
          </button>
        </div>
      )}
      
      <div className="space-y-2">
        {recentCards.map((card) => (
          <Card
            key={`recent-${card.id}`}
            card={card}
            compact={compact}
            showDistance={false}
            onClick={(card) => openCardDetails(card)}
          />
        ))}
      </div>
      
      {cardHistory.length > limit && (
        <div className="mt-3 text-center">
          <span className="text-sm text-slate-500">
            +{cardHistory.length - limit} more cards viewed
          </span>
        </div>
      )}
    </div>
  );
};
