/* Day 10. Edit only this file to change this day (see modules.js for the fields). */
LMS_DAY_DEFS[10] = {
  title: "TL Pitch Deck Simulation",
  titles: { "110926": "Prospecting Call Simulation" },   // batch 110926 sees this day name instead of title
  sessions: ["s-d7-discussion", "s-d7-sim"],   // Nov 20 sessions (Day 7 titles, held on the Day 10 date for batch 110926); ids from LMS_SESSIONS in modules.js
  brief: "Simulation of the pitch deck presentation to your team leader.",
  // Guided demo: sims/acqui-demo-transition.html (Transition call once the BCL is opened and utilized). It ticks the task when finished.
  tasks: [
    { id: "d10-demo-transition", openLabel: "Demo", label: "Log a Transition call through Acqui Service", href: "sims/acqui-demo-transition.html" }
  ],
  // Graded exam: Acqui Service Exam 3 part 2. One lead's story: Prospecting call, Discovery call (playbook), time skip, Transition call. Script: sims/acqui/exam-activities2.js
  exams: [
    { id: "exam-acqui-activities-2", label: "Acqui Service Exam 3 (Part 2): Prospecting, Discovery and Transition Calls", href: "sims/acqui-exam-activities-2.html", minutes: 30, kind: "lms", passing: 75 }
  ],
  materialsTitle: "Learning Materials",
  materials: [
    { label: "How to Transition leads to Retention or Support: First Disbursement, Referrals and Transition Call (Notion)", href: "https://app.notion.com/p/firstcircle/How-to-Transition-leads-to-Retention-or-Support-First-Disbursement-Referrals-and-Transition-Call-9f8dd5b3b0a64e9a9585aee0a8b663b2", link: true }
  ]
};
