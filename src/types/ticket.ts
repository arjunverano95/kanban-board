import {ColumnStatus} from '../constants/status';

export interface Ticket {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  status: ColumnStatus;
  priority?: 'low' | 'medium' | 'high';
}

export interface TicketFormData {
  name: string;
  description: string;
  tags: string[];
  priority: 'low' | 'medium' | 'high';
}

export interface SearchFilters {
  searchText: string;
  selectedTags: string[];
  priority?: 'low' | 'medium' | 'high';
}
