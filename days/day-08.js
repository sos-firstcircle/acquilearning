/* Day 8. Edit only this file to change this day (see modules.js for the fields). */
// TODO: Day 8 real content (the live prospecting call simulation) goes here when the user provides it.
// For now this is a holiday placeholder: the single tickable task lets the day complete so Days 9-10 can unlock.
LMS_DAY_DEFS[8] = {
  opens: { "110926": "2026-11-18" },   // batch 110926: stays locked until this date (Manila time), even if Day 7 is done
  title: "Live Prospecting Call Simulation",
  titles: { "110926": "ASEAN Summit 2026 Holiday" },   // batch 110926 sees this day name instead of title
  brief: "Please contact your training manager (Reyster) for what to expect.",
  tasks: [
    { id: "d8-message-reyster", label: "Message Reyster (Training Manager) about what to expect" }
  ],
  materials: []
};
