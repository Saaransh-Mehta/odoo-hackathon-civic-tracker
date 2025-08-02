import React from 'react';
import type { Issue } from '../types/issue';
import { useCardOperations } from '../store/useCardContext';

interface CardProps {
  card: Issue;
  showDistance?: boolean;
  compact?: boolean;
  onClick?: (card: Issue) => void;
}

export const Card: React.FC<CardProps> = ({ 
  card, 
  showDistance = true, 
  compact = false,
  onClick 
}) => {
  const { openCardDetails } = useCardOperations();

  const handleCardClick = () => {
    if (onClick) {
      onClick(card);
    } else {
      openCardDetails(card);
    }
  };

  const getStatusColor = (status: Issue['status']) => {
    switch (status) {
      case 'Open':
      case 'pending':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'In Progress':
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Resolved':
      case 'resolved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Closed':
      case 'rejected':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityIcon = (priority?: Issue['priority']) => {
    switch (priority) {
      case 'high':
        return (
          <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
          </svg>
        );
      case 'medium':
        return (
          <svg className="w-4 h-4 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5"/>
          </svg>
        );
      case 'low':
        return (
          <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L2 7l10 5 10-5-10-5z"/>
          </svg>
        );
      default:
        return null;
    }
  };

  const cardImage = card.image || (card.images && card.images[0]);

  if (compact) {
    return (
      <div 
        onClick={handleCardClick}
        className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-slate-200 hover:border-slate-300 hover:shadow-sm cursor-pointer transition-all duration-200"
      >
        {cardImage && (
          <img
            src={cardImage}
            alt={card.title}
            className="w-12 h-12 object-cover rounded-lg"
          />
        )}
        
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-slate-800 text-sm truncate">{card.title}</h4>
          <div className="flex items-center space-x-2 mt-1">
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(card.status)}`}>
              {card.status}
            </span>
            {card.priority && getPriorityIcon(card.priority)}
          </div>
        </div>

        {typeof card.votes === 'number' && (
          <div className="flex items-center space-x-1 text-slate-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
            <span className="text-sm">{card.votes}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div 
      onClick={handleCardClick}
      className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg hover:border-slate-300 transition-all duration-300 cursor-pointer group"
    >
      {cardImage && (
        <div className="aspect-video overflow-hidden">
          <img
            src={cardImage}
            alt={card.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-slate-800 group-hover:text-slate-900 transition-colors line-clamp-2">
              {card.title}
            </h3>
            <p className="text-slate-600 text-sm mt-1 line-clamp-2">
              {card.description}
            </p>
          </div>
          {card.priority && (
            <div className="ml-3 flex-shrink-0">
              {getPriorityIcon(card.priority)}
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(card.status)}`}>
            {card.status.replace('-', ' ')}
          </span>
          
          <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs">
            {card.category}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm text-slate-500">
          <div className="flex items-center space-x-4">
            {showDistance && (
              <div className="flex items-center space-x-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{card.distance}</span>
              </div>
            )}
            
            <div className="flex items-center space-x-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{card.reportedDate}</span>
            </div>
          </div>

          {typeof card.votes === 'number' && (
            <div className="flex items-center space-x-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
              <span className="font-medium">{card.votes}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
