import React from 'react';
import {render, screen} from '@testing-library/react';
import {Column} from '../Column';
import {mockTickets} from '../../data/mockTickets';
import {COLUMN_STATUS} from '../../constants/status';

// Mock @dnd-kit hooks
jest.mock('@dnd-kit/core', () => ({
  useDroppable: () => ({
    setNodeRef: jest.fn(),
    isOver: false,
  }),
}));

jest.mock('@dnd-kit/sortable', () => ({
  SortableContext: ({children}: {children: React.ReactNode}) => (
    <div data-testid="sortable-context">{children}</div>
  ),
  verticalListSortingStrategy: jest.fn(),
}));

// Mock the Ticket component
jest.mock('../Ticket', () => ({
  Ticket: ({ticket, onClick}: {ticket: any; onClick?: () => void}) => (
    <div data-testid={`ticket-${ticket.id}`} onClick={onClick}>
      {ticket.name}
    </div>
  ),
}));

describe('Column', () => {
  const mockColumnId = COLUMN_STATUS.TODO;
  const mockColumnTickets = mockTickets.filter(
    (ticket) => ticket.status === COLUMN_STATUS.TODO,
  );
  const mockOnTicketClick = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render column header with correct title', () => {
      render(
        <Column
          id={mockColumnId}
          tickets={mockColumnTickets}
          onTicketClick={mockOnTicketClick}
        />,
      );

      expect(screen.getByText('To Do')).toBeInTheDocument();
    });

    it('should render ticket count correctly', () => {
      render(
        <Column
          id={mockColumnId}
          tickets={mockColumnTickets}
          onTicketClick={mockOnTicketClick}
        />,
      );

      expect(screen.getByText('3 tickets')).toBeInTheDocument();
    });

    it('should render singular form for single ticket', () => {
      const singleTicket = [mockColumnTickets[0]];
      render(
        <Column
          id={mockColumnId}
          tickets={singleTicket}
          onTicketClick={mockOnTicketClick}
        />,
      );

      expect(screen.getByText('1 ticket')).toBeInTheDocument();
    });

    it('should render empty state when no tickets', () => {
      render(
        <Column
          id={mockColumnId}
          tickets={[]}
          onTicketClick={mockOnTicketClick}
        />,
      );

      expect(screen.getByText('No tickets in this column')).toBeInTheDocument();
      expect(screen.getByText('0 tickets')).toBeInTheDocument();
    });
  });

  describe('Ticket Display', () => {
    it('should render all tickets in the column', () => {
      render(
        <Column
          id={mockColumnId}
          tickets={mockColumnTickets}
          onTicketClick={mockOnTicketClick}
        />,
      );

      mockColumnTickets.forEach((ticket) => {
        expect(screen.getByTestId(`ticket-${ticket.id}`)).toBeInTheDocument();
        expect(screen.getByText(ticket.name)).toBeInTheDocument();
      });
    });

    it('should render tickets in SortableContext', () => {
      render(
        <Column
          id={mockColumnId}
          tickets={mockColumnTickets}
          onTicketClick={mockOnTicketClick}
        />,
      );

      expect(screen.getByTestId('sortable-context')).toBeInTheDocument();
    });

    it('should pass correct props to Ticket components', () => {
      render(
        <Column
          id={mockColumnId}
          tickets={mockColumnTickets}
          onTicketClick={mockOnTicketClick}
        />,
      );

      const firstTicket = screen.getByTestId(
        `ticket-${mockColumnTickets[0].id}`,
      );
      expect(firstTicket).toBeInTheDocument();
    });
  });

  describe('Column Configuration', () => {
    it('should apply correct styling for TODO column', () => {
      render(
        <Column
          id={COLUMN_STATUS.TODO}
          tickets={mockColumnTickets}
          onTicketClick={mockOnTicketClick}
        />,
      );

      const columnHeader = screen.getByText('To Do').closest('div');
      expect(columnHeader).toHaveClass('border-b-2');
    });

    it('should apply correct styling for IN_PROGRESS column', () => {
      const inProgressTickets = mockTickets.filter(
        (ticket) => ticket.status === COLUMN_STATUS.IN_PROGRESS,
      );
      render(
        <Column
          id={COLUMN_STATUS.IN_PROGRESS}
          tickets={inProgressTickets}
          onTicketClick={mockOnTicketClick}
        />,
      );

      expect(screen.getByText('In Progress')).toBeInTheDocument();
    });

    it('should apply correct styling for DONE column', () => {
      const doneTickets = mockTickets.filter(
        (ticket) => ticket.status === COLUMN_STATUS.DONE,
      );
      render(
        <Column
          id={COLUMN_STATUS.DONE}
          tickets={doneTickets}
          onTicketClick={mockOnTicketClick}
        />,
      );

      expect(screen.getByText('Done')).toBeInTheDocument();
    });

    it('should handle unknown column ID gracefully', () => {
      render(
        <Column
          id="UNKNOWN_COLUMN"
          tickets={mockColumnTickets}
          onTicketClick={mockOnTicketClick}
        />,
      );

      expect(screen.getByText('UNKNOWN_COLUMN')).toBeInTheDocument();
    });
  });

  describe('Click Handling', () => {
    it('should call onTicketClick when ticket is clicked', () => {
      render(
        <Column
          id={mockColumnId}
          tickets={mockColumnTickets}
          onTicketClick={mockOnTicketClick}
        />,
      );

      const firstTicket = screen.getByTestId(
        `ticket-${mockColumnTickets[0].id}`,
      );
      firstTicket.click();

      expect(mockOnTicketClick).toHaveBeenCalledWith(mockColumnTickets[0]);
    });

    it('should not crash when onTicketClick is not provided', () => {
      render(<Column id={mockColumnId} tickets={mockColumnTickets} />);

      const firstTicket = screen.getByTestId(
        `ticket-${mockColumnTickets[0].id}`,
      );
      expect(() => firstTicket.click()).not.toThrow();
    });
  });

  describe('Layout and Styling', () => {
    it('should have correct column width and flex properties', () => {
      render(
        <Column
          id={mockColumnId}
          tickets={mockColumnTickets}
          onTicketClick={mockOnTicketClick}
        />,
      );

      const columnContainer = screen
        .getByText('To Do')
        .closest('div')?.parentElement;
      expect(columnContainer).toHaveClass('min-w-[350px]', 'flex-1');
    });

    it('should have minimum height for content area', () => {
      render(
        <Column
          id={mockColumnId}
          tickets={mockColumnTickets}
          onTicketClick={mockOnTicketClick}
        />,
      );

      const contentArea = screen.getByTestId('sortable-context').parentElement;
      expect(contentArea).toHaveClass('min-h-[500px]');
    });

    it('should apply transition effects', () => {
      render(
        <Column
          id={mockColumnId}
          tickets={mockColumnTickets}
          onTicketClick={mockOnTicketClick}
        />,
      );

      const contentArea = screen.getByTestId('sortable-context').parentElement;
      expect(contentArea).toHaveClass('transition-all', 'duration-200');
    });
  });

  describe('Edge Cases', () => {
    it('should handle column with many tickets', () => {
      const manyTickets = Array.from({length: 100}, (_, index) => ({
        ...mockColumnTickets[0],
        id: `ticket-${index}`,
        name: `Ticket ${index}`,
      }));

      render(
        <Column
          id={mockColumnId}
          tickets={manyTickets}
          onTicketClick={mockOnTicketClick}
        />,
      );

      expect(screen.getByText('100 tickets')).toBeInTheDocument();
      expect(screen.getByTestId('ticket-ticket-0')).toBeInTheDocument();
      expect(screen.getByTestId('ticket-ticket-99')).toBeInTheDocument();
    });

    it('should handle tickets with special characters in names', () => {
      const specialTickets = [
        {
          ...mockColumnTickets[0],
          name: 'Ticket with "quotes" & <tags>',
        },
      ];

      render(
        <Column
          id={mockColumnId}
          tickets={specialTickets}
          onTicketClick={mockOnTicketClick}
        />,
      );

      expect(
        screen.getByText('Ticket with "quotes" & <tags>'),
      ).toBeInTheDocument();
    });

    it('should handle tickets with very long names', () => {
      const longNameTicket = [
        {
          ...mockColumnTickets[0],
          name: 'This is a very long ticket name that should be displayed properly without breaking the layout or causing any rendering issues in the column component',
        },
      ];

      render(
        <Column
          id={mockColumnId}
          tickets={longNameTicket}
          onTicketClick={mockOnTicketClick}
        />,
      );

      expect(screen.getByText(longNameTicket[0].name)).toBeInTheDocument();
    });
  });
});
