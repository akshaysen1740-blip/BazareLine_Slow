# Bazaarline Seller Hub (deliberately broken)

A seller dashboard for an Indian handicrafts marketplace, written badly on purpose.
Every performance and security problem in here is one that shows up in real production
React codebases. Your job is to find them with tools, fix them, and measure the difference.

Nothing here is safe to deploy. All keys in `.env` are fake.

## Run it

    npm install
    npm run dev          # web on :5173, API on :4000
    npm run build        # production bundle in dist/
    npx vite preview     # serve the production build

## Roadmap

| Phase | Area added | Main lessons |
|---|---|---|
| 1 | App shell, context, build config | Bundle size, re-render storms, memory leaks, secrets in bundles |
| 2 | Product catalogue (5,000 rows) | Virtualization, memoization, debouncing, race conditions, CLS |
| 3 | Analytics with charts | Code splitting, heavy libraries, Web Workers, layout thrashing |
| 4 | Sign-in and orders | Token storage, client-only authorization, IDOR, open redirects |
| 5 | Reviews and profile | XSS, `javascript:` URLs, `eval`, prototype pollution, postMessage |
| 6 | Production hardening | CSP, SRI, security headers, `npm audit`, error boundaries |

After Phase 6 we turn what you fixed into a scenario-based interview question bank.

## Phase 1: measure before you touch anything

Rule for every phase: record a baseline first, fix second, re-measure third.
An optimization you can't show numbers for doesn't count in an interview either.

Record these in a `NOTES.md` before changing any code:

1. **Bundle.** Run `npm run build` and note the JS size (raw and gzip).
   Then run `npx vite-bundle-visualizer` and see what's taking the space.
2. **React Profiler.** Install React DevTools, open Profiler, turn on
   "Highlight updates when components render" and "Record why each component rendered".
   Record 10 seconds sitting idle on Overview. How many commits? What triggered them?
   How long is each commit?
3. **Performance tab.** Record 10 idle seconds. Look for long tasks (red corners)
   and what's inside them.
4. **Memory.** Take a heap snapshot, wait 60 seconds, take another, compare.
   In the console, run `getEventListeners(window)` twice, a minute apart.
5. **Network.** Stay on Overview for 30 seconds. Switch to Products and back three times,
   then watch the request rate. Check the size of the `/api/products` response.
6. **Lighthouse.** Run it against `vite preview`, not the dev server. Note LCP, TBT, CLS.
7. **Security sweep.** Open `dist/assets/*.js` and search for things that shouldn't be there.
   Check what's exposed on `window`. Request `/api/products/99999` directly.
   Run `npm audit`.

Try to find everything yourself first. When you're stuck or done,
compare with `SPOILERS-phase1.md`.
