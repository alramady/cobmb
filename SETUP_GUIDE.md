# CoBnB KSA — Complete Setup & Migration Guide

This guide walks you through setting up the CoBnB KSA project on a **new Manus account** from scratch. It covers project initialization, environment configuration, database setup, data import, domain binding, and post-deployment verification.

---

## Prerequisites

Before you begin, ensure you have:

1. A **Manus account** with web project creation access
2. The **cobnb-ksa-handoff.zip** file (this package)
3. Access to the **cobnb.vip** domain DNS settings (if you want to bind the custom domain)

---

## Step 1: Create a New Manus Web Project

Start a new conversation in Manus and ask it to create a web project with the following specifications:

> Create a new web project called "cobnb-ksa" with features: database, server, user authentication. Use the tRPC + Manus Auth + Database template.

Once the project is initialized, you will have a fresh project with a database, Express server, and tRPC setup. The project will be assigned a `*.manus.space` subdomain automatically.

---

## Step 2: Upload and Replace Source Code

After the project is created:

1. Extract the contents of `cobnb-ksa-handoff.zip`
2. Ask Manus to replace all project files with the source code from the ZIP
3. Alternatively, you can upload files manually through the Management UI **Code** panel

The key directories to replace are:

| Directory | Purpose |
|---|---|
| `client/` | Frontend React app (pages, components, hooks, styles) |
| `server/` | Backend Express + tRPC (routers, db helpers, auth) |
| `drizzle/` | Database schema and migration files |
| `shared/` | Shared types and constants |
| `storage/` | S3 storage helpers |
| `seed-data.mjs` | Seeds 3 cities, 70 neighborhoods, 12 properties, 6 blog posts |
| `seed-admin.mjs` | Creates the initial admin account |
| `export-db.mjs` | Database export utility |

**Important:** Do NOT replace the `server/_core/` directory if the new Manus project has a different version of the template. The `_core` files contain Manus platform integration (OAuth, LLM, storage, notifications) that must match the target environment. Instead, only replace the files you authored:

- `server/routers.ts`
- `server/db.ts`
- `server/clientAuth.ts`
- `server/adminAuth.ts`
- `server/storage.ts` (if customized)

---

## Step 3: Install Dependencies

Run the following in the project terminal:

```bash
pnpm install
```

If any packages are missing (they should be in `package.json`), install them explicitly:

```bash
pnpm add express-rate-limit react-helmet-async
```

---

## Step 4: Configure Environment Variables

Use Manus's `webdev_request_secrets` tool or the Management UI **Settings → Secrets** panel to set the following environment variables. The system variables (`DATABASE_URL`, `JWT_SECRET`, `VITE_APP_ID`, etc.) are automatically injected by Manus — you only need to set the custom ones.

### Required Custom Variables

| Variable | Value | Description |
|---|---|---|
| `VITE_APP_TITLE` | `CoBnB KSA - The BNB Expert` | Browser tab title |
| `VITE_APP_LOGO` | `(URL to your logo)` | Site logo URL |

### Admin Seed Variables (for initial setup only)

| Variable | Value | Description |
|---|---|---|
| `ADMIN_USERNAME` | `Hobart` | Initial admin login username |
| `ADMIN_PASSWORD` | `(your secure password)` | Initial admin login password |
| `ADMIN_FULLNAME` | `Khalid Abdullah` | Admin display name |
| `ADMIN_EMAIL` | `hobart@protonmail.com` | Admin email address |
| `ADMIN_MOBILE` | `+966504466528` | Admin mobile number |

### System Variables (auto-injected by Manus)

These are provided automatically when you create a Manus web project with database + server + user features. You do NOT need to set them manually:

| Variable | Description |
|---|---|
| `DATABASE_URL` | MySQL/TiDB connection string |
| `JWT_SECRET` | Session cookie signing secret |
| `VITE_APP_ID` | Manus OAuth application ID |
| `OAUTH_SERVER_URL` | Manus OAuth backend URL |
| `VITE_OAUTH_PORTAL_URL` | Manus login portal URL |
| `OWNER_OPEN_ID` | Project owner's Manus Open ID |
| `OWNER_NAME` | Project owner's display name |
| `BUILT_IN_FORGE_API_URL` | Manus built-in API endpoint (server) |
| `BUILT_IN_FORGE_API_KEY` | Manus built-in API token (server) |
| `VITE_FRONTEND_FORGE_API_URL` | Manus built-in API endpoint (client) |
| `VITE_FRONTEND_FORGE_API_KEY` | Manus built-in API token (client) |

