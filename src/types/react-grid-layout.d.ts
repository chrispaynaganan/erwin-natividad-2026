// react-grid-layout ships plain (non-module) CSS files that TypeScript's
// module resolution can't find type declarations for when imported directly
// (e.g. `import 'react-grid-layout/css/styles.css'`). This is a types-only
// problem — webpack/Next.js already knows how to load these at build time —
// so a bare ambient declaration is all that's needed to satisfy the checker.
declare module 'react-grid-layout/css/styles.css'
declare module 'react-resizable/css/styles.css'