# Simple Bar - Agent Guidelines

## Build/Lint/Test Commands
- Lint: `npm run lint` (ESLint for JS/JSX files)
- No test framework configured
- No build command - this is an Übersicht widget

## Code Style
- **Language**: JavaScript (ES2021) with JSX for React components
- **Imports**: Use named imports with `* as ModuleName` pattern for modules
- **Components**: Functional components with React hooks, use `React.memo()` for optimization
- **Files**: Use `.jsx` extension for components, `.js` for utilities
- **Naming**: camelCase variables/functions, PascalCase components, kebab-case CSS classes
- **Comments**: JSDoc format for function documentation, avoid inline comments unless necessary
- **Error Handling**: Use try-catch with console.error, return null/undefined for graceful failures
- **State**: Use React hooks (useState, useCallback, useMemo) for component state
- **Props**: Destructure props, use defaultProps or default parameters
- **Styling**: CSS-in-JS strings exported as `styles`, inject via `Utils.injectStyles()`
- **Constants**: UPPER_SNAKE_CASE for module-level constants

## ESLint Rules
- React prop-types disabled, React in JSX scope disabled
- Warn on console usage, strict hook rules
- Allow unescaped entities in JSX

## File Structure
- Components in `lib/components/`
- Utilities in `lib/utils.js`
- Styles in `lib/styles/`