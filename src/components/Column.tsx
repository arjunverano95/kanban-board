'use client';

import {useDroppable} from '@dnd-kit/core';
import {SortableContext, verticalListSortingStrategy} from '@dnd-kit/sortable';
import {Ticket} from './Ticket';
import {Ticket as TicketType} from '../types/ticket';
import {COLUMN_CONFIG} from '../constants/status';

interface ColumnProps {
  id: string;
  tickets: TicketType[];
  onTicketClick?: (ticket: TicketType) => void;
}

export const Column = ({id, tickets, onTicketClick}: ColumnProps) => {
  const {setNodeRef, isOver} = useDroppable({id});

  const columnConfig = COLUMN_CONFIG.find((col) => col.id === id);
  const columnName = columnConfig?.name || id;

  return (
    <div className="flex flex-col min-w-[350px] flex-1">
      {/* Column Header */}
      <div className={`p-4 rounded-t-lg border-b-2 ${columnConfig?.color}`}>
        <h2 className={`font-semibold text-lg ${columnConfig?.textColor}`}>
          {columnName}
        </h2>
        <span className={`text-sm ${columnConfig?.textColor} opacity-75`}>
          {tickets.length} {tickets.length === 1 ? 'ticket' : 'tickets'}
        </span>
      </div>

      {/* Column Content */}
      <div
        ref={setNodeRef}
        className={`min-h-[500px] ${
          columnConfig?.color
        } p-4 bg-opacity-30 transition-all duration-200 ${
          isOver
            ? 'bg-opacity-60 ring-2 ring-blue-400 ring-opacity-75 shadow-lg'
            : ''
        }`}
      >
        <SortableContext
          items={tickets.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          {tickets.length === 0 ? (
            <div className="text-center text-gray-500 py-8 m-4">
              <p className="text-sm">No tickets in this column</p>
            </div>
          ) : (
            tickets.map((ticket) => (
              <Ticket
                key={ticket.id}
                ticket={ticket}
                onClick={() => onTicketClick?.(ticket)}
              />
            ))
          )}
        </SortableContext>
      </div>
    </div>
  );
};
