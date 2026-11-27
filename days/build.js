/* Assembles window.LMS_DAYS from the per-day files. Loaded last by modules.js. Don't edit. */
window.LMS_DAY_BATCH = (function(){ try { const u = window.LMS && LMS.user && LMS.user(), b = u ? LMS.batchOf(u.email) : ""; return ((LMS.config || {}).viewAs || {})[b] || b; } catch (e) { return ""; } })();   // the signed-in person's batch (viewAs applied), for byBatch in a day file
window.LMS_DAYS = Array.from({ length: Math.max(10, ...Object.keys(window.LMS_DAY_DEFS).map(Number)) }, (_, i) => {   // days 11+ exist only for batches whose plan (LMS_PLANS in modules.js) lists them
  const day = i + 1;
  const def = window.LMS_DAY_DEFS[day] || {};
  const d = { day, week: day <= 5 ? 1 : 2, title: "", brief: "", tasks: [], materials: [], ...def, ...((def.byBatch || {})[window.LMS_DAY_BATCH] || {}) };   // byBatch: { "<batch>": { ...fields } } = that batch sees these fields instead
  d.exams = d.exams || (d.exam ? [d.exam] : []);   // a day file may set exam:{...} or exams:[{...}, ...]
  d.exam = d.exams[0];
  return d;
});
