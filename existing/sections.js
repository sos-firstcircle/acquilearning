/* Dashboard for EXISTING AMs (batch "000002" in shared/roster.js): no 10-day path, just the lectures, simulations and practice exams.
   Everything sits on one screen (dashboard.html draws it with renderExisting()). Hovering a tile shows a Netflix-style card with the thumbnail.
   - id: the same ids the Day 3/4/5 pages use, so a sim ticks / scores exactly as it does for new hires.
   - kind: "lecture" | "practice" | "exam" (badge on the tile). done = Progress tab has the id (exams: a saved score).
   - thumb: picture in existing/thumbs/ (640x360). Replace the file to change it.
   - desc: one line on the hover card. */
window.LMS_EXISTING = [
  { title: "FC Connect", sub: "Guided demos, then the simulation exam", groups: [
    { label: "Navigating Connect Platform", items: [
      { id: "d3-demo-login",        kind: "lecture", label: "Log in to FC Connect (AM)",                   href: "sims/connect-demo.html?fn=login",        thumb: "login",        desc: "A guided run of the Connect login as the Account Manager, then try it yourself." },
      { id: "d3-demo-authrep",      kind: "lecture", label: "Add the authorized representative",           href: "sims/connect-demo.html?fn=authrep",      thumb: "authrep",      desc: "Add the client's authorized representative through Team Access." },
      { id: "d3-demo-settings",     kind: "lecture", label: "Change the representative's name and number", href: "sims/connect-demo.html?fn=settings",     thumb: "settings",     desc: "Update the representative's name and number in Settings." },
      { id: "d3-demo-contact",      kind: "lecture", label: "Add bank accounts (Contacts)",                href: "sims/connect-demo.html?fn=contact",      thumb: "contact",      desc: "Add the client's bank accounts as Contacts." },
      { id: "d3-demo-topup",        kind: "lecture", label: "Top up the wallet (Deposits)",                href: "sims/connect-demo.html?fn=topup",        thumb: "topup",        desc: "Put money into the wallet through a local bank deposit." },
      { id: "d3-demo-transfer",     kind: "lecture", label: "Transfer funds",                              href: "sims/connect-demo.html?fn=transfer",     thumb: "transfer",     desc: "Send funds from the wallet to a saved contact." },
      { id: "d3-demo-drawdown",     kind: "lecture", label: "Use the credit line (Drawdown)",              href: "sims/connect-demo.html?fn=drawdown",     thumb: "drawdown",     desc: "Draw down from the credit line and see how the request works." },
      { id: "d3-demo-uploadchecks", kind: "lecture", label: "Sign the contract and upload checks",         href: "sims/connect-demo.html?fn=uploadchecks", thumb: "uploadchecks", desc: "The client's side: sign the contract and upload the checks." }
    ]},
    { label: "Simulation exam", items: [
      { id: "d4-exam-connect-sim", kind: "exam", label: "Connect Simulation Exam", href: "sims/connect-exam.html", thumb: "connect-exam", desc: "A live-call style simulation in FC Connect. 30 minutes, scored step by step, with trainer notes." }
    ]}
  ]},
  { title: "Acqui Service", sub: "Intro, lead reassignment, lead creation and referrer registration", groups: [
    { label: "Introduction to Acqui Service", items: [
      { id: "d5-acqui-tour",     kind: "lecture",  label: "Tour of Acqui Service",                    href: "sims/acqui-tour.html",           thumb: "tour",     desc: "Your trainer walks you through Acqui Service, section by section." },
      { id: "d5-acqui-practice", kind: "practice", label: "Exploring Acqui Service",           href: "sims/acqui-tour-exam.html",      thumb: "practice", desc: "15 short situations to check you can find things in Acqui Service. Not graded." }
    ]},
    { label: "Getting leads", items: [
      { id: "d5-reassign-lecture",  kind: "lecture",  label: "Lead reassignment",                          href: "sims/acqui-reassign-lecture.html", thumb: "reassign-lecture",  desc: "How to request a lead (reassignment), and when it should be refused." },
      { id: "d5-create-lecture",    kind: "lecture",  label: "Lead creation",                              href: "sims/acqui-create-lecture.html",   thumb: "create-lecture",    desc: "Create a new lead: self-generated or referral, with DTI and SEC lookups." },
      { id: "d5-referrer-demo",      kind: "lecture",  label: "Registering a referrer in Slack",          href: "sims/slack-referrer-demo.html",     thumb: "referrer-demo",     desc: "Register a new regular referrer with /regularnew in Slack: the form, the ID and the proof of bank account." },
      { id: "d5-referrer-practice",  kind: "practice", label: "Registering a Referrer in Slack",          href: "sims/slack-referrer-practice.html", thumb: "referrer-practice", desc: "Do it yourself in a Slack look-alike: the command, the form and the right documents. Scored out of 100, not graded." },
      { id: "d5-reassign-practice", kind: "practice", label: "Getting Leads in Acqui Service",   href: "sims/acqui-reassign-exam.html",    thumb: "reassign-practice", desc: "5 situations in the Acqui Service sim: lead requests and new leads. Not graded." }
    ]},
    { label: "Logging a call", items: [
      { id: "d9-demo-log-call",     kind: "lecture",  label: "Add a contact and log a call",             href: "sims/acqui-demo-log-call.html",     thumb: "demo-log-call",     desc: "A guided run: add a contact in Acqui Service and log the call." },
      { id: "d9-practice-log-call", kind: "practice", label: "Add a contact and log a call by yourself", href: "sims/acqui-practice-log-call.html", thumb: "practice-log-call", desc: "Do it yourself in the Acqui Service sim. Not graded." }
    ]},
    { label: "Logging a meeting", items: [
      { id: "d9-demo-log-meeting",     kind: "lecture",  label: "Log a meeting",              href: "sims/acqui-demo-log-meeting.html",     thumb: "demo-log-meeting",     desc: "A guided run: log a meeting in Acqui Service." },
      { id: "d9-practice-log-meeting", kind: "practice", label: "Log a meeting by yourself",  href: "sims/acqui-practice-log-meeting.html", thumb: "practice-log-meeting", desc: "Do it yourself in the Acqui Service sim. Not graded." }
    ]},
    { label: "Acqui Service exam", items: [
      { id: "exam-acqui-day9", kind: "exam", label: "Acqui Service Exam: Navigation, General Information and Leads", href: "sims/acqui-exam-day9.html", thumb: "exam-acqui-day9", desc: "22 situations in the Acqui Service sim: navigation, general information and leads. 45 minutes, 40 points." }
    ]}
  ]}
];
