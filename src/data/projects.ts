import type { ComponentType } from "react"
import { MigClassroomDemo } from "../components/MigClassroomDemo"

export type ProjectLink = {
  label: string
  url: string
}

export type Project = {
  id: string
  name: string
  category: string
  description: string
  highlights: string[]
  // Short rationale behind one of the choices above, shown in the expanded view.
  note: string
  stack: string[]
  // Most projects link to a single repo. The security toolkit links to several.
  link?: ProjectLink
  links?: ProjectLink[]
  // Optional small interactive demo rendered in the expanded panel.
  demo?: ComponentType
}

export const projects: Project[] = [
  {
    id: "mig-classroom",
    name: "MIG Classroom",
    category: "Learning platform",
    description:
      "Full learning-management system for MIG, a German-language academy: coursework, exams, attendance, and grades for students, teachers, and admins.",
    highlights: [
      "Role-based access enforced in the database with PostgreSQL Row-Level Security",
      "Secure exam delivery: answer keys never reach the browser, timer enforced server-side",
      "In-browser audio recording for speaking practice, CEFR (A1–C2) tagging",
      "Self-registration with admin approval; suspension instead of deletion",
    ],
    note: "Access rules live in PostgreSQL RLS policies rather than in application code, so a bug in a Next.js route can't accidentally expose another student's grades or another teacher's roster.",
    stack: ["Next.js", "TypeScript", "Supabase", "PostgreSQL RLS", "Tailwind", "Vercel"],
    link: { label: "GitHub", url: "https://github.com/MalakSeddik/mig-classroom" },
    demo: MigClassroomDemo,
  },
  {
    id: "kemet",
    name: "Kemet",
    category: "E-commerce",
    description:
      "Bilingual (English/Arabic) store for handcrafted leather goods with a full admin panel.",
    highlights: [
      "Paymob payment integration with EGP/USD currency switching",
      "NextAuth v5 auth; catalogue, cart, orders on Prisma + PostgreSQL",
      "Localized routing via next-intl; media via Cloudinary",
      "Admin CRUD for products, categories, orders",
    ],
    note: "Locale and currency are resolved server-side per request (next-intl routing plus Paymob's EGP/USD split), so one build serves both languages and both prices without client-side branching.",
    stack: ["Next.js 16", "Prisma 7", "NextAuth v5", "Paymob", "PostgreSQL", "next-intl"],
    link: { label: "GitHub", url: "https://github.com/MalakSeddik/KEMET-WEBSITE" },
  },
  {
    id: "cinema-ticket-booking-api",
    name: "Cinema Ticket Booking API",
    category: "Backend",
    description:
      "REST API for cinema ticketing in ASP.NET Core: movies, auditoriums, showtimes, customers, bookings.",
    highlights: [
      "Versioned endpoints (v1/v2) with API-version routing and per-version OpenAPI docs",
      "Controllers → services → repositories over EF Core and PostgreSQL",
      "AutoMapper DTOs, pagination, error-handling middleware",
    ],
    note: "Versioning lives at the routing layer (v1 and v2 served side by side) instead of in a single mutable contract, so existing clients keep working while the API evolves underneath them.",
    stack: ["C#", "ASP.NET Core", "EF Core", "PostgreSQL", "Swagger", "AutoMapper"],
    link: {
      label: "GitHub",
      url: "https://github.com/MalakSeddik/cinema-ticket-booking-api",
    },
  },
  {
    id: "mealsapp",
    name: "MealsApp",
    category: "Android",
    description: "Native Android app for browsing meals by category and viewing recipe details.",
    highlights: [
      "Separate Data/Domain/UI modules with use-cases and repository interfaces",
      "Jetpack Compose UI, Hilt DI, Retrofit + Coil",
      "MVVM with ViewModels and Compose Navigation",
    ],
    note: "The domain layer defines repository interfaces and depends on nothing else, so the UI module talks to abstractions instead of Retrofit or any specific data source directly.",
    stack: ["Kotlin", "Jetpack Compose", "Hilt", "Retrofit", "Clean Architecture"],
    link: { label: "GitHub", url: "https://github.com/MalakSeddik/AndroidApp" },
  },
  {
    id: "security-toolkit",
    name: "Security toolkit",
    category: "Offensive security",
    description:
      "Tools and write-ups on how apps and networks fail, for authorized testing and teaching.",
    highlights: [
      "recon-scanner: multithreaded Python TCP port scanner with banner grabbing",
      "password-auditor: HTTP-form and SSH brute-force auditing with paramiko",
      "vulnerable-app: Next.js app deliberately exposing SQL injection and XSS",
      "pentest_reports: black-box Metasploitable2 assessment with findings and remediation",
    ],
    note: "Each tool targets one failure mode in isolation (recon, brute-force auth, injection), so a write-up can point at a specific, reproducible cause instead of a vague finding.",
    stack: ["Python", "paramiko", "Nmap", "Metasploit", "Next.js"],
    links: [
      { label: "recon-scanner", url: "https://github.com/MalakSeddik/recon-scanner" },
      { label: "password-auditor", url: "https://github.com/MalakSeddik/password-auditor" },
      { label: "vulnerable-app", url: "https://github.com/MalakSeddik/vulnerable-app" },
      { label: "pentest_reports", url: "https://github.com/MalakSeddik/pentest_reports" },
    ],
  },
]
