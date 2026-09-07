# Task Manager – React + TypeScript CRUD Demo

A task management application built with React and TypeScript that demonstrates modern frontend development practices, including typed forms, data fetching, validation, testing, and clean project architecture.

The application allows users to create, update, complete, filter, and delete tasks through a simple and responsive interface.

Task data is stored locally using `localStorage`, allowing the project to run without a backend while still following patterns that can easily be extended to a real API.

## Tech Stack

| Tool                               | Purpose                                                         |
| ---------------------------------- | --------------------------------------------------------------- |
| **React 19 + TypeScript**          | Component-based UI development with strict typing.              |
| **Vite**                           | Fast development server and build tooling.                      |
| **TanStack Query v5**              | Data fetching, caching, mutations, and server-state management. |
| **React Hook Form + Zod**          | Form handling and schema-based validation.                      |
| **Vitest + React Testing Library** | Unit, component, and integration testing.                       |
| **ESLint + Prettier**              | Code quality, consistency, and formatting.                      |

## Features

* Create new tasks
* Edit existing tasks
* Mark tasks as completed or active
* Delete tasks with confirmation
* Filter tasks by status
* Form validation using Zod
* Optimistic updates for task status changes
* Local persistence using browser storage
* Automated test coverage

## Getting Started

### Requirements

* Node.js `20.19+` or `22.12+`

### Installation

```bash
npm install
npm run dev
```

This starts the development server and provides a local URL for accessing the application.

### Available Scripts

| Command                | Description                             |
| ---------------------- | --------------------------------------- |
| `npm run dev`          | Start development server                |
| `npm run build`        | Type check and create production build  |
| `npm run preview`      | Preview production build locally        |
| `npm test`             | Run tests once                          |
| `npm run test:watch`   | Run tests in watch mode                 |
| `npm run lint`         | Run ESLint                              |
| `npm run typecheck`    | Run TypeScript type checking            |
| `npm run format`       | Format code using Prettier              |
| `npm run format:check` | Check formatting without making changes |

### Local Storage

Tasks are stored in the browser under:

```text
react-ts-crud-demo:tasks
```

The application seeds sample data on first launch. Removing this key from browser storage will reset the application.

## Project Structure

```text
src/
├── api/
│   ├── taskService.ts
│   └── queryClient.ts
├── hooks/
│   └── useTasks.ts
├── schemas/
│   └── taskSchema.ts
├── types/
│   └── task.ts
├── components/
│   ├── ConfirmDialog.tsx
│   ├── FilterTabs.tsx
│   ├── TaskForm.tsx
│   ├── TaskItem.tsx
│   └── TaskList.tsx
├── App.tsx
└── main.tsx
```

Tests are located alongside the components and modules they cover, making it easy to identify test coverage and maintain related code together.

## Architecture Decisions

### Service Layer Separation

The application uses a dedicated service layer (`taskService.ts`) rather than placing data-access logic directly inside components.

This keeps components focused on presentation and makes it straightforward to replace the local storage implementation with a REST or GraphQL API in future.

### TanStack Query for Data Management

TanStack Query manages server-state concerns such as:

* Caching
* Loading states
* Error handling
* Mutations
* Cache invalidation

This provides a scalable pattern commonly used in production React applications.

### Schema-Driven Validation

Validation rules are defined using Zod and TypeScript types are inferred directly from the schema.

This ensures validation logic and type definitions remain aligned and reduces duplication.

### Optimistic Updates

Task status changes use optimistic updates to provide immediate UI feedback while maintaining rollback capability if an operation fails.

### Minimal State Management

The project intentionally avoids a global state library because the current scope does not require one. Local component state remains simple, predictable, and easy to maintain.

### Lightweight Styling Approach

The interface uses custom CSS and design tokens rather than a UI framework. This keeps dependencies minimal while still providing a clean and consistent user experience.

## Testing

The project includes automated testing at multiple levels:

### Unit Tests

* Validation schemas
* Utility logic

### Component Tests

* Form behaviour
* User interactions
* Validation messages

### Integration Tests

* End-to-end task creation flow
* Component interaction with the data layer

Testing is implemented using:

* Vitest
* React Testing Library

## Future Improvements

Potential enhancements include:

* Backend API integration
* User authentication and authorisation
* Pagination and advanced filtering
* Additional optimistic updates
* Route-based navigation with React Router
* CI/CD pipelines using GitHub Actions
* Expanded accessibility testing
* End-to-end testing with Playwright or Cypress
