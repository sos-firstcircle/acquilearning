/* Day 9. Edit only this file to change this day (see modules.js for the fields). */
LMS_DAY_DEFS[9] = {
  opens: { "110926": "2026-11-19" },   // batch 110926: stays locked until this date (Manila time), even if Day 8 is done
  // hold: the day shows this lock message for the batch until this line is deleted (the trainer asks for the unlock). Remove the whole line to open the day.
  hold: { "110926": "Session Locked. Please review your Acqui Service Demos for the graded exam this afternoon." },
  title: "Role-Play Assessment",
  titles: { "110926": "Acqui Service Training" },   // batch 110926 sees this day name instead of title
  brief: "Nov 19\n• Review the other Acqui Service functions at your own pace\n• Guided demos and practice: log a call, log a meeting\n• Graded Acqui Service exam",
  materialsTitle: "Learning Materials",
  materialsBelow: true, groupColumns: true, groupFull: ["Log a Call", "Log a Meeting"],   // one full-width column (no empty right half)
  // Guided demos (Demo) and practice (Practice) are simulations of Acqui Service with fake data: sims/acqui-demo-log-*.html, sims/acqui-practice-log-*.html (steps: sims/acqui/lecture-*.js, practice-activity.js).
  tasks: [
    { id: "d9-demo-log-call",         group: "Log a Call",    openLabel: "Demo",     label: "Add a contact and log a call in Acqui Service",    href: "sims/acqui-demo-log-call.html" },
    { id: "d9-practice-log-call",     group: "Log a Call",    openLabel: "Practice", label: "Add a contact and log a call by yourself",        href: "sims/acqui-practice-log-call.html" },
    { id: "d9-demo-log-meeting",      group: "Log a Meeting", openLabel: "Demo",     label: "Log a meeting in Acqui Service",                  href: "sims/acqui-demo-log-meeting.html" },
    { id: "d9-practice-log-meeting",  group: "Log a Meeting", openLabel: "Practice", label: "Log a meeting by yourself",                       href: "sims/acqui-practice-log-meeting.html" }
  ],
  sessions: ["s-d6-self", "s-d6-virtual"],   // Nov 19 sessions (Day 6 titles, held on the Day 9 date for batch 110926); ids from LMS_SESSIONS in modules.js
  // One graded exam: navigation, general information and lead creation / reassignment (exam 1 + 2 merged). 22 questions, 40 points, 45 min.
  // Pages: sims/acqui-exam-day9.html; scripts sims/acqui/exam-nav.js, exam-leads.js, exam-day9.js; extra screens sims/acqui/lead-ext.js.
  // Built but NOT listed: sims/acqui-exam-activities.html (log a call + meeting) and sims/acqui-exam-onboarding.html (document status + transition).
  exams: [
    { id: "exam-acqui-day9", label: "Acqui Service Exam: Navigation, General Information and Leads", href: "sims/acqui-exam-day9.html", minutes: 45, kind: "lms", passing: 75 }
  ],
  materials: [
    { label: "Outbound Prospecting (Notion)", href: "https://app.notion.com/p/firstcircle/ACQ-Platform-based-Selling-Outbound-Prospecting-1d51a5890448805f85dbefb7ea8e670c", link: true },
    { label: "Communication Standards and Tone Guide (Notion)", href: "https://app.notion.com/p/firstcircle/Communication-Standards-Tone-Guide-34c1a5890448800492bbfe0f0be693a4", link: true },
    { label: "Sample prospecting call recording 1", href: "https://drive.google.com/file/d/1Etn1hi9PjyG5qiHI8RoQEn7Jft0N8RD2/view", link: true },
    { label: "Sample prospecting call recording 2", href: "https://drive.google.com/file/d/1s-Di2naBvmqtXjXAUDyGR61Qli3e0dTh/view", link: true },
    { label: "Discovery Call: Multi-Product Discovery Call / Meeting (Notion)", href: "https://app.notion.com/p/firstcircle/ACQ-Sales-Training-Multi-Product-Discovery-Call-Meeting-2131a589044880d7b92adb7e64a56961", link: true },
    { label: "Discovery Call pitch deck", href: "lessons/d10-discovery-deck.html", link: true }
  ]
};
