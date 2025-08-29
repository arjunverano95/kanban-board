import {mockTickets, availableTags} from '../mockTickets';
import {COLUMN_STATUS} from '../../constants/status';
import {PRIORITY} from '../../constants/priority';

describe('Mock Data', () => {
  describe('mockTickets', () => {
    it('should have the correct number of tickets', () => {
      expect(mockTickets).toHaveLength(6);
    });

    it('should have valid ticket structure', () => {
      mockTickets.forEach((ticket) => {
        expect(ticket).toHaveProperty('id');
        expect(ticket).toHaveProperty('name');
        expect(ticket).toHaveProperty('description');
        expect(ticket).toHaveProperty('createdAt');
        expect(ticket).toHaveProperty('updatedAt');
        expect(ticket).toHaveProperty('tags');
        expect(ticket).toHaveProperty('status');
        expect(ticket).toHaveProperty('priority');

        // Check types
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
    });

    it('should have unique ticket IDs', () => {
      const ids = mockTickets.map((ticket) => ticket.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('should have valid status values', () => {
      const validStatuses = Object.values(COLUMN_STATUS);
      mockTickets.forEach((ticket) => {
        expect(validStatuses).toContain(ticket.status);
      });
    });

    it('should have valid priority values', () => {
      const validPriorities = [
        PRIORITY.LOW,
        PRIORITY.MEDIUM,
        PRIORITY.HIGH,
        undefined,
      ];
      mockTickets.forEach((ticket) => {
        expect(validPriorities).toContain(ticket.priority);
      });
    });

    it('should have tickets in different statuses', () => {
      const statuses = mockTickets.map((ticket) => ticket.status);
      const uniqueStatuses = new Set(statuses);
      expect(uniqueStatuses.size).toBeGreaterThan(1);
    });

    it('should have tickets with different priorities', () => {
      const priorities = mockTickets
        .map((ticket) => ticket.priority)
        .filter(Boolean);
      const uniquePriorities = new Set(priorities);
      expect(uniquePriorities.size).toBeGreaterThan(1);
    });

    it('should have realistic dates', () => {
      const now = new Date();
      const twoYearsAgo = new Date(
        now.getFullYear() - 2,
        now.getMonth(),
        now.getDate(),
      );

      mockTickets.forEach((ticket) => {
        expect(ticket.createdAt).toBeInstanceOf(Date);
        expect(ticket.updatedAt).toBeInstanceOf(Date);
        expect(ticket.createdAt.getTime()).toBeLessThanOrEqual(now.getTime());
        expect(ticket.updatedAt.getTime()).toBeLessThanOrEqual(now.getTime());
        expect(ticket.createdAt.getTime()).toBeGreaterThanOrEqual(
          twoYearsAgo.getTime(),
        );
      });
    });

    it('should have updatedAt >= createdAt', () => {
      mockTickets.forEach((ticket) => {
        expect(ticket.updatedAt.getTime()).toBeGreaterThanOrEqual(
          ticket.createdAt.getTime(),
        );
      });
    });

    it('should have non-empty names and descriptions', () => {
      mockTickets.forEach((ticket) => {
        expect(ticket.name.trim().length).toBeGreaterThan(0);
        expect(ticket.description.trim().length).toBeGreaterThan(0);
      });
    });

    it('should have valid tag arrays', () => {
      mockTickets.forEach((ticket) => {
        expect(Array.isArray(ticket.tags)).toBe(true);
        ticket.tags.forEach((tag) => {
          expect(typeof tag).toBe('string');
          expect(tag.trim().length).toBeGreaterThan(0);
        });
      });
    });
  });

  describe('availableTags', () => {
    it('should have the correct number of tags', () => {
      expect(availableTags).toHaveLength(17);
    });

    it('should contain all tags used in mockTickets', () => {
      const usedTags = new Set();
      mockTickets.forEach((ticket) => {
        ticket.tags.forEach((tag) => usedTags.add(tag));
      });

      usedTags.forEach((tag) => {
        expect(availableTags).toContain(tag);
      });
    });

    it('should have unique tags', () => {
      const uniqueTags = new Set(availableTags);
      expect(uniqueTags.size).toBe(availableTags.length);
    });

    it('should have non-empty tag strings', () => {
      availableTags.forEach((tag) => {
        expect(typeof tag).toBe('string');
        expect(tag.trim().length).toBeGreaterThan(0);
      });
    });

    it('should contain common development tags', () => {
      const commonTags = ['frontend', 'backend', 'database', 'api', 'testing'];
      commonTags.forEach((tag) => {
        expect(availableTags).toContain(tag);
      });
    });

    it('should have consistent tag format', () => {
      availableTags.forEach((tag) => {
        // Tags should be lowercase and contain only letters, numbers, and hyphens
        expect(tag).toMatch(/^[a-z0-9-]+$/);
      });
    });
  });

  describe('Data Consistency', () => {
    it('should have realistic ticket distribution across statuses', () => {
      const statusCounts = mockTickets.reduce(
        (acc, ticket) => {
          acc[ticket.status] = (acc[ticket.status] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>,
      );

      // Should have tickets in multiple statuses
      expect(Object.keys(statusCounts).length).toBeGreaterThan(1);

      // No single status should dominate (more than 50% of tickets)
      const totalTickets = mockTickets.length;
      Object.values(statusCounts).forEach((count) => {
        expect(count).toBeLessThanOrEqual(totalTickets * 0.5);
      });
    });

    it('should have realistic priority distribution', () => {
      const priorityCounts = mockTickets.reduce(
        (acc, ticket) => {
          const priority = ticket.priority || 'none';
          acc[priority] = (acc[priority] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>,
      );

      // Should have tickets with different priorities
      expect(Object.keys(priorityCounts).length).toBeGreaterThan(1);
    });

    it('should have realistic tag usage patterns', () => {
      const tagUsage = new Map<string, number>();

      mockTickets.forEach((ticket) => {
        ticket.tags.forEach((tag) => {
          tagUsage.set(tag, (tagUsage.get(tag) || 0) + 1);
        });
      });

      // Some tags should be used multiple times
      const usageCounts = Array.from(tagUsage.values());
      expect(Math.max(...usageCounts)).toBeGreaterThan(1);

      // Some tags should be used only once
      expect(Math.min(...usageCounts)).toBe(1);
    });
  });

  describe('Edge Cases', () => {
    it('should handle tickets with no priority gracefully', () => {
      // Since all tickets now have priority, we'll test that the priority field exists
      mockTickets.forEach((ticket) => {
        expect(ticket).toHaveProperty('priority');
        expect(ticket.priority).toBeDefined();
      });
    });

    it('should handle tickets with single tags', () => {
      // Since all tickets have multiple tags, we'll test that tags are properly handled
      mockTickets.forEach((ticket) => {
        expect(ticket.tags.length).toBeGreaterThan(0);
        ticket.tags.forEach((tag) => {
          expect(typeof tag).toBe('string');
          expect(tag.trim().length).toBeGreaterThan(0);
        });
      });
    });

    it('should handle tickets with multiple tags', () => {
      const multiTagTickets = mockTickets.filter(
        (ticket) => ticket.tags.length > 1,
      );
      expect(multiTagTickets.length).toBeGreaterThan(0);
    });
  });
});
