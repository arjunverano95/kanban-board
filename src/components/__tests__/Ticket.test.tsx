import React from 'react';
import {render, screen, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {Ticket} from '../Ticket';
import {useTicketStore} from '../../store/useTicketStore';
import {mockTickets} from '../../data/mockTickets';
import {PRIORITY, type Priority} from '../../constants/priority';

// Mock the store
jest.mock('../../store/useTicketStore');

// Mock @dnd-kit hooks
jest.mock('@dnd-kit/sortable', () => ({
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

jest.mock('@dnd-kit/utilities', () => ({
  CSS: {
    Transform: {
      toString: jest.fn(() => ''),
    },
  },
}));

const mockUseTicketStore = useTicketStore as jest.MockedFunction<
  typeof useTicketStore
>;

describe('Ticket', () => {
  const mockTicket = mockTickets[0]; // First ticket for testing
  const mockStore = {
    updateTicketPriority: jest.fn(),
    tickets: mockTickets,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseTicketStore.mockReturnValue(mockStore);
  });

  const renderTicketWithPriority = (priority?: Priority) => {
    const testTicket = {...mockTicket, priority};
    mockUseTicketStore.mockReturnValue({
      ...mockStore,
      tickets: [testTicket, ...mockTickets.slice(1)],
    });
    return render(<Ticket ticket={testTicket} />);
  };

  describe('Rendering', () => {
    it('should render ticket information correctly', () => {
      render(<Ticket ticket={mockTicket} />);

      expect(screen.getByText(mockTicket.name)).toBeInTheDocument();
      expect(screen.getByText(mockTicket.description)).toBeInTheDocument();
      expect(screen.getByText(/Created:/)).toBeInTheDocument();
      expect(screen.getByText(/Updated:/)).toBeInTheDocument();
    });

    it('should render all tags', () => {
      render(<Ticket ticket={mockTicket} />);

      mockTicket.tags.forEach((tag) => {
        expect(screen.getByText(tag)).toBeInTheDocument();
      });
    });

    it('should render priority badge with correct text', () => {
      render(<Ticket ticket={mockTicket} />);

      expect(screen.getByText(/🔥.*High/)).toBeInTheDocument();
    });

    it('should render priority badge with "None" when no priority', () => {
      renderTicketWithPriority(undefined);

      expect(screen.getByText(/📋.*None/)).toBeInTheDocument();
    });

    it('should render age indicator', () => {
      render(<Ticket ticket={mockTicket} />);

      // The age indicator should be present (exact text depends on date calculation)
      expect(screen.getByText(/ago/)).toBeInTheDocument();
    });
  });

  describe('Priority Badge', () => {
    it('should show correct priority styles for high priority', () => {
      renderTicketWithPriority(PRIORITY.HIGH);

      const priorityBadge = screen.getByText(/🔥.*High/);
      expect(priorityBadge).toHaveClass(
        'bg-red-100',
        'text-red-800',
        'border-red-200',
      );
    });

    it('should show correct priority styles for medium priority', () => {
      renderTicketWithPriority(PRIORITY.MEDIUM);

      const priorityBadge = screen.getByText(/⚡.*Medium/);
      expect(priorityBadge).toHaveClass(
        'bg-yellow-100',
        'text-yellow-800',
        'border-yellow-200',
      );
    });

    it('should show correct priority styles for low priority', () => {
      renderTicketWithPriority(PRIORITY.LOW);

      const priorityBadge = screen.getByText(/🌱.*Low/);
      expect(priorityBadge).toHaveClass(
        'bg-green-100',
        'text-green-800',
        'border-green-200',
      );
    });

    it('should show correct priority styles for no priority', () => {
      renderTicketWithPriority(undefined);

      const priorityBadge = screen.getByText(/📋.*None/);
      expect(priorityBadge).toHaveClass(
        'bg-gray-100',
        'text-gray-800',
        'border-gray-200',
      );
    });
  });

  describe('Priority Menu', () => {
    it('should open priority menu when priority badge is clicked', async () => {
      const user = userEvent.setup();
      render(<Ticket ticket={mockTicket} />);

      // Find the priority badge button (not the menu option)
      const priorityBadgeButton = screen.getByRole('button', {
        name: /🔥.*High/,
      });
      await user.click(priorityBadgeButton);

      // Check that the menu is open by looking for menu-specific elements
      expect(screen.getByText('📋 None')).toBeInTheDocument();
      expect(screen.getByText('🌱 Low')).toBeInTheDocument();
      expect(screen.getByText('⚡ Medium')).toBeInTheDocument();

      // For the "🔥 High" text, look specifically in the menu context
      const menuContainer = screen
        .getByRole('button', {name: '📋 None'})
        .closest('div')?.parentElement;
      if (menuContainer) {
        expect(within(menuContainer).getByText('🔥 High')).toBeInTheDocument();
      }
    });

    it('should close priority menu when priority is selected', async () => {
      const user = userEvent.setup();
      render(<Ticket ticket={mockTicket} />);

      const priorityBadge = screen.getByText('🔥 High');
      await user.click(priorityBadge);

      const lowPriorityOption = screen.getByText('🌱 Low');
      await user.click(lowPriorityOption);

      expect(mockStore.updateTicketPriority).toHaveBeenCalledWith(
        mockTicket.id,
        PRIORITY.LOW,
      );
      expect(screen.queryByText('📋 None')).not.toBeInTheDocument();
    });

    it('should call updateTicketPriority with null when None is selected', async () => {
      const user = userEvent.setup();
      render(<Ticket ticket={mockTicket} />);

      const priorityBadge = screen.getByText('🔥 High');
      await user.click(priorityBadge);

      const noneOption = screen.getByText('📋 None');
      await user.click(noneOption);

      expect(mockStore.updateTicketPriority).toHaveBeenCalledWith(
        mockTicket.id,
        null,
      );
    });

    it('should prevent event propagation when priority badge is clicked', async () => {
      const user = userEvent.setup();
      const onClickMock = jest.fn();
      render(<Ticket ticket={mockTicket} onClick={onClickMock} />);

      const priorityBadge = screen.getByText('🔥 High');
      await user.click(priorityBadge);

      expect(onClickMock).not.toHaveBeenCalled();
    });
  });

  describe('Click Handling', () => {
    it('should call onClick when ticket is clicked', async () => {
      const user = userEvent.setup();
      const onClickMock = jest.fn();
      render(<Ticket ticket={mockTicket} onClick={onClickMock} />);

      const ticketElement = screen.getByText(mockTicket.name).closest('div');
      if (ticketElement) {
        await user.click(ticketElement);
        expect(onClickMock).toHaveBeenCalled();
      }
    });

    it('should not call onClick when priority menu is clicked', async () => {
      const user = userEvent.setup();
      const onClickMock = jest.fn();
      render(<Ticket ticket={mockTicket} onClick={onClickMock} />);

      const priorityBadge = screen.getByText('🔥 High');
      await user.click(priorityBadge);

      const lowPriorityOption = screen.getByText('🌱 Low');
      await user.click(lowPriorityOption);

      expect(onClickMock).not.toHaveBeenCalled();
    });
  });

  describe('Store Integration', () => {
    it('should use latest ticket data from store', () => {
      const updatedTicket = {...mockTicket, priority: PRIORITY.LOW};
      mockUseTicketStore.mockReturnValue({
        ...mockStore,
        tickets: [updatedTicket, ...mockTickets.slice(1)],
      });

      render(<Ticket ticket={mockTicket} />);

      // Should show updated priority from store
      expect(screen.getByText('🌱 Low')).toBeInTheDocument();
    });

    it('should fallback to prop ticket when not found in store', () => {
      mockUseTicketStore.mockReturnValue({
        ...mockStore,
        tickets: mockTickets.slice(1), // Remove first ticket
      });

      render(<Ticket ticket={mockTicket} />);

      // Should show original ticket data
      expect(screen.getByText('🔥 High')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper button types', async () => {
      render(<Ticket ticket={mockTicket} />);

      const priorityBadge = screen.getByText('🔥 High');
      await userEvent.click(priorityBadge);

      const buttons = screen.getAllByRole('button');
      buttons.forEach((button) => {
        expect(button).toHaveAttribute('type', 'button');
      });
    });

    it('should have proper cursor styles', () => {
      render(<Ticket ticket={mockTicket} />);

      const ticketElement = screen
        .getByText(mockTicket.name)
        .closest('div')?.parentElement;
      expect(ticketElement).toHaveClass('cursor-pointer');
    });
  });

  describe('Edge Cases', () => {
    it('should handle ticket with empty tags array', () => {
      const ticketWithNoTags = {...mockTicket, tags: []};
      render(<Ticket ticket={ticketWithNoTags} />);

      // Should not crash and should not show any tags
      expect(screen.queryByText(/tag/)).not.toBeInTheDocument();
    });

    it('should handle ticket with very long name', () => {
      const ticketWithLongName = {
        ...mockTicket,
        name: 'This is a very long ticket name that should be truncated properly to fit within the component boundaries without breaking the layout',
      };

      mockUseTicketStore.mockReturnValue({
        ...mockStore,
        tickets: [ticketWithLongName, ...mockTickets.slice(1)],
      });

      render(<Ticket ticket={ticketWithLongName} />);

      // The name should be present even if truncated by CSS
      expect(
        screen.getByText(/This is a very long ticket name/),
      ).toBeInTheDocument();
    });

    it('should handle ticket with very long description', () => {
      const ticketWithLongDescription = {
        ...mockTicket,
        description:
          'This is a very long description that should be truncated properly to fit within the component boundaries without breaking the layout. It should handle multiple lines and very long text content gracefully.',
      };

      mockUseTicketStore.mockReturnValue({
        ...mockStore,
        tickets: [ticketWithLongDescription, ...mockTickets.slice(1)],
      });

      render(<Ticket ticket={ticketWithLongDescription} />);

      // The description should be present even if truncated by CSS
      expect(
        screen.getByText(/This is a very long description/),
      ).toBeInTheDocument();
    });
  });
});
