# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ConfeMate is an Angular 20.3 application built using the latest standalone component architecture with signals for reactive state management.

## Development Commands

### Start Development Server
```bash
ng serve
# or
npm start
```
Runs on `http://localhost:4200/` with hot reload enabled.

### Build
```bash
ng build                                    # Production build (default)
ng build --configuration development        # Development build
npm run watch                              # Watch mode with development configuration
```
Build artifacts are stored in `dist/`. Production builds have bundle size limits: 500kB warning/1MB error for initial bundles, 4kB warning/8kB error for component styles.

### Testing
```bash
ng test              # Run all unit tests with Karma
npm test            # Same as ng test
```
Tests use Jasmine framework with Karma runner.

### Code Generation
```bash
ng generate component component-name    # Generate new component
ng generate --help                      # See all available schematics
```

## Architecture & Key Patterns

### Standalone Components Architecture
This project uses Angular's modern standalone component architecture (no NgModules). All components should be created as standalone with explicit imports.

### Application Bootstrap
- Entry point: `src/main.ts`
- Root component: `App` in `src/app/app.ts`
- Configuration: `appConfig` in `src/app/app.config.ts` provides:
  - Global error listeners via `provideBrowserGlobalErrorListeners()`
  - Zone change detection with event coalescing
  - Router configuration

### State Management
The application uses Angular signals for reactive state management (see `App.title` signal in `src/app/app.ts:11`). Prefer signals over traditional RxJS subjects for component-local state.

### Routing
Routes are defined in `src/app/app.routes.ts`. Currently empty but configured for lazy loading support.

### TypeScript Configuration
The project enforces strict TypeScript settings:
- `strict: true` with all strict flags enabled
- `noImplicitReturns`, `noFallthroughCasesInSwitch`, `noPropertyAccessFromIndexSignature`
- Angular strict template checking enabled via `strictTemplates: true`

### Code Style
Prettier is configured with:
- Print width: 100 characters
- Single quotes
- Angular parser for HTML files

### Component Naming Convention
- Selector prefix: `app-` (configured in `angular.json:11`)
- Class naming: Use simple names without "Component" suffix (e.g., `App` not `AppComponent`)
- File naming: Use `.ts`, `.html`, `.css` extensions for component files
- this project is for showcase a usage of vertex ai and angular on a tech talk