/* Day 7. Edit only this file to change this day (see modules.js for the fields). */
// TODO: replace the placeholder below with the real Day 7 content (the Acqui Service exam) once the user gives it.
// Batch 110926: Days 6 to 8 fall on a holiday. The single tickable task keeps the day completable so Days 8-10 are not locked.
LMS_DAY_DEFS[7] = {
  opens: { "110926": "2026-11-17" },   // batch 110926: stays locked until this date (Manila time), even if Day 6 is done
  title: "Acqui Service Exam",
  titles: { "110926": "ASEAN Summit 2026 Holiday" },   // batch 110926 sees this day name instead of title
  brief: "Please contact your training manager (Reyster) for what to expect.",
  tasks: [
    { id: "d7-message-reyster", label: "Message Reyster (Training Manager) about what to expect" }
  ],
  materials: []
};
