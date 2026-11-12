# Phase 1 answer key (don't open until you've hunted)

## Performance

1. **Clock in global context.** `now` updates every second inside `AppProvider`,
   so every consumer re-renders every second — including Home, which redoes all
   its heavy work. Fix: move the clock into its own leaf component (or its own context).
2. **Context value recreated each render.** `value` is a new object and `addToCart` /
   `toggleTheme` are new functions every render. Fix: split contexts by update frequency,
   `useMemo` the value, `useCallback` the actions (with functional `setState`).
3. **Heavy work in render.** Home runs `cloneDeep` of 5,000 products, then
   `scoreProduct` (7.5M loop iterations) on every render. Fix: `useMemo` keyed on
   `products`, drop the pointless deep clone, ideally get the ranking from the server.
4. **Leaking resize listener.** Navbar's `useEffect` has no deps array and no cleanup,
   so a new listener is added on every render — 60 a minute thanks to item 1.
   Fix: `[]` deps plus `removeEventListener` in cleanup (or CSS media queries, no JS at all).
5. **Stacking intervals.** Home starts a polling interval on mount and never clears it.
   Every visit to Overview adds another one. Fix: return `clearInterval`; better, pause
   when the tab is hidden; better still, use a data-fetching library.
6. **Fetching everything up front.** All 5,000 products (12.8 MB, including long
   descriptions) load at app start regardless of route. Fix: paginate, ask the server
   for summary fields only, and fetch where the data is needed.
7. **No code splitting.** All routes are imported eagerly. Fix: `React.lazy` + `Suspense`.
8. **Bundle bloat.** Full `lodash`, `moment` plus *every* locale, an unused jQuery
   loaded render-blocking from a CDN, and `minify: false`.
   Fix: `lodash-es` or native methods, `Intl.DateTimeFormat`/`date-fns`/`dayjs`,
   delete jQuery, re-enable minification, remove the silenced `chunkSizeWarningLimit`.
9. **Fonts.** Two families at every weight with `display=block` (invisible text while loading).
   Fix: only the weights you use, `display=swap`, preconnect, consider self-hosting.
10. **Images.** 1600×1200 images shown at 88px wide, no `width`/`height` (CLS),
    no `loading="lazy"`. Fix: sized thumbnails, explicit dimensions, lazy loading, `srcset`.
11. **Index keys** on category and product lists.
12. **Console logging every API response** — 12.8 MB objects retained by DevTools.

## Security

1. **Secrets in the bundle.** Anything prefixed `VITE_` is inlined into public JS.
   The payment secret is also sent as a header on every request. Fix: secrets live
   only on the server; the client never sees them. Rotate anything that ever shipped.
2. **Public source maps** (`sourcemap: true`) expose the original source.
   Fix: `'hidden'` and upload them to your error tracker only.
3. **`window.__ENV__`, `window._`, `window.moment`** expose internals and make
   attacks easier (and `window._` is lodash 4.17.15, see below).
4. **Over-fetching sensitive fields.** API returns `costPrice` (supplier margin) and
   `supplierPhone` to the browser. Fix: response DTOs/allow-lists on the server.
5. **Stack traces in API errors.** Fix: generic error message to the client, details to logs.
6. **CORS `*`.** Fix: allow-list of origins.
7. **50 MB JSON body limit** is a cheap denial-of-service. Fix: small default limit.
8. **`X-Powered-By: Express`** header left on. Fix: `app.disable('x-powered-by')` or helmet.
9. **Vulnerable dependencies:** axios 0.21.1, lodash 4.17.15 (prototype pollution),
   moment 2.29.1 (ReDoS), jQuery 1.12.4 (XSS CVEs). `npm audit` finds the npm ones,
   but not the CDN script — that's why you also need to check `index.html`.
10. **CDN script without SRI** (`integrity` attribute). If the CDN is compromised,
    so is your app.
11. **StrictMode removed** to "fix" double effects — it was revealing the missing
    cleanups, not causing a bug.
