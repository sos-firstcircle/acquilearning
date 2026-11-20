/* Assembles window.LMS_DAYS from the per-day files. Loaded last by modules.js. Don't edit. */
window.LMS_DAYS = Array.from({ length: Math.max(10, ...Object.keys(window.LMS_DAY_DEFS).map(Number)) }, (_, i) => {   // days 11+ exist only for batches whose plan (LMS_PLANS in modules.js) lists them
  const day = i + 1;
  const d = { day, week: day <= 5 ? 1 : 2, title: "", brief: "", tasks: [], materials: [], ...(window.LMS_DAY_DEFS[day] || {}) };
  d.exams = d.exams || (d.exam ? [d.exam] : []);   // a day file may set exam:{...} or exams:[{...}, ...]
  d.exam = d.exams[0];
  return d;
});
