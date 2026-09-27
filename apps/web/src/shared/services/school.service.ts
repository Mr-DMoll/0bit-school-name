import apiClient from "@/api/client";
import { endpoints } from "@/api/endpoints";

export interface SchoolSettings {
  id:               string;
  schoolName:       string;
  type:             "PRIMARY" | "HIGH";
  motto:            string;
  accentColor:      string;
  accentSoft:       string;
  logoUrl:          string | null;
  heroPhoto:        string | null;
  address:          string;
  phone:            string;
  email:            string;
  principalName:    string;
  principalPhoto:   string | null;
  principalMessage: string;
  province:         string;
  passRate:         number;
  learnerCount:     number;
  yearEstablished:  number;
  ratio:            string;
  features:         { title: string; body: string }[] | null;
  socialFacebook:   string | null;
  socialTwitter:    string | null;
  socialYoutube:    string | null;
  footerBio:        string | null;
  ctaTitle:         string | null;
  ctaBody:          string | null;
  ctaBullets:       string[] | null;
  // About page
  aboutSubtitle:      string | null;
  aboutHistory:       string[] | null;
  aboutHistoryImage:  string | null;
  mission:            string | null;
  vision:             string | null;
  sgbBody:            string[] | null;
  awards:             { year: string; title: string }[] | null;
  // Academics page
  academicStreams:    { name: string; desc: string; subjects: string[] }[] | null;
  academicSupport:   { title: string; body: string }[] | null;
  // Admissions page
  admissionsDocs:     string[] | null;
  admissionsFees:     { label: string; value: string }[] | null;
  admissionsFeeNote:  string | null;
  admissionsFAQ:      { q: string; a: string }[] | null;
  admissionsKeyDates: { date: string; event: string }[] | null;
  // Student Life page
  studentActivities:  { cat: string; items: string[] }[] | null;
  calendarEvents:     { date: string; title: string }[] | null;
  // Resources page
  resourceLinks:      { cat: string; items: string[] }[] | null;
  parentPortalUrl:    string | null;
  // Contact page
  officeHours:        string | null;
  contactSubjects:    string[] | null;
  // News page
  newsletters:        { title: string; date: string }[] | null;
  // Homepage "Why {label}" heading override — falls back to the first word
  // of schoolName when blank
  whyLabel:           string | null;
  // Gallery, testimonials, staff — separate tables, not JSON columns; saving
  // these replaces the full set server-side (see school.controller.ts)
  photos:             { url: string; caption?: string | null; featured?: boolean }[] | null;
  testimonials:       { quote: string; author: string; role: string }[] | null;
  staff:              { name: string; role: string; subject?: string | null; photo?: string | null }[] | null;
  updatedAt:          string;
}

export const schoolService = {
  get: () =>
    apiClient.get<{ status: string; data: { school: SchoolSettings } }>(endpoints.school.get),

  update: (payload: Partial<SchoolSettings>) =>
    apiClient.patch<{ status: string; data: { school: SchoolSettings } }>(endpoints.school.update, payload),
};
