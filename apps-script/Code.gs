/**
 * Acquisition Learning Hub — backend (Google Apps Script)
 *
 * Verifies the Google sign-in token, then records progress and grades in the
 * Google Sheet this script is attached to.
 *
 * Setup: see apps-script/README.md
 */

const CLIENT_ID = "PASTE_YOUR_GOOGLE_CLIENT_ID_HERE";
const ALLOWED_DOMAIN = "firstcircle.com";

// "email" = TEMPORARY: trust a typed email if it is in BATCHES or ADMIN_EMAILS (no Google sign-in needed).
//            Not secure: anyone who knows a listed email could submit as that person.
// "google" = verify the Google sign-in token (use once the OAuth client ID exists).
const AUTH_MODE = "email";
const BATCHES = {                 // batch number (start date, MMDDYY) -> onboardee emails. Keep in sync with shared/roster.js
  "000000": [                     // test batch: no retake
    "test1@firstcircle.com",
    "test2@firstcircle.com",
    "test3@firstcircle.com"
  ],
  "000001": [                     // test batch: can retake exams
    "hanna.test@firstcircle.com"
  ],
  "000002": [                   // existing AMs: simulations and practice only; can retake
    "acquisitiongroup@firstcircle.com"
  ],
  "110926": [   // first real onboarding batch: starts Nov 9, 2026 (standard 10-day path, one attempt per exam)
      "benedict.oyek@firstcircle.com",
      "alexander.painaga@firstcircle.com",
      "renell.gatchalian@firstcircle.com",
      "raymund.estebar@firstcircle.com",
      "ralph.aniciete@firstcircle.com",
      "melissa.ligeralde@firstcircle.com",
      "jazon.pulmano@firstcircle.com",
      "hyasmin.lascano@firstcircle.com",
      "leslie.reyes@firstcircle.com",
      "jeremiah.veloria@firstcircle.com",
      "alyssa.moncada@firstcircle.com"
  ]
};

// Who may open the Grades page (admins are allowed in automatically). Optional extra passcode: leave "" for none.
const ADMIN_EMAILS = [
  "salesoperations@firstcircle.com", "nice.junsay@firstcircle.com", "hanna.jo@firstcircle.com",
  "reyster.barron@firstcircle.com", "charles.allen@firstcircle.com", "alan.smyth@firstcircle.com", "michael.limandibhratha@firstcircle.com",
  "sophia.pesa@firstcircle.com", "ayrton.arteficio@firstcircle.com"
];
const ADMIN_PASSCODE = "";

// Batches that may retake exams. Everyone else gets one attempt per exam (enforced here, not just in the browser).
const RETAKE_BATCHES = ["000001", "000002"];

const GRADES_SHEET = "Grades";      // one row per scored attempt
const PROGRESS_SHEET = "Progress";  // one row per completed task/lesson
const GRADES_HEADER = ["Timestamp", "Email", "Name", "Batch", "Exam ID", "Attempt", "Score", "Max", "Percent", "Passed", "Details"];
const PROGRESS_HEADER = ["Timestamp", "Email", "Name", "Batch", "Item ID"];
// Exams that also get their own tab (in addition to the Grades row). Exam ID -> tab name.
const EXAM_TABS = { "d1-exam-responsible-selling": "D1-1", "d4-exam-connect-sim": "D4-1" };
// Site settings (e.g. the trainer name that narrates the Acqui Service tour). One row per setting; admins change them on the Settings page.
const SETTINGS_SHEET = "Settings";
const SETTINGS_HEADER = ["Key", "Value", "Updated", "By"];
// Yes/No replies to live sessions. One row per reply; the latest row per person + session wins. Shown to trainers on sessions.html.
const SESSIONS_SHEET = "Sessions";
const SESSIONS_HEADER = ["Timestamp", "Email", "Name", "Batch", "Session ID", "Answer", "Note", "Informed TL"];
const EXAM_TAB_HEADER = ["Timestamp", "Email", "Name", "Batch", "Attempt", "Score", "Max", "Percent", "Passed", "Details"];
// Exams whose tab needs a different header (default is EXAM_TAB_HEADER). The Connect sim also records the step-by-step breakdown and trainer notes.
const EXAM_TAB_HEADERS = { "d4-exam-connect-sim": ["Timestamp", "Email", "Name", "Batch", "Attempt", "Score", "Max", "Percent", "Passed", "Details", "Breakdown", "Notes"] };

