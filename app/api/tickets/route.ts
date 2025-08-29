import {NextRequest, NextResponse} from 'next/server';
import {mockTickets} from '../../../src/data/mockTickets';

export async function GET(request: NextRequest) {
  try {
    const {searchParams} = new URL(request.url);
    const search = searchParams.get('search') || '';
    const tags = searchParams.get('tags') || '';

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Filter tickets based on search and tags
    let filteredTickets = [...mockTickets];

    if (search) {
      filteredTickets = filteredTickets.filter(
        (ticket) =>
          ticket.name.toLowerCase().includes(search.toLowerCase()) ||
          ticket.description.toLowerCase().includes(search.toLowerCase()),
      );
    }

    if (tags) {
      const tagArray = tags.split(',').filter((tag) => tag.trim());
      if (tagArray.length > 0) {
        filteredTickets = filteredTickets.filter((ticket) =>
          tagArray.some((tag) => ticket.tags.includes(tag.trim())),
        );
      }
    }

    // Convert dates to ISO strings for JSON serialization
    const serializedTickets = filteredTickets.map((ticket) => ({
      ...ticket,
      createdAt: ticket.createdAt.toISOString(),
      updatedAt: ticket.updatedAt.toISOString(),
    }));

    return NextResponse.json({
      tickets: serializedTickets,
      total: filteredTickets.length,
    });
  } catch (error) {
    console.error('Error fetching tickets:', error);
    return NextResponse.json({error: 'Failed to fetch tickets'}, {status: 500});
  }
}
