/* List of every exam, used by the admin Exams tab (exams.html) and to label exams on the Grades page.
   id must match the exam id that gets saved to the Sheet. href is relative to the site root.
   group: "product" | "simulation" | "other" (the Exams tab shows them in these sections).
   empty: true = no questions yet (Preview is disabled). */
window.LMS_EXAM_LIST = [
  { group: "product", id: "d3-exam-product-knowledge-1", title: "Product Knowledge Examination 1", where: "Day 3", type: "Multiple choice, true/false, typed and tick-all questions, shuffled", href: "exams/product-knowledge-1.html" },
  { group: "product", id: "exam-product-knowledge-2", title: "Product Knowledge Examination 2", where: "Day 4", type: "Multiple choice, true/false and tick-all questions, shuffled", href: "exams/product-knowledge-2.html" },
  { group: "product", id: "exam-product-knowledge-3", title: "Product Knowledge Examination 3", where: "Day 5", type: "Multiple choice, true/false and tick-all questions, shuffled", href: "exams/product-knowledge-3.html" },
  { group: "simulation", id: "d4-exam-connect-sim", title: "Connect Simulation Exam", where: "Day 4", type: "Simulation with scored steps and notes", href: "sims/connect-exam.html" },
  { group: "simulation", id: "d5-acqui-practice", title: "Find your way around Acqui Service", where: "Day 5", type: "Practice, 15 situational tasks (click, type, pick). Not graded", href: "sims/acqui-tour-exam.html" },
  { group: "simulation", id: "d5-reassign-practice", title: "Lead reassignment and creation in Acqui Service", where: "Day 5", type: "Practice, 5 situations in the Acqui Service sim: 3 lead requests (1 should be refused) and 2 new leads, with DTI/SEC lookups. Not graded", href: "sims/acqui-reassign-exam.html" },
  { group: "simulation", id: "d5-referrer-practice", title: "Registering a referrer in Slack", where: "Day 5", type: "Practice in a Slack look-alike: /regularnew, the form, ID and proof of bank account. Scored out of 100, not graded", href: "sims/slack-referrer-practice.html" },
  { group: "other", id: "d2-exam-business-card", title: "Business Card & Contact Details", where: "Day 2 (all batches except 110926)", type: "Required form: name, work phone, home address, then a summary to acknowledge. Always 100%", href: "lessons/d02-exam-business-card.html" },
  { group: "other", id: "d1-exam-responsible-selling", title: "Foundations of Responsible Selling", where: "Day 1", type: "Agree to 16 statements", href: "lessons/d01-exam-responsible-selling.html" }
];
