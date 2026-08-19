import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Lang = "en" | "kn";

type Dict = Record<string, { en: string; kn: string }>;

export const dict: Dict = {
  "site.name": { en: "Shiksha Sahaya", kn: "ಶಿಕ್ಷಾ ಸಹಾಯ" },
  "site.tagline": { en: "Government of Karnataka · School Grievance & Learning Portal", kn: "ಕರ್ನಾಟಕ ಸರ್ಕಾರ · ಶಾಲಾ ದೂರು ಮತ್ತು ಕಲಿಕಾ ಪೋರ್ಟಲ್" },
  "site.emblem": { en: "Satyameva Jayate", kn: "ಸತ್ಯಮೇವ ಜಯತೇ" },

  "nav.home": { en: "Home", kn: "ಮುಖಪುಟ" },
  "nav.dashboard": { en: "Dashboard", kn: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್" },
  "nav.library": { en: "Digital Library", kn: "ಡಿಜಿಟಲ್ ಗ್ರಂಥಾಲಯ" },
  "nav.assistant": { en: "AI Assistant", kn: "AI ಸಹಾಯಕ" },
  "nav.submit": { en: "Submit Problem", kn: "ಸಮಸ್ಯೆ ಸಲ್ಲಿಸಿ" },
  "nav.track": { en: "Track Status", kn: "ಸ್ಥಿತಿ ಪರಿಶೀಲಿಸಿ" },
  "nav.officials": { en: "Officials Panel", kn: "ಅಧಿಕಾರಿಗಳ ಫಲಕ" },
  "nav.login": { en: "Login", kn: "ಲಾಗಿನ್" },
  "nav.logout": { en: "Logout", kn: "ಲಾಗ್ ಔಟ್" },
  "nav.menu": { en: "Menu", kn: "ಮೆನು" },

  "home.hero.title": { en: "Report school problems. Track every step. Keep learning.", kn: "ಶಾಲಾ ಸಮಸ್ಯೆಗಳನ್ನು ವರದಿ ಮಾಡಿ. ಪ್ರತಿ ಹಂತವನ್ನೂ ಟ್ರ್ಯಾಕ್ ಮಾಡಿ. ಕಲಿಕೆ ಮುಂದುವರಿಸಿ." },
  "home.hero.sub": { en: "An official channel for students, parents and school officials of Karnataka government schools — grievance redressal with ticket tracking, plus a free digital learning space.", kn: "ಕರ್ನಾಟಕ ಸರ್ಕಾರಿ ಶಾಲೆಗಳ ವಿದ್ಯಾರ್ಥಿಗಳು, ಪೋಷಕರು ಮತ್ತು ಅಧಿಕಾರಿಗಳಿಗಾಗಿ ಅಧಿಕೃತ ವೇದಿಕೆ — ಟಿಕೆಟ್ ಟ್ರ್ಯಾಕಿಂಗ್ ಸಹಿತ ದೂರು ಪರಿಹಾರ ಮತ್ತು ಉಚಿತ ಡಿಜಿಟಲ್ ಕಲಿಕಾ ಸ್ಥಳ." },
  "home.cta.submit": { en: "Submit a Problem", kn: "ಸಮಸ್ಯೆ ಸಲ್ಲಿಸಿ" },
  "home.cta.track": { en: "Track a Ticket", kn: "ಟಿಕೆಟ್ ಟ್ರ್ಯಾಕ್ ಮಾಡಿ" },
  "home.quick": { en: "Quick links", kn: "ತ್ವರಿತ ಲಿಂಕ್‌ಗಳು" },
  "home.how": { en: "How it works", kn: "ಇದು ಹೇಗೆ ಕೆಲಸ ಮಾಡುತ್ತದೆ" },
  "home.how.1": { en: "Submit", kn: "ಸಲ್ಲಿಸಿ" },
  "home.how.1.d": { en: "Describe the problem — infrastructure, teacher shortage, safety, mid-day meal and more. Attach a photo if you have one.", kn: "ಸಮಸ್ಯೆಯನ್ನು ವಿವರಿಸಿ — ಮೂಲಸೌಕರ್ಯ, ಶಿಕ್ಷಕರ ಕೊರತೆ, ಸುರಕ್ಷತೆ, ಮಧ್ಯಾಹ್ನದ ಊಟ ಇತ್ಯಾದಿ. ಫೋಟೋ ಇದ್ದರೆ ಲಗತ್ತಿಸಿ." },
  "home.how.2": { en: "Track", kn: "ಟ್ರ್ಯಾಕ್" },
  "home.how.2.d": { en: "You get a ticket ID immediately. Follow the status timeline any time — nothing disappears.", kn: "ತಕ್ಷಣ ಟಿಕೆಟ್ ಐಡಿ ಸಿಗುತ್ತದೆ. ಯಾವಾಗ ಬೇಕಾದರೂ ಸ್ಥಿತಿ ನೋಡಿ — ಯಾವುದೂ ಕಳೆದುಹೋಗುವುದಿಲ್ಲ." },
  "home.how.3": { en: "Resolve", kn: "ಪರಿಹಾರ" },
  "home.how.3.d": { en: "The concerned official reviews, responds with a resolution note, and closes the ticket.", kn: "ಸಂಬಂಧಿತ ಅಧಿಕಾರಿ ಪರಿಶೀಲಿಸಿ, ಪರಿಹಾರ ಟಿಪ್ಪಣಿಯೊಂದಿಗೆ ಪ್ರತಿಕ್ರಿಯಿಸಿ ಟಿಕೆಟ್ ಮುಚ್ಚುತ್ತಾರೆ." },
  "home.stats.a": { en: "Bilingual", kn: "ದ್ವಿಭಾಷಾ" },
  "home.stats.a.d": { en: "Kannada and English throughout", kn: "ಪೂರ್ತಿ ಕನ್ನಡ ಮತ್ತು ಇಂಗ್ಲಿಷ್" },
  "home.stats.b": { en: "Traceable", kn: "ಟ್ರ್ಯಾಕ್ ಮಾಡಬಹುದಾದ" },
  "home.stats.b.d": { en: "Every complaint gets a ticket ID", kn: "ಪ್ರತಿ ದೂರಿಗೂ ಟಿಕೆಟ್ ಐಡಿ" },
  "home.stats.c": { en: "Protected", kn: "ಸುರಕ್ಷಿತ" },
  "home.stats.c.d": { en: "Student data only after login", kn: "ಲಾಗಿನ್ ನಂತರವೇ ವಿದ್ಯಾರ್ಥಿ ಮಾಹಿತಿ" },

  "auth.title": { en: "Login / Register", kn: "ಲಾಗಿನ್ / ನೋಂದಣಿ" },
  "auth.login": { en: "Login", kn: "ಲಾಗಿನ್" },
  "auth.register": { en: "Register", kn: "ನೋಂದಣಿ" },
  "auth.role": { en: "I am a", kn: "ನಾನು" },
  "auth.role.student": { en: "Student", kn: "ವಿದ್ಯಾರ್ಥಿ" },
  "auth.role.parent": { en: "Parent", kn: "ಪೋಷಕ" },
  "auth.role.official": { en: "Official", kn: "ಅಧಿಕಾರಿ" },
  "auth.name": { en: "Full name", kn: "ಪೂರ್ಣ ಹೆಸರು" },
  "auth.email": { en: "Email", kn: "ಇಮೇಲ್" },
  "auth.password": { en: "Password", kn: "ಪಾಸ್‌ವರ್ಡ್" },
  "auth.roll": { en: "Student roll number", kn: "ವಿದ್ಯಾರ್ಥಿ ರೋಲ್ ಸಂಖ್ಯೆ" },
  "auth.roll.help": { en: "Parents: enter your child's roll number to link the account. Demo roll numbers: KS1001, KS1002, KS1003.", kn: "ಪೋಷಕರು: ಖಾತೆ ಲಿಂಕ್ ಮಾಡಲು ಮಗುವಿನ ರೋಲ್ ಸಂಖ್ಯೆ ನಮೂದಿಸಿ. ಡೆಮೋ ರೋಲ್ ಸಂಖ್ಯೆಗಳು: KS1001, KS1002, KS1003." },
  "auth.submit.login": { en: "Login securely", kn: "ಸುರಕ್ಷಿತವಾಗಿ ಲಾಗಿನ್ ಆಗಿ" },
  "auth.submit.register": { en: "Create account", kn: "ಖಾತೆ ರಚಿಸಿ" },
  "auth.note": { en: "Student attendance and results are never shown without login.", kn: "ಲಾಗಿನ್ ಇಲ್ಲದೆ ವಿದ್ಯಾರ್ಥಿ ಹಾಜರಾತಿ ಮತ್ತು ಫಲಿತಾಂಶಗಳನ್ನು ಎಂದಿಗೂ ತೋರಿಸಲಾಗುವುದಿಲ್ಲ." },
  "auth.needLogin": { en: "Please login to view this page.", kn: "ಈ ಪುಟವನ್ನು ನೋಡಲು ದಯವಿಟ್ಟು ಲಾಗಿನ್ ಆಗಿ." },
  "auth.goLogin": { en: "Go to login", kn: "ಲಾಗಿನ್‌ಗೆ ಹೋಗಿ" },
  "auth.regno": { en: "Register number", kn: "ನೋಂದಣಿ ಸಂಖ್ಯೆ" },
  "auth.regno.help": { en: "Officials: use your staff ID as the register number.", kn: "ಅಧಿಕಾರಿಗಳು: ನಿಮ್ಮ ಸಿಬ್ಬಂದಿ ಐಡಿಯನ್ನು ನೋಂದಣಿ ಸಂಖ್ಯೆಯಾಗಿ ಬಳಸಿ." },
  "auth.phone": { en: "Mobile number", kn: "ಮೊಬೈಲ್ ಸಂಖ್ಯೆ" },
  "auth.phone.help": { en: "10-digit mobile number used for school contact.", kn: "ಶಾಲಾ ಸಂಪರ್ಕಕ್ಕಾಗಿ 10 ಅಂಕಿಯ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ." },
  "auth.dob": { en: "Date of birth (this is your password)", kn: "ಜನ್ಮ ದಿನಾಂಕ (ಇದೇ ನಿಮ್ಮ ಪಾಸ್‌ವರ್ಡ್)" },
  "auth.dob.help": { en: "Login with your register number and your date of birth.", kn: "ನಿಮ್ಮ ನೋಂದಣಿ ಸಂಖ್ಯೆ ಮತ್ತು ಜನ್ಮ ದಿನಾಂಕದೊಂದಿಗೆ ಲಾಗಿನ್ ಆಗಿ." },
  "auth.class": { en: "Class", kn: "ತರಗತಿ" },
  "auth.school": { en: "School name", kn: "ಶಾಲೆಯ ಹೆಸರು" },
  "auth.badCreds": { en: "Register number or date of birth is incorrect. If you are new, please register first.", kn: "ನೋಂದಣಿ ಸಂಖ್ಯೆ ಅಥವಾ ಜನ್ಮ ದಿನಾಂಕ ತಪ್ಪಾಗಿದೆ. ಹೊಸಬರಾಗಿದ್ದರೆ ಮೊದಲು ನೋಂದಾಯಿಸಿ." },
  "auth.exists": { en: "This register number is already registered. Please login instead.", kn: "ಈ ನೋಂದಣಿ ಸಂಖ್ಯೆ ಈಗಾಗಲೇ ನೋಂದಾಯಿಸಲಾಗಿದೆ. ದಯವಿಟ್ಟು ಲಾಗಿನ್ ಆಗಿ." },


  "dash.student": { en: "Student Dashboard", kn: "ವಿದ್ಯಾರ್ಥಿ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್" },
  "dash.parent": { en: "Parent Dashboard", kn: "ಪೋಷಕರ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್" },
  "dash.attendance": { en: "Attendance", kn: "ಹಾಜರಾತಿ" },
  "dash.attendance.sub": { en: "Overall this year", kn: "ಈ ವರ್ಷದ ಒಟ್ಟಾರೆ" },
  "dash.results": { en: "Subject-wise results", kn: "ವಿಷಯವಾರು ಫಲಿತಾಂಶಗಳು" },
  "dash.progress": { en: "Attendance trend", kn: "ಹಾಜರಾತಿ ಪ್ರವೃತ್ತಿ" },
  "dash.complaints": { en: "My complaints", kn: "ನನ್ನ ದೂರುಗಳು" },
  "dash.class": { en: "Class", kn: "ತರಗತಿ" },
  "dash.school": { en: "School", kn: "ಶಾಲೆ" },
  "dash.roll": { en: "Roll number", kn: "ರೋಲ್ ಸಂಖ್ಯೆ" },
  "dash.average": { en: "Average marks", kn: "ಸರಾಸರಿ ಅಂಕಗಳು" },
  "dash.subjects": { en: "Subjects tracked", kn: "ಟ್ರ್ಯಾಕ್ ಮಾಡಿದ ವಿಷಯಗಳು" },
  "dash.nolink": { en: "No student record is linked to this account yet. Ask your school to link your roll number.", kn: "ಈ ಖಾತೆಗೆ ಇನ್ನೂ ಯಾವುದೇ ವಿದ್ಯಾರ್ಥಿ ದಾಖಲೆ ಲಿಂಕ್ ಆಗಿಲ್ಲ. ನಿಮ್ಮ ರೋಲ್ ಸಂಖ್ಯೆ ಲಿಂಕ್ ಮಾಡಲು ಶಾಲೆಯನ್ನು ಕೇಳಿ." },
  "dash.onBehalf": { en: "Submit problem on behalf of student", kn: "ವಿದ್ಯಾರ್ಥಿಯ ಪರವಾಗಿ ಸಮಸ್ಯೆ ಸಲ್ಲಿಸಿ" },
  "dash.none": { en: "No complaints submitted yet.", kn: "ಇನ್ನೂ ಯಾವುದೇ ದೂರು ಸಲ್ಲಿಸಿಲ್ಲ." },

  "complaint.title": { en: "Submit a problem", kn: "ಸಮಸ್ಯೆ ಸಲ್ಲಿಸಿ" },
  "complaint.step": { en: "Step", kn: "ಹಂತ" },
  "complaint.of": { en: "of", kn: "ರಲ್ಲಿ" },
  "complaint.school": { en: "School name", kn: "ಶಾಲೆಯ ಹೆಸರು" },
  "complaint.category": { en: "Category", kn: "ವರ್ಗ" },
  "complaint.description": { en: "Description", kn: "ವಿವರಣೆ" },
  "complaint.photo": { en: "Photo link (optional)", kn: "ಫೋಟೋ ಲಿಂಕ್ (ಐಚ್ಛಿಕ)" },
  "complaint.next": { en: "Next", kn: "ಮುಂದೆ" },
  "complaint.back": { en: "Back", kn: "ಹಿಂದೆ" },
  "complaint.submit": { en: "Submit complaint", kn: "ದೂರು ಸಲ್ಲಿಸಿ" },
  "complaint.success": { en: "Complaint registered", kn: "ದೂರು ನೋಂದಾಯಿಸಲಾಗಿದೆ" },
  "complaint.ticket": { en: "Ticket ID", kn: "ಟಿಕೆಟ್ ಐಡಿ" },
  "complaint.saveTicket": { en: "Save this ticket ID. Use it to track the status any time.", kn: "ಈ ಟಿಕೆಟ್ ಐಡಿ ಉಳಿಸಿಕೊಳ್ಳಿ. ಸ್ಥಿತಿ ಟ್ರ್ಯಾಕ್ ಮಾಡಲು ಬಳಸಿ." },
  "complaint.another": { en: "Submit another", kn: "ಇನ್ನೊಂದು ಸಲ್ಲಿಸಿ" },

  "cat.infrastructure": { en: "Infrastructure", kn: "ಮೂಲಸೌಕರ್ಯ" },
  "cat.teacher": { en: "Teacher shortage", kn: "ಶಿಕ್ಷಕರ ಕೊರತೆ" },
  "cat.safety": { en: "Safety", kn: "ಸುರಕ್ಷತೆ" },
  "cat.meal": { en: "Mid-day meal", kn: "ಮಧ್ಯಾಹ್ನದ ಊಟ" },
  "cat.other": { en: "Other", kn: "ಇತರೆ" },

  "status.submitted": { en: "Submitted", kn: "ಸಲ್ಲಿಸಲಾಗಿದೆ" },
  "status.under_review": { en: "Under Review", kn: "ಪರಿಶೀಲನೆಯಲ್ಲಿದೆ" },
  "status.resolved": { en: "Resolved", kn: "ಪರಿಹರಿಸಲಾಗಿದೆ" },

  "track.title": { en: "Track complaint status", kn: "ದೂರಿನ ಸ್ಥಿತಿ ಟ್ರ್ಯಾಕ್ ಮಾಡಿ" },
  "track.sub": { en: "All complaints you have submitted, with their live status timeline.", kn: "ನೀವು ಸಲ್ಲಿಸಿದ ಎಲ್ಲಾ ದೂರುಗಳು ಮತ್ತು ಅವುಗಳ ಸ್ಥಿತಿ ಸಮಯರೇಖೆ." },
  "track.response": { en: "Official response", kn: "ಅಧಿಕಾರಿಯ ಪ್ರತಿಕ್ರಿಯೆ" },
  "track.search": { en: "Search by ticket ID", kn: "ಟಿಕೆಟ್ ಐಡಿ ಮೂಲಕ ಹುಡುಕಿ" },

  "off.title": { en: "Officials Panel", kn: "ಅಧಿಕಾರಿಗಳ ಫಲಕ" },
  "off.sub": { en: "Review, respond to and resolve submitted grievances.", kn: "ಸಲ್ಲಿಕೆಯಾದ ದೂರುಗಳನ್ನು ಪರಿಶೀಲಿಸಿ, ಪ್ರತಿಕ್ರಿಯಿಸಿ ಮತ್ತು ಪರಿಹರಿಸಿ." },
  "off.filter.status": { en: "Status", kn: "ಸ್ಥಿತಿ" },
  "off.filter.category": { en: "Category", kn: "ವರ್ಗ" },
  "off.filter.school": { en: "School", kn: "ಶಾಲೆ" },
  "off.all": { en: "All", kn: "ಎಲ್ಲಾ" },
  "off.responseNote": { en: "Resolution note (visible to submitter)", kn: "ಪರಿಹಾರ ಟಿಪ್ಪಣಿ (ಸಲ್ಲಿಸಿದವರಿಗೆ ಕಾಣುತ್ತದೆ)" },
  "off.update": { en: "Update ticket", kn: "ಟಿಕೆಟ್ ನವೀಕರಿಸಿ" },
  "off.notOfficial": { en: "This panel is only for verified officials.", kn: "ಈ ಫಲಕ ಪರಿಶೀಲಿತ ಅಧಿಕಾರಿಗಳಿಗೆ ಮಾತ್ರ." },
  "off.count": { en: "complaints", kn: "ದೂರುಗಳು" },

  "lib.title": { en: "Digital Library", kn: "ಡಿಜಿಟಲ್ ಗ್ರಂಥಾಲಯ" },
  "lib.sub": { en: "Free study material organised by class, subject and topic.", kn: "ತರಗತಿ, ವಿಷಯ ಮತ್ತು ವಿಷಯಾಂಶದ ಪ್ರಕಾರ ಜೋಡಿಸಿದ ಉಚಿತ ಅಧ್ಯಯನ ಸಾಮಗ್ರಿ." },
  "lib.search": { en: "Search title or topic", kn: "ಶೀರ್ಷಿಕೆ ಅಥವಾ ವಿಷಯಾಂಶ ಹುಡುಕಿ" },
  "lib.class": { en: "Class", kn: "ತರಗತಿ" },
  "lib.subject": { en: "Subject", kn: "ವಿಷಯ" },
  "lib.open": { en: "Open", kn: "ತೆರೆಯಿರಿ" },
  "lib.none": { en: "No material matches these filters.", kn: "ಈ ಫಿಲ್ಟರ್‌ಗಳಿಗೆ ಯಾವುದೇ ಸಾಮಗ್ರಿ ಹೊಂದಿಕೆಯಾಗಲಿಲ್ಲ." },
  "lib.pdf": { en: "PDF", kn: "ಪಿಡಿಎಫ್" },
  "lib.video": { en: "Video", kn: "ವೀಡಿಯೊ" },
  "lib.read": { en: "Read PDF", kn: "ಪಿಡಿಎಫ್ ಓದಿ" },
  "lib.watch": { en: "Watch video", kn: "ವೀಡಿಯೊ ನೋಡಿ" },
  "lib.newTab": { en: "Open in new tab", kn: "ಹೊಸ ಟ್ಯಾಬ್‌ನಲ್ಲಿ ತೆರೆಯಿರಿ" },
  "lib.download": { en: "Download", kn: "ಡೌನ್‌ಲೋಡ್" },
  "lib.close": { en: "Close", kn: "ಮುಚ್ಚಿ" },
  "lib.lesson": { en: "Lesson notes", kn: "ಪಾಠದ ಟಿಪ್ಪಣಿಗಳು" },
  "lib.original": { en: "Original document / video", kn: "ಮೂಲ ದಾಖಲೆ / ವೀಡಿಯೊ" },

  "lib.viewerNote": { en: "If the document does not appear, use \"Open in new tab\".", kn: "ದಾಖಲೆ ಕಾಣದಿದ್ದರೆ \"ಹೊಸ ಟ್ಯಾಬ್‌ನಲ್ಲಿ ತೆರೆಯಿರಿ\" ಬಳಸಿ." },

  "gate.title": { en: "Login required", kn: "ಲಾಗಿನ್ ಅಗತ್ಯವಿದೆ" },
  "gate.sub": { en: "This portal is available to registered students, parents and officials only. Please login or create an account to continue.", kn: "ಈ ಪೋರ್ಟಲ್ ನೋಂದಾಯಿತ ವಿದ್ಯಾರ್ಥಿಗಳು, ಪೋಷಕರು ಮತ್ತು ಅಧಿಕಾರಿಗಳಿಗೆ ಮಾತ್ರ. ಮುಂದುವರಿಯಲು ಲಾಗಿನ್ ಮಾಡಿ ಅಥವಾ ಖಾತೆ ತೆರೆಯಿರಿ." },
  "gate.checking": { en: "Checking your session…", kn: "ನಿಮ್ಮ ಸೆಷನ್ ಪರಿಶೀಲಿಸಲಾಗುತ್ತಿದೆ…" },


  "ai.title": { en: "AI Learning Assistant", kn: "AI ಕಲಿಕಾ ಸಹಾಯಕ" },
  "ai.sub": { en: "Ask homework and concept doubts in Kannada or English.", kn: "ಕನ್ನಡ ಅಥವಾ ಇಂಗ್ಲಿಷ್‌ನಲ್ಲಿ ಮನೆಕೆಲಸ ಮತ್ತು ಪರಿಕಲ್ಪನೆಯ ಸಂದೇಹಗಳನ್ನು ಕೇಳಿ." },
  "ai.placeholder": { en: "Type your doubt…", kn: "ನಿಮ್ಮ ಸಂದೇಹ ಬರೆಯಿರಿ…" },
  "ai.send": { en: "Send", kn: "ಕಳುಹಿಸಿ" },
  "ai.disclaimer": { en: "This assistant supports your learning. It does not replace your teacher — always confirm important answers with them.", kn: "ಈ ಸಹಾಯಕ ನಿಮ್ಮ ಕಲಿಕೆಗೆ ಬೆಂಬಲ ನೀಡುತ್ತದೆ. ಇದು ಶಿಕ್ಷಕರ ಬದಲಿಯಲ್ಲ — ಮುಖ್ಯ ಉತ್ತರಗಳನ್ನು ಶಿಕ್ಷಕರೊಂದಿಗೆ ಖಚಿತಪಡಿಸಿಕೊಳ್ಳಿ." },
  "ai.empty": { en: "Example: Explain photosynthesis for Class 8 in simple words.", kn: "ಉದಾಹರಣೆ: 8ನೇ ತರಗತಿಗೆ ದ್ಯುತಿಸಂಶ್ಲೇಷಣೆಯನ್ನು ಸರಳ ಪದಗಳಲ್ಲಿ ವಿವರಿಸಿ." },
  "ai.thinking": { en: "Thinking…", kn: "ಯೋಚಿಸುತ್ತಿದೆ…" },

  "footer.helpline": { en: "Helpline", kn: "ಸಹಾಯವಾಣಿ" },
  "footer.contact": { en: "Contact", kn: "ಸಂಪರ್ಕ" },
  "footer.rti": { en: "RTI", kn: "ಮಾಹಿತಿ ಹಕ್ಕು" },
  "footer.accessibility": { en: "Accessibility", kn: "ಪ್ರವೇಶಸಾಧ್ಯತೆ" },
  "footer.disclaimer": { en: "This is a demonstration portal for school grievance redressal and learning support. Content is owned by the respective department; data shown to logged-in users is restricted to their own records.", kn: "ಇದು ಶಾಲಾ ದೂರು ಪರಿಹಾರ ಮತ್ತು ಕಲಿಕಾ ಬೆಂಬಲಕ್ಕಾಗಿ ಪ್ರದರ್ಶನ ಪೋರ್ಟಲ್. ವಿಷಯದ ಒಡೆತನ ಸಂಬಂಧಿತ ಇಲಾಖೆಗೆ ಸೇರಿದೆ; ಲಾಗಿನ್ ಆದ ಬಳಕೆದಾರರಿಗೆ ಅವರ ಸ್ವಂತ ದಾಖಲೆಗಳು ಮಾತ್ರ ಕಾಣುತ್ತವೆ." },

  "common.loading": { en: "Loading…", kn: "ಲೋಡ್ ಆಗುತ್ತಿದೆ…" },
  "common.error": { en: "Something went wrong. Please try again.", kn: "ಏನೋ ತಪ್ಪಾಗಿದೆ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ." },
  "common.required": { en: "This field is required.", kn: "ಈ ಕ್ಷೇತ್ರ ಅಗತ್ಯವಿದೆ." },
  "common.date": { en: "Date", kn: "ದಿನಾಂಕ" },
};

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (key: string) => string };

const LanguageContext = createContext<Ctx | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const saved = window.localStorage.getItem("ss-lang");
    if (saved === "kn" || saved === "en") setLangState(saved);
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    window.localStorage.setItem("ss-lang", l);
    document.documentElement.lang = l === "kn" ? "kn" : "en";
  }, []);

  const t = useCallback((key: string) => dict[key]?.[lang] ?? key, [lang]);

  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useI18n must be used inside LanguageProvider");
  return ctx;
}
