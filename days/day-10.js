/* Day 10. Edit only this file to change this day (see modules.js for the fields). */
// Default (batch 112326 and later): Discovery Call Discussion (content to come; the session will come from Google Calendar).
// byBatch keeps what batch 110926 already had (Prospecting Call Simulation day: transition demo + Acqui Service Exam Part 2).
LMS_DAY_DEFS[10] = {
  title: "Discovery Call Discussion",
  brief: "",
  tasks: [],
  exams: [],
  materials: [],
  byBatch: {
    "110926": {
      title: "Prospecting Call Simulation",
      sessions: ["s-d7-discussion", "s-d7-sim"],   // Nov 20 sessions (Day 7 titles, held on the Day 10 date for batch 110926); ids from LMS_SESSIONS in modules.js
      brief: "Simulation of the pitch deck presentation to your team leader.",
      tasks: [
        { id: "d10-demo-transition", openLabel: "Demo", label: "Log a Transition call through Acqui Service", href: "sims/acqui-demo-transition.html" }
      ],
      exams: [
        { id: "exam-acqui-activities-2", label: "Acqui Service Exam (Part 2): Log Calls and Meetings", href: "sims/acqui-exam-activities-2.html", minutes: 30, kind: "lms", passing: 75 }
      ],
      materialsTitle: "Learning Materials",
      materials: [
        { label: "How to Transition leads to Retention or Support: First Disbursement, Referrals and Transition Call (Notion)", href: "https://app.notion.com/p/firstcircle/How-to-Transition-leads-to-Retention-or-Support-First-Disbursement-Referrals-and-Transition-Call-9f8dd5b3b0a64e9a9585aee0a8b663b2", link: true }
      ]
    }
  }
};
