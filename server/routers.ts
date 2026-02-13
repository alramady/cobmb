import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import * as db from "./db";
import { verifyAdminSession, parseCookies, ADMIN_COOKIE_NAME } from "./adminAuth";
import { hashPassword } from "./adminAuth";

// Admin-only middleware — local admin session only (no OAuth)
const adminProcedure = publicProcedure.use(async ({ ctx, next }) => {
  const cookies = parseCookies(ctx.req.headers.cookie);
  const adminCookie = cookies.get(ADMIN_COOKIE_NAME);
  const adminSession = await verifyAdminSession(adminCookie);
  if (adminSession) {
    const admin = await db.getAdminById(adminSession.adminId);
    if (admin && admin.isActive) {
      return next({ ctx: { ...ctx, adminUser: admin, user: ctx.user } });
    }
  }
  throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
});

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
    updateProfile: protectedProcedure.input(z.object({
      name: z.string().optional(),
      phone: z.string().optional(),
      bio: z.string().optional(),
      company: z.string().optional(),
      preferredLanguage: z.string().optional(),
    })).mutation(async ({ ctx, input }) => {
      await db.upsertUser({ openId: ctx.user.openId, ...input });
      return { success: true };
    }),
  }),

  // ─── Public Routes ─────────────────────────────────────────────────
  cities: router({
    list: publicProcedure.query(() => db.getAllCities()),
    getBySlug: publicProcedure.input(z.object({ slug: z.string() })).query(({ input }) => db.getCityBySlug(input.slug)),
  }),

  neighborhoods: router({
    byCity: publicProcedure.input(z.object({ cityId: z.number() })).query(({ input }) => db.getNeighborhoodsByCity(input.cityId)),
    getBySlug: publicProcedure.input(z.object({ citySlug: z.string(), slug: z.string() })).query(({ input }) => db.getNeighborhoodBySlug(input.citySlug, input.slug)),
    all: publicProcedure.query(() => db.getAllNeighborhoods()),
  }),

  properties: router({
    list: publicProcedure.input(z.object({
      cityId: z.number().optional(),
      neighborhoodId: z.number().optional(),
      bedrooms: z.number().optional(),
      minPrice: z.number().optional(),
      maxPrice: z.number().optional(),
      featured: z.boolean().optional(),
    }).optional()).query(({ input }) => db.getActiveProperties(input || {})),
    getById: publicProcedure.input(z.object({ id: z.number() })).query(({ input }) => db.getPropertyById(input.id)),
    featured: publicProcedure.query(() => db.getActiveProperties({ featured: true })),
  }),

  blog: router({
    published: publicProcedure.input(z.object({ category: z.string().optional() }).optional()).query(({ input }) => db.getPublishedPosts(input?.category)),
    getBySlug: publicProcedure.input(z.object({ slug: z.string() })).query(({ input }) => db.getPostBySlug(input.slug)),
  }),

  reviews: router({
    byProperty: publicProcedure.input(z.object({ propertyId: z.number() })).query(({ input }) => db.getReviewsByProperty(input.propertyId)),
  }),

  team: router({
    list: publicProcedure.query(() => db.getActiveTeamMembers()),
  }),

  partners: router({
    byCategory: publicProcedure.input(z.object({ category: z.string().optional() }).optional()).query(({ input }) => db.getActivePartnersByCategory(input?.category)),
  }),

  jobs: router({
    open: publicProcedure.query(() => db.getOpenJobPostings()),
    getById: publicProcedure.input(z.object({ id: z.number() })).query(({ input }) => db.getJobPostingById(input.id)),
    submit: publicProcedure.input(z.object({
      jobId: z.number(),
      firstName: z.string().min(1),
      lastName: z.string().min(1),
      email: z.string().email(),
      phone: z.string().optional(),
      linkedinUrl: z.string().optional(),
      resumeUrl: z.string().optional(),
      coverLetter: z.string().optional(),
    })).mutation(async ({ input }) => {
      await db.createJobApplication(input);
      return { success: true };
    }),
  }),

  inquiries: router({
    create: publicProcedure.input(z.object({
      name: z.string().min(1),
      email: z.string().email().optional(),
      phone: z.string().optional(),
      inquiryType: z.enum(["owner", "guest", "booking", "general", "rental_forecast"]).default("general"),
      city: z.string().optional(),
      neighborhood: z.string().optional(),
      propertyType: z.string().optional(),
      message: z.string().optional(),
      propertyId: z.number().optional(),
    })).mutation(async ({ input }) => {
      await db.createInquiry(input);
      return { success: true };
    }),
  }),

  // ─── Client Account Routes ─────────────────────────────────────────
  account: router({
    bookings: protectedProcedure.query(({ ctx }) => db.getBookingsByGuest(ctx.user.id)),
    createBooking: protectedProcedure.input(z.object({
      propertyId: z.number(),
      checkIn: z.string(),
      checkOut: z.string(),
      guests: z.number().default(1),
      specialRequests: z.string().optional(),
    })).mutation(async ({ ctx, input }) => {
      await db.createBooking({
        guestId: ctx.user.id,
        propertyId: input.propertyId,
        checkIn: new Date(input.checkIn),
        checkOut: new Date(input.checkOut),
        guests: input.guests,
        specialRequests: input.specialRequests,
      });
      return { success: true };
    }),

    favorites: protectedProcedure.query(({ ctx }) => db.getUserFavorites(ctx.user.id)),
    addFavorite: protectedProcedure.input(z.object({ propertyId: z.number() })).mutation(async ({ ctx, input }) => {
      await db.addFavorite(ctx.user.id, input.propertyId);
      return { success: true };
    }),
    removeFavorite: protectedProcedure.input(z.object({ propertyId: z.number() })).mutation(async ({ ctx, input }) => {
      await db.removeFavorite(ctx.user.id, input.propertyId);
      return { success: true };
    }),

    reviews: protectedProcedure.query(({ ctx }) => db.getReviewsByGuest(ctx.user.id)),
    createReview: protectedProcedure.input(z.object({
      propertyId: z.number(),
      bookingId: z.number().optional(),
      rating: z.number().min(1).max(5),
      comment: z.string().optional(),
    })).mutation(async ({ ctx, input }) => {
      await db.createReview({ guestId: ctx.user.id, ...input });
      return { success: true };
    }),

    ownerProperties: protectedProcedure.query(({ ctx }) => db.getPropertiesByOwner(ctx.user.id)),
  }),

  // ─── Admin Routes ──────────────────────────────────────────────────
  admin: router({
    dashboard: adminProcedure.query(() => db.getDashboardStatsExtended()),
    recentActivity: adminProcedure.query(async () => {
      const [recentInquiries, recentBookings, recentClients] = await Promise.all([
        db.getRecentInquiries(5),
        db.getRecentBookings(5),
        db.getRecentClientUsers(5),
      ]);
      return { recentInquiries, recentBookings, recentClients };
    }),

    users: router({
      list: adminProcedure.query(() => db.getAllUsers()),
      updateRole: adminProcedure.input(z.object({ id: z.number(), role: z.enum(["user", "admin", "owner", "guest"]) })).mutation(({ input }) => db.updateUserRole(input.id, input.role)),
    }),

    cities: router({
      list: adminProcedure.query(() => db.getAllCities()),
      create: adminProcedure.input(z.object({
        nameEn: z.string(), nameAr: z.string(), slug: z.string(),
        descriptionEn: z.string().optional(), descriptionAr: z.string().optional(),
        heroImage: z.string().optional(), latitude: z.string().optional(), longitude: z.string().optional(),
      })).mutation(({ input }) => db.createCity(input)),
      update: adminProcedure.input(z.object({
        id: z.number(), nameEn: z.string().optional(), nameAr: z.string().optional(),
        descriptionEn: z.string().optional(), descriptionAr: z.string().optional(),
        heroImage: z.string().optional(), isActive: z.boolean().optional(),
        displayOrder: z.number().optional(),
      })).mutation(({ input }) => { const { id, ...data } = input; return db.updateCity(id, data); }),
    }),

    neighborhoods: router({
      list: adminProcedure.query(() => db.getAllNeighborhoods()),
      create: adminProcedure.input(z.object({
        cityId: z.number(), nameEn: z.string(), nameAr: z.string(), slug: z.string(),
        zone: z.string().optional(), profileEn: z.string().optional(), profileAr: z.string().optional(),
        descriptionEn: z.string().optional(), descriptionAr: z.string().optional(),
        heroImage: z.string().optional(), latitude: z.string().optional(), longitude: z.string().optional(),
        avgAdrPeak: z.string().optional(), avgAdrHigh: z.string().optional(), avgAdrLow: z.string().optional(),
        isActive: z.boolean().optional(), displayOrder: z.number().optional(),
      })).mutation(({ input }) => db.createNeighborhood(input)),
      update: adminProcedure.input(z.object({
        id: z.number(), nameEn: z.string().optional(), nameAr: z.string().optional(),
        descriptionEn: z.string().optional(), descriptionAr: z.string().optional(),
        heroImage: z.string().optional(), zone: z.string().optional(),
        avgAdrPeak: z.string().optional(), avgAdrHigh: z.string().optional(), avgAdrLow: z.string().optional(),
        isActive: z.boolean().optional(), displayOrder: z.number().optional(),
        landmarks: z.any().optional(),
      })).mutation(({ input }) => { const { id, ...data } = input; return db.updateNeighborhood(id, data); }),
    }),

    properties: router({
      list: adminProcedure.query(() => db.getAllProperties()),
      create: adminProcedure.input(z.object({
        titleEn: z.string(), titleAr: z.string(), cityId: z.number(), neighborhoodId: z.number(),
        descriptionEn: z.string().optional(), descriptionAr: z.string().optional(),
        propertyType: z.enum(["studio", "1br", "2br", "3br", "4br", "villa", "penthouse"]).default("2br"),
        bedrooms: z.number().optional(), bathrooms: z.number().optional(), maxGuests: z.number().optional(),
        sizeSqm: z.string().optional(), pricePeak: z.string().optional(), priceHigh: z.string().optional(), priceLow: z.string().optional(),
        amenities: z.any().optional(), images: z.any().optional(),
        latitude: z.string().optional(), longitude: z.string().optional(),
        isFeatured: z.boolean().optional(),
      })).mutation(({ input }) => db.createProperty(input)),
      update: adminProcedure.input(z.object({
        id: z.number(), titleEn: z.string().optional(), titleAr: z.string().optional(),
        descriptionEn: z.string().optional(), descriptionAr: z.string().optional(),
        cityId: z.number().optional(), neighborhoodId: z.number().optional(),
        propertyType: z.enum(["studio", "1br", "2br", "3br", "4br", "villa", "penthouse"]).optional(),
        bedrooms: z.number().optional(), bathrooms: z.number().optional(), maxGuests: z.number().optional(),
        sizeSqm: z.string().optional(),
        pricePeak: z.string().optional(), priceHigh: z.string().optional(), priceLow: z.string().optional(),
        status: z.enum(["draft", "active", "maintenance", "inactive"]).optional(),
        images: z.any().optional(), amenities: z.any().optional(), isFeatured: z.boolean().optional(),
      })).mutation(({ input }) => { const { id, ...data } = input; return db.updateProperty(id, data); }),
      delete: adminProcedure.input(z.object({ id: z.number() })).mutation(({ input }) => db.deleteProperty(input.id)),
    }),

    inquiries: router({
      list: adminProcedure.query(() => db.getAllInquiries()),
      updateStatus: adminProcedure.input(z.object({
        id: z.number(), status: z.string(), notes: z.string().optional(),
      })).mutation(({ input }) => db.updateInquiryStatus(input.id, input.status, input.notes)),
      update: adminProcedure.input(z.object({
        id: z.number(),
        status: z.string().optional(),
        internalNotes: z.string().optional(),
        assignedTo: z.number().nullable().optional(),
      })).mutation(({ input }) => { const { id, ...data } = input; return db.updateInquiry(id, data); }),
    }),

    blog: router({
      list: adminProcedure.query(() => db.getAllPosts()),
      create: adminProcedure.input(z.object({
        titleEn: z.string(), titleAr: z.string(), slug: z.string(),
        contentEn: z.string().optional(), contentAr: z.string().optional(),
        excerptEn: z.string().optional(), excerptAr: z.string().optional(),
        category: z.enum(["saudi_tourism", "property_investment", "travel_guides", "industry_news"]).default("industry_news"),
        featuredImage: z.string().optional(), status: z.enum(["draft", "published", "archived"]).default("draft"),
        seoTitle: z.string().optional(), seoDescription: z.string().optional(),
        tags: z.any().optional(),
      })).mutation(async ({ ctx, input }) => {
        await db.createPost({ ...input, authorId: ctx.user?.id ?? null, publishedAt: input.status === "published" ? new Date() : undefined });
        return { success: true };
      }),
      update: adminProcedure.input(z.object({
        id: z.number(), titleEn: z.string().optional(), titleAr: z.string().optional(),
        contentEn: z.string().optional(), contentAr: z.string().optional(),
        excerptEn: z.string().optional(), excerptAr: z.string().optional(),
        status: z.enum(["draft", "published", "archived"]).optional(),
        featuredImage: z.string().optional(), category: z.enum(["saudi_tourism", "property_investment", "travel_guides", "industry_news"]).optional(),
        seoTitle: z.string().optional(), seoDescription: z.string().optional(),
        tags: z.any().optional(),
      })).mutation(({ input }) => { const { id, ...data } = input; return db.updatePost(id, data); }),
      delete: adminProcedure.input(z.object({ id: z.number() })).mutation(({ input }) => db.deletePost(input.id)),
    }),

    bookings: router({
      list: adminProcedure.query(() => db.getAllBookings()),
      updateStatus: adminProcedure.input(z.object({
        id: z.number(), status: z.enum(["pending", "confirmed", "checked_in", "checked_out", "cancelled"]),
      })).mutation(({ input }) => db.updateBookingStatus(input.id, input.status)),
    }),

    reviews: router({
      list: adminProcedure.query(() => db.getAllReviews()),
      updateStatus: adminProcedure.input(z.object({
        id: z.number(), status: z.enum(["pending", "approved", "rejected"]),
      })).mutation(({ input }) => db.updateReviewStatus(input.id, input.status)),
    }),

    partners: router({
      list: adminProcedure.query(() => db.getAllPartners()),
      create: adminProcedure.input(z.object({
        nameEn: z.string(), nameAr: z.string(),
        logo: z.string().optional(), category: z.enum(["press", "client", "ota", "award"]).default("client"),
        url: z.string().optional(), displayOrder: z.number().optional(),
        isActive: z.boolean().optional(),
      })).mutation(({ input }) => db.createPartner(input)),
      update: adminProcedure.input(z.object({
        id: z.number(), nameEn: z.string().optional(), nameAr: z.string().optional(),
        logo: z.string().optional(), category: z.enum(["press", "client", "ota", "award"]).optional(),
        url: z.string().optional(), displayOrder: z.number().optional(),
        isActive: z.boolean().optional(),
      })).mutation(({ input }) => { const { id, ...data } = input; return db.updatePartner(id, data); }),
      delete: adminProcedure.input(z.object({ id: z.number() })).mutation(({ input }) => db.deletePartner(input.id)),
    }),

    team: router({
      list: adminProcedure.query(() => db.getAllTeamMembers()),
      create: adminProcedure.input(z.object({
        nameEn: z.string(), nameAr: z.string(),
        roleEn: z.string().optional(), roleAr: z.string().optional(),
        image: z.string().optional(), bioEn: z.string().optional(), bioAr: z.string().optional(),
        displayOrder: z.number().optional(), isActive: z.boolean().optional(),
      })).mutation(({ input }) => db.createTeamMember(input)),
      update: adminProcedure.input(z.object({
        id: z.number(), nameEn: z.string().optional(), nameAr: z.string().optional(),
        roleEn: z.string().optional(), roleAr: z.string().optional(),
        image: z.string().optional(), bioEn: z.string().optional(), bioAr: z.string().optional(),
        displayOrder: z.number().optional(), isActive: z.boolean().optional(),
      })).mutation(({ input }) => { const { id, ...data } = input; return db.updateTeamMember(id, data); }),
      delete: adminProcedure.input(z.object({ id: z.number() })).mutation(({ input }) => db.deleteTeamMember(input.id)),
    }),

    clientUsers: router({
      list: adminProcedure.query(() => db.getAllClientUsers()),
      update: adminProcedure.input(z.object({
        id: z.number(), isActive: z.boolean().optional(), role: z.enum(["guest", "owner"]).optional(),
      })).mutation(({ input }) => { const { id, ...data } = input; return db.updateClientUser(id, data); }),
    }),

    adminUsers: router({
      list: adminProcedure.query(() => db.getAllAdminUsers()),
      create: adminProcedure.input(z.object({
        username: z.string().min(3), password: z.string().min(8),
        fullName: z.string(), email: z.string().optional(), mobile: z.string().optional(),
        displayName: z.string().optional(), role: z.enum(["root", "admin", "editor"]).default("admin"),
      })).mutation(async ({ input }) => {
        const { password, ...rest } = input;
        const passwordHash = await hashPassword(password);
        await db.createAdminUser({ ...rest, passwordHash });
        return { success: true };
      }),
      update: adminProcedure.input(z.object({
        id: z.number(), fullName: z.string().optional(), email: z.string().optional(),
        mobile: z.string().optional(), displayName: z.string().optional(),
        role: z.enum(["root", "admin", "editor"]).optional(), isActive: z.boolean().optional(),
        password: z.string().min(8).optional(),
      })).mutation(async ({ input }) => {
        const { id, password, ...data } = input;
        if (password) {
          const passwordHash = await hashPassword(password);
          await db.updateAdminUser(id, { ...data, passwordHash });
        } else {
          await db.updateAdminUser(id, data);
        }
        return { success: true };
      }),
      delete: adminProcedure.input(z.object({ id: z.number() })).mutation(({ input }) => db.deleteAdminUser(input.id)),
    }),

    careers: router({
      jobs: router({
        list: adminProcedure.query(() => db.getAllJobPostings()),
        create: adminProcedure.input(z.object({
          titleEn: z.string(), titleAr: z.string(),
          departmentEn: z.string().optional(), departmentAr: z.string().optional(),
          locationEn: z.string().optional(), locationAr: z.string().optional(),
          typeEn: z.string().optional(), typeAr: z.string().optional(),
          descriptionEn: z.string().optional(), descriptionAr: z.string().optional(),
          requirementsEn: z.string().optional(), requirementsAr: z.string().optional(),
          salaryRange: z.string().optional(), contactEmail: z.string().optional(),
          status: z.enum(["open", "closed", "draft"]).default("draft"),
          displayOrder: z.number().optional(),
        })).mutation(({ input }) => db.createJobPosting(input)),
        update: adminProcedure.input(z.object({
          id: z.number(), titleEn: z.string().optional(), titleAr: z.string().optional(),
          departmentEn: z.string().optional(), departmentAr: z.string().optional(),
          locationEn: z.string().optional(), locationAr: z.string().optional(),
          typeEn: z.string().optional(), typeAr: z.string().optional(),
          descriptionEn: z.string().optional(), descriptionAr: z.string().optional(),
          requirementsEn: z.string().optional(), requirementsAr: z.string().optional(),
          salaryRange: z.string().optional(), contactEmail: z.string().optional(),
          status: z.enum(["open", "closed", "draft"]).optional(),
          displayOrder: z.number().optional(),
        })).mutation(({ input }) => { const { id, ...data } = input; return db.updateJobPosting(id, data); }),
        delete: adminProcedure.input(z.object({ id: z.number() })).mutation(({ input }) => db.deleteJobPosting(input.id)),
      }),
      applications: router({
        list: adminProcedure.query(() => db.getAllJobApplications()),
        byJob: adminProcedure.input(z.object({ jobId: z.number() })).query(({ input }) => db.getApplicationsByJob(input.jobId)),
        update: adminProcedure.input(z.object({
          id: z.number(), status: z.enum(["new", "screening", "interview", "offered", "hired", "rejected"]).optional(),
          internalNotes: z.string().optional(),
        })).mutation(({ input }) => { const { id, ...data } = input; return db.updateJobApplication(id, data); }),
      }),
    }),

    settings: router({
      get: adminProcedure.input(z.object({ key: z.string() })).query(({ input }) => db.getSetting(input.key)),
      getAll: adminProcedure.query(async () => {
        const keys = [
          "hero_video_url", "hero_poster_url", "hero_title_en", "hero_title_ar",
          "hero_subtitle_en", "hero_subtitle_ar", "site_phone", "site_email", "site_whatsapp",
          "stats_years", "stats_properties", "stats_occupancy", "stats_cities",
          "social_twitter", "social_instagram", "social_linkedin", "social_facebook",
          "revenue_owner_pct", "revenue_company_pct",
          "analytics_tracking_code",
          "app_store_url", "google_play_url", "app_coming_soon",
          "app_features_owner_en", "app_features_owner_ar",
          "app_features_guest_en", "app_features_guest_ar",
        ];
        const results: Record<string, string> = {};
        for (const key of keys) {
          const val = await db.getSetting(key);
          if (val) results[key] = val;
        }
        return results;
      }),
      set: adminProcedure.input(z.object({ key: z.string(), value: z.string() })).mutation(({ input }) => db.setSetting(input.key, input.value)),
      setBatch: adminProcedure.input(z.array(z.object({ key: z.string(), value: z.string() }))).mutation(async ({ input }) => {
        for (const item of input) {
          await db.setSetting(item.key, item.value);
        }
        return { success: true };
      }),
    }),
  }),

  // ─── Public Settings Route ──────────────────────────────────────────
  settings: router({
    heroVideo: publicProcedure.query(async () => {
      const videoUrl = await db.getSetting("hero_video_url");
      const posterUrl = await db.getSetting("hero_poster_url");
      return { videoUrl, posterUrl };
    }),
    get: publicProcedure.input(z.object({ key: z.string() })).query(({ input }) => db.getSetting(input.key)),
    getMultiple: publicProcedure.input(z.object({ keys: z.array(z.string()) })).query(async ({ input }) => {
      const results: Record<string, string> = {};
      for (const key of input.keys) {
        const val = await db.getSetting(key);
        if (val) results[key] = val;
      }
      return results;
    }),
  }),
});

export type AppRouter = typeof appRouter;
