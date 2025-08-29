import React from 'react';
import {render, screen, fireEvent} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {SearchAndFilter} from '../SearchAndFilter';
import {useTicketStore} from '../../store/useTicketStore';
import {PRIORITY} from '../../constants/priority';

// Mock the store
jest.mock('../../store/useTicketStore');

const mockUseTicketStore = useTicketStore as jest.MockedFunction<
  typeof useTicketStore
>;

describe('SearchAndFilter', () => {
  const mockStore = {
    searchText: '',
    selectedTags: [],
    selectedPriority: null,
    setSearchText: jest.fn(),
    setSelectedTags: jest.fn(),
    setSelectedPriority: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseTicketStore.mockReturnValue(mockStore);
  });

  describe('Rendering', () => {
    it('should render all filter elements', () => {
      render(<SearchAndFilter />);

      expect(screen.getByLabelText('Search Tickets')).toBeInTheDocument();
      expect(screen.getByLabelText('Priority')).toBeInTheDocument();
      expect(screen.getByLabelText('Tags')).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText('Search by ticket name or description...'),
      ).toBeInTheDocument();
    });

    it('should show correct default values', () => {
      render(<SearchAndFilter />);

      expect(screen.getByDisplayValue('')).toBeInTheDocument();
      expect(screen.getByText('All Priorities')).toBeInTheDocument();
      expect(screen.getByText('Select tags...')).toBeInTheDocument();
    });

    it('should show selected values when provided', () => {
      mockUseTicketStore.mockReturnValue({
        ...mockStore,
        searchText: 'test search',
        selectedTags: ['frontend', 'backend'],
        selectedPriority: PRIORITY.HIGH,
      });

      render(<SearchAndFilter />);

      expect(screen.getByDisplayValue('test search')).toBeInTheDocument();
      expect(screen.getByText('🔥 High Priority')).toBeInTheDocument();
      expect(screen.getByText('2 tags selected')).toBeInTheDocument();
    });
  });

  describe('Search Functionality', () => {
    it('should call setSearchText when typing in search input', async () => {
      const user = userEvent.setup();
      render(<SearchAndFilter />);

      const searchInput = screen.getByLabelText('Search Tickets');
      await user.type(searchInput, 'test');

      // The input change handler is called for each character, so we expect multiple calls
      expect(mockStore.setSearchText).toHaveBeenCalledWith('t');
      expect(mockStore.setSearchText).toHaveBeenCalledWith('e');
      expect(mockStore.setSearchText).toHaveBeenCalledWith('s');
      expect(mockStore.setSearchText).toHaveBeenCalledWith('t');
    });

    it('should update search text on input change', () => {
      render(<SearchAndFilter />);

      const searchInput = screen.getByLabelText('Search Tickets');
      fireEvent.change(searchInput, {target: {value: 'new search'}});

      expect(mockStore.setSearchText).toHaveBeenCalledWith('new search');
    });
  });

  describe('Priority Filter', () => {
    it('should open priority dropdown when clicked', async () => {
      const user = userEvent.setup();
      render(<SearchAndFilter />);

      const priorityButton = screen.getByLabelText('Priority');
      await user.click(priorityButton);

      expect(screen.getByText('📋 All Priorities')).toBeInTheDocument();
      expect(screen.getByText('🔥 High Priority')).toBeInTheDocument();
      expect(screen.getByText('⚡ Medium Priority')).toBeInTheDocument();
      expect(screen.getByText('🌱 Low Priority')).toBeInTheDocument();
    });

    it('should close priority dropdown when option is selected', async () => {
      const user = userEvent.setup();
      render(<SearchAndFilter />);

      const priorityButton = screen.getByLabelText('Priority');
      await user.click(priorityButton);

      const highPriorityOption = screen.getByText('🔥 High Priority');
      await user.click(highPriorityOption);

      expect(mockStore.setSelectedPriority).toHaveBeenCalledWith(PRIORITY.HIGH);
      expect(screen.queryByText('📋 All Priorities')).not.toBeInTheDocument();
    });

    it('should call setSelectedPriority with null when All Priorities is selected', async () => {
      const user = userEvent.setup();
      render(<SearchAndFilter />);

      const priorityButton = screen.getByLabelText('Priority');
      await user.click(priorityButton);

      const allPrioritiesOption = screen.getByText('📋 All Priorities');
      await user.click(allPrioritiesOption);

      expect(mockStore.setSelectedPriority).toHaveBeenCalledWith(null);
    });

    it('should show selected priority in button text', () => {
      mockUseTicketStore.mockReturnValue({
        ...mockStore,
        selectedPriority: PRIORITY.MEDIUM,
      });

      render(<SearchAndFilter />);

      expect(screen.getByText('⚡ Medium Priority')).toBeInTheDocument();
    });
  });

  describe('Tag Filter', () => {
    it('should open tag dropdown when clicked', async () => {
      const user = userEvent.setup();
      render(<SearchAndFilter />);

      const tagButton = screen.getByText('Select tags...');
      await user.click(tagButton);

      // Check for some available tags
      expect(screen.getByText('frontend')).toBeInTheDocument();
      expect(screen.getByText('backend')).toBeInTheDocument();
      expect(screen.getByText('database')).toBeInTheDocument();
    });

    it('should toggle tag selection when checkbox is clicked', async () => {
      const user = userEvent.setup();
      render(<SearchAndFilter />);

      const tagButton = screen.getByText('Select tags...');
      await user.click(tagButton);

      const frontendCheckbox = screen.getByLabelText('frontend');
      await user.click(frontendCheckbox);

      expect(mockStore.setSelectedTags).toHaveBeenCalledWith(['frontend']);
    });

    it('should remove tag when already selected tag is clicked', async () => {
      mockUseTicketStore.mockReturnValue({
        ...mockStore,
        selectedTags: ['frontend'],
      });

      const user = userEvent.setup();
      render(<SearchAndFilter />);

      const tagButton = screen.getByText('1 tag selected');
      await user.click(tagButton);

      const frontendCheckbox = screen.getByLabelText('frontend');
      await user.click(frontendCheckbox);

      expect(mockStore.setSelectedTags).toHaveBeenCalledWith([]);
    });

    it('should show selected tags count in button text', () => {
      mockUseTicketStore.mockReturnValue({
        ...mockStore,
        selectedTags: ['frontend', 'backend'],
      });

      render(<SearchAndFilter />);

      expect(screen.getByText('2 tags selected')).toBeInTheDocument();
    });

    it('should show singular form for single tag', () => {
      mockUseTicketStore.mockReturnValue({
        ...mockStore,
        selectedTags: ['frontend'],
      });

      render(<SearchAndFilter />);

      expect(screen.getByText('1 tag selected')).toBeInTheDocument();
    });
  });

  describe('Clear Filters', () => {
    it('should show clear all button when filters are active', () => {
      mockUseTicketStore.mockReturnValue({
        ...mockStore,
        searchText: 'test',
        selectedTags: ['frontend'],
        selectedPriority: PRIORITY.HIGH,
      });

      render(<SearchAndFilter />);

      expect(screen.getByText('Clear All')).toBeInTheDocument();
    });

    it('should not show clear all button when no filters are active', () => {
      render(<SearchAndFilter />);

      expect(screen.queryByText('Clear All')).not.toBeInTheDocument();
    });

    it('should clear all filters when clear all button is clicked', async () => {
      const user = userEvent.setup();
      mockUseTicketStore.mockReturnValue({
        ...mockStore,
        searchText: 'test',
        selectedTags: ['frontend'],
        selectedPriority: PRIORITY.HIGH,
      });

      render(<SearchAndFilter />);

      const clearButton = screen.getByText('Clear All');
      await user.click(clearButton);

      expect(mockStore.setSearchText).toHaveBeenCalledWith('');
      expect(mockStore.setSelectedTags).toHaveBeenCalledWith([]);
      expect(mockStore.setSelectedPriority).toHaveBeenCalledWith(null);
    });
  });

  describe('Active Filters Display', () => {
    it('should show search filter when search text is present', () => {
      mockUseTicketStore.mockReturnValue({
        ...mockStore,
        searchText: 'test search',
      });

      render(<SearchAndFilter />);

      expect(screen.getByText('Search: "test search"')).toBeInTheDocument();
    });

    it('should show priority filter when priority is selected', () => {
      mockUseTicketStore.mockReturnValue({
        ...mockStore,
        selectedPriority: PRIORITY.HIGH,
      });

      render(<SearchAndFilter />);

      expect(
        screen.getByText('Priority: 🔥 High Priority'),
      ).toBeInTheDocument();
    });

    it('should show tag filters when tags are selected', () => {
      mockUseTicketStore.mockReturnValue({
        ...mockStore,
        selectedTags: ['frontend', 'backend'],
      });

      render(<SearchAndFilter />);

      expect(screen.getByText('frontend')).toBeInTheDocument();
      expect(screen.getByText('backend')).toBeInTheDocument();
    });

    it('should allow removing individual filters', async () => {
      const user = userEvent.setup();
      mockUseTicketStore.mockReturnValue({
        ...mockStore,
        searchText: 'test',
        selectedTags: ['frontend'],
        selectedPriority: PRIORITY.HIGH,
      });

      render(<SearchAndFilter />);

      // Remove search filter
      const searchRemoveButton = screen
        .getByText('Search: "test"')
        .querySelector('button');
      if (searchRemoveButton) {
        await user.click(searchRemoveButton);
        expect(mockStore.setSearchText).toHaveBeenCalledWith('');
      }

      // Remove priority filter
      const priorityRemoveButton = screen
        .getByText('Priority: 🔥 High Priority')
        .querySelector('button');
      if (priorityRemoveButton) {
        await user.click(priorityRemoveButton);
        expect(mockStore.setSelectedPriority).toHaveBeenCalledWith(null);
      }

      // Remove tag filter
      const tagRemoveButton = screen
        .getByText('frontend')
        .querySelector('button');
      if (tagRemoveButton) {
        await user.click(tagRemoveButton);
        expect(mockStore.setSelectedTags).toHaveBeenCalledWith([]);
      }
    });
  });

  describe('Accessibility', () => {
    it('should have proper labels for all form elements', () => {
      render(<SearchAndFilter />);

      expect(screen.getByLabelText('Search Tickets')).toBeInTheDocument();
      expect(screen.getByText('Priority')).toBeInTheDocument();
      expect(screen.getByText('Tags')).toBeInTheDocument();
    });

    it('should have proper button types', () => {
      render(<SearchAndFilter />);

      const buttons = screen.getAllByRole('button');
      buttons.forEach((button) => {
        expect(button).toHaveAttribute('type', 'button');
      });
    });
  });
});
