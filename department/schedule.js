// Work schedule (acquisition teams only) and seat plan images, per weekday.
// Seat plan images live in department/seatplan/. Edit the `teams` lists to change the schedule.
window.DEPT_SCHEDULE = [
  { day: "Monday", key: "mon", teams: ["SalesOps", "Inbound, CLO, Specialised (Justin)", "ESBT 2 (Jay Ann)", "EXBT-3 (Jay Ann)", "EXBT-5 (Brian)", "EXBT-7 (Leslie)", "EMBT-2 (Jico)", "EMBT-3 (Chot)"] },
  { day: "Tuesday", key: "tue", teams: ["SalesOps", "ESBT 2 (Jay Ann)", "EXBT-3 (Jay Ann)", "EXBT-6 (Aly)", "EXBT-7 (Leslie)", "EMBT-1 (Klang)", "Region"] },
  { day: "Wednesday", key: "wed", teams: ["Top Gun + SDR", "ESBT 1 (Jad)", "EXBT-1 (Rox)", "EXBT-2 (Jad)", "EMBT-2 (Jico)", "EMBT-3 (Chot)", "Region"] },
  { day: "Thursday", key: "thu", teams: ["Top Gun + SDR", "ESBT 1 (Jad)", "EXBT-1 (Rox)", "EXBT-2 (Jad)", "EXBT-4 (Chuck)", "EXBT-6 (Aly)"] },
  { day: "Friday", key: "fri", teams: ["Inbound, CLO, Specialised (Justin)", "EXBT-4 (Chuck)", "EXBT-5 (Brian)", "EMBT-1 (Klang)"] }
];

// Work schedule finder. `find` = text a day's team label starts with; `note` = special note shown for the team.
window.DEPT_FINDER = [
  { label: "All teams" },
  { label: "Inbound (Justin)", find: "Inbound, CLO" },
  { label: "CLO Activation (Justin)", find: "Inbound, CLO" },
  { label: "Specialized Sales Team (Justin)", find: "Inbound, CLO" },
  { label: "ESBT 1 (Jad)", find: "ESBT 1" },
  { label: "ESBT 2 (Jay Ann)", find: "ESBT 2" },
  { label: "EXBT 1 (Rox)", find: "EXBT-1" },
  { label: "EXBT 2 (Jad)", find: "EXBT-2" },
  { label: "EXBT 3 (Jay Ann)", find: "EXBT-3" },
  { label: "EXBT 4 (Chuck)", find: "EXBT-4" },
  { label: "EXBT 5 (Brian)", find: "EXBT-5" },
  { label: "EXBT 6 (Aly)", find: "EXBT-6" },
  { label: "EXBT 7 (Leslie)", find: "EXBT-7" },
  { label: "EMBT 1 (Klang)", find: "EMBT-1" },
  { label: "EMBT 2 (Jico)", find: "EMBT-2" },
  { label: "EMBT 3 (Chot)", find: "EMBT-3" },
  { label: "Region", find: "Region", note: "All team members are working remotely in their respective provinces, except when asked to RTO. The Region 1 Team Lead reports to the BGC Office every Tuesday and Wednesday." },
  { label: "Top Gun + SDR", find: "Top Gun" },
  { label: "Sales Operations", find: "SalesOps" },
  { label: "Partnerships", find: null, note: "Communicate with the Partnership Manager or Alan for the exact work schedule." }
];
