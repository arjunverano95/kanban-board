import {ColumnStatus} from '../constants/status';
import {Priority} from '../constants/priority';

export interface Ticket {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  status: ColumnStatus;
  priority?: Priority;
}

export interface TicketFormData {
  name: string;
  description: string;
  tags: string[];
  priority: Priority;
}

export interface SearchFilters {
  searchText: string;
  selectedTags: string[];
  priority?: Priority;
}
