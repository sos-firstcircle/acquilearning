/* Day 5. Edit only this file to change this day (see modules.js for the fields). */
LMS_DAY_DEFS[5] = {
  title: "Intro to Acqui Service",
  sessions: ["s-d5-virtual"],   // ids from LMS_SESSIONS in modules.js; shown at the bottom of the dropdown
  brief: "Find your way around Acqui Service, our CRM, then learn to request a lead (reassignment) and to enroll a new lead.",
  materialsTitle: "Further Reading",
  materialsBelow: true,
  groupFull: ["Introduction to Acqui Service"],   // this group spans the whole row; the other two sit side by side below it
  groupColumns: true,          // the two task groups sit side by side (see dashboard.html)        // Further Reading goes under the task groups, not beside them (see dashboard.html)
  // All of these open a simulation of the Acqui Service screens (fake data, nothing real is touched). Practice only: nothing is graded.
  // The sims tick the task themselves when finished (if signed in). Source: sims/acqui-*.html, shared code in sims/acqui/ (see build-standalone.py for the shareable single-file versions).
  tasks: [
    { id: "d5-acqui-tour",         group: "Introduction to Acqui Service", openLabel: "Demo", label: "Tour of Acqui Service",                                        href: "sims/acqui-tour.html" },
    { id: "d5-acqui-practice",     group: "Introduction to Acqui Service", openLabel: "Practice", label: "Find your way around Acqui Service",                 href: "sims/acqui-tour-exam.html" },
    { id: "d5-reassign-lecture",   group: "Getting Leads in Acqui Service", openLabel: "Demo", label: "Lead Reassignment in Acqui Service",                       href: "sims/acqui-reassign-lecture.html" },
    { id: "d5-create-lecture",     group: "Getting Leads in Acqui Service", openLabel: "Demo", label: "Lead Creation in Acqui Service",          href: "sims/acqui-create-lecture.html" },
    { id: "d5-reassign-practice",  group: "Getting Leads in Acqui Service", openLabel: "Practice", label: "Lead reassignment and creation in Acqui Service",         href: "sims/acqui-reassign-exam.html" },
    { id: "d5-referrer-demo",       group: "Related: Registering a Referrer in Slack", openLabel: "Demo", label: "How to register a referrer",   href: "sims/slack-referrer-demo.html" },
    { id: "d5-referrer-practice",   group: "Related: Registering a Referrer in Slack", openLabel: "Practice", label: "Register a referrer yourself",    href: "sims/slack-referrer-practice.html" }
  ],
  // Questions and answer keys: exams/product-knowledge-3-questions.js
  exams: [
    { id: "exam-product-knowledge-3", label: "Product Knowledge Examination 3", href: "exams/product-knowledge-3.html", kind: "lms", passing: 75 }
  ],
  // The Notion link is the "Document Guidelines" bookmark from downloads/Bookmarks.html.
  materials: [
    { label: "How to review onboarding docs (Notion)", href: "https://app.notion.com/p/firstcircle/How-to-Review-Onboarding-Documents-404df9ae1e7e4943b5bca9e0efcc8f0b", link: true }
  ]
};
