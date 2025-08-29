import {
  PRIORITY,
  PRIORITY_CONFIG,
  getPriorityConfig,
  getPriorityIcon,
  getPriorityLabel,
  getPriorityColor,
  getPriorityTextColor,
  type Priority,
} from '../priority';

describe('Priority Constants', () => {
  describe('PRIORITY enum', () => {
    it('should have the correct priority values', () => {
      expect(PRIORITY.LOW).toBe('low');
      expect(PRIORITY.MEDIUM).toBe('medium');
      expect(PRIORITY.HIGH).toBe('high');
    });

    it('should have exactly 3 priority values', () => {
      const priorityValues = Object.values(PRIORITY);
      expect(priorityValues).toHaveLength(3);
    });

    it('should have unique priority values', () => {
      const priorityValues = Object.values(PRIORITY);
      const uniqueValues = new Set(priorityValues);
      expect(uniqueValues.size).toBe(priorityValues.length);
    });
  });

  describe('PRIORITY_CONFIG', () => {
    it('should have configuration for all priorities', () => {
      expect(PRIORITY_CONFIG[PRIORITY.LOW]).toBeDefined();
      expect(PRIORITY_CONFIG[PRIORITY.MEDIUM]).toBeDefined();
      expect(PRIORITY_CONFIG[PRIORITY.HIGH]).toBeDefined();
      expect(PRIORITY_CONFIG.NONE).toBeDefined();
    });

    it('should have proper structure for each config', () => {
      Object.values(PRIORITY_CONFIG).forEach((config) => {
        expect(config).toHaveProperty('label');
        expect(config).toHaveProperty('icon');
        expect(config).toHaveProperty('color');
        expect(config).toHaveProperty('textColor');

        expect(typeof config.label).toBe('string');
        expect(typeof config.icon).toBe('string');
        expect(typeof config.color).toBe('string');
        expect(typeof config.textColor).toBe('string');
      });
    });

    it('should have meaningful labels', () => {
      expect(PRIORITY_CONFIG[PRIORITY.LOW].label).toBe('Low');
      expect(PRIORITY_CONFIG[PRIORITY.MEDIUM].label).toBe('Medium');
      expect(PRIORITY_CONFIG[PRIORITY.HIGH].label).toBe('High');
      expect(PRIORITY_CONFIG.NONE.label).toBe('None');
    });

    it('should have appropriate icons', () => {
      expect(PRIORITY_CONFIG[PRIORITY.LOW].icon).toBe('🌱');
      expect(PRIORITY_CONFIG[PRIORITY.MEDIUM].icon).toBe('⚡');
      expect(PRIORITY_CONFIG[PRIORITY.HIGH].icon).toBe('🔥');
      expect(PRIORITY_CONFIG.NONE.icon).toBe('📋');
    });

    it('should have consistent color scheme', () => {
      // Colors should follow Tailwind CSS patterns
      Object.values(PRIORITY_CONFIG).forEach((config) => {
        expect(config.color).toMatch(
          /^bg-\w+-\d+ text-\w+-\d+ border-\w+-\d+$/,
        );
        expect(config.textColor).toMatch(/^text-\w+-\d+$/);
      });
    });
  });

  describe('Utility Functions', () => {
    it('should return correct config for each priority', () => {
      expect(getPriorityConfig(PRIORITY.LOW)).toBe(
        PRIORITY_CONFIG[PRIORITY.LOW],
      );
      expect(getPriorityConfig(PRIORITY.MEDIUM)).toBe(
        PRIORITY_CONFIG[PRIORITY.MEDIUM],
      );
      expect(getPriorityConfig(PRIORITY.HIGH)).toBe(
        PRIORITY_CONFIG[PRIORITY.HIGH],
      );
    });

    it('should return NONE config for undefined priority', () => {
      expect(getPriorityConfig(undefined)).toBe(PRIORITY_CONFIG.NONE);
    });

    it('should return correct icon for each priority', () => {
      expect(getPriorityIcon(PRIORITY.LOW)).toBe('🌱');
      expect(getPriorityIcon(PRIORITY.MEDIUM)).toBe('⚡');
      expect(getPriorityIcon(PRIORITY.HIGH)).toBe('🔥');
      expect(getPriorityIcon(undefined)).toBe('📋');
    });

    it('should return correct label for each priority', () => {
      expect(getPriorityLabel(PRIORITY.LOW)).toBe('Low');
      expect(getPriorityLabel(PRIORITY.MEDIUM)).toBe('Medium');
      expect(getPriorityLabel(PRIORITY.HIGH)).toBe('High');
      expect(getPriorityLabel(undefined)).toBe('None');
    });

    it('should return correct color for each priority', () => {
      expect(getPriorityColor(PRIORITY.LOW)).toBe(
        'bg-green-100 text-green-800 border-green-200',
      );
      expect(getPriorityColor(PRIORITY.MEDIUM)).toBe(
        'bg-yellow-100 text-yellow-800 border-yellow-200',
      );
      expect(getPriorityColor(PRIORITY.HIGH)).toBe(
        'bg-red-100 text-red-800 border-red-200',
      );
      expect(getPriorityColor(undefined)).toBe(
        'bg-gray-100 text-gray-800 border-gray-200',
      );
    });

    it('should return correct text color for each priority', () => {
      expect(getPriorityTextColor(PRIORITY.LOW)).toBe('text-green-800');
      expect(getPriorityTextColor(PRIORITY.MEDIUM)).toBe('text-yellow-800');
      expect(getPriorityTextColor(PRIORITY.HIGH)).toBe('text-red-800');
      expect(getPriorityTextColor(undefined)).toBe('text-gray-800');
    });
  });

  describe('Type Safety', () => {
    it('should enforce correct types for priority values', () => {
      // These assignments should work
      const lowPriority: Priority = PRIORITY.LOW;
      const mediumPriority: Priority = PRIORITY.MEDIUM;
      const highPriority: Priority = PRIORITY.HIGH;
      const noPriority: Priority = undefined;

      expect(lowPriority).toBe('low');
      expect(mediumPriority).toBe('medium');
      expect(highPriority).toBe('high');
      expect(noPriority).toBeUndefined();
    });

    it('should prevent assignment of invalid priority values', () => {
      // This test documents the expected TypeScript behavior
      // In a real TypeScript environment, these would cause compilation errors

      // Valid assignments
      const validPriority: Priority = PRIORITY.LOW;
      expect(validPriority).toBeDefined();

      // These would cause TypeScript errors:
      // const invalidPriority: Priority = 'critical'; // Should fail
      // const anotherInvalid: Priority = 'urgent'; // Should fail
    });
  });

  describe('Usage Examples', () => {
    it('should work correctly in typical usage patterns', () => {
      // Simulate typical usage in components
      const getPriorityDisplay = (priority?: Priority) => {
        const config = getPriorityConfig(priority);
        return {
          icon: config.icon,
          label: config.label,
          color: config.color,
        };
      };

      const lowDisplay = getPriorityDisplay(PRIORITY.LOW);
      const highDisplay = getPriorityDisplay(PRIORITY.HIGH);
      const noneDisplay = getPriorityDisplay(undefined);

      expect(lowDisplay.icon).toBe('🌱');
      expect(lowDisplay.label).toBe('Low');
      expect(highDisplay.icon).toBe('🔥');
      expect(highDisplay.label).toBe('High');
      expect(noneDisplay.icon).toBe('📋');
      expect(noneDisplay.label).toBe('None');
    });

    it('should support priority validation', () => {
      const isValidPriority = (value: string): value is PRIORITY => {
        return Object.values(PRIORITY).includes(value as PRIORITY);
      };

      expect(isValidPriority('low')).toBe(true);
      expect(isValidPriority('medium')).toBe(true);
      expect(isValidPriority('high')).toBe(true);
      expect(isValidPriority('invalid')).toBe(false);
      expect(isValidPriority('')).toBe(false);
    });
  });
});
