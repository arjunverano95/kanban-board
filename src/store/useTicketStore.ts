import {create} from 'zustand';
import {persist, createJSONStorage} from 'zustand/middleware';
import {Ticket} from '../types/ticket';
import {ColumnStatus} from '../constants/status';

interface TicketState {
  // State
  tickets: Ticket[];
  searchText: string;
  selectedTags: string[];
  selectedPriority: 'low' | 'medium' | 'high' | null;
  isLoading: boolean;
  error: string | null;
  isHydrated: boolean; // Track if localStorage data has been loaded

  // Actions
  setTickets: (tickets: Ticket[]) => void;
  setSearchText: (text: string) => void;
  setSelectedTags: (tags: string[]) => void;
  setSelectedPriority: (priority: 'low' | 'medium' | 'high' | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setHydrated: (hydrated: boolean) => void;

  // Ticket operations
  updateTicketStatus: (ticketId: string, newStatus: ColumnStatus) => void;
  updateTicketPriority: (
    ticketId: string,
    priority: 'low' | 'medium' | 'high' | null | undefined,
  ) => void;
  reorderTickets: (ticketIds: string[]) => void;

  // Reset
  reset: () => void;
}

const initialState = {
  tickets: [],
  searchText: '',
  selectedTags: [],
  selectedPriority: null,
  isLoading: false,
  error: null,
  isHydrated: false,
};

export const useTicketStore = create<TicketState>()(
  persist(
    (set) => ({
      ...initialState,

      setTickets: (tickets) => set({tickets}),
      setSearchText: (searchText) => set({searchText}),
      setSelectedTags: (selectedTags) => set({selectedTags}),
      setSelectedPriority: (priority) => set({selectedPriority: priority}),
      setLoading: (isLoading) => set({isLoading}),
      setError: (error) => set({error}),
      setHydrated: (isHydrated) => set({isHydrated}),

      updateTicketStatus: (ticketId, newStatus) =>
        set((state) => ({
          tickets: state.tickets.map((ticket) =>
            ticket.id === ticketId
              ? {...ticket, status: newStatus, updatedAt: new Date()}
              : ticket,
          ),
        })),

      updateTicketPriority: (
        ticketId: string,
        priority: 'low' | 'medium' | 'high' | null | undefined,
      ) =>
        set((state) => {
          console.log(
            'Store: Updating ticket priority:',
            ticketId,
            'to:',
            priority,
          );
          console.log('Store: Current tickets:', state.tickets);

          const updatedTickets = state.tickets.map((ticket) =>
            ticket.id === ticketId
              ? {
                  ...ticket,
                  priority: priority || undefined,
                  updatedAt: new Date(),
                }
              : ticket,
          );

          console.log('Store: Updated tickets:', updatedTickets);
          return {tickets: updatedTickets};
        }),

      reorderTickets: (ticketIds) =>
        set((state) => {
          const idToPosition = new Map(
            ticketIds.map((id, index) => [id, index]),
          );

          const reorderedTickets = [...state.tickets].sort((a, b) => {
            const aPosition = idToPosition.get(a.id) ?? Number.MAX_SAFE_INTEGER;
            const bPosition = idToPosition.get(b.id) ?? Number.MAX_SAFE_INTEGER;
            return aPosition - bPosition;
          });

          return {tickets: reorderedTickets};
        }),

      reset: () => set(initialState),
    }),
    {
      name: 'kanban-board-storage',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        // Called when localStorage data is restored
        if (state) {
          state.setHydrated(true);
        }
      },
      partialize: (state) => ({
        // Only persist these fields to localStorage
        tickets: state.tickets,
        searchText: state.searchText,
        selectedTags: state.selectedTags,
        selectedPriority: state.selectedPriority,
      }),
    },
  ),
);
