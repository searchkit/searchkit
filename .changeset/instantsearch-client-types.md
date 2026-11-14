---
'@searchkit/instantsearch-client': minor
---

`createClient` is now typed with InstantSearch's own `SearchClient` type (exported as `SearchkitInstantSearchClient`, which also includes `clearCache`) instead of `any`. TypeScript projects get the client checked against what InstantSearch expects, and `instantsearch.js` is declared as an optional peer dependency because the published types import it.

Code that relied on the client being `any` may now see type errors, for example when passing it to a library that expects a different client type. Cast to that library's type, or `as any`, to keep the previous behaviour.
