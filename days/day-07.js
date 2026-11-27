/* Day 7. Edit only this file to change this day (see modules.js for the fields). */
// Default (batch 112326 and later): Acqui Service Training Part 2. byBatch keeps what batch 110926 already had (holiday placeholder).
LMS_DAY_DEFS[7] = {
  opens: { "110926": "2026-11-17" },   // batch 110926: stays locked until this date (Manila time), even if Day 6 is done
  title: "Acqui Service Training Part 2",
  brief: "• Graded Acqui Service Exam (Part 1)\n• Guided demos and practice: add a contact and log a call, log a meeting, log a transition call",
  materialsBelow: true, groupColumns: true, groupFull: ["Transition Call"],
  // Guided demos (Demo) and practice (Practice) are Acqui Service simulations with fake data. Same task ids as the old Day 9/10 so tries and ticks carry over.
  tasks: [
    { id: "d9-demo-log-call",        group: "Add a Contact & Log a Call", openLabel: "Demo",     label: "Add a contact and log a call in Acqui Service", href: "sims/acqui-demo-log-call.html" },
    { id: "d9-practice-log-call",    group: "Add a Contact & Log a Call", openLabel: "Practice", label: "Add a contact and log a call by yourself",     href: "sims/acqui-practice-log-call.html" },
    { id: "d9-demo-log-meeting",     group: "Log a Meeting",              openLabel: "Demo",     label: "Log a meeting in Acqui Service",               href: "sims/acqui-demo-log-meeting.html" },
    { id: "d9-practice-log-meeting", group: "Log a Meeting",              openLabel: "Practice", label: "Log a meeting by yourself",                    href: "sims/acqui-practice-log-meeting.html" },
    { id: "d10-demo-transition",     group: "Transition Call",            openLabel: "Demo",     label: "Log a Transition call through Acqui Service",  href: "sims/acqui-demo-transition.html" },
    { id: "d10-practice-transition", group: "Transition Call",            openLabel: "Practice", label: "Log a Transition call by yourself",            href: "sims/acqui-practice-transition.html" }
  ],
  exams: [
    { id: "exam-acqui-day9", label: "Acqui Service Exam (Part 1): Navigation, General Information and Leads", href: "sims/acqui-exam-day9.html", minutes: 45, kind: "lms", passing: 75 }
  ],
  materialsTitle: "Learning Materials",
  materials: [
    { label: "How to Transition leads to Retention or Support: First Disbursement, Referrals and Transition Call (Notion)", href: "https://app.notion.com/p/firstcircle/How-to-Transition-leads-to-Retention-or-Support-First-Disbursement-Referrals-and-Transition-Call-9f8dd5b3b0a64e9a9585aee0a8b663b2", link: true }
  ],
  byBatch: {
    "110926": {
      title: "ASEAN Summit 2026 Holiday",
      brief: "Please contact your training manager (Reyster) for what to expect.",
      materialsBelow: false, groupColumns: false, groupFull: [], groupSoon: {},
      tasks: [ { id: "d7-message-reyster", label: "Message Reyster (Training Manager) about what to expect" } ],
      exams: [], materialsTitle: "Materials", materials: []
    }
  }
};
