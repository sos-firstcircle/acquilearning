/* Day 3. Edit only this file to change this day (see modules.js for the fields). */
LMS_DAY_DEFS[3] = {
  title: "FC Connect Platform (Account Staging)",
  brief: "Learn to navigate FC Connect.",
  tasksTitle: "Guided demos",
  materialsTitle: "Further Reading (Notion)",
  // Each demo opens sims/connect-demo.html on that function: a guided run first, then "try it yourself". Practice only, nothing is graded.
  // group = heading on the dashboard (dashboard.html groups tasks that share a group).
  tasks: [
    { id: "d3-demo-login",        group: "Guided Demos (Onboarding)", label: "Log in to FC Connect (AM)",                          href: "sims/connect-demo.html?fn=login" },
    { id: "d3-demo-authrep",      group: "Guided Demos (Onboarding)", label: "Add the authorized representative",                  href: "sims/connect-demo.html?fn=authrep" },
    { id: "d3-demo-settings",     group: "Guided Demos (Onboarding)", label: "Change the representative's name and number",       href: "sims/connect-demo.html?fn=settings" },
    { id: "d3-demo-contact",      group: "Guided Demos (Open BCL)",   label: "Add bank accounts (Contacts)",                       href: "sims/connect-demo.html?fn=contact" },
    { id: "d3-demo-topup",        group: "Guided Demos (Open BCL)",   label: "Top up the wallet (Deposits)",                       href: "sims/connect-demo.html?fn=topup" },
    { id: "d3-demo-transfer",     group: "Guided Demos (Open BCL)",   label: "Transfer funds",                                     href: "sims/connect-demo.html?fn=transfer" },
    { id: "d3-demo-drawdown",     group: "Guided Demos (Open BCL)",   label: "Use the credit line (Drawdown)",                     href: "sims/connect-demo.html?fn=drawdown" },
    { id: "d3-demo-uploadchecks", group: "Guided Demos (Open BCL)",   label: "Sign the contract and upload checks",               href: "sims/connect-demo.html?fn=uploadchecks" }
  ],
  // link:true = link icon bullet (dark, not teal)
  materials: [
    { label: "Add a new team member",             href: "https://www.notion.so/firstcircle/Teams-2001a5890448806abaa9c51315a15579", link: true },
    { label: "Add bank accounts (Contacts)",      href: "https://www.notion.so/firstcircle/Contact-2001a589044880c08e32ddeca52117b8?pvs=25", link: true },
    { label: "Top up the wallet (Deposits)",      href: "https://www.notion.so/firstcircle/Deposits-2001a5890448806c82e6c36e99011fc7", link: true },
    { label: "Transfer funds (Transfers)",        href: "https://www.notion.so/firstcircle/Transfers-2001a5890448800b998cea9f027f8d8c", link: true },
    { label: "Use the credit line (Drawdown)",    href: "https://www.notion.so/firstcircle/Drawdown-2001a58904488098aed9e8b9f6cc47ce", link: true }
  ],
  sessions: ["s-d3-self", "s-d3-virtual"],   // ids from LMS_SESSIONS in modules.js; shown at the bottom of the dropdown with a Yes/No
  // Product Knowledge Exam 1 (2 sections). Questions and answer keys: exams/product-knowledge-1-questions.js
  exam: { id: "d3-exam-product-knowledge-1", label: "Product Knowledge Examination 1", href: "exams/product-knowledge-1.html", kind: "lms", passing: 80 }
};
