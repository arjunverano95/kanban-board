# Technical Assessment

## Kanban Board - (4 hours)

### Requirements

#### Core Features

- Render 3 fixed columns with the names:
  - To Do
  - In Progress
  - Done
- Each column should have an ID and a name.
- Tickets:
  - Each ticket belongs to exactly one column at a time.
  - A ticket should include:
    - a name (short title)
    - a description (longer text)
    - when it was created
    - when it was last updated
    - one or more tags (for filtering)

#### Data loading:

- Provide a button to load the initial tickets from a mocked API call.
  - The mocked API should serve data from a local JSON file.
  - For example: GET /api/tickets returns ticket data after a
    short simulated delay.
- Save the current state (tickets, their column assignments, and order) to
  local storage.
- Restore from local storage when the app reloads.

#### Drag & Drop:

- Tickets can be reordered within a column.
- Tickets can be moved between columns.
- Any changes should be saved immediately to local storage.

#### Search & Filter:

- Allow searching tickets by their name.
- Provide a simple filter by tag.

#### Derived Fields:

- Show how old a ticket is, calculated from when it was created.

#### States:

- Handle loading, error, and empty states gracefully.

### "Twist" Feature

Add one extra feature of your choice that improves the board.
Examples:

- A limit on how many tickets can be in a column at once
- Inline editing of ticket titles
- A dark mode toggle
- Marking tickets as high priority
  Keep it simple but useful.

### Technical Requirements

- Use React.js with Next.js (latest version).
- Write in TypeScript.
- Style with Tailwind CSS (Mantine or Headless UI are also allowed).
- Follow CSS best practices (clean, reusable classes, consistent spacing,
  accessibility in mind).
  - The board does not need to look visually impressive, focus on clarity,
    structure, and responsiveness.
- Use either React Query or Zustand for state management.
- Use local storage to persist data.
- Use a mocked API call (via Next.js API route or mocked fetch) to load the initial
  JSON tickets.
- Make the board mobile-friendly.

The app should run with:

```bash
npm install
npm run dev
```

### Testing

- Add unit tests for core logic (e.g. ticket movement, state persistence, search and
  filter).
- Use your preferred testing framework (e.g. Jest, React Testing Library, or Vitest).

### Deliverables

- A GitHub repo link with all the code.
- A README.md file that explains:
  - How to run the project
  - Your approach and key technical decisions
  - Why you chose your state management option
  - A short note on your "twist" feature
  - How to run the tests

### Time Expectation:

This task should take around 4 hours. We’re looking for something functional, clean, and well thought out, not perfection.