---

## Step 5: Push Database Schema

Run the database migration to create all tables:

```bash
pnpm db:push
```

This will create the following 17 tables:

| Table | Purpose |
|---|---|
| `users` | Manus OAuth users (template default) |
| `cities` | 3 Saudi cities (Riyadh, Jeddah, Madinah) |
| `neighborhoods` | 70 neighborhoods across 3 cities |
| `properties` | Property listings with images, pricing, amenities |
| `bookings` | Guest booking requests |
| `favorites` | Saved/favorited properties |
| `reviews` | Guest reviews and ratings |
| `inquiries` | Contact form submissions and lead management |
| `blog_posts` | Blog/newsroom articles |
| `team_members` | Team member profiles |
| `admin_users` | Local admin accounts (username/password) |
| `client_users` | Guest and owner accounts (email/password) |
| `password_reset_tokens` | Password reset flow tokens |
| `partners` | Partner logos (press, clients, OTAs) |
| `job_postings` | Career job listings |
| `job_applications` | Received job applications |
| `settings` | Site configuration key-value store |

---

## Step 6: Import Data

You have two options for populating the database:

### Option A: Import from SQL Dump (recommended — preserves all existing data)

The `database-dump.sql` file contains all data from the original project, including 3 cities, 70 neighborhoods, 12 properties, 6 blog posts, settings, and user accounts.

```bash
# Import using the MySQL client
mysql -u <user> -p<password> -h <host> -P <port> <database> < database-dump.sql
```

You can find the database connection details in the Management UI **Database** panel (click the settings icon in the bottom-left corner). Remember to enable SSL if required.

### Option B: Seed from scratch (clean start)

```bash
node seed-data.mjs    # Seeds cities, neighborhoods, properties, blog posts
node seed-admin.mjs   # Creates the admin account (requires ADMIN_* env vars)
```

Note: The seed scripts generate fresh data but will NOT include any customizations you made through the admin panel (settings, uploaded images, etc.). Option A is recommended for a complete migration.

---

## Step 7: Restart the Server

After importing data and setting environment variables:

```bash
# Restart via Manus tools or:
pnpm dev
```

Or use the Manus `webdev_restart_server` tool.

---

## Step 8: Verify the Setup

Open the preview URL and check the following:

| Check | URL | Expected Result |
|---|---|---|
| Homepage | `/` | Hero video, stats counter, property cards |
| Admin login | `/admin` | Login form → dashboard with 15 tabs |
| Client login | `/login` | Email/password login form |
| Properties | `/properties` | 12 property listings with images |
| Careers | `/careers` | Job listings page |
| CoBnB+ | `/cobnb-plus` | Premium stays page |
| App Download | `/app-download` | Mobile app page with Coming Soon |
| Sitemap | `/sitemap.xml` | Dynamic XML sitemap |
| WhatsApp | Bottom-right corner | Floating green WhatsApp button |

### Admin Panel Tabs (15 total)

Log in at `/admin` with the credentials from `seed-admin.mjs`:

Dashboard, Cities, Neighborhoods, Properties, Bookings, Inquiries, Reviews, Blog Posts, Partners, Careers, Team Members, Client Users, Admin Users, Media, Settings

---

## Step 9: Domain Configuration (cobnb.vip)

To bind the `cobnb.vip` domain to your new Manus project:

### In Manus Management UI:

1. Open the **Management UI** panel
2. Go to **Settings → Domains**
3. Click **Add Custom Domain**
4. Enter `cobnb.vip` (and optionally `www.cobnb.vip`)
5. Manus will display the required DNS records

### In Your Domain Registrar (DNS Settings):

Add the DNS records that Manus provides. Typically these are:

