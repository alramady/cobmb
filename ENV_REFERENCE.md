# CoBnB KSA - Environment Variables Reference

Copy these variables into your `.env` file and fill in the values.
**NEVER commit `.env` to version control.**

## Required Variables

| Variable | Description | Example |
|---|---|---|
| `DATABASE_URL` | MySQL/TiDB connection string | `mysql://user:pass@host:port/dbname` |
| `JWT_SECRET` | Secret key for signing session cookies (min 32 chars) | `your-random-secret-key-here` |

## Manus OAuth (optional)

| Variable | Description | Example |
|---|---|---|
| `VITE_APP_ID` | Manus OAuth application ID | `app-id` |
| `OAUTH_SERVER_URL` | Manus OAuth backend base URL | `https://api.manus.im` |
| `VITE_OAUTH_PORTAL_URL` | Manus login portal URL (frontend) | `https://login.manus.im` |

## Owner Info

| Variable | Description | Example |
|---|---|---|
| `OWNER_OPEN_ID` | Owner's Manus Open ID | `owner-open-id` |
| `OWNER_NAME` | Owner's display name | `Khalid Abdullah` |

## Manus Built-in APIs

| Variable | Description | Example |
|---|---|---|
| `BUILT_IN_FORGE_API_URL` | Server-side Manus API endpoint | `https://api.manus.im` |
| `BUILT_IN_FORGE_API_KEY` | Server-side Manus API bearer token | `key-xxx` |
| `VITE_FRONTEND_FORGE_API_URL` | Client-side Manus API endpoint | `https://api.manus.im` |
| `VITE_FRONTEND_FORGE_API_KEY` | Client-side Manus API bearer token | `key-xxx` |

## Admin Seed Account

| Variable | Description | Example |
|---|---|---|
| `ADMIN_USERNAME` | Initial admin username (used by seed-admin.mjs) | `admin` |
| `ADMIN_PASSWORD` | Initial admin password (used by seed-admin.mjs, min 8 chars) | `SecurePass123!` |
| `ADMIN_FULLNAME` | Initial admin display name | `Khalid Abdullah` |
| `ADMIN_EMAIL` | Initial admin email | `admin@cobnb.vip` |
| `ADMIN_MOBILE` | Initial admin mobile number | `+966504466528` |

## App Branding

| Variable | Description | Example |
|---|---|---|
| `VITE_APP_TITLE` | Website title shown in browser tab | `CoBnB KSA - The BNB Expert` |
| `VITE_APP_LOGO` | URL to the site logo image | `https://cdn.example.com/logo.png` |

## Analytics (optional)

| Variable | Description | Example |
|---|---|---|
| `VITE_ANALYTICS_ENDPOINT` | Analytics service endpoint | `https://analytics.example.com` |
| `VITE_ANALYTICS_WEBSITE_ID` | Analytics website identifier | `website-id` |
