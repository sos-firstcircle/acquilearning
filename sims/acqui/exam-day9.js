/* Day 9 graded exam: Navigation, General Information, Lead Creation and Reassignment (one exam, 45 min).
   Merges exam-nav.js (17 questions) and exam-leads.js (5 situations). The page (acqui-exam-day9.html) loads both, saving the first config in window.__E1.
   Total 40 points: 17 one-point questions (Parts 1 and 2) + 5 lead situations worth 3 (the trick one) and 5, 5, 5, 5 points ( set with pts on each task, see exam.js). */
(function(){
  var E1 = window.__E1, E2 = window.ACQUI_EXAM, tasks = E1.tasks.concat(E2.tasks);
  if (E2.tasks[0] && typeof E2.tasks[0].text === "string") E2.tasks[0].text = "Part 3 · Lead creation and reassignment. " + E2.tasks[0].text;
  window.ACQUI_EXAM = {
    graded: true, examId: "exam-acqui-day9", minutes: 45, passing: 75, askName: true, backLabel: "Back to Day 9",
    title: "Acqui Service Exam: Navigation, General Information and Leads",
    intro: "You will get " + tasks.length + " questions, one at a time. Part 1 is navigation, Part 2 is general information on a lead, Part 3 is getting leads: you will read messages from your referrer and others, then request or create the lead in Acqui Service, the way you would for real. Use the three tabs at the top: Acqui Service, the SEC website and the DTI website.",
    scoring: "The exam is worth 40 points. In Parts 1 and 2 every question is worth 1 point (17 points). In Part 3 the trick situation is worth 3 points and each of the other four is worth 5 points (23 points), given in parts: channel, referrer, registration number, contact details and so on. A wrong answer costs 0.25. Creating a lead that already exists, or typing a fake registration number, loses points. There are no hints. Questions you did not answer get 0.",
    tasks: tasks
  };
})();
