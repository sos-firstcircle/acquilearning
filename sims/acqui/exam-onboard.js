/* Day 9 graded exam 3: Acqui Service onboarding follow-up (30 min). Loaded after app.js + lead-ext.js, before exam.js.
   Part 5: a lead that needs resubmission and has clarifications from the risk team (documents, Business profile notes, Financial assessment notes, reply to Risk).
   Part 6: an open BCL whose 30 days after the drawdown are over: check it, then log the Transition call with the Transition playbook. No hints. 1 point each. */
(function(){
  function L(id){ return LEADS.filter(function(l){ return l.id === id; })[0]; }
  function norm(s){ return String(s || "").toLowerCase().replace(/[^a-z0-9]/g, ""); }
  /* fake leads for this exam */
  if (!L("246810")) LEADS.unshift({ id: "246810", name: "Mabuhay Coffee Roasters Inc.", status: "Risk Review", risk: "Information Missing", ba: "For Clarification", channel: "KAM - Self Generated Leads", clo: 0, eng: "2026-11-13", owner: "me", contact: "Tessa Lim", task: { pr: "High", due: "Due today" },
    rk: { docs: [
      { t: "Audited Financial Statement", s: "Not available", why: "" }, { t: "Bank Statement", s: "Verified", why: "" }, { t: "DTI COR", s: "Verified", why: "" }, { t: "Future Revenue", s: "Not available", why: "" },
      { t: "Income Tax Return", s: "In processing", why: "" }, { t: "Personal ID", s: "Requires resubmission", why: "The Personal ID provided cannot be validated at this time. Kindly submit another type of primary ID." }, { t: "Trading Relationship", s: "Not available", why: "" }],
      uw: [{ stage: "Business profile", status: "For Clarification", notes: "Kindly request a valid NBI clearance of the owner, TESSA LIM.", resp: "" },
        { stage: "Credit check", status: "Not Started", notes: "", resp: "" }, { stage: "ESMS", status: "Complete", notes: "", resp: "" },
        { stage: "Financial assessment", status: "For Clarification", notes: "Refer to Hubspot for the details of the findings required for contestation. We have sufficient information to consider the findings as an exact match. Findings are required for contestation.", resp: "" }] } });
  if (!L("255501")) LEADS.unshift({ id: "255501", name: "Brightway Packaging Supplies", status: "Utilized", risk: "Fully Verified with Provisional Limit", ba: "Approved", bclAmt: 200000, rev: 4200000, channel: "KAM - Self Generated Leads", clo: 200000, eng: "2026-10-12", owner: "me", contact: "Rose Dizon" });
  if (!BCLS.some(function(b){ return b.id === "255501"; })) BCLS.unshift({ co: "Brightway Packaging Supplies", id: "255501", team: "Region Team 2", am: ME, bcl: 200000, orig30: 120000, login: "2026-10-09", ym: "2026-10", date: "Oct 9, 2026" });
  var R = "246810", B = "255501";
  var onRisk = function(id){ return function(ev, d){ return ev === "render" && d.route === "lead" && d.id === id && S.ltab === "Risk"; }; };
  var tess = { thread: "tess", who: { name: "Tessa Lim", sub: "Mabuhay Coffee Roasters Inc. · client", av: "TL" } };
  var rose = { thread: "rose", who: { name: "Your situation", sub: "Brightway Packaging Supplies", av: "!" } };

  var T = [
    { type: "nav", text: "Part 1 · Documents and clarifications. Tessa asks why her application is not moving. Open the lead and find her document status.",
      chat: { thread: tess.thread, who: tess.who, msgs: [{ from: "them", text: "Hi {ME}, it's been days and nothing is moving on our application. What is missing? 😟 (Lead: Mabuhay Coffee Roasters Inc., ID 246810)" }] },
      check: onRisk(R) },
    { type: "mcq", text: "Which document needs to be resubmitted?", choices: ["Personal ID", "Bank Statement", "Income Tax Return", "DTI COR", "Audited Financial Statement"],
      chat: { thread: tess.thread, who: tess.who, msgs: [{ from: "me", text: "Let me check your documents." }, { from: "them", text: "Which one do I need to send again?" }] },
      answer: function(){ return ["Personal ID"]; } },
    { type: "mcq", text: "What is the resubmission reason for that document?", choices: ["The ID cannot be validated. Submit another type of primary ID.", "The document is expired.", "The scan is blurry.", "The name does not match the DTI certificate."],
      answer: function(){ return ["The ID cannot be validated. Submit another type of primary ID."]; } },
    { type: "mcq", text: "Under Underwriting, the Business profile is For Clarification (BA clarification). What does the risk team ask for?", choices: ["A valid NBI clearance of the owner", "A recent bank statement", "A new DTI certificate", "A second valid ID"],
      answer: function(){ return ["A valid NBI clearance of the owner"]; } },
    { type: "mcq", text: "The Financial assessment is also For Clarification (BCL clarification). What do the Risk Notes say is required?", choices: ["Findings are required for contestation", "More collateral", "A co-borrower", "A new credit check"],
      answer: function(){ return ["Findings are required for contestation"]; } },
    { type: "act", html: true,
      text: "Reply to Risk on the <b>Financial assessment</b> clarification.",
      chat: { thread: tess.thread, who: tess.who, msgs: [{ from: "them", text: "I confirmed with the bank: I have no cancelled credit cards or loans with the banks they listed. Can you ask them to re-evaluate our application for the credit line? Thank you!" }] },
      reset: function(){ var l = L(R); l.rk.uw[3].resp = ""; },
      grade: function(ev, d){
        if (ev !== "uw-response") return false;
        if (d.id !== R) return "That response is for a different lead.";
        if (d.stage !== "Financial assessment") return "That response is for a different stage. Reply on the Financial assessment.";
        var t = norm(d.text);
        return { items: [{ label: "Replied on the Financial assessment", w: 0.6, ok: true }, { label: "Explained the client has no cancelled cards or loans", w: 0.2, ok: /cancel|loan|credit/.test(String(d.text).toLowerCase()) }, { label: "Asked for a re-evaluation", w: 0.2, ok: /re-?evaluat|reconsider|review/.test(String(d.text).toLowerCase()) }] };
      } },
    { type: "nav", text: "Part 2 · Transition. Brightway Packaging Supplies already did its drawdown more than 30 days ago. Find its Open BCL details.",
      chat: { thread: rose.thread, who: rose.who, msgs: [{ from: "sys", text: "Brightway Packaging Supplies (lead 255501) opened a BCL and did one drawdown on Oct 12. The 30 days to trigger another drawdown are over, so it is time to transition the account to the RM / Customer Success." }] },
      check: function(ev, d){ return ev === "bcl-detail" && d === B; } },
    { type: "input", text: "How much of the BCL is still unused? (BCL amount minus Total originations (30D))", placeholder: "Type the amount",
      answer: function(){ return ["80000"]; } },
    { type: "mcq", text: "What is the important thing to discuss with the client before the transition?", choices: ["Principal Paydown Policy", "The referral bonus", "A new interest rate promo", "The annual fee"],
      answer: function(){ return ["Principal Paydown Policy"]; } },
    { type: "act", html: true,
      text: "Log your <b>Transition call</b> with Rose Dizon of Brightway Packaging Supplies.",
      chat: { thread: rose.thread, who: rose.who, msgs: [
        { from: "sys", text: "You called Rose Dizon and she answered. You explained the Principal Paydown Policy and she understood it." },
        { from: "sys", text: "Her main contact is herself: 09171234567, prefers Viber. Alternative contact: her brother Ben Dizon, 09181234567, Viber calls only, for cheque pick-up concerns. Helpful for the new RM: she pays on the 5th of every month and likes reminders the day before." },
        { from: "sys", text: "Log the call on the lead with the right type and playbook." }] },
      reset: function(){ var l = L(B); if (l) delete l.feed; },
      grade: function(ev, d){
        if (ev !== "activity-logged") return false;
        if (d.kind !== "call") return "That is a meeting, not a call. Log a call.";
        if (d.id !== B) return "That call was logged on a different lead. Use Brightway Packaging Supplies.";
        var v = d.vals, has = function(s, re){ return re.test(String(s || "").toLowerCase()); };
        return { items: [
          { label: "Type: Transition", w: 0.15, ok: d.type === "Transition", exp: "Transition" },
          { label: "Call Outcome: Connected", w: 0.1, ok: d.outcome === "Connected", exp: "Connected" },
          { label: "Contact: Rose Dizon", w: 0.05, ok: norm(d.contact) === "rosedizon", exp: "Rose Dizon" },
          { label: "Playbook: Transition Call", w: 0.2, ok: d.playbook === "Transition Call", exp: "Transition Call" },
          { label: "Main POC filled (name, number)", w: 0.15, ok: has(v.poc, /rose/) && has(v.poc, /0917|917/), exp: "Rose Dizon, 09171234567, Viber" },
          { label: "Alternative contact filled (Ben)", w: 0.1, ok: has(v.alt, /ben/), exp: "Ben Dizon, 09181234567, Viber, cheque pick-up" },
          { label: "Insights for the new RM", w: 0.1, ok: has(v.insight, /5th|reminder|day before/), exp: "pays on the 5th, likes reminders" },
          { label: "Discussed principal paydown: Yes", w: 0.15, ok: v.paydown === "Yes", exp: "Yes" }] };
      },
      undo: function(){ var l = L(B); if (l && l.feed) l.feed.shift(); render(); } }
  ];
  T.forEach(function(t){ t.noHint = true; t.hint = ""; });
  window.ACQUI_EXAM = {
    graded: true, examId: "exam-acqui-onboarding", minutes: 30, passing: 75, askName: true, backLabel: "Back to Day 9",
    events: ["activity-logged", "contact-added", "note-added", "uw-response"],
    title: "Acqui Service Exam, Part 3: Document Status and Transition",
    intro: "You will get " + T.length + " situations in two parts: first a lead with documents to resubmit and clarifications from the risk team, then an account ready to be transitioned. Use the Acqui Service simulation behind this box.",
    scoring: "Every question is worth 1 point. Each wrong answer costs 0.25. Questions where you log or send something are graded per part. There are no hints. Questions you did not answer get 0.",
    tasks: T
  };
})();
