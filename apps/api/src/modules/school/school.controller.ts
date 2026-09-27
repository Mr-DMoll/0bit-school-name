import { Request, Response } from "express";
import { prisma } from "@repo/database";
import { Role, HttpStatus } from "@repo/types";
import { catchAsync } from "../../utils/catchAsync.js";
import { AppError } from "../../utils/appError.js";

// Identity/brand — changing these is a brand decision, kept Admin-only.
const BRANDING_FIELDS = [
  "schoolName", "type", "motto", "accentColor", "accentSoft", "logoUrl",
] as const;

// Day-to-day content — Manager can edit these too.
const CONTENT_FIELDS = [
  "heroPhoto", "address", "phone", "email",
  "principalName", "principalPhoto", "principalMessage",
  "province", "passRate", "learnerCount", "yearEstablished", "ratio",
  "features",
  "socialFacebook", "socialTwitter", "socialYoutube",
  "footerBio", "ctaTitle", "ctaBody", "ctaBullets",
  // About page
  "aboutSubtitle", "aboutHistory", "aboutHistoryImage",
  "mission", "vision", "sgbBody", "awards",
  // Academics page
  "academicStreams", "academicSupport",
  // Admissions page
  "admissionsDocs", "admissionsFees", "admissionsFeeNote", "admissionsFAQ", "admissionsKeyDates",
  // Student Life page
  "studentActivities", "calendarEvents",
  // Resources page
  "resourceLinks", "parentPortalUrl",
  // Contact page
  "officeHours", "contactSubjects",
  // News page
  "newsletters",
  "whyLabel",
] as const;

// ── GET /school — public, the public site + dashboard branding both read this ─

export const getSchool = catchAsync(async (_req: Request, res: Response) => {
  const school = await prisma.school.upsert({
    where:  { id: "singleton" },
    update: {},
    create: { id: "singleton" },
    include: { staff: { orderBy: { sortOrder: "asc" } }, testimonials: { orderBy: { sortOrder: "asc" } }, termDates: { orderBy: { sortOrder: "asc" } }, photos: { orderBy: { sortOrder: "asc" } } },
  });
  res.json({ status: "success", data: { school } });
});

// ── PATCH /school — ADMIN or MANAGER, but Branding fields are Admin-only ─────

export const updateSchool = catchAsync(async (req: Request, res: Response) => {
  const isAdmin = req.user!.role === Role.ADMIN;

  const attemptedBrandingField = BRANDING_FIELDS.find((f) => req.body[f] !== undefined);
  if (attemptedBrandingField && !isAdmin) {
    throw new AppError("Branding can only be changed by an Admin.", HttpStatus.FORBIDDEN);
  }

  const allowedFields = isAdmin ? [...BRANDING_FIELDS, ...CONTENT_FIELDS] : CONTENT_FIELDS;
  const data: Record<string, unknown> = {};
  for (const field of allowedFields) {
    if (req.body[field] !== undefined) data[field] = req.body[field];
  }

  // Gallery photos, testimonials, and staff are separate tables (not JSON
  // columns on School), so a "save" here means replace-all: wipe whatever
  // rows exist for this school and recreate them from the submitted array,
  // using array position as sortOrder. Content-level, so Manager can edit too.
  //
  // upsert() type-validates BOTH the update and create branches regardless
  // of which one actually runs, and `deleteMany` is only valid on an update
  // (there's nothing to delete on a row that doesn't exist yet) — so update
  // and create need their own separate relation shapes, not one shared object.
  const updateData: Record<string, unknown> = { ...data };
  const createData: Record<string, unknown> = { ...data };

  if (req.body.photos !== undefined) {
    const photos = req.body.photos as { url: string; caption?: string; featured?: boolean }[];
    const rows = photos.map((p, i) => ({ url: p.url, caption: p.caption, featured: p.featured ?? false, sortOrder: i }));
    updateData.photos = { deleteMany: {}, create: rows };
    createData.photos = { create: rows };
  }
  if (req.body.testimonials !== undefined) {
    const testimonials = req.body.testimonials as { quote: string; author: string; role: string }[];
    // Pick only the real content fields — the incoming objects are echoed
    // back from the GET response and carry `id`/`schoolId`, which a nested
    // `create` under a relation rejects (the relation sets schoolId itself).
    const rows = testimonials.map((t, i) => ({ quote: t.quote, author: t.author, role: t.role, sortOrder: i }));
    updateData.testimonials = { deleteMany: {}, create: rows };
    createData.testimonials = { create: rows };
  }
  if (req.body.staff !== undefined) {
    const staff = req.body.staff as { name: string; role: string; subject?: string; photo?: string }[];
    const rows = staff.map((s, i) => ({ name: s.name, role: s.role, subject: s.subject, photo: s.photo, sortOrder: i }));
    updateData.staff = { deleteMany: {}, create: rows };
    createData.staff = { create: rows };
  }

  const school = await prisma.school.upsert({
    where:  { id: "singleton" },
    update: updateData,
    create: { id: "singleton", ...createData },
    include: { staff: { orderBy: { sortOrder: "asc" } }, testimonials: { orderBy: { sortOrder: "asc" } }, photos: { orderBy: { sortOrder: "asc" } } },
  });

  res.json({ status: "success", data: { school } });
});
