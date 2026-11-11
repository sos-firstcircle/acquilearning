/* Day 9. Edit only this file to change this day (see modules.js for the fields). */
LMS_DAY_DEFS[9] = {
  title: "Role-Play Assessment",
  brief: "Client-facing role-play: discovery, objection, close.",
  tasks: [],
  // Graded Acqui Service exams (clones of the Day 5 practice sims). Both are "soon" (no exam page yet) but blocks:true, so Day 9 stays incomplete and Day 10 locked.
  // `desc` is the description shown on the card.
  exams: [
    { id: "exam-acqui-nav", label: "Acqui Service Exam, Part 1: Navigation", soon: true, blocks: true, minutes: 20, kind: "lms", passing: 80,
      desc: "Graded exam, 20 minutes. Basic navigation of Acqui Service, like the tour and the first practice: finding your way around the screens." },
    { id: "exam-acqui-lead", label: "Acqui Service Exam, Part 2: Lead Level", soon: true, blocks: true, minutes: 40, kind: "lms", passing: 80,
      desc: "Graded exam, 40 minutes. Lead creation, lead reassignment and lead activities (such as call logging)." }
  ],
  materials: []
};
