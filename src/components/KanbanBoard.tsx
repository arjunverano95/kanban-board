'use client';

import {useState, useCallback, useEffect} from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  DragEndEvent,
  DragStartEvent,
} from '@dnd-kit/core';
import {arrayMove} from '@dnd-kit/sortable';

import {Column} from './Column';
import {SearchAndFilter} from './SearchAndFilter';
import {Ticket as TicketType} from '../types/ticket';
import {COLUMN_STATUS, COLUMN_CONFIG, ColumnStatus} from '../constants/status';
import {useTicketStore} from '../store/useTicketStore';
import {fetchTickets} from '../services/api';

export const KanbanBoard = () => {
  const {
    tickets,
    isLoading,
    error,
    isHydrated,
    setTickets,
    setLoading,
    setError,
    updateTicketStatus,
    reorderTickets,
    searchText,
    selectedTags,
    selectedPriority,
  } = useTicketStore();

  const [draggingTicket, setDraggingTicket] = useState<TicketType | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {distance: 8},
    }),
  );

  const loadInitialData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const fetchedTickets = await fetchTickets();
      setTickets(fetchedTickets);
    } catch {
      setError('Failed to load tickets. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [setTickets, setLoading, setError]);

  // Load initial data only if no stored data exists
  useEffect(() => {
    // Wait for hydration to complete
    if (isHydrated && tickets.length === 0) {
      // console.log('No stored tickets found, loading from API...');
      loadInitialData();
    } else if (isHydrated && tickets.length > 0) {
      // console.log('Restored tickets from localStorage:', tickets.length);
    }
  }, [isHydrated, tickets.length, loadInitialData]);

  // Filter tickets based on search, tags, and priority
  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      searchText === '' ||
      ticket.name.toLowerCase().includes(searchText.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchText.toLowerCase());

    const matchesTags =
      selectedTags.length === 0 ||
      selectedTags.some((tag) => ticket.tags.includes(tag));

    const matchesPriority =
      !selectedPriority || ticket.priority === selectedPriority;

    return matchesSearch && matchesTags && matchesPriority;
  });

  // Group tickets by status
  const ticketsByStatus = COLUMN_CONFIG.reduce(
    (acc, column) => {
      acc[column.id] = filteredTickets.filter(
        (ticket) => ticket.status === column.id,
      );
      return acc;
    },
    {} as Record<string, TicketType[]>,
  );

  const handleDragStart = (event: DragStartEvent) => {
    const ticketId = event.active.id as string;
    const ticket = tickets.find((t) => t.id === ticketId);
    if (ticket) {
      setDraggingTicket(ticket);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const {active, over} = event;
    setDraggingTicket(null);

    if (!over || !active.id) return;

    const ticketId = active.id as string;
    const targetId = over.id as string;

    // Check if we're dropping on a column (status change)
    if (Object.values(COLUMN_STATUS).includes(targetId as ColumnStatus)) {
      updateTicketStatus(ticketId, targetId as ColumnStatus);
      return;
    }

    // Check if we're reordering within the same column
    const activeTicket = tickets.find((t) => t.id === ticketId);
    const overTicket = tickets.find((t) => t.id === targetId);

    if (
      activeTicket &&
      overTicket &&
      activeTicket.status === overTicket.status
    ) {
      const columnTickets = ticketsByStatus[activeTicket.status] || [];
      const oldIndex = columnTickets.findIndex((t) => t.id === ticketId);
      const newIndex = columnTickets.findIndex((t) => t.id === targetId);

      if (oldIndex !== newIndex) {
        const reorderedColumnTickets = arrayMove(
          columnTickets,
          oldIndex,
          newIndex,
        );
        const reorderedTicketIds = reorderedColumnTickets.map((t) => t.id);
        reorderTickets(reorderedTicketIds);
      }
    }
  };

  const handleTicketClick = (ticket: TicketType) => {
    console.log('Ticket clicked:', ticket);
  };

  // Loading state - show while hydrating or loading from API
  if (!isHydrated || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">
            {!isHydrated ? 'Loading saved data...' : 'Loading tickets...'}
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Something went wrong
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            type="button"
            onClick={loadInitialData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Empty state
  if (tickets.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 text-6xl mb-4">📋</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            No tickets yet
          </h2>
          <p className="text-gray-600 mb-4">
            Click the button below to load sample tickets
          </p>
          <button
            type="button"
            onClick={loadInitialData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Load Sample Data
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Kanban Board
          </h1>
          <p className="text-gray-600">
            Organize and track your tasks efficiently
          </p>
        </div>

        <SearchAndFilter />

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {COLUMN_CONFIG.map((column) => (
              <Column
                key={column.id}
                id={column.id}
                tickets={ticketsByStatus[column.id] || []}
                onTicketClick={handleTicketClick}
              />
            ))}
          </div>

          <DragOverlay dropAnimation={null}>
            {draggingTicket && (
              <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-lg opacity-80">
                <h3 className="font-semibold text-gray-900 text-sm mb-2">
                  {draggingTicket.name}
                </h3>
                <p className="text-gray-600 text-xs line-clamp-2">
                  {draggingTicket.description}
                </p>
              </div>
            )}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
};
