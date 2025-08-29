import {fetchTickets} from '../api';
import {mockTickets} from '../../data/mockTickets';
import {PRIORITY} from '../../constants/priority';

// Mock fetch globally
global.fetch = jest.fn();

describe('API Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchTickets', () => {
    it('should fetch tickets successfully', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          tickets: mockTickets.map((ticket) => ({
            ...ticket,
            createdAt: ticket.createdAt.toISOString(),
            updatedAt: ticket.updatedAt.toISOString(),
          })),
        }),
      };

      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      const result = await fetchTickets();

      expect(global.fetch).toHaveBeenCalledWith('/api/tickets');
      expect(mockResponse.json).toHaveBeenCalled();
      expect(result).toHaveLength(6);
      expect(result[0].createdAt).toBeInstanceOf(Date);
      expect(result[0].updatedAt).toBeInstanceOf(Date);
      expect(result[0].id).toBe('1');
      expect(result[0].name).toBe('Implement User Authentication');
    });

    it('should handle API error response', async () => {
      const mockResponse = {
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      };

      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      await expect(fetchTickets()).rejects.toThrow('Failed to fetch tickets');
      expect(global.fetch).toHaveBeenCalledWith('/api/tickets');
    });

    it('should handle network errors', async () => {
      const networkError = new Error('Network error');
      (global.fetch as jest.Mock).mockRejectedValue(networkError);

      await expect(fetchTickets()).rejects.toThrow('Network error');
      expect(global.fetch).toHaveBeenCalledWith('/api/tickets');
    });

    it('should handle JSON parsing errors', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockRejectedValue(new Error('Invalid JSON')),
      };

      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      await expect(fetchTickets()).rejects.toThrow('Invalid JSON');
      expect(global.fetch).toHaveBeenCalledWith('/api/tickets');
    });

    it('should convert ISO date strings to Date objects correctly', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          tickets: [
            {
              id: '1',
              name: 'Test Ticket',
              description: 'Test Description',
              createdAt: '2024-01-15T10:00:00.000Z',
              updatedAt: '2024-01-20T14:30:00.000Z',
              tags: ['test'],
              status: 'TODO',
              priority: PRIORITY.HIGH,
            },
          ],
        }),
      };

      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      const result = await fetchTickets();

      expect(result).toHaveLength(1);
      expect(result[0].createdAt).toBeInstanceOf(Date);
      expect(result[0].updatedAt).toBeInstanceOf(Date);
      expect(result[0].createdAt.getTime()).toBe(
        new Date('2024-01-15T10:00:00.000Z').getTime(),
      );
      expect(result[0].updatedAt.getTime()).toBe(
        new Date('2024-01-20T14:30:00.000Z').getTime(),
      );
    });

    it('should handle empty tickets array', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          tickets: [],
        }),
      };

      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      const result = await fetchTickets();

      expect(result).toHaveLength(0);
      expect(global.fetch).toHaveBeenCalledWith('/api/tickets');
    });

    it('should handle tickets with invalid dates gracefully', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          tickets: [
            {
              id: '1',
              name: 'Test Ticket',
              description: 'Test Description',
              createdAt: 'invalid-date',
              updatedAt: 'not-a-date',
              tags: ['test'],
              status: 'TODO',
              priority: PRIORITY.HIGH,
            },
          ],
        }),
      };

      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      const result = await fetchTickets();

      expect(result).toHaveLength(1);
      expect(result[0].createdAt).toBeInstanceOf(Date);
      expect(result[0].updatedAt).toBeInstanceOf(Date);

      // When invalid date strings are passed to new Date(), it creates Invalid Date objects
      // These result in NaN when calling getTime()
      expect(isNaN(result[0].createdAt.getTime())).toBe(true);
      expect(isNaN(result[0].updatedAt.getTime())).toBe(true);
    });
  });
});