| Type | Name | Value | TTL |
|---|---|---|---|
| CNAME | `@` or root | `<your-project>.manus.space` | 300 |
| CNAME | `www` | `<your-project>.manus.space` | 300 |

Some registrars don't support CNAME on the root domain. In that case, use an **ALIAS** or **ANAME** record, or use Cloudflare's CNAME flattening feature.

### SSL Certificate

Manus automatically provisions an SSL certificate for custom domains once DNS propagation is complete (usually 5–30 minutes).

---

## Step 10: Publish

1. Create a checkpoint in Manus (or ask Manus to save one)
2. Click the **Publish** button in the Management UI header
3. Your site will be live at both `<project>.manus.space` and `cobnb.vip`

---

## Project Architecture Summary

```
cobnb-ksa/
├── client/                    # React 19 + Tailwind 4 frontend
│   ├── src/
│   │   ├── pages/             # 20 page components
│   │   │   ├── admin/         # 15 modular admin tab files + DataTable
│   │   │   ├── Home.tsx       # Homepage with hero video
│   │   │   ├── CoBnBPlus.tsx  # Premium stays page
│   │   │   ├── Careers.tsx    # Job listings + application form
│   │   │   ├── AppDownload.tsx # Mobile app download page
│   │   │   └── AdminPanel.tsx # Thin shell (120 lines) importing tabs
│   │   ├── components/        # Reusable UI (Navbar, Footer, WhatsApp, SEO, Map)
│   │   ├── contexts/          # Language + Theme providers
│   │   └── hooks/             # useClientAuth, useMobile
│   └── index.html             # SEO meta tags
├── server/
│   ├── routers.ts             # All tRPC procedures (admin + public)
│   ├── db.ts                  # Database query helpers
│   ├── clientAuth.ts          # Client email/password auth
│   ├── adminAuth.ts           # Admin username/password auth
│   └── _core/                 # Manus platform integration (DO NOT EDIT)
├── drizzle/
│   ├── schema.ts              # 17 database tables
│   └── migrations/            # SQL migration files
├── seed-data.mjs              # Seed cities, neighborhoods, properties, blog
├── seed-admin.mjs             # Seed admin account
├── export-db.mjs              # Database export utility
├── database-dump.sql          # Full database dump (for migration)
├── ENV_REFERENCE.md           # Environment variable documentation
├── SETUP_GUIDE.md             # This file
└── todo.md                    # Feature tracking
```

---

## Authentication System

This project uses **100% local authentication** — no Manus OAuth dependency for end users.

| Auth Type | Method | Cookie | Login URL |
|---|---|---|---|
| Admin | Username + password (bcrypt) | `admin_session` | `/admin` |
| Client (Guest/Owner) | Email + password (bcrypt) | `client_session` | `/login` |
| Manus OAuth | Template default (unused by app) | `session` | N/A |

The admin and client auth systems are completely independent. Admin accounts are stored in `admin_users`, client accounts in `client_users`.

---

## Key Credentials

| Account | Username/Email | Default Password | Notes |
|---|---|---|---|
| Admin (root) | `Hobart` | Set via `ADMIN_PASSWORD` env var | Created by `seed-admin.mjs` |

---

## Troubleshooting

**"Reserved words used in router" error:** This was a transient error during development that has been fixed. If it reappears, check `server/routers.ts` for any tRPC router key named `apply`, `bind`, `call`, or `constructor` — these are JavaScript reserved words.

**Images not loading:** Some neighborhood and city images use signed S3 URLs that may expire. Re-upload images through the admin panel if they stop loading.

**Database connection issues:** Ensure `DATABASE_URL` is set correctly and SSL is enabled if required by the database provider. Check the Management UI **Database** panel for connection details.

**Rate limiting:** Login endpoints are rate-limited to 5 attempts per 15 minutes per IP. If locked out during testing, wait 15 minutes or restart the server.

---

## Support

For questions about the Manus platform, visit [https://help.manus.im](https://help.manus.im).

For questions about the CoBnB KSA codebase, refer to the `todo.md` file for a complete feature history and the `ENV_REFERENCE.md` for environment variable documentation.
