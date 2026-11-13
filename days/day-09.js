/* Day 9. Edit only this file to change this day (see modules.js for the fields). */
LMS_DAY_DEFS[9] = {
  opens: { "110926": "2026-11-19" },   // batch 110926: stays locked until this date (Manila time), even if Day 8 is done
  title: "Role-Play Assessment",
  titles: { "110926": "Acqui Service Training" },   // batch 110926 sees this day name instead of title
  brief: "Nov 19\n• Acqui Service review, self pace (morning)\n• Acqui Service refresher continuation",
  materialsBelow: true, groupColumns: true, groupFull: ["Afternoon: Guided Demos"],   // one full-width column (no empty right half)
  // Afternoon guided demos: buttons only for now (locked: true shows a grey Locked button). Replace each with href + openLabel when the demo is built.
  tasks: [
    { id: "d9-demo-log-call",    group: "Afternoon: Guided Demos", openLabel: "Demo", label: "Log a call through Acqui Service", locked: true },
    { id: "d9-demo-log-meeting", group: "Afternoon: Guided Demos", openLabel: "Demo", label: "Log a meeting through Acqui Service", locked: true },
    { id: "d9-demo-risk",        group: "Afternoon: Guided Demos", openLabel: "Demo", label: "Document resubmission status and risk clarifications through Acqui Service", locked: true },
    { id: "d9-demo-transition",  group: "Afternoon: Guided Demos", openLabel: "Demo", label: "Transition of utilized BCLs through Acqui Service", locked: true }
  ],
  sessions: ["s-d6-self", "s-d6-virtual"],   // Nov 19 sessions (Day 6 titles, held on the Day 9 date for batch 110926); ids from LMS_SESSIONS in modules.js
  // The three graded Acqui Service exams are built (pages sims/acqui-exam-nav|lead|onboarding.html, scripts sims/acqui/exam-*.js, screens sims/acqui/lead-ext.js) but NOT listed yet.
  // To show them again, add to this list (soon + lockBtn + blocks = grey Locked button; delete those three to open an exam):
  //   { id: "exam-acqui-nav", label: "Acqui Service Exam 1: Navigation and General Information", href: "sims/acqui-exam-nav.html", minutes: 20, kind: "lms", passing: 75, desc: "..." }
  //   { id: "exam-acqui-lead", label: "Acqui Service Exam 2: Lead Level", href: "sims/acqui-exam-lead.html", minutes: 40, kind: "lms", passing: 75, desc: "..." }
  //   { id: "exam-acqui-onboarding", label: "Acqui Service Exam 3: Document Status and Transition", href: "sims/acqui-exam-onboarding.html", minutes: 30, kind: "lms", passing: 75, desc: "..." }
  // Day 9 stays incomplete (Day 10 locked) while the locked demo tasks above exist.
  exams: [],
  materials: []
};
