/* Day 9. Edit only this file to change this day (see modules.js for the fields). */
LMS_DAY_DEFS[9] = {
  opens: { "110926": "2026-11-19" },   // batch 110926: stays locked until this date (Manila time), even if Day 8 is done
  title: "Role-Play Assessment",
  brief: "Client-facing role-play: discovery, objection, close.",
  tasks: [],
  sessions: ["s-d6-self", "s-d6-virtual"],   // Nov 19 sessions (Day 6 titles, held on the Day 9 date for batch 110926); ids from LMS_SESSIONS in modules.js
  // Three graded Acqui Service exams (Acqui Service simulation, fake data). Pages: sims/acqui-exam-*.html, scripts: sims/acqui/exam-*.js, screens: sims/acqui/lead-ext.js.
  // Day 9 stays incomplete (and Day 10 locked) until all three are done.
  exams: [
    { id: "exam-acqui-nav", label: "Acqui Service Exam 1: Navigation and General Information", href: "sims/acqui-exam-nav.html", minutes: 20, kind: "lms", passing: 75,
      desc: "Graded, 20 minutes. Basic navigation of Acqui Service, then finding general information on a lead: Lead ID, owner, CLO, tasks, related parties, BCL and BA status, documents and BCL details." },
    { id: "exam-acqui-lead", label: "Acqui Service Exam 2: Lead Level", href: "sims/acqui-exam-lead.html", minutes: 40, kind: "lms", passing: 75,
      desc: "Graded, 40 minutes. Search a lead and decide whether to get it, create a lead, request a lead, add a contact, log a Prospecting call and log a face-to-face Discovery meeting." },
    { id: "exam-acqui-onboarding", label: "Acqui Service Exam 3: Document Status and Transition", href: "sims/acqui-exam-onboarding.html", minutes: 30, kind: "lms", passing: 75,
      desc: "Graded, 30 minutes. Check document status, resubmission notes and the risk team's clarifications, then log the Transition call with the Transition playbook." }
  ],
  materials: []
};
