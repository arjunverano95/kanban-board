# Kanban Board

A modern, responsive kanban board application built with Next.js 15, TypeScript, and Tailwind CSS. This project demonstrates a clean implementation of drag-and-drop functionality, state persistence, and responsive design with a priority management system.

## Features

### Core Features

- **Three Fixed Columns**: To Do, In Progress, and Done
- **Ticket Management**: Each ticket includes name, description, creation date, update date, tags, and priority level
- **Drag & Drop**: Move tickets between columns and reorder within columns using @dnd-kit
- **Search & Filter**: Search tickets by name/description and filter by tags and priority
- **Derived Fields**: Display ticket age calculated from creation date
- **State Persistence**: Save and restore board state from local storage using Zustand persist middleware

### Additional Features

- **Priority System**: Three priority levels (High 🔥, Medium ⚡, Low 🌱) with visual indicators
- **Responsive Design**: Mobile-friendly layout that works on all screen sizes
- **Loading States**: Graceful handling of loading, error, and empty states
- **Tag System**: Comprehensive tagging system with multi-select filtering
- **Modern UI**: Clean, accessible interface built with Tailwind CSS
- **Real-time Updates**: Immediate state updates with automatic local storage persistence

## Technical Stack

- **Framework**: Next.js 15 with App Router and Turbopack
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **Drag & Drop**: @dnd-kit/core and @dnd-kit/sortable
- **Date Handling**: dayjs for lightweight date manipulation
- **State Management**: Zustand with persist middleware for local storage

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd kanban-board
```

2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── components/          # React components
│   ├── Column.tsx      # Individual column component
│   ├── KanbanBoard.tsx # Main board component with drag & drop
│   ├── SearchAndFilter.tsx # Search, tag, and priority filtering
│   └── Ticket.tsx      # Individual ticket component with priority management
├── constants/           # Application constants
│   ├── status.ts       # Column status definitions
│   └── priority.ts     # Priority level configurations
├── data/               # Mock data and static content
│   └── mockTickets.ts  # Sample ticket data with priorities
├── services/           # API services
│   └── api.ts          # Mock API for fetching tickets
├── store/              # State management
│   └── useTicketStore.ts # Zustand store with persistence
├── types/              # TypeScript type definitions
│   └── ticket.ts       # Ticket and related interfaces
└── utils/              # Utility functions
    └── dateUtils.ts    # Date formatting and age calculations

app/
└── api/
    └── tickets/        # Next.js API route for mock data
```

## Key Technical Decisions

### State Management

I chose **Zustand** over other state management solutions because:

- **Simplicity**: Minimal boilerplate compared to Redux or Context API
- **Performance**: Excellent performance with automatic component optimization
- **Persistence**: Built-in persist middleware for seamless local storage integration
- **TypeScript**: First-class TypeScript support with excellent type inference
- **Bundle Size**: Lightweight with tree-shaking support

The store handles all ticket operations, search/filter state, and automatically persists changes to localStorage.

### Drag & Drop Library

**@dnd-kit** was selected because:

- **Modern**: Built specifically for React 18+ with concurrent features
- **Accessibility**: Built-in ARIA support and keyboard navigation
- **Performance**: Efficient rendering with minimal re-renders
- **Flexibility**: Modular architecture for custom drag behaviors
- **TypeScript**: Excellent type safety and developer experience

### Priority System as "Twist" Feature

The application includes a comprehensive **priority management system** that enhances the basic requirements:

- **Three Priority Levels**: High (🔥), Medium (⚡), Low (🌱) with distinct visual styling
- **Priority Filtering**: Filter tickets by priority level in addition to tags
- **Visual Indicators**: Color-coded priority badges with icons
- **Inline Editing**: Click to change ticket priority directly from the ticket card
- **Persistent Storage**: Priority changes are automatically saved to local storage

This feature improves task organization and helps users quickly identify and manage high-priority items.

### Date Handling

**dayjs** was chosen over alternatives because:

- **Lightweight**: Minimal bundle size impact
- **Tree-shaking**: Only imports used functionality
- **Familiar API**: Similar to moment.js for easy adoption
- **TypeScript**: Good type definitions and support

## Testing

The project is set up for comprehensive testing with Jest and React Testing Library. To run tests:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

### Test Coverage

The application achieves **94.28% statement coverage** with tests covering:

- Component rendering and interactions
- State management operations
- Utility functions
- API service functions
- Type definitions and constants

## API Integration

The application includes a mock API implementation:

- **Endpoint**: `GET /api/tickets`
- **Features**: Simulated delay, search/filter support, error handling
- **Data Source**: Local JSON file with realistic ticket data
- **Response Format**: JSON with proper date serialization

## Future Enhancements

- Real backend API integration
- User authentication and multi-user support
- Real-time collaboration features
- Advanced analytics and reporting
- Custom column configurations
- Ticket assignment and due dates
- Email notifications and reminders
- Bulk operations and batch editing

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## License

This project is licensed under the MIT License.
