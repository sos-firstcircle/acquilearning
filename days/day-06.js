/* Day 6. Edit only this file to change this day (see modules.js for the fields). */
// Default (batch 112326 and later): Bonifacio Day holiday. byBatch keeps what batch 110926 already had.
LMS_DAY_DEFS[6] = {
  opens: { "110926": "2026-11-16" },   // batch 110926: stays locked until this date (Manila time), even if Day 5 is done
  title: "Bonifacio Day",
  brief: "Holiday: no training today. Enjoy your rest day!",
  // One tickable task so the day can be completed and Day 7 opens.
  tasks: [
    { id: "d6-holiday", label: "Bonifacio Day: no training today. Tick this to open Day 7." }
  ],
  materials: [],
  byBatch: {
    "110926": {
      title: "ASEAN Summit 2026 Holiday",
      brief: "Please contact your training manager (Reyster) for what to expect.",
      tasks: [ { id: "d6-message-reyster", label: "Message Reyster (Training Manager) about what to expect" } ],
      materials: []
    }
  }
};
