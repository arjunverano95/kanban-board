'use client';

import {useState} from 'react';
import {useSortable} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';
import {Ticket as TicketType} from '../types/ticket';
import {calculateTicketAge, formatDate} from '../utils/dateUtils';
import {useTicketStore} from '../store/useTicketStore';

interface TicketProps {
  ticket: TicketType;
  onClick?: () => void;
}

const PriorityBadge = ({priority}: {priority?: 'low' | 'medium' | 'high'}) => {
  const getPriorityStyles = (priority?: 'low' | 'medium' | 'high') => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityIcon = (priority?: 'low' | 'medium' | 'high') => {
    switch (priority) {
      case 'high':
        return '🔥';
      case 'medium':
        return '⚡';
      case 'low':
        return '🌱';
      default:
        return '📋';
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getPriorityStyles(
        priority,
      )}`}
    >
      {getPriorityIcon(priority)}{' '}
      {priority ? priority.charAt(0).toUpperCase() + priority.slice(1) : 'None'}
    </span>
  );
};

export const Ticket = ({ticket, onClick}: TicketProps) => {
  const {updateTicketPriority, tickets} = useTicketStore();
  const [showPriorityMenu, setShowPriorityMenu] = useState(false);

  // Get the latest ticket data from the store
  const currentTicket = tickets.find((t) => t.id === ticket.id) || ticket;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    isOver,
  } = useSortable({id: ticket.id});

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handlePriorityChange = (
    newPriority: 'low' | 'medium' | 'high' | null,
  ) => {
    console.log('Updating priority for ticket:', ticket.id, 'to:', newPriority);
    updateTicketPriority(ticket.id, newPriority);
    setShowPriorityMenu(false);
  };

  const handlePriorityClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowPriorityMenu(!showPriorityMenu);
  };

  // Debug: log current ticket priority
  console.log('Ticket priority:', ticket.id, currentTicket.priority);

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer mb-3 touch-none relative ${
        isOver && !isDragging
          ? 'ring-2 ring-green-400 ring-opacity-75 bg-green-50 border-green-300'
          : ''
      }`}
      onClick={onClick}
    >
      {/* Priority Badge */}
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 flex-1 mr-2">
          {currentTicket.name}
        </h3>
        <div className="relative">
          <button
            onClick={handlePriorityClick}
            className="hover:scale-110 transition-transform"
          >
            <PriorityBadge priority={currentTicket.priority} />
          </button>

          {/* Priority Dropdown Menu */}
          {showPriorityMenu && (
            <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[120px]">
              <div className="py-1">
                <button
                  onClick={() => handlePriorityChange(null)}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"
                >
                  📋 None
                </button>
                <button
                  onClick={() => handlePriorityChange('low')}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"
                >
                  🌱 Low
                </button>
                <button
                  onClick={() => handlePriorityChange('medium')}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"
                >
                  ⚡ Medium
                </button>
                <button
                  onClick={() => handlePriorityChange('high')}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"
                >
                  🔥 High
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <p className="text-gray-600 text-xs mb-3 line-clamp-3">
        {currentTicket.description}
      </p>

      <div className="flex flex-wrap gap-1 mb-3">
        {currentTicket.tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="flex justify-between items-center text-xs text-gray-500">
        <span>Created: {formatDate(currentTicket.createdAt)}</span>
        <span>Updated: {formatDate(currentTicket.updatedAt)}</span>
      </div>

      {/* Age indicator */}
      <div className="flex justify-end">
        <span className="text-xs text-gray-400">
          {calculateTicketAge(currentTicket.createdAt)}
        </span>
      </div>
    </div>
  );
};