function doPost(e) {
  try {
    const req = JSON.parse(e.postData.contents);
    const user = AUTH_MODE === "email" ? checkEmail_(req) : verifyToken_(req.token);   // throws if not allowed
    const p = req.payload || {};

    if (req.action === "verify") return json_({ ok: true, email: user.email });

    if (req.action === "saveResult") {
      if (RETAKE_BATCHES.indexOf(user.batch) === -1 && readRows_(GRADES_SHEET).some(function (r) { return String(r.Email).toLowerCase() === user.email && r["Exam ID"] === p.id; })) {
        return json_({ ok: false, error: "already-taken" });
      }
      const pct = p.max ? Math.round((p.score / p.max) * 1000) / 10 : "";
      appendByHeader_(sheet_(GRADES_SHEET, GRADES_HEADER), { "Timestamp": new Date(), "Email": user.email, "Name": user.name, "Batch": user.batch ? "'" + user.batch : "", "Exam ID": p.id, "Attempt": p.attempt, "Score": p.score, "Max": p.max, "Percent": pct, "Passed": p.passed ? "Yes" : "No", "Details": p.details || "" });
      if (EXAM_TABS[p.id]) appendByHeader_(sheet_(EXAM_TABS[p.id], EXAM_TAB_HEADERS[p.id] || EXAM_TAB_HEADER), { "Timestamp": new Date(), "Email": user.email, "Name": user.name, "Batch": user.batch ? "'" + user.batch : "", "Attempt": p.attempt, "Score": p.score, "Max": p.max, "Percent": pct, "Passed": p.passed ? "Yes" : "No", "Details": p.details || "", "Breakdown": p.breakdown || "", "Notes": p.notes || "" });
      return json_({ ok: true });
    }
    if (req.action === "complete") {
      appendByHeader_(sheet_(PROGRESS_SHEET, PROGRESS_HEADER), { "Timestamp": new Date(), "Email": user.email, "Name": user.name, "Batch": user.batch ? "'" + user.batch : "", "Item ID": p.id });
      return json_({ ok: true });
    }
    if (req.action === "undo") {          // logged as a row "UNDO:<id>" in Progress; the latest row for an item wins
      appendByHeader_(sheet_(PROGRESS_SHEET, PROGRESS_HEADER), { "Timestamp": new Date(), "Email": user.email, "Name": user.name, "Batch": user.batch ? "'" + user.batch : "", "Item ID": "UNDO:" + p.id });
      return json_({ ok: true });
    }
    if (req.action === "myProgress") {
      const done = {};
      readRows_(PROGRESS_SHEET).forEach(function (r) {
        if (String(r.Email).toLowerCase() !== user.email) return;
        const id = String(r["Item ID"]);
        if (id.indexOf("UNDO:") === 0) delete done[id.substring(5)]; else done[id] = true;
      });
      const results = {};
      readRows_(GRADES_SHEET).forEach(function (r) {
        if (String(r.Email).toLowerCase() !== user.email) return;
        const id = r["Exam ID"], at = new Date(r.Timestamp).getTime() || 0;
        const attempt = { score: Number(r.Score), max: Number(r.Max), passed: r.Passed === "Yes", at: at };
        const cur = results[id] || { history: [] };
        cur.history.push(attempt);
        results[id] = cur;
      });
      Object.keys(results).forEach(function (id) {
        const h = results[id].history;
        const best = h.reduce(function (a, b) { return (b.score / b.max) > (a.score / a.max) ? b : a; });
        results[id] = { status: "done", score: best.score, max: best.max, passed: best.passed, attempts: h.length, history: h, updated: h[h.length - 1].at };
        done[id] = true;
      });
      return json_({ ok: true, done: Object.keys(done).filter(function (id) { return !results[id]; }), results: results });
    }
    if (req.action === "myGrades") {
      return json_({ ok: true, grades: readRows_(GRADES_SHEET).filter(function (r) { return String(r.Email).toLowerCase() === user.email; }) });
    }
    if (req.action === "adminData") {
      if (ADMIN_EMAILS.indexOf(user.email) === -1) throw new Error("not-admin");
      if (ADMIN_PASSCODE && p.passcode !== ADMIN_PASSCODE) throw new Error("passcode-required");
      return json_({ ok: true, grades: readRows_(GRADES_SHEET), progress: readRows_(PROGRESS_SHEET) });
    }
    if (req.action === "saveRsvp") {
      const ans = p.answer === "yes" ? "yes" : p.answer === "no" ? "no" : "";
      if (!p.id || !ans) throw new Error("bad-rsvp");
      let note = String(p.note || "").slice(0, 1000);
      if (/^[=+\-@]/.test(note)) note = "'" + note;     // keep a typed note from being read as a formula
      appendByHeader_(sheet_(SESSIONS_SHEET, SESSIONS_HEADER), { "Timestamp": new Date(), "Email": user.email, "Name": user.name, "Batch": user.batch ? "'" + user.batch : "", "Session ID": String(p.id).slice(0, 60), "Answer": ans, "Note": note, "Informed TL": p.informed ? "Yes" : "" });
      return json_({ ok: true });
    }
    if (req.action === "myRsvps") {
      const out = {};
      readRows_(SESSIONS_SHEET).forEach(function (r) {
        if (String(r.Email).toLowerCase() !== user.email) return;
        out[r["Session ID"]] = { answer: r.Answer, note: String(r.Note || "").replace(/^'/, ""), informed: r["Informed TL"] === "Yes", at: new Date(r.Timestamp).getTime() || 0 };   // later rows overwrite earlier ones
      });
      return json_({ ok: true, rsvps: out });
    }
    if (req.action === "adminRsvps") {
      if (ADMIN_EMAILS.indexOf(user.email) === -1) throw new Error("not-admin");
      return json_({ ok: true, rsvps: readRows_(SESSIONS_SHEET) });
    }
    if (req.action === "getSettings") {       // any allowed person (the tour reads the trainer name)
      const out = {};
      readRows_(SETTINGS_SHEET).forEach(function (r) { if (r.Key) out[r.Key] = r.Value; });
      return json_({ ok: true, settings: out });
    }
    if (req.action === "setSetting") {
      if (ADMIN_EMAILS.indexOf(user.email) === -1) throw new Error("not-admin");
      const key = String(p.key || "").slice(0, 60), val = String(p.value == null ? "" : p.value).slice(0, 200);
      if (!key) throw new Error("no-key");
      const sh = sheet_(SETTINGS_SHEET, SETTINGS_HEADER), vals = sh.getDataRange().getValues();
      for (let i = 1; i < vals.length; i++) {
        if (vals[i][0] === key) { sh.getRange(i + 1, 2, 1, 3).setValues([[val, new Date(), user.email]]); return json_({ ok: true }); }
      }
      appendByHeader_(sh, { "Key": key, "Value": val, "Updated": new Date(), "By": user.email });
      return json_({ ok: true });
    }
    return json_({ ok: false, error: "unknown-action" });
  } catch (err) {
    return json_({ ok: false, error: String(err.message || err) });
  }
}

/** Temporary mode: accept an email that is on the allow list. */
function checkEmail_(req) {
  const email = String(req.email || "").trim().toLowerCase();
  const batch = Object.keys(BATCHES).filter(function (k) { return BATCHES[k].indexOf(email) !== -1; })[0] || "";
  if (!email.endsWith("@" + ALLOWED_DOMAIN) || (!batch && ADMIN_EMAILS.indexOf(email) === -1)) throw new Error("not-on-list");
  return { email: email, name: req.name || email, batch: batch };
}

/** Ask Google to validate the ID token, then enforce audience and domain. */
function verifyToken_(token) {
  if (!token) throw new Error("no-token");
  const res = UrlFetchApp.fetch("https://oauth2.googleapis.com/tokeninfo?id_token=" + encodeURIComponent(token), { muteHttpExceptions: true });
  if (res.getResponseCode() !== 200) throw new Error("bad-token");
  const t = JSON.parse(res.getContentText());
  if (t.aud !== CLIENT_ID) throw new Error("wrong-app");
  if (String(t.email_verified) !== "true") throw new Error("email-not-verified");
  if (!String(t.email).toLowerCase().endsWith("@" + ALLOWED_DOMAIN)) throw new Error("not-company");
  return { email: String(t.email).toLowerCase(), name: t.name || t.email };
}

/** Write a row by matching column NAMES in row 1, so you can reorder columns or add your own. */
// Note: batch values are written with a leading apostrophe so Sheets stores them as text and keeps leading zeros (000001).
function appendByHeader_(sh, obj) {
  const headers = sh.getRange(1, 1, 1, Math.max(sh.getLastColumn(), 1)).getValues()[0];
  sh.appendRow(headers.map(function (h) { return obj.hasOwnProperty(h) ? obj[h] : ""; }));
}

/** Read every row as an object keyed by the column names in row 1. */
function readRows_(name) {
  const sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(name);
  if (!sh || sh.getLastRow() < 2) return [];
  const values = sh.getDataRange().getValues(), headers = values[0];
  return values.slice(1).filter(function (r) { return r.join("") !== ""; }).map(function (r) {
    const o = {};
    headers.forEach(function (h, i) { o[h] = r[i] instanceof Date ? r[i].toISOString() : r[i]; });
    return o;
  });
}

function sheet_(name, header) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(name);
  if (!sh) { sh = ss.insertSheet(name); sh.appendRow(header); sh.setFrozenRows(1); }
  return sh;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
