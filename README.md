# ConfeMate

An AI-powered conference session recommendation assistant built with Angular 20.3 and Vertex AI. ConfeMate helps attendees discover the perfect sessions based on their interests, experience level, and schedule preferences.

## Features

- Real-time chat interface with Vertex AI-powered recommendations
- Signal-based reactive state management
- Session recommendations with detailed information
- Responsive design
- Auto-scrolling chat history

## Prerequisites

- Node.js (v18 or higher)
- Angular CLI 20.3.5
- Google Cloud account with Vertex AI enabled

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables for the backend server (see `server/.env.example`)

## Running the Application

### Start Backend Server

First, start the Express backend server:

```bash
npm run server:dev
```

The backend server will run on `http://localhost:3000`.

### Start Frontend Development Server

In a separate terminal, start the Angular development server:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

The frontend is configured with a proxy that routes `/api/*` requests to the backend server.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
