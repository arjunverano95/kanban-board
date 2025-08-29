# Kanban Board

A modern, responsive kanban board application built with Next.js, TypeScript, and Tailwind CSS. This project demonstrates a clean implementation of drag-and-drop functionality, state persistence, and responsive design.

## Features

### Core Features

- **Three Fixed Columns**: To Do, In Progress, and Done
- **Ticket Management**: Each ticket includes name, description, creation date, update date, and tags
- **Drag & Drop**: Move tickets between columns and reorder within columns
- **Search & Filter**: Search tickets by name/description and filter by tags
- **Derived Fields**: Display ticket age calculated from creation date
- **State Persistence**: Save and restore board state from local storage

### Additional Features

- **Responsive Design**: Mobile-friendly layout that works on all screen sizes
- **Loading States**: Graceful handling of loading, error, and empty states
- **Tag System**: Comprehensive tagging system for better organization
- **Modern UI**: Clean, accessible interface built with Tailwind CSS

## Technical Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Drag & Drop**: @dnd-kit (modern, accessible drag and drop library)
- **Date Handling**: dayjs for lightweight date manipulation
- **State Management**: React hooks with local storage persistence

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
│   ├── KanbanBoard.tsx # Main board component
│   ├── SearchAndFilter.tsx # Search and filtering UI
│   └── Ticket.tsx      # Individual ticket component
├── constants/           # Application constants
│   └── status.ts       # Column status definitions
├── data/               # Mock data and static content
│   └── mockTickets.ts  # Sample ticket data
├── types/              # TypeScript type definitions
│   └── ticket.ts       # Ticket and related interfaces
└── utils/              # Utility functions
    └── dateUtils.ts    # Date formatting and calculations
```

## Key Technical Decisions

### State Management

I chose React hooks with local storage over external state management libraries because:

- The application state is relatively simple and doesn't require complex state synchronization
- Local storage provides immediate persistence without additional dependencies
- React hooks offer excellent performance and developer experience for this use case

### Drag & Drop Library

@dnd-kit was selected because:

- It's the most modern and accessible drag & drop library for React
- Excellent TypeScript support and performance
- Built-in accessibility features
- Active maintenance and community support

### Date Handling

dayjs was chosen over alternatives because:

- Lightweight alternative to moment.js
- Excellent tree-shaking support
- Familiar API for developers
- Good TypeScript support

### "Twist" Feature

The application includes several enhancements beyond the basic requirements:

- **Comprehensive Tag System**: Advanced filtering and tag management
- **Responsive Design**: Mobile-first approach with excellent cross-device support
- **Enhanced Search**: Search across both ticket names and descriptions
- **Visual Feedback**: Hover effects, loading states, and smooth transitions

## Testing

The project is set up for testing with Jest and React Testing Library. To run tests:

```bash
npm test
```

## Future Enhancements

- API integration for real backend data
- User authentication and multi-user support
- Real-time collaboration features
- Advanced analytics and reporting
- Custom column configurations
- Ticket assignment and due dates
- Email notifications and reminders

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## License

This project is licensed under the MIT License.
