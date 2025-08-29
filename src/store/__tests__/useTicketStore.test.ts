import {renderHook, act} from '@testing-library/react';
import {useTicketStore} from '../useTicketStore';
import {mockTickets} from '../../data/mockTickets';
import {COLUMN_STATUS} from '../../constants/status';
import {PRIORITY} from '../../constants/priority';

// Mock Zustand persist middleware
jest.mock('zustand/middleware', () => ({
  persist: (fn: any) => fn,
  createJSONStorage: () => () => ({
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
  }),
}));

describe('useTicketStore', () => {
  beforeEach(() => {
    // Reset store before each test
    const {result} = renderHook(() => useTicketStore());
    act(() => {
      result.current.reset();
    });
  });

  describe('Initial State', () => {
    it('should have correct initial state', () => {
      const {result} = renderHook(() => useTicketStore());

      expect(result.current.tickets).toEqual([]);
      expect(result.current.searchText).toBe('');
      expect(result.current.selectedTags).toEqual([]);
      expect(result.current.selectedPriority).toBeNull();
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(result.current.isHydrated).toBe(false);
    });
  });

  describe('State Setters', () => {
    it('should set tickets', () => {
      const {result} = renderHook(() => useTicketStore());

      act(() => {
        result.current.setTickets(mockTickets);
      });

      expect(result.current.tickets).toEqual(mockTickets);
    });

    it('should set search text', () => {
      const {result} = renderHook(() => useTicketStore());

      act(() => {
        result.current.setSearchText('test search');
      });

      expect(result.current.searchText).toBe('test search');
    });

    it('should set selected tags', () => {
      const {result} = renderHook(() => useTicketStore());

      act(() => {
        result.current.setSelectedTags(['frontend', 'backend']);
      });

      expect(result.current.selectedTags).toEqual(['frontend', 'backend']);
    });

    it('should set selected priority', () => {
      const {result} = renderHook(() => useTicketStore());

      act(() => {
        result.current.setSelectedPriority(PRIORITY.HIGH);
      });

      expect(result.current.selectedPriority).toBe(PRIORITY.HIGH);
    });

    it('should set loading state', () => {
      const {result} = renderHook(() => useTicketStore());

      act(() => {
        result.current.setLoading(true);
      });

      expect(result.current.isLoading).toBe(true);
    });

    it('should set error state', () => {
      const {result} = renderHook(() => useTicketStore());

      act(() => {
        result.current.setError('Test error');
      });

      expect(result.current.error).toBe('Test error');
    });

    it('should set hydrated state', () => {
      const {result} = renderHook(() => useTicketStore());

      act(() => {
        result.current.setHydrated(true);
      });

      expect(result.current.isHydrated).toBe(true);
    });
  });

  describe('Ticket Operations', () => {
    beforeEach(() => {
      const {result} = renderHook(() => useTicketStore());
      act(() => {
        result.current.setTickets(mockTickets);
      });
    });

    it('should update ticket status', () => {
      const {result} = renderHook(() => useTicketStore());
      const ticketId = '1';
      const newStatus = COLUMN_STATUS.IN_PROGRESS;

      act(() => {
        result.current.updateTicketStatus(ticketId, newStatus);
      });

      const updatedTicket = result.current.tickets.find(
        (t) => t.id === ticketId,
      );
      expect(updatedTicket?.status).toBe(newStatus);
      expect(updatedTicket?.updatedAt).toBeInstanceOf(Date);
    });

    it('should update ticket priority', () => {
      const {result} = renderHook(() => useTicketStore());
      const ticketId = '1';
      const newPriority = PRIORITY.LOW;

      act(() => {
        result.current.updateTicketPriority(ticketId, newPriority);
      });

      const updatedTicket = result.current.tickets.find(
        (t) => t.id === ticketId,
      );
      expect(updatedTicket?.priority).toBe(newPriority);
      expect(updatedTicket?.updatedAt).toBeInstanceOf(Date);
    });

    it('should remove ticket priority when set to null', () => {
      const {result} = renderHook(() => useTicketStore());
      const ticketId = '1';

      act(() => {
        result.current.updateTicketPriority(ticketId, null);
      });

      const updatedTicket = result.current.tickets.find(
        (t) => t.id === ticketId,
      );
      expect(updatedTicket?.priority).toBeUndefined();
      expect(updatedTicket?.updatedAt).toBeInstanceOf(Date);
    });

    it('should reorder tickets correctly', () => {
      const {result} = renderHook(() => useTicketStore());
      const newOrder = ['3', '1', '2', '4', '5', '6'];

      act(() => {
        result.current.reorderTickets(newOrder);
      });

      const reorderedIds = result.current.tickets.map((t) => t.id);
      expect(reorderedIds).toEqual(newOrder);
    });

    it('should handle reordering with non-existent ticket IDs', () => {
      const {result} = renderHook(() => useTicketStore());
      const newOrder = ['3', '1', '999', '2']; // 999 doesn't exist

      act(() => {
        result.current.reorderTickets(newOrder);
      });

      // Non-existent tickets should be placed at the end
      const reorderedIds = result.current.tickets.map((t) => t.id);
      expect(reorderedIds.slice(0, 3)).toEqual(['3', '1', '2']);
      expect(reorderedIds).toHaveLength(6); // All tickets should still be present
    });
  });

  describe('Reset Functionality', () => {
    it('should reset store to initial state', () => {
      const {result} = renderHook(() => useTicketStore());

      // Set some state
      act(() => {
        result.current.setTickets(mockTickets);
        result.current.setSearchText('test');
        result.current.setSelectedTags(['frontend']);
        result.current.setSelectedPriority(PRIORITY.HIGH);
        result.current.setLoading(true);
        result.current.setError('error');
      });

      // Reset
      act(() => {
        result.current.reset();
      });

      // Verify reset
      expect(result.current.tickets).toEqual([]);
      expect(result.current.searchText).toBe('');
      expect(result.current.selectedTags).toEqual([]);
      expect(result.current.selectedPriority).toBeNull();
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });
  });

  describe('State Immutability', () => {
    it('should not mutate original tickets array when updating', () => {
      const {result} = renderHook(() => useTicketStore());
      const originalTickets = [...mockTickets];

      act(() => {
        result.current.setTickets(originalTickets);
      });

      act(() => {
        result.current.updateTicketStatus('1', COLUMN_STATUS.DONE);
      });

      // Original array should not be mutated
      expect(originalTickets[0].status).toBe(COLUMN_STATUS.TODO);
      // Store should have updated ticket
      expect(result.current.tickets[0].status).toBe(COLUMN_STATUS.DONE);
    });
  });
});
