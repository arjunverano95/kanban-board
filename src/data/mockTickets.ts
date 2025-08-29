import {Ticket} from '../types/ticket';
import {COLUMN_STATUS} from '../constants/status';
import {PRIORITY} from '../constants/priority';

export const mockTickets: Ticket[] = [
  {
    id: '1',
    name: 'Implement User Authentication',
    description:
      'Create a secure authentication system with JWT tokens and user registration/login functionality.',
    createdAt: new Date('2024-01-15T10:00:00Z'),
    updatedAt: new Date('2024-01-20T14:30:00Z'),
    tags: ['frontend', 'security', 'auth'],
    status: COLUMN_STATUS.TODO,
    priority: PRIORITY.HIGH,
  },
  {
    id: '2',
    name: 'Design Database Schema',
    description:
      'Plan and create the database structure for the user management system.',
    createdAt: new Date('2024-01-16T09:00:00Z'),
    updatedAt: new Date('2024-01-18T16:45:00Z'),
    tags: ['database', 'planning', 'backend'],
    status: COLUMN_STATUS.IN_PROGRESS,
    priority: PRIORITY.MEDIUM,
  },
  {
    id: '3',
    name: 'Create API Endpoints',
    description: 'Implement RESTful API endpoints for user CRUD operations.',
    createdAt: new Date('2024-01-17T11:00:00Z'),
    updatedAt: new Date('2024-01-19T10:15:00Z'),
    tags: ['api', 'backend', 'rest'],
    status: COLUMN_STATUS.IN_PROGRESS,
    priority: PRIORITY.HIGH,
  },
  {
    id: '4',
    name: 'Write Unit Tests',
    description:
      'Create comprehensive unit tests for all components and functions.',
    createdAt: new Date('2024-01-18T13:00:00Z'),
    updatedAt: new Date('2024-01-20T11:20:00Z'),
    tags: ['testing', 'quality', 'tdd'],
    status: COLUMN_STATUS.DONE,
    priority: PRIORITY.MEDIUM,
  },
  {
    id: '5',
    name: 'Setup CI/CD Pipeline',
    description:
      'Configure continuous integration and deployment pipeline using GitHub Actions.',
    createdAt: new Date('2024-01-19T08:00:00Z'),
    updatedAt: new Date('2024-01-19T08:00:00Z'),
    tags: ['devops', 'ci-cd', 'automation'],
    status: COLUMN_STATUS.TODO,
    priority: PRIORITY.LOW,
  },
  {
    id: '6',
    name: 'Optimize Performance',
    description: 'Identify and fix performance bottlenecks in the application.',
    createdAt: new Date('2024-01-20T10:00:00Z'),
    updatedAt: new Date('2024-01-20T10:00:00Z'),
    tags: ['performance', 'optimization', 'monitoring'],
    status: COLUMN_STATUS.TODO,
    priority: PRIORITY.MEDIUM,
  },
];

export const availableTags = [
  'frontend',
  'backend',
  'database',
  'api',
  'security',
  'testing',
  'devops',
  'performance',
  'planning',
  'auth',
  'rest',
  'tdd',
  'ci-cd',
  'automation',
  'optimization',
  'monitoring',
  'quality',
];
