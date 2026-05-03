# Quran Companion

Production-ready Next.js Quran reader using Quran Foundation Content API with offline-friendly caching.

## Core Client Stack

- Axios for HTTP requests
- TanStack Query for client-side data fetching/cache

## Setup

1. Install dependencies:
   npm install
2. Configure env:
   copy `.env.example` to `.env.local` and set `QF_CLIENT_ID`, `QF_CLIENT_SECRET`.
   PowerShell example:
   `Copy-Item .env.example .env.local`
3. Run dev server:
   npm run dev

## Environment

- `QF_ENV=prelive` uses:
  - Auth: `https://prelive-oauth2.quran.foundation`
  - API: `https://apis-prelive.quran.foundation`
- `QF_ENV=production` uses:
  - Auth: `https://oauth2.quran.foundation`
  - API: `https://apis.quran.foundation`

## Security

Quran Foundation OAuth credentials are used only in server routes (`src/lib/quran-foundation/*`). They are never exposed to the client bundle.

## Data Sources

- Quran Foundation / Quran.com Content API (primary)
- Al Furqan API (fallback reciters/audio URL)
- QuranEnc API (fallback translation structure)

## Islamic Content Handling

- `<meta name="google" content="notranslate">` is enabled via metadata.
- Arabic and official translation containers use `translate="no"`.
- Arabic text is preserved exactly from provider response.
- Translation/Tafsir HTML is sanitized before rendering.

## MVP Limitations

- Search currently runs on local IndexedDB cache; server search route is placeholder.
- Audio offline download is marked as a future enhancement.
- Translation/resource IDs should be selected from API resources, not guessed.

## UI Shell Mode

- The current reader shell can run entirely on mock data for UI review.
- Mock source: `src/lib/mock/quran.ts`
- Data-source adapter scaffold: `src/lib/data-source.ts`
- Next step: wire `qfDataSource` in `src/lib/data-source.ts` to real API routes.
# quran-web
