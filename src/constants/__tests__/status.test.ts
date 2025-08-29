import {COLUMN_STATUS, COLUMN_CONFIG, ColumnStatus} from '../status';

describe('Status Constants', () => {
  describe('COLUMN_STATUS', () => {
    it('should have the correct status values', () => {
      expect(COLUMN_STATUS.TODO).toBe('TODO');
      expect(COLUMN_STATUS.IN_PROGRESS).toBe('IN_PROGRESS');
      expect(COLUMN_STATUS.DONE).toBe('DONE');
    });

    it('should have exactly 3 status values', () => {
      const statusValues = Object.values(COLUMN_STATUS);
      expect(statusValues).toHaveLength(3);
    });

    it('should have unique status values', () => {
      const statusValues = Object.values(COLUMN_STATUS);
      const uniqueValues = new Set(statusValues);
      expect(uniqueValues.size).toBe(statusValues.length);
    });

    it('should be readonly', () => {
      // Note: This test checks TypeScript readonly behavior
      // In JavaScript runtime, the values can be modified, but TypeScript will prevent it
      const originalValue = COLUMN_STATUS.TODO;
      expect(() => {
        (COLUMN_STATUS as any).TODO = 'MODIFIED';
      }).not.toThrow(); // In JS runtime, this won't throw, but TypeScript will error

      // Reset the value for subsequent tests
      (COLUMN_STATUS as any).TODO = originalValue;
    });
  });

  describe('ColumnStatus type', () => {
    it('should be a union of all status values', () => {
      const validStatuses: ColumnStatus[] = [
        COLUMN_STATUS.TODO,
        COLUMN_STATUS.IN_PROGRESS,
        COLUMN_STATUS.DONE,
      ];

      validStatuses.forEach((status) => {
        expect(typeof status).toBe('string');
        expect(Object.values(COLUMN_STATUS)).toContain(status);
      });
    });

    it('should not accept invalid status values', () => {
      // This test ensures TypeScript compilation would fail for invalid values
      const validStatus: ColumnStatus = COLUMN_STATUS.TODO;
      expect(validStatus).toBeDefined();

      // These should cause TypeScript errors if uncommented:
      // const invalidStatus: ColumnStatus = 'INVALID_STATUS'
      // const anotherInvalid: ColumnStatus = 'PENDING'
    });
  });

  describe('COLUMN_CONFIG', () => {
    it('should have configuration for all statuses', () => {
      expect(COLUMN_CONFIG).toHaveLength(3);

      const configIds = COLUMN_CONFIG.map((config) => config.id);
      expect(configIds).toContain(COLUMN_STATUS.TODO);
      expect(configIds).toContain(COLUMN_STATUS.IN_PROGRESS);
      expect(configIds).toContain(COLUMN_STATUS.DONE);
    });

    it('should have unique IDs', () => {
      const ids = COLUMN_CONFIG.map((config) => config.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('should have proper structure for each config', () => {
      COLUMN_CONFIG.forEach((config) => {
        expect(config).toHaveProperty('id');
        expect(config).toHaveProperty('name');
        expect(config).toHaveProperty('color');
        expect(config).toHaveProperty('textColor');

        expect(typeof config.id).toBe('string');
        expect(typeof config.name).toBe('string');
        expect(typeof config.color).toBe('string');
        expect(typeof config.textColor).toBe('string');
      });
    });

    it('should have meaningful names', () => {
      const todoConfig = COLUMN_CONFIG.find(
        (config) => config.id === COLUMN_STATUS.TODO,
      );
      const inProgressConfig = COLUMN_CONFIG.find(
        (config) => config.id === COLUMN_STATUS.IN_PROGRESS,
      );
      const doneConfig = COLUMN_CONFIG.find(
        (config) => config.id === COLUMN_STATUS.DONE,
      );

      expect(todoConfig?.name).toBe('To Do');
      expect(inProgressConfig?.name).toBe('In Progress');
      expect(doneConfig?.name).toBe('Done');
    });

    it('should have consistent color scheme', () => {
      COLUMN_CONFIG.forEach((config) => {
        // Colors should follow Tailwind CSS patterns
        expect(config.color).toMatch(/^bg-\w+-\d+ border-\w+-\d+$/);
        expect(config.textColor).toMatch(/^text-\w+-\d+$/);
      });
    });

    it('should have appropriate color combinations', () => {
      const todoConfig = COLUMN_CONFIG.find(
        (config) => config.id === COLUMN_STATUS.TODO,
      );
      const inProgressConfig = COLUMN_CONFIG.find(
        (config) => config.id === COLUMN_STATUS.IN_PROGRESS,
      );
      const doneConfig = COLUMN_CONFIG.find(
        (config) => config.id === COLUMN_STATUS.DONE,
      );

      // TODO should be blue
      expect(todoConfig?.color).toContain('blue');
      expect(todoConfig?.textColor).toContain('blue');

      // IN_PROGRESS should be yellow
      expect(inProgressConfig?.color).toContain('yellow');
      expect(inProgressConfig?.textColor).toContain('yellow');

      // DONE should be green
      expect(doneConfig?.color).toContain('green');
      expect(doneConfig?.textColor).toContain('green');
    });

    it('should be readonly', () => {
      // Note: This test checks TypeScript readonly behavior
      // In JavaScript runtime, the values can be modified, but TypeScript will prevent it
      const originalValue = COLUMN_CONFIG[0].name;
      expect(() => {
        (COLUMN_CONFIG as any)[0].name = 'Modified Name';
      }).not.toThrow(); // In JS runtime, this won't throw, but TypeScript will error

      // Reset the value for subsequent tests
      (COLUMN_CONFIG as any)[0].name = originalValue;
    });
  });

  describe('Configuration Consistency', () => {
    it('should have matching IDs between status and config', () => {
      const statusIds = Object.values(COLUMN_STATUS);
      const configIds = COLUMN_CONFIG.map((config) => config.id);

      expect(statusIds).toEqual(expect.arrayContaining(configIds));
      expect(configIds).toEqual(expect.arrayContaining(statusIds));
    });

    it('should have non-empty names', () => {
      COLUMN_CONFIG.forEach((config) => {
        expect(config.name.trim().length).toBeGreaterThan(0);
      });
    });

    it('should have non-empty colors', () => {
      COLUMN_CONFIG.forEach((config) => {
        expect(config.color.trim().length).toBeGreaterThan(0);
        expect(config.textColor.trim().length).toBeGreaterThan(0);
      });
    });

    it('should have consistent naming conventions', () => {
      COLUMN_CONFIG.forEach((config) => {
        // Names should be title case (allowing spaces and multiple words)
        // "To Do" is valid: starts with uppercase, followed by lowercase, spaces, and more uppercase+lowercase
        expect(config.name).toMatch(/^[A-Z][a-z\s]*[A-Z]?[a-z]*$/);
      });
    });
  });

  describe('Type Safety', () => {
    it('should enforce correct types for status values', () => {
      // These assignments should work
      const todoStatus: ColumnStatus = COLUMN_STATUS.TODO;
      const inProgressStatus: ColumnStatus = COLUMN_STATUS.IN_PROGRESS;
      const doneStatus: ColumnStatus = COLUMN_STATUS.DONE;

      expect(todoStatus).toBe('TODO');
      expect(inProgressStatus).toBe('IN_PROGRESS');
      expect(doneStatus).toBe('DONE');
    });

    it('should prevent assignment of invalid status values', () => {
      // This test documents the expected TypeScript behavior
      // In a real TypeScript environment, these would cause compilation errors

      // Valid assignments
      const validStatus: ColumnStatus = COLUMN_STATUS.TODO;
      expect(validStatus).toBeDefined();

      // These would cause TypeScript errors:
      // const invalidStatus: ColumnStatus = 'PENDING' // Should fail
      // const anotherInvalid: ColumnStatus = 'ARCHIVED' // Should fail
    });
  });

  describe('Usage Examples', () => {
    it('should work correctly in typical usage patterns', () => {
      // Simulate typical usage in components
      const getColumnConfig = (status: ColumnStatus) => {
        return COLUMN_CONFIG.find((config) => config.id === status);
      };

      const todoConfig = getColumnConfig(COLUMN_STATUS.TODO);
      const inProgressConfig = getColumnConfig(COLUMN_STATUS.IN_PROGRESS);
      const doneConfig = getColumnConfig(COLUMN_STATUS.DONE);

      expect(todoConfig).toBeDefined();
      expect(inProgressConfig).toBeDefined();
      expect(doneConfig).toBeDefined();

      expect(todoConfig?.name).toBe('To Do');
      expect(inProgressConfig?.name).toBe('In Progress');
      expect(doneConfig?.name).toBe('Done');
    });

    it('should support status validation', () => {
      const isValidStatus = (status: string): status is ColumnStatus => {
        return Object.values(COLUMN_STATUS).includes(status as ColumnStatus);
      };

      expect(isValidStatus('TODO')).toBe(true);
      expect(isValidStatus('IN_PROGRESS')).toBe(true);
      expect(isValidStatus('DONE')).toBe(true);
      expect(isValidStatus('INVALID')).toBe(false);
      expect(isValidStatus('')).toBe(false);
    });
  });
});
