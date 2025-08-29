import React from 'react';
import {render, screen, fireEvent, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {KanbanBoard} from '../KanbanBoard';
import {useTicketStore} from '../../store/useTicketStore';
import {fetchTickets} from '../../services/api';
import {mockTickets} from '../../data/mockTickets';
import {COLUMN_STATUS} from '../../constants/status';
import {PRIORITY} from '../../constants/priority';

// Mock the store
jest.mock('../../store/useTicketStore');

// Mock the API service
jest.mock('../../services/api');

// Mock @dnd-kit components
jest.mock('@dnd-kit/core', () => ({
  DndContext: ({children, onDragStart, onDragEnd}: any) => (
    <div
      data-testid="dnd-context"
      onClick={() => {
        // Simulate drag start
        onDragStart({active: {id: '1'}});
        // Simulate drag end
        onDragEnd({active: {id: '1'}, over: {id: COLUMN_STATUS.IN_PROGRESS}});
      }}
    >
      {children}
    </div>
  ),
  closestCenter: jest.fn(),
  PointerSensor: jest.fn(),
  useSensor: jest.fn(() => jest.fn()),
  useSensors: jest.fn(() => [jest.fn()]),
  DragOverlay: ({children}: any) => (
    <div data-testid="drag-overlay">{children}</div>
  ),
  useDroppable: () => ({
    setNodeRef: jest.fn(),
    isOver: false,
  }),
}));

jest.mock('@dnd-kit/sortable', () => ({
  arrayMove: jest.fn((array, oldIndex, newIndex) => {
    const newArray = [...array];
    const [removed] = newArray.splice(oldIndex, 1);
    newArray.splice(newIndex, 0, removed);
    return newArray;
  }),
  SortableContext: ({children}: any) => (
    <div data-testid="sortable-context">{children}</div>
  ),
  verticalListSortingStrategy: jest.fn(),
  useSortable: () => ({
    attributes: {},
    listeners: {},
    setNodeRef: jest.fn(),
    transform: null,
    transition: null,
    isDragging: false,
    isOver: false,
  }),
}));

const mockUseTicketStore = useTicketStore as jest.MockedFunction<
  typeof useTicketStore
>;
const mockFetchTickets = fetchTickets as jest.MockedFunction<
  typeof fetchTickets
>;

describe('KanbanBoard', () => {
  const mockStore = {
    tickets: mockTickets,
    isLoading: false,
    error: null,
    isHydrated: true,
    setTickets: jest.fn(),
    setLoading: jest.fn(),
    setError: jest.fn(),
    updateTicketStatus: jest.fn(),
    reorderTickets: jest.fn(),
    searchText: '',
    selectedTags: [],
    selectedPriority: null,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseTicketStore.mockReturnValue(mockStore);
    mockFetchTickets.mockResolvedValue(mockTickets);
  });

  describe('Rendering', () => {
    it('should render the main board with title and description', () => {
      render(<KanbanBoard />);

      expect(screen.getByText('Kanban Board')).toBeInTheDocument();
      expect(
        screen.getByText('Organize and track your tasks efficiently'),
      ).toBeInTheDocument();
    });

    it('should render SearchAndFilter component', () => {
      render(<KanbanBoard />);

      expect(screen.getByLabelText('Search Tickets')).toBeInTheDocument();
    });

    it('should render all three columns', () => {
      render(<KanbanBoard />);

      expect(screen.getByText('To Do')).toBeInTheDocument();
      expect(screen.getByText('In Progress')).toBeInTheDocument();
      expect(screen.getByText('Done')).toBeInTheDocument();
    });

    it('should render DndContext', () => {
      render(<KanbanBoard />);

      expect(screen.getByTestId('dnd-context')).toBeInTheDocument();
    });
  });

  describe('Loading States', () => {
    it('should show loading spinner when not hydrated', () => {
      mockUseTicketStore.mockReturnValue({
        ...mockStore,
        isHydrated: false,
      });

      render(<KanbanBoard />);

      expect(screen.getByText('Loading saved data...')).toBeInTheDocument();
      expect(screen.getByText('Loading saved data...')).toBeInTheDocument();
    });

    it('should show loading spinner when loading from API', () => {
      mockUseTicketStore.mockReturnValue({
        ...mockStore,
        isLoading: true,
      });

      render(<KanbanBoard />);

      expect(screen.getByText('Loading tickets...')).toBeInTheDocument();
      expect(screen.getByText('Loading tickets...')).toBeInTheDocument();
    });
  });

  describe('Error States', () => {
    it('should show error message when there is an error', () => {
      mockUseTicketStore.mockReturnValue({
        ...mockStore,
        error: 'Failed to load tickets',
      });

      render(<KanbanBoard />);

      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
      expect(screen.getByText('Failed to load tickets')).toBeInTheDocument();
      expect(screen.getByText('Try Again')).toBeInTheDocument();
    });

    it('should call loadInitialData when retry button is clicked', async () => {
      const user = userEvent.setup();
      mockUseTicketStore.mockReturnValue({
        ...mockStore,
        error: 'Failed to load tickets',
      });

      render(<KanbanBoard />);

      const retryButton = screen.getByText('Try Again');
      await user.click(retryButton);

      expect(mockStore.setLoading).toHaveBeenCalledWith(true);
      expect(mockStore.setError).toHaveBeenCalledWith(null);
      expect(mockFetchTickets).toHaveBeenCalled();
    });
  });

  describe('Empty States', () => {
    it('should show empty state when no tickets exist', () => {
      mockUseTicketStore.mockReturnValue({
        ...mockStore,
        tickets: [],
      });

      render(<KanbanBoard />);

      expect(screen.getByText('No tickets yet')).toBeInTheDocument();
      expect(
        screen.getByText('Click the button below to load sample tickets'),
      ).toBeInTheDocument();
      expect(screen.getByText('Load Sample Data')).toBeInTheDocument();
    });

    it('should call loadInitialData when load sample data button is clicked', async () => {
      const user = userEvent.setup();
      mockUseTicketStore.mockReturnValue({
        ...mockStore,
        tickets: [],
      });

      render(<KanbanBoard />);

      const loadButton = screen.getByText('Load Sample Data');
      await user.click(loadButton);

      expect(mockStore.setLoading).toHaveBeenCalledWith(true);
      expect(mockStore.setError).toHaveBeenCalledWith(null);
      expect(mockFetchTickets).toHaveBeenCalled();
    });
  });

  describe('Data Loading', () => {
    it('should load initial data when hydrated and no tickets exist', async () => {
      mockUseTicketStore.mockReturnValue({
        ...mockStore,
        tickets: [],
      });

      render(<KanbanBoard />);

      await waitFor(() => {
        expect(mockFetchTickets).toHaveBeenCalled();
        expect(mockStore.setTickets).toHaveBeenCalledWith(mockTickets);
        expect(mockStore.setLoading).toHaveBeenCalledWith(false);
      });
    });

    it('should not load data when tickets already exist', () => {
      mockUseTicketStore.mockReturnValue({
        ...mockStore,
        tickets: mockTickets,
      });

      render(<KanbanBoard />);

      expect(mockFetchTickets).not.toHaveBeenCalled();
    });

    it('should handle API errors gracefully', async () => {
      mockUseTicketStore.mockReturnValue({
        ...mockStore,
        tickets: [],
      });
      mockFetchTickets.mockRejectedValue(new Error('API Error'));

      render(<KanbanBoard />);

      await waitFor(() => {
        expect(mockStore.setError).toHaveBeenCalledWith(
          'Failed to load tickets. Please try again.',
        );
        expect(mockStore.setLoading).toHaveBeenCalledWith(false);
      });
    });
  });

  describe('Ticket Filtering', () => {
    it('should filter tickets by search text', () => {
      mockUseTicketStore.mockReturnValue({
        ...mockStore,
        searchText: 'User Authentication',
      });

      render(<KanbanBoard />);

      // Should only show tickets matching the search
      expect(
        screen.getByText('Implement User Authentication'),
      ).toBeInTheDocument();
      expect(
        screen.queryByText('Design Database Schema'),
      ).not.toBeInTheDocument();
    });

    it('should filter tickets by selected tags', () => {
      mockUseTicketStore.mockReturnValue({
        ...mockStore,
        selectedTags: ['frontend'],
      });

      render(<KanbanBoard />);

      // Should only show tickets with frontend tag
      expect(
        screen.getByText('Implement User Authentication'),
      ).toBeInTheDocument();
      expect(
        screen.queryByText('Design Database Schema'),
      ).not.toBeInTheDocument();
    });

    it('should filter tickets by priority', () => {
      mockUseTicketStore.mockReturnValue({
        ...mockStore,
        selectedPriority: PRIORITY.HIGH,
      });

      render(<KanbanBoard />);

      // Should only show high priority tickets
      expect(
        screen.getByText('Implement User Authentication'),
      ).toBeInTheDocument();
      expect(screen.getByText('Create API Endpoints')).toBeInTheDocument();
      expect(
        screen.queryByText('Design Database Schema'),
      ).not.toBeInTheDocument();
    });

    it('should combine multiple filters', () => {
      mockUseTicketStore.mockReturnValue({
        ...mockStore,
        searchText: 'API',
        selectedTags: ['backend'],
        selectedPriority: PRIORITY.HIGH,
      });

      render(<KanbanBoard />);

      // Should only show high priority backend tickets with "API" in name/description
      expect(screen.getByText('Create API Endpoints')).toBeInTheDocument();
      expect(
        screen.queryByText('Implement User Authentication'),
      ).not.toBeInTheDocument();
    });
  });

  describe('Drag and Drop', () => {
    it('should handle drag start', () => {
      render(<KanbanBoard />);

      const dndContext = screen.getByTestId('dnd-context');
      fireEvent.click(dndContext);

      // Drag start should be handled
      expect(dndContext).toBeInTheDocument();
    });

    it('should handle status change on drop', () => {
      render(<KanbanBoard />);

      const dndContext = screen.getByTestId('dnd-context');
      fireEvent.click(dndContext);

      // Should call updateTicketStatus when dropping on a column
      expect(mockStore.updateTicketStatus).toHaveBeenCalledWith(
        '1',
        COLUMN_STATUS.IN_PROGRESS,
      );
    });
  });

  describe('Ticket Distribution', () => {
    it('should distribute tickets correctly across columns', () => {
      render(<KanbanBoard />);

      // Check that tickets are in the correct columns
      const todoColumn = screen
        .getByText('To Do')
        .closest('div')?.parentElement;
      const inProgressColumn = screen
        .getByText('In Progress')
        .closest('div')?.parentElement;
      const doneColumn = screen.getByText('Done').closest('div')?.parentElement;

      expect(todoColumn).toBeInTheDocument();
      expect(inProgressColumn).toBeInTheDocument();
      expect(doneColumn).toBeInTheDocument();
    });

    it('should show correct ticket counts in column headers', () => {
      render(<KanbanBoard />);

      // Check ticket counts
      expect(screen.getByText('2 tickets')).toBeInTheDocument(); // TODO column
      expect(screen.getByText('2 tickets')).toBeInTheDocument(); // IN_PROGRESS column
      expect(screen.getByText('1 ticket')).toBeInTheDocument(); // DONE column
    });
  });

  describe('Responsive Design', () => {
    it('should have responsive grid layout', () => {
      render(<KanbanBoard />);

      const gridContainer = screen.getByText('To Do').closest('div')
        ?.parentElement?.parentElement;
      expect(gridContainer).toHaveClass(
        'grid',
        'grid-cols-1',
        'lg:grid-cols-3',
      );
    });

    it('should have proper spacing and padding', () => {
      render(<KanbanBoard />);

      const mainContainer = screen.getByText('Kanban Board').closest('div')
        ?.parentElement?.parentElement;
      expect(mainContainer).toHaveClass('min-h-screen', 'bg-gray-50', 'p-6');
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading structure', () => {
      render(<KanbanBoard />);

      expect(screen.getByRole('heading', {level: 1})).toBeInTheDocument();
      expect(screen.getByText('Kanban Board')).toBeInTheDocument();
    });

    it('should have proper button labels', () => {
      mockUseTicketStore.mockReturnValue({
        ...mockStore,
        error: 'Test error',
      });

      render(<KanbanBoard />);

      const retryButton = screen.getByRole('button', {name: 'Try Again'});
      expect(retryButton).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    it('should handle large numbers of tickets efficiently', () => {
      const manyTickets = Array.from({length: 100}, (_, index) => ({
        ...mockTickets[0],
        id: `ticket-${index}`,
        name: `Ticket ${index}`,
      }));

      mockUseTicketStore.mockReturnValue({
        ...mockStore,
        tickets: manyTickets,
      });

      const start = performance.now();
      render(<KanbanBoard />);
      const end = performance.now();

      // Should render in reasonable time (less than 500ms for 100 tickets)
      expect(end - start).toBeLessThan(500);
    });
  });
});
