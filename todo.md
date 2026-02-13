# CoBnB KSA — Project TODO

## Architecture & Setup
- [x] React 19 + Tailwind 4 + Express 4 + tRPC 11 stack
- [x] Bilingual (Arabic/English) with RTL support via LanguageContext
- [x] 17-table Drizzle ORM schema with MySQL/TiDB
- [x] Custom admin auth (bcryptjs + JWT) — no OAuth dependency for admin
- [x] Custom client auth (bcryptjs + JWT) with registration/login/logout
- [x] Password reset flow with secure token generation and owner notification
- [x] Rate limiting on login and forgot-password endpoints (express-rate-limit)
- [x] S3 file storage for image uploads (admin + client avatars)
- [x] SEO with react-helmet-async (per-page meta tags)
- [x] Environment variables configured (VITE_APP_TITLE, ADMIN_*, etc.)
- [x] Database schema pushed with all 17 tables
- [x] Database seeded with production data (3 cities, 70 neighborhoods, 12 properties, 6 blog posts)

## Public Pages (20+ pages)
- [x] Homepage with hero video, featured properties, city cards, stats, partner logos
- [x] About page (company story, mission, vision, team)
- [x] Services page (5 service cards with details)
- [x] Properties listing with search, city/bedroom filters
- [x] Property detail page with image gallery, amenities, booking form, reviews
- [x] City pages (Riyadh, Jeddah, Madinah) with neighborhood listings
- [x] Neighborhood detail pages
- [x] Blog listing with category filter
- [x] Blog post detail page
- [x] Contact page with form and map
- [x] Owners page (property owner onboarding)
- [x] CoBnB+ luxury tier page
- [x] App download page (iOS/Android coming soon)
- [x] Careers page with job listings and application form
- [x] Privacy policy page
- [x] Terms and conditions page
- [x] Client login page
- [x] Client registration page (guest/owner roles)
- [x] Client account/profile page
- [x] Password reset page
- [x] 404 Not Found page

## Admin Panel (15 tabs)
- [x] Admin login with bcryptjs authentication
- [x] Dashboard with KPIs (properties, bookings, revenue, occupancy)
- [x] Properties management (CRUD, image upload, featured toggle)
- [x] Cities management (CRUD with hero images)
- [x] Neighborhoods management (CRUD linked to cities)
- [x] Bookings management (status tracking, guest details)
- [x] Reviews management (approve/reject moderation)
- [x] Inquiries/Leads management (status pipeline)
- [x] Blog management (CRUD with rich content, SEO fields)
- [x] Team members management
- [x] Client users management (view/deactivate)
- [x] Admin users management
- [x] Partners management
- [x] Careers management (job postings + applications)
- [x] Settings management (hero video, WhatsApp, social links)

## API & Backend
- [x] tRPC router with public + admin procedures
- [x] Express routes for admin auth (login/logout/me)
- [x] Express routes for client auth (register/login/logout/me/profile/password)
- [x] Express routes for forgot-password and reset-password
- [x] Express routes for image uploads (admin + client avatar)
- [x] Express routes for public careers API
- [x] XML sitemap at /sitemap.xml (dynamic with cities, neighborhoods, properties, blog posts)
- [x] Robots.txt at /robots.txt
- [x] Admin dashboard stats endpoint
- [x] Recent activity endpoint

## SEO & Technical
- [x] Dynamic XML sitemap with all routes
- [x] Robots.txt with proper disallow rules
- [x] Per-page meta tags via react-helmet-async
- [x] WhatsApp floating button (configurable via settings)
- [x] Google Fonts (Tajawal for Arabic, Inter for English)
- [x] Responsive design (mobile-first)
- [x] Distribution partner logos (Airbnb, Booking.com, Agoda)

## Testing
- [x] auth.logout.test.ts — session cookie clearing
- [x] cobnb.test.ts — 19 tests (public + admin routes)
- [x] audit.test.ts — 28 tests (all admin CRUD routes)
- [x] passwordReset.test.ts — password reset flow tests
- [x] All 69 tests passing

## Pending / Future
- [ ] Domain binding (cobnb.vip)
- [ ] Email sending for password reset (currently logs to console + notifies owner)
- [ ] Client booking flow (payment integration)
- [ ] Client favorites functionality
- [ ] Push notifications
- [ ] Mobile app (iOS/Android)

## Audit
- [x] Comprehensive website audit (UI/UX, functionality, SEO, accessibility, performance, code quality)

## Export & GitHub
- [x] Export project as ZIP file
- [x] Push latest code to GitHub (alramady/cobmb)

## Khalid's Fixes Integration (Round 2)
- [x] Merge Navbar.tsx — add CoBnB+ link
- [x] Merge Home.tsx — dynamic partners sections (press, client, OTA)
- [x] Merge BlogTab.tsx — RichTextEditor for blog content
- [x] Add new RichTextEditor.tsx component
- [x] Install TipTap packages
- [x] Add SEO component to 12 missing pages (About, Services, Properties, PropertyDetail, Blog, BlogPost, Contact, CityPage, NeighborhoodPage, ForOwners, Terms, Privacy)
- [x] Download and upload official CoBnB logos to S3
- [x] Update CoBnBLogo.tsx to use official logo image
- [x] Update Footer.tsx to use footer logo with tagline
- [x] Test all changes compile and run correctly
- [x] Export final ZIP and update GitHub

## CoBnB+ Page Redesign
- [x] Redesign CoBnB+ page to match Malaysia reference (dark luxury theme)
- [x] Hero section with luxury interior image carousel
- [x] L'OCCITANE premium amenities partner section
- [x] "What is CoBnB+?" explanation section
- [x] 4 differentiator cards (Designer-Furnished, Luxury Comfort, Curated Support, Elevated Amenities)
- [x] KSA property listings section (from database)
- [x] Bilingual Arabic/English support maintained

## Property Photos Update
- [x] Identify all properties and their current image status
- [x] Download high-quality real property photos for each listing
- [x] Upload photos to S3 and update database image URLs
- [x] Verify CoBnB+ page displays real photos
- [x] Export ZIP and update GitHub
