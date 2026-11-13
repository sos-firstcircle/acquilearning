/* Day 6. Edit only this file to change this day (see modules.js for the fields). */
LMS_DAY_DEFS[6] = {
  opens: { "110926": "2026-11-16" },   // batch 110926: stays locked until this date (Manila time), even if Day 5 is done
  title: "Acqui Service Training",
  titles: { "110926": "ASEAN Summit 2026 Holiday" },   // batch 110926 sees this day name instead of title
  // TODO: replace with the real Day 6 content (batch 110926 falls on a holiday, so this is only a note for now).
  brief: "Please contact your training manager (Reyster) for what to expect.",
  // One tickable task so the day can still be completed and Days 7-10 do not stay locked.
  tasks: [
    { id: "d6-message-reyster", label: "Message Reyster (Training Manager) about what to expect" }
  ],
  materials: []
};
