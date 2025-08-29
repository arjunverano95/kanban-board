import {Ticket} from '../types/ticket';

export const fetchTickets = async (): Promise<Ticket[]> => {
  try {
    const response = await fetch('/api/tickets');

    if (!response.ok) {
      throw new Error('Failed to fetch tickets');
    }

    const data = await response.json();

    // Convert ISO strings back to Date objects
    return data.tickets.map(
      (
        ticket: Omit<Ticket, 'createdAt' | 'updatedAt'> & {
          createdAt: string;
          updatedAt: string;
        },
      ) => ({
        ...ticket,
        createdAt: new Date(ticket.createdAt),
        updatedAt: new Date(ticket.updatedAt),
      }),
    );
  } catch (error) {
    console.error('Error fetching tickets:', error);
    throw error;
  }
};
