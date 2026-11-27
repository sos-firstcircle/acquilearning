/* Day 8. Edit only this file to change this day (see modules.js for the fields). */
// Default (batch 112326 and later): Prospecting Call Discussion. byBatch keeps what batch 110926 already had (holiday placeholder).
// The Prospecting Call Discussion session will come from Google Calendar.
LMS_DAY_DEFS[8] = {
  opens: { "110926": "2026-11-18" },   // batch 110926: stays locked until this date (Manila time), even if Day 7 is done
  title: "Prospecting Call Discussion",
  brief: "• Graded Acqui Service Exam (Part 2)\n• Prospecting call learning materials",
  exams: [
    { id: "exam-acqui-activities-2", label: "Acqui Service Exam (Part 2): Log Calls and Meetings", href: "sims/acqui-exam-activities-2.html", minutes: 30, kind: "lms", passing: 75 }
  ],
  tasks: [],
  materialsTitle: "Prospecting Call Learning Materials",
  materials: [
    { label: "Outbound Prospecting (Notion)", href: "https://app.notion.com/p/firstcircle/ACQ-Platform-based-Selling-Outbound-Prospecting-1d51a5890448805f85dbefb7ea8e670c", link: true },
    { label: "Communication Standards and Tone Guide (Notion)", href: "https://app.notion.com/p/firstcircle/Communication-Standards-Tone-Guide-34c1a5890448800492bbfe0f0be693a4", link: true },
    { label: "Sample prospecting call recording 1", href: "https://drive.google.com/file/d/1Etn1hi9PjyG5qiHI8RoQEn7Jft0N8RD2/view", link: true },
    { label: "Sample prospecting call recording 2", href: "https://drive.google.com/file/d/1s-Di2naBvmqtXjXAUDyGR61Qli3e0dTh/view", link: true }
  ],
  byBatch: {
    "110926": {
      title: "ASEAN Summit 2026 Holiday",
      brief: "Please contact your training manager (Reyster) for what to expect.",
      tasks: [ { id: "d8-message-reyster", label: "Message Reyster (Training Manager) about what to expect" } ],
      exams: [], materialsTitle: "Materials", materials: []
    }
  }
};
