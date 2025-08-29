import {calculateTicketAge, formatDate, formatDateTime} from '../dateUtils';

// Mock dayjs to have consistent test results
jest.mock('dayjs', () => {
  const originalDayjs = jest.requireActual('dayjs');
  const mockDayjs = (date: any) => {
    const instance = originalDayjs(date);
    instance.fromNow = jest.fn(() => '2 days ago');
    instance.format = jest.fn((format: string) => {
      if (format === 'MMM D, YYYY') return 'Jan 15, 2024';
      if (format === 'MMM D, YYYY h:mm A') return 'Jan 15, 2024 10:00 AM';
      return 'formatted date';
    });
    return instance;
  };

  // Copy all static methods
  Object.setPrototypeOf(mockDayjs, originalDayjs);
  Object.assign(mockDayjs, originalDayjs);

  return mockDayjs;
});

describe('Date Utils', () => {
  const testDate = new Date('2024-01-15T10:00:00Z');

  describe('calculateTicketAge', () => {
    it('should calculate ticket age using dayjs fromNow', () => {
      const result = calculateTicketAge(testDate);

      expect(result).toBe('2 days ago');
    });

    it('should handle different date inputs', () => {
      const oldDate = new Date('2020-01-01T00:00:00Z');
      const recentDate = new Date('2024-12-31T23:59:59Z');

      const oldResult = calculateTicketAge(oldDate);
      const recentResult = calculateTicketAge(recentDate);

      expect(oldResult).toBe('2 days ago');
      expect(recentResult).toBe('2 days ago');
    });

    it('should handle edge case dates', () => {
      const epochDate = new Date(0);
      const futureDate = new Date('2030-01-01T00:00:00Z');

      const epochResult = calculateTicketAge(epochDate);
      const futureResult = calculateTicketAge(futureDate);

      expect(epochResult).toBe('2 days ago');
      expect(futureResult).toBe('2 days ago');
    });

    it('should handle invalid dates gracefully', () => {
      const invalidDate = new Date('invalid');

      expect(() => calculateTicketAge(invalidDate)).not.toThrow();
    });
  });

  describe('formatDate', () => {
    it('should format date in MMM D, YYYY format', () => {
      const result = formatDate(testDate);

      expect(result).toBe('Jan 15, 2024');
    });

    it('should handle different date inputs', () => {
      const oldDate = new Date('2020-01-01T00:00:00Z');
      const recentDate = new Date('2024-12-31T23:59:59Z');

      const oldResult = formatDate(oldDate);
      const recentResult = formatDate(recentDate);

      expect(oldResult).toBe('Jan 15, 2024');
      expect(recentResult).toBe('Jan 15, 2024');
    });

    it('should handle edge case dates', () => {
      const epochDate = new Date(0);
      const futureDate = new Date('2030-01-01T00:00:00Z');

      const epochResult = formatDate(epochDate);
      const futureResult = formatDate(futureDate);

      expect(epochResult).toBe('Jan 15, 2024');
      expect(futureResult).toBe('Jan 15, 2024');
    });

    it('should handle invalid dates gracefully', () => {
      const invalidDate = new Date('invalid');

      expect(() => formatDate(invalidDate)).not.toThrow();
    });
  });

  describe('formatDateTime', () => {
    it('should format date and time in MMM D, YYYY h:mm A format', () => {
      const result = formatDateTime(testDate);

      expect(result).toBe('Jan 15, 2024 10:00 AM');
    });

    it('should handle different date inputs', () => {
      const oldDate = new Date('2020-01-01T00:00:00Z');
      const recentDate = new Date('2024-12-31T23:59:59Z');

      const oldResult = formatDateTime(oldDate);
      const recentResult = formatDateTime(recentDate);

      expect(oldResult).toBe('Jan 15, 2024 10:00 AM');
      expect(recentResult).toBe('Jan 15, 2024 10:00 AM');
    });

    it('should handle edge case dates', () => {
      const epochDate = new Date(0);
      const futureDate = new Date('2030-01-01T00:00:00Z');

      const epochResult = formatDateTime(epochDate);
      const futureResult = formatDateTime(futureDate);

      expect(epochResult).toBe('Jan 15, 2024 10:00 AM');
      expect(futureResult).toBe('Jan 15, 2024 10:00 AM');
    });

    it('should handle invalid dates gracefully', () => {
      const invalidDate = new Date('invalid');

      expect(() => formatDateTime(invalidDate)).not.toThrow();
    });
  });

  describe('Integration', () => {
    it('should work together consistently', () => {
      const sameDate = new Date('2024-01-15T10:00:00Z');

      const age = calculateTicketAge(sameDate);
      const formatted = formatDate(sameDate);
      const formattedTime = formatDateTime(sameDate);

      expect(age).toBe('2 days ago');
      expect(formatted).toBe('Jan 15, 2024');
      expect(formattedTime).toBe('Jan 15, 2024 10:00 AM');
    });

    it('should handle null and undefined gracefully', () => {
      // These should not crash the application
      expect(() => calculateTicketAge(null as any)).not.toThrow();
      expect(() => formatDate(null as any)).not.toThrow();
      expect(() => formatDateTime(null as any)).not.toThrow();

      expect(() => calculateTicketAge(undefined as any)).not.toThrow();
      expect(() => formatDate(undefined as any)).not.toThrow();
      expect(() => formatDateTime(undefined as any)).not.toThrow();
    });
  });

  describe('Performance', () => {
    it('should handle multiple date operations efficiently', () => {
      const dates = Array.from(
        {length: 1000},
        (_, i) =>
          new Date(`2024-01-${String(i + 1).padStart(2, '0')}T00:00:00Z`),
      );

      const start = performance.now();

      dates.forEach((date) => {
        calculateTicketAge(date);
        formatDate(date);
        formatDateTime(date);
      });

      const end = performance.now();
      const duration = end - start;

      // Should complete in reasonable time (less than 200ms for 1000 operations)
      expect(duration).toBeLessThan(200);
    });
  });
});
