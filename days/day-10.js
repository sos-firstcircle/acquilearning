/* Day 10. Edit only this file to change this day (see modules.js for the fields). */
LMS_DAY_DEFS[10] = {
  opens: { "110926": "2026-11-20" },   // batch 110926: stays locked until this date (Manila time), even if Day 9 is done
  title: "TL Pitch Deck Simulation",
  titles: { "110926": "Prospecting Call Simulation" },   // batch 110926 sees this day name instead of title
  brief: "Simulation of the pitch deck presentation to your team leader.",
  tasks: [],
  // Graded Acqui Service exams (pages sims/acqui-exam-*.html). Exam 2 (Lead Creation and Reassignment) is not on this day.
  exams: [
    { id: "exam-acqui-nav",        label: "Acqui Service Exam 1: Navigation and General Information", href: "sims/acqui-exam-nav.html",        minutes: 20, kind: "lms", passing: 75 },
    { id: "exam-acqui-activities", label: "Acqui Service Exam 3: Logging a Call and a Meeting",       href: "sims/acqui-exam-activities.html", minutes: 25, kind: "lms", passing: 75 },
    { id: "exam-acqui-onboarding", label: "Acqui Service Exam 4: Document Status and Transition",     href: "sims/acqui-exam-onboarding.html", minutes: 30, kind: "lms", passing: 75 }
  ],
  materialsTitle: "Learning Materials",
  materials: [
    { label: "Outbound Prospecting (Notion)", href: "https://app.notion.com/p/firstcircle/ACQ-Platform-based-Selling-Outbound-Prospecting-1d51a5890448805f85dbefb7ea8e670c", link: true },
    { label: "Communication Standards and Tone Guide (Notion)", href: "https://app.notion.com/p/firstcircle/Communication-Standards-Tone-Guide-34c1a5890448800492bbfe0f0be693a4", link: true },
    { label: "Sample prospecting call recording 1", href: "https://drive.google.com/file/d/1Etn1hi9PjyG5qiHI8RoQEn7Jft0N8RD2/view", link: true },
    { label: "Sample prospecting call recording 2", href: "https://drive.google.com/file/d/1s-Di2naBvmqtXjXAUDyGR61Qli3e0dTh/view", link: true },
    { label: "Discovery Call: Multi-Product Discovery Call / Meeting (Notion)", href: "https://app.notion.com/p/firstcircle/ACQ-Sales-Training-Multi-Product-Discovery-Call-Meeting-2131a589044880d7b92adb7e64a56961", link: true },
    { label: "Discovery Call pitch deck", href: "lessons/d10-discovery-deck.html", link: true }
  ]
};
