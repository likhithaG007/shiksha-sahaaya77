# Shiksha Sahaya

. Concept Summary

A bilingual (Kannada + English) public portal that connects students, parents, and government school officials. Core purpose: give people suffering from poor school facilities a real channel to report problems and get resolutions, while also giving students a free digital learning space.

Core modules

Landing/Home page (public info + trust-building)

Login/Register (Student / Parent / Official — role-based access)

Student Dashboard (attendance, results, progress, assigned complaints status)

Parent Dashboard (view child's attendance/results/progress, submit complaints)

Problem/Grievance Submission + Tracking (ticket-style, with status: Submitted → Under Review → Resolved)

Officials Panel (view, respond to, and resolve complaints; escalate if needed)

Digital Library (subject-wise PDFs & videos, searchable, topic-tagged)

AI Assistant (doubt-solving chatbot, bilingual, subject-aware)

Language toggle (ಕನ್ನಡ / English) — site-wide, not just a homepage widget

2. Visual Theme — "Trustworthy Government + Approachable Learning"

Real Indian government portals (UDISE+, DIKSHA, Karnataka's own seva.karnataka.gov.in style sites) share a visual language: restrained color, clear hierarchy, an emblem/header bar, and high information density without clutter. You want that credibility, but softened slightly since students will spend time here.

Color Palette

RoleColorHexUsePrimary (Header/Nav)Navy Blue#0B3D66Header bar, nav, primary buttonsSecondarySaffron/Orange#F4941ECTAs, highlights, "Submit Problem" buttonAccent (Trust/Growth)Deep Green#1E7B45Success states, "Resolved" tags, library iconsBackgroundOff-white#F7F8FAPage background (not pure white — easier on eyes)SurfaceWhite#FFFFFFCards, panelsText PrimaryCharcoal#1F2937Body textText MutedSlate Gray#6B7280Captions, metadataAlert/PendingAmber#D97706"Under Review" statusErrorRed#B91C1CForm errors only, use sparingly

This is essentially an Ashoka-chakra-adjacent tricolor cue (navy, saffron, green) without being literal or flag-like — it reads as "official India" without looking like a political banner.

Typography

English: Noto Sans or Inter — clean, highly legible, used by many .gov.in sites.

Kannada: Noto Sans Kannada — pairs naturally with Noto Sans, same x-height rhythm, free and Google-hosted, renders reliably across devices.

Headings: Noto Sans SemiBold/Bold, slightly larger than body (1.4–1.6 ratio scale).

Avoid: decorative/script fonts, anything with low Kannada glyph support (many "modern" Google Fonts don't support Kannada — always verify before picking).

Layout & Feel

Top bar: emblem/logo + "Government of Karnataka" style tag line + language toggle + login.

Sticky nav below: Home | Dashboard | Digital Library | AI Assistant | Submit Problem | Track Status.

Card-based dashboard (not dense tables) for students/parents — large legible numbers for attendance %, grade trends as simple bar/line charts.

Grievance form: short, numbered steps (School → Category → Description → Optional photo → Submit), with a visible ticket ID on submission — mirrors how real grievance portals (e.g., CPGRAMS) build trust through traceability.

Footer: contact/helpline info, RTI/accessibility links, disclaimer — standard on gov sites and reassures users this is a "real" channel, not a form that vanishes.

Rounded corners (6–8px, not 20px — stay formal), soft shadows, generous whitespace. Avoid gradients, neon colors, or playful illustration styles that undercut authority.

3. Key Functional Notes (things to get right)

Role-based auth: three roles (student, parent, official) with different dashboard views. Parent accounts should be linked to a student ID/roll number, not just free-standing.

Password-gated student data: attendance/results should never be visible without login — make this explicit in the prompt below so the AI doesn't build an open data view.

Problem tracking: every submission gets a ticket ID + status timeline, visible to the submitter and to officials. This is the single most important trust feature — people need to see that their complaint didn't disappear.

Digital Library: organize by Class → Subject → Topic, not a flat file list. Each PDF/video entry should show title, subject, class, and a short description so search/filter actually works.

AI Assistant: scope it to homework/concept help, bilingual by default, and give it a visible disclaimer that it supports learning but doesn't replace teachers.

Language toggle: build it as a global state (not per-page translation), so switching once switches the whole site including dashboard labels and form fields.

4. Ready-to-Use Prompt (for an AI site builder / Claude / v0 / Lovable etc.)

Copy-paste this as your build prompt:

Build a bilingual (Kannada and English, with a toggle) government school portal web app called "School Samadhana" (or similar — a portal name meaning "school solutions"). It must look like a real, professional Indian government website — formal, trustworthy, high information density, not playful or startup-like.

Visual style: Navy blue (#0B3D66) header/nav, saffron orange (#F4941E) for primary CTAs, deep green (#1E7B45) for success/resolved states, off-white (#F7F8FA) background, white card surfaces, charcoal (#1F2937) body text. Use Noto Sans for English and Noto Sans Kannada for Kannada text, matched heading/body scale. Rounded corners of 6-8px, soft shadows, generous whitespace, no gradients or neon colors. Include a top government-style bar with an emblem placeholder, a tagline, language toggle, and login button, plus a sticky nav below it.

Roles & auth: Three login roles — Student, Parent, Official — each with a distinct password-protected dashboard. Parent accounts link to a student's roll number to view that child's data only.

Pages/features to build:

Home page — hero explaining the portal's purpose, quick links to Submit Problem, Digital Library, and AI Assistant, plus a "how it works" section (Submit → Track → Resolve).

Login/Register — role selector, Kannada/English labels.

Student Dashboard — attendance %, subject-wise results/grades (simple bar chart), progress over time (line chart), and a list of the student's own submitted complaints with status.

Parent Dashboard — same data as student dashboard for their linked child, plus a "Submit Problem on behalf of student" button.

Problem Submission form — step-based: School name → Category (infrastructure, teacher shortage, safety, mid-day meal, other) → Description → Optional photo upload → Submit. On submit, generate a ticket ID and show a status timeline (Submitted → Under Review → Resolved).

Officials Panel — table of all submitted complaints with filters (status, category, school), ability to change status and add a response/resolution note visible to the submitter.

Digital Library — organized by Class → Subject → Topic, with searchable/filterable cards for PDFs and videos; clicking a card opens the actual file/video in an embedded viewer, and shows a short description of the topic it covers.

AI Assistant — a chat-style doubt-solving assistant for students, bilingual, scoped to academic help, with a visible note that it supports but doesn't replace teachers.

Technical requirements: Fully responsive (mobile-first, since many users will be on phones). All student/parent data must be behind authentication — no data visible without login. Language toggle must switch all UI text and labels site-wide, not just the homepage. Use accessible, semantic HTML with proper contrast ratios (WCAG AA minimum) since this serves a broad public audience including low-literacy and low-bandwidth users — keep pages lightweight.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://shiksha-sahaya.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/e8d084ac-473e-44a6-9e66-44d9add5cc97).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
