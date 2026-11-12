/* =========================================================
   Acquisition Learning Hub — 2-Week Learning Path (course outline)
   Edit days/day-NN.js to change a day. Edit this file only for weeks, sessions, or to explain fields.

   Content is being rewritten, so every day is empty for now
   (the dashboard shows "Content coming soon" for these).

   Each day file sets LMS_DAY_DEFS[N] = { title, brief, tasks, materials, exam }.
   Each day has a short "brief" (what to expect). It shows in the dropdown while the day is locked.
   To fill in a day, give it a title and any of:
     tasks      checklist items. Each needs a short unique id (don't rename once people start).
                { id:"d1-welcome", label:"Read the welcome note", href:"lessons/d1-welcome.html" }
     materials  reading/links: { label, href }
     exam       optional graded item. It must be done before the next day unlocks.
                { id, label, href, kind, passing }
                kind: "form"    = Google Form or other link (trainer records the score)
                      "sim"     = one of our simulations
                      "trainer" = scored live by the trainer

   The Connect simulation exam is still in the repo at sims/connect-exam.html.
   To bring it back, add this to a day (it reports its score to the Sheet by itself):
     exam:{ id:"exam-connect-sim", label:"Connect Simulation", href:"sims/connect-exam.html", kind:"sim", passing:80 }
   ========================================================= */

window.LMS_WEEKS = { 1: "Week 1", 2: "Week 2" };

window.LMS_DAY_DEFS = {};
// Each day lives in its own file (days/day-01.js ... day-10.js) so several people (or chats) can edit different days
// without touching each other's work. They are loaded here, then days/build.js assembles window.LMS_DAYS.
(function(){
  const base = document.currentScript.src.replace(/modules\.js(\?.*)?$/, "days/");
  const files = Array.from({ length: 10 }, (_, i) => "day-" + String(i + 1).padStart(2, "0") + ".js").concat("build.js");
  files.forEach(f => document.write('<script src="' + base + f + '"><\/script>'));
})();

/* Live sessions shown on the dashboard if no Google Calendar is embedded.
   when: "YYYY-MM-DDTHH:MM" in Philippine time. link: Google Meet or calendar event link.
   Example: { title:"Kickoff with your trainer", when:"2026-10-19T10:00", minutes:60, link:"" } */
window.LMS_SESSIONS = [
  // id: used by days (sessions:["id"]) and for the saved Yes/No. Never rename once people have replied. batch: one batch number or a list. Only people in that batch see the session and are asked Yes/No (admins and other batches do not); shown on the Sessions page. desc: full description ("See details").
  { id:"s-d2-f2f", batch:"110926", title:"Day 2: Onboarding - [F2F] Industry and Product Knowledge Discussion", when:"2026-11-10T15:00", minutes:165, room:"BOTT-1-Board Room (15)", link:"", desc:"" },
  { id:"s-d3-self", batch:"110926", title:"Day 3: Onboarding [Self Pace] - Product Exam 1 & Connect Learning Materials", when:"2026-11-11T09:00", minutes:165, room:"", link:"",
    desc:"Please accomplish Product Exam 1, Guided Demos (Onboarding), and Guided Demos (Open BCL) for the morning." },
  { id:"s-d3-virtual", batch:"110926", title:"Day 3: Onboarding - [Virtual] Product Exam 1 & First Circle Connect Intro Discussion", when:"2026-11-11T14:30", minutes:180, room:"", link:"https://meet.google.com/eno-jkod-mae",
    desc:"Review answers for Product Exam 1. Introduction discussion for our main banking platform, First Circle Connect." },
  { id:"s-d4-self", batch:"110926", title:"Day 4: Onboarding [Self Pace] - Product Exam 2 & FC Connect Simulation Exam", when:"2026-11-12T09:00", minutes:165, room:"", link:"",
    desc:"Please accomplish Product Knowledge Examination 2 and the FC Connect Simulation Exam for the morning." },
  { id:"s-d4-virtual", batch:"110926", title:"Day 4: Onboarding [Virtual] - Intro to Acqui Service Part 1", when:"2026-11-12T14:30", minutes:180, room:"", link:"https://meet.google.com/znc-stnp-owm",
    desc:"Introduction discussion to our in-house CRM, Acquisitions Service (Acqui Service/ACQ SVC)." },
  { id:"s-d5-virtual", batch:"110926", title:"Day 5: Onboarding [Virtual] - Intro to Acqui Service Part 2", when:"2026-11-13T10:00", minutes:120, room:"", link:"https://meet.google.com/tnd-krwh-qgu",
    desc:"Hands-on follow-up to Part 1. We go through the Acqui Service demos and practice checks (tour, lead reassignment, lead creation, registering a referrer in Slack), answer your questions, and review Product Knowledge Examination 3." }
];
