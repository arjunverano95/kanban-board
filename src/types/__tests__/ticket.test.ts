import {Ticket, TicketFormData, SearchFilters} from '../ticket';
import {COLUMN_STATUS, PRIORITY} from '../../constants';

describe('Ticket Types', () => {
  describe('Ticket Interface', () => {
    it('should have all required properties', () => {
      const ticket: Ticket = {
        id: '1',
        name: 'Test Ticket',
        description: 'Test Description',
        createdAt: new Date(),
        updatedAt: new Date(),
        tags: ['test'],
        status: COLUMN_STATUS.TODO,
        priority: PRIORITY.HIGH,
      };

      expect(ticket.id).toBe('1');
      expect(ticket.name).toBe('Test Ticket');
      expect(ticket.description).toBe('Test Description');
      expect(ticket.createdAt).toBeInstanceOf(Date);
      expect(ticket.updatedAt).toBeInstanceOf(Date);
      expect(ticket.tags).toEqual(['test']);
      expect(ticket.status).toBe(COLUMN_STATUS.TODO);
      expect(ticket.priority).toBe(PRIORITY.HIGH);
    });

    it('should allow priority to be undefined', () => {
      const ticket: Ticket = {
        id: '1',
        name: 'Test Ticket',
        description: 'Test Description',
        createdAt: new Date(),
        updatedAt: new Date(),
        tags: ['test'],
        status: COLUMN_STATUS.TODO,
        // priority is optional
      };

      expect(ticket.priority).toBeUndefined();
    });

    it('should enforce correct types for all properties', () => {
      const ticket: Ticket = {
        id: '1',
        name: 'Test Ticket',
        description: 'Test Description',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-02'),
        tags: ['frontend', 'backend'],
        status: COLUMN_STATUS.IN_PROGRESS,
        priority: PRIORITY.MEDIUM,
      };

      expect(typeof ticket.id).toBe('string');
      expect(typeof ticket.name).toBe('string');
      expect(typeof ticket.description).toBe('string');
      expect(ticket.createdAt).toBeInstanceOf(Date);
      expect(ticket.updatedAt).toBeInstanceOf(Date);
      expect(Array.isArray(ticket.tags)).toBe(true);
      expect(typeof ticket.status).toBe('string');
      expect([
        PRIORITY.LOW,
        PRIORITY.MEDIUM,
        PRIORITY.HIGH,
        undefined,
      ]).toContain(ticket.priority);
    });

    it('should enforce valid priority values', () => {
      const validPriorities = [
        PRIORITY.LOW,
        PRIORITY.MEDIUM,
        PRIORITY.HIGH,
      ] as const;

      validPriorities.forEach((priority) => {
        const ticket: Ticket = {
          id: '1',
          name: 'Test Ticket',
          description: 'Test Description',
          createdAt: new Date(),
          updatedAt: new Date(),
          tags: ['test'],
          status: COLUMN_STATUS.TODO,
          priority,
        };

        expect(ticket.priority).toBe(priority);
      });
    });

    it('should enforce valid status values', () => {
      const validStatuses = Object.values(COLUMN_STATUS);

      validStatuses.forEach((status) => {
        const ticket: Ticket = {
          id: '1',
          name: 'Test Ticket',
          description: 'Test Description',
          createdAt: new Date(),
          updatedAt: new Date(),
          tags: ['test'],
          status,
          priority: PRIORITY.HIGH,
        };

        expect(ticket.status).toBe(status);
      });
    });
  });

  describe('TicketFormData Interface', () => {
    it('should have all required properties', () => {
      const formData: TicketFormData = {
        name: 'New Ticket',
        description: 'New Description',
        tags: ['new', 'feature'],
        priority: PRIORITY.HIGH,
      };

      expect(formData.name).toBe('New Ticket');
      expect(formData.description).toBe('New Description');
      expect(formData.tags).toEqual(['new', 'feature']);
      expect(formData.priority).toBe(PRIORITY.HIGH);
    });

    it('should enforce correct types for all properties', () => {
      const formData: TicketFormData = {
        name: 'Test Ticket',
        description: 'Test Description',
        tags: ['tag1', 'tag2'],
        priority: PRIORITY.MEDIUM,
      };

      expect(typeof formData.name).toBe('string');
      expect(typeof formData.description).toBe('string');
      expect(Array.isArray(formData.tags)).toBe(true);
      expect(typeof formData.priority).toBe('string');
    });

    it('should enforce valid priority values', () => {
      const validPriorities = [
        PRIORITY.LOW,
        PRIORITY.MEDIUM,
        PRIORITY.HIGH,
      ] as const;

      validPriorities.forEach((priority) => {
        const formData: TicketFormData = {
          name: 'Test Ticket',
          description: 'Test Description',
          tags: ['test'],
          priority,
        };

        expect(formData.priority).toBe(priority);
      });
    });

    it('should require all properties', () => {
      // This test documents that all properties are required
      const formData: TicketFormData = {
        name: 'Required',
        description: 'Required',
        tags: ['required'],
        priority: PRIORITY.HIGH,
      };

      expect(formData.name).toBeDefined();
      expect(formData.description).toBeDefined();
      expect(formData.tags).toBeDefined();
      expect(formData.priority).toBeDefined();
    });
  });

  describe('SearchFilters Interface', () => {
    it('should have all required properties', () => {
      const filters: SearchFilters = {
        searchText: 'search query',
        selectedTags: ['tag1', 'tag2'],
        priority: PRIORITY.HIGH,
      };

      expect(filters.searchText).toBe('search query');
      expect(filters.selectedTags).toEqual(['tag1', 'tag2']);
      expect(filters.priority).toBe(PRIORITY.HIGH);
    });

    it('should allow priority to be undefined', () => {
      const filters: SearchFilters = {
        searchText: 'search query',
        selectedTags: ['tag1'],
        // priority is optional
      };

      expect(filters.priority).toBeUndefined();
    });

    it('should enforce correct types for all properties', () => {
      const filters: SearchFilters = {
        searchText: 'test search',
        selectedTags: ['tag1', 'tag2', 'tag3'],
        priority: PRIORITY.LOW,
      };

      expect(typeof filters.searchText).toBe('string');
      expect(Array.isArray(filters.selectedTags)).toBe(true);
      expect([
        PRIORITY.LOW,
        PRIORITY.MEDIUM,
        PRIORITY.HIGH,
        undefined,
      ]).toContain(filters.priority);
    });

    it('should enforce valid priority values when provided', () => {
      const validPriorities = [
        PRIORITY.LOW,
        PRIORITY.MEDIUM,
        PRIORITY.HIGH,
      ] as const;

      validPriorities.forEach((priority) => {
        const filters: SearchFilters = {
          searchText: 'test',
          selectedTags: ['tag'],
          priority,
        };

        expect(filters.priority).toBe(priority);
      });
    });
  });

  describe('Type Compatibility', () => {
    it('should allow TicketFormData to be used to create Ticket', () => {
      const formData: TicketFormData = {
        name: 'New Ticket',
        description: 'New Description',
        tags: ['new'],
        priority: PRIORITY.HIGH,
      };

      const ticket: Ticket = {
        id: 'generated-id',
        ...formData,
        createdAt: new Date(),
        updatedAt: new Date(),
        status: COLUMN_STATUS.TODO,
      };

      expect(ticket.name).toBe(formData.name);
      expect(ticket.description).toBe(formData.description);
      expect(ticket.tags).toEqual(formData.tags);
      expect(ticket.priority).toBe(formData.priority);
    });

    it('should allow SearchFilters to be used for filtering', () => {
      const filters: SearchFilters = {
        searchText: 'test',
        selectedTags: ['frontend'],
        priority: PRIORITY.HIGH,
      };

      const mockTickets: Ticket[] = [
        {
          id: '1',
          name: 'Test Ticket',
          description: 'Test Description',
          createdAt: new Date(),
          updatedAt: new Date(),
          tags: ['frontend'],
          status: COLUMN_STATUS.TODO,
          priority: PRIORITY.HIGH,
        },
      ];

      // Simulate filtering logic
      const filteredTickets = mockTickets.filter((ticket) => {
        const matchesSearch =
          ticket.name
            .toLowerCase()
            .includes(filters.searchText.toLowerCase()) ||
          ticket.description
            .toLowerCase()
            .includes(filters.searchText.toLowerCase());
        const matchesTags =
          filters.selectedTags.length === 0 ||
          filters.selectedTags.some((tag) => ticket.tags.includes(tag));
        const matchesPriority =
          !filters.priority || ticket.priority === filters.priority;

        return matchesSearch && matchesTags && matchesPriority;
      });

      expect(filteredTickets).toHaveLength(1);
      expect(filteredTickets[0].id).toBe('1');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty strings and arrays', () => {
      const ticket: Ticket = {
        id: '',
        name: '',
        description: '',
        createdAt: new Date(),
        updatedAt: new Date(),
        tags: [],
        status: COLUMN_STATUS.TODO,
      };

      expect(ticket.id).toBe('');
      expect(ticket.name).toBe('');
      expect(ticket.description).toBe('');
      expect(ticket.tags).toEqual([]);
    });

    it('should handle very long strings', () => {
      const longString = 'a'.repeat(1000);
      const ticket: Ticket = {
        id: longString,
        name: longString,
        description: longString,
        createdAt: new Date(),
        updatedAt: new Date(),
        tags: [longString],
        status: COLUMN_STATUS.TODO,
      };

      expect(ticket.name).toBe(longString);
      expect(ticket.description).toBe(longString);
      expect(ticket.tags[0]).toBe(longString);
    });

    it('should handle special characters in strings', () => {
      const specialString = 'Special chars: !@#$%^&*()_+-=[]{}|;:,.<>?';
      const ticket: Ticket = {
        id: '1',
        name: specialString,
        description: specialString,
        createdAt: new Date(),
        updatedAt: new Date(),
        tags: [specialString],
        status: COLUMN_STATUS.TODO,
      };

      expect(ticket.name).toBe(specialString);
      expect(ticket.description).toBe(specialString);
      expect(ticket.tags[0]).toBe(specialString);
    });
  });

  describe('Validation Functions', () => {
    it('should validate ticket structure', () => {
      const isValidTicket = (obj: any): obj is Ticket => {
        return (
          typeof obj === 'object' &&
          obj !== null &&
          typeof obj.id === 'string' &&
          typeof obj.name === 'string' &&
          typeof obj.description === 'string' &&
          obj.createdAt instanceof Date &&
          obj.updatedAt instanceof Date &&
          Array.isArray(obj.tags) &&
          typeof obj.status === 'string' &&
          (obj.priority === undefined ||
            [PRIORITY.LOW, PRIORITY.MEDIUM, PRIORITY.HIGH].includes(
              obj.priority,
            ))
        );
      };

      const validTicket: Ticket = {
        id: '1',
        name: 'Test',
        description: 'Test',
        createdAt: new Date(),
        updatedAt: new Date(),
        tags: ['test'],
        status: COLUMN_STATUS.TODO,
      };

      const invalidTicket = {
        id: '1',
        name: 'Test',
        // missing required properties
      };

      expect(isValidTicket(validTicket)).toBe(true);
      expect(isValidTicket(invalidTicket)).toBe(false);
    });
  });
});
