/* Day 10 graded exam: Acqui Service Exam 3 part 2, one lead's story (30 min). Loaded after app.js + lead-ext.js, before exam.js.
   Story: Villanueva Hardware Trading goes through 1) a Prospecting call (notes only), 2) a Discovery call (Inbound Discovery Call playbook), then a time skip:
   the BCL is opened and utilized, 3) find the Open BCL, 4) work out the unused amount, 5) Transition call (Transition Call playbook). No hints. 1 point each, graded per field. */
(function(){
  function L(id){ return LEADS.filter(function(l){ return l.id === id; })[0]; }
  function norm(s){ return String(s || "").toLowerCase().replace(/[^a-z0-9]/g, ""); }
  var has = function(s, re){ return re.test(String(s || "").toLowerCase()); };
  var ID = "262005";
  if (!L(ID)) LEADS.unshift({ id: ID, name: "Villanueva Hardware Trading", channel: "KAM - Self Generated Leads", entry: "KAM - Self Generated Leads", touch: "KAM - Self Generated Leads", owner: "me", contact: "Ramon Villanueva" });
  function early(){ var l = L(ID); l.status = "For Engagement"; l.risk = "-"; delete l.ba; delete l.bclAmt; l.clo = 0; l.eng = "2026-11-12"; l.task = { pr: "High", due: "Due today" };
    l.contacts = [{ fn: "Ramon", ln: "Villanueva", role: "Owner", rel: "Decision Maker", phones: ["09171230777"], emails: ["ramon.villanueva@example.com"] }];
    for (var i = BCLS.length - 1; i >= 0; i--) if (BCLS[i].id === ID) BCLS.splice(i, 1); }
  function late(){ var l = L(ID); l.status = "Utilized"; l.risk = "Fully Verified with Provisional Limit"; l.ba = "Approved"; l.bclAmt = 500000; l.clo = 500000; l.eng = "2026-10-12"; delete l.task;
    if (!BCLS.some(function(b){ return b.id === ID; })) BCLS.unshift({ co: "Villanueva Hardware Trading", id: ID, team: "Region Team 2", am: ME, bcl: 500000, orig30: 300000, login: "2026-10-12", ym: "2026-10", date: "Oct 12, 2026" }); }
  early();
  var story = { thread: "story", who: { name: "Your situation", sub: "Villanueva Hardware Trading · lead " + ID, av: "!" } };
  var wipe = function(){ var l = L(ID); if (l) { early(); delete l.feed; } };
  var undoFeed = function(){ var l = L(ID); if (l && l.feed) l.feed.shift(); render(); };
  var logCheck = function(kind, wrong){ return function(ev, d){ if (ev !== "activity-logged") return false; if (d.kind !== kind) return wrong; if (d.id !== ID) return "That was logged on a different lead. Use Villanueva Hardware Trading (lead " + ID + ")."; return true; }; };

  var tPros = { type: "act", html: true, text: "Log your first call with <b>Ramon Villanueva</b>.",
    chat: { thread: story.thread, who: story.who, msgs: [
      { from: "sys", text: "Villanueva Hardware Trading is your own lead. Its owner, Ramon Villanueva, is already a contact on it. This is your first call to him: you want to get through to him and book a meeting." },
      { from: "sys", text: "He picked up and listened. He is open to hear about a credit line and wants a longer call about his business this Thursday at 2 PM. You agreed." },
      { from: "sys", text: "Log the call on the lead. No playbook, just notes." }] },
    reset: wipe,
    grade: function(ev, d){
      var c = logCheck("call", "That is a meeting, not a call. Log a call.")(ev, d); if (c !== true) return c;
      return { items: [
        { label: "Type: Prospecting", w: 0.3, ok: d.type === "Prospecting", exp: "Prospecting (getting through to the decision maker and booking a call)" },
        { label: "Call Outcome: Connected", w: 0.2, ok: d.outcome === "Connected", exp: "Connected" },
        { label: "Contact: Ramon Villanueva", w: 0.1, ok: norm(d.contact).indexOf("ramon") >= 0, exp: "Ramon Villanueva" },
        { label: "Notes added (what was agreed)", w: 0.3, ok: String((d.vals && d.vals.notes) || d.notes || "").trim().length >= 15, exp: "a short note, e.g. call on Thursday 2 PM" },
        { label: "No playbook (notes only)", w: 0.1, ok: d.playbook === "No playbook", exp: "No playbook, just notes" }] };
    }, undo: undoFeed };

  var tDiscQ = { type: "mcq", text: "Thursday, 2 PM. You will call Ramon to learn about his business and its financing needs. Which call Type do you log?",
    choices: ["Prospecting", "Discovery", "Check-in", "Nurturing", "Transition"],
    chat: { thread: story.thread, who: story.who, msgs: [{ from: "sys", text: "It is now Thursday, 2 PM. Time for your longer call with Ramon." }] },
    answer: function(){ return ["Discovery"]; } };

  var V = { spoke: /ramon/, region: "Luzon (outside NCR)", rev: ">5M to 20M", funds: "Inventory / Supplies", driver: "Seasonal demand", partner: "Bank" };
  var tDisc = { type: "act", html: true, text: "Log your <b>Discovery call</b> with Ramon Villanueva, using its playbook.",
    chat: { thread: story.thread, who: { name: "Your call notes", sub: "Villanueva Hardware Trading · phone call", av: "📞" }, msgs: [
      { from: "sys", text: "You called Ramon and he answered. He told you: the business is a hardware trading company in Bulacan (outside NCR) and has operated for 8 years. It sells to contractors. Annual revenue is around 8 million. He needs money to buy inventory, because demand rises in the dry season. He has a bank credit line already." },
      { from: "sys", text: "His thoughts on First Circle: interested, but he asked how fast the drawdown is. No other objections. Next step: you will send the application link and follow up on Monday." },
      { from: "sys", text: "Log the call with the right type, outcome, contact and playbook." }] },
    reset: wipe,
    grade: function(ev, d){
      var c = logCheck("call", "That is a meeting, not a call. Log a call.")(ev, d); if (c !== true) return c;
      var v = d.vals || {};
      return { items: [
        { label: "Type: Discovery", w: 0.15, ok: d.type === "Discovery", exp: "Discovery" },
        { label: "Call Outcome: Connected", w: 0.05, ok: d.outcome === "Connected", exp: "Connected" },
        { label: "Contact: Ramon Villanueva", w: 0.05, ok: norm(d.contact).indexOf("ramon") >= 0, exp: "Ramon Villanueva" },
        { label: "Playbook: Inbound Discovery Call", w: 0.15, ok: d.playbook === "Inbound Discovery Call", exp: "Inbound Discovery Call (the call playbook for discovery)" },
        { label: "Spoke with (Ramon, owner)", w: 0.05, ok: has(v.spoke, V.spoke), exp: "Ramon Villanueva, Owner" },
        { label: "Region", w: 0.05, ok: v.region === V.region, exp: V.region },
        { label: "Years in operation", w: 0.05, ok: has(v.years, /8|eight/), exp: "8 years" },
        { label: "Nature of business / buyers", w: 0.05, ok: has(v.nature, /hardware|contractor|trading/), exp: "Hardware trading, sells to contractors" },
        { label: "Annual revenue", w: 0.1, ok: v.rev === V.rev, exp: V.rev },
        { label: "Use of funds", w: 0.1, ok: v.funds === V.funds, exp: V.funds },
        { label: "What is driving the need", w: 0.05, ok: v.driver === V.driver, exp: V.driver },
        { label: "Financial partner", w: 0.05, ok: v.partner === V.partner, exp: V.partner },
        { label: "Thoughts / objections noted", w: 0.05, ok: has(v.thoughts, /fast|speed|drawdown|interest/), exp: "interested, asked how fast the drawdown is" },
        { label: "Next steps noted", w: 0.05, ok: has(v.next, /link|monday|follow/), exp: "send the application link, follow up on Monday" }] };
    }, undo: undoFeed };

  var tBcl = { type: "nav", text: "Time skip: weeks later. Villanueva Hardware Trading opened a BCL and has already used it. Find its Open BCL details.",
    setup: late,
    chat: { thread: story.thread, who: story.who, msgs: [
      { from: "sys", text: "Several weeks passed. After your discovery call, Ramon applied. The BCL was approved and opened, and he did a drawdown on Oct 12 (lead 262005)." },
      { from: "sys", text: "The 30 days to trigger another drawdown are over, so it is time to transition the account to the RM / Customer Success. First, check the BCL." }] },
    check: function(ev, d){ return ev === "bcl-detail" && d === ID; } };
  var tAmt = { type: "input", text: "How much of the BCL is still unused? (BCL amount minus Total originations (30D))", placeholder: "Type the amount",
    answer: function(){ return ["200000"]; } };
  var tPay = { type: "mcq", text: "What is the important thing to discuss with the client before the transition?", choices: ["Principal Paydown Policy", "The referral bonus", "A new interest rate promo", "The annual fee"],
    answer: function(){ return ["Principal Paydown Policy"]; } };

  var tTrans = { type: "act", html: true, text: "Log your <b>Transition call</b> with Ramon Villanueva.",
    chat: { thread: story.thread, who: story.who, msgs: [
      { from: "sys", text: "You called Ramon and he answered. You explained the Principal Paydown Policy and he understood it." },
      { from: "sys", text: "His main contact is himself: 09171230777, prefers Viber. Alternative contact: his bookkeeper Lorna Cruz, 09181230777, SMS only, for payment and statement concerns. Helpful for the new RM: he pays his suppliers every 15th and 30th, and he prefers calls before 10 AM." },
      { from: "sys", text: "Log the call on the lead with the right type and playbook." }] },
    reset: wipe,
    grade: function(ev, d){
      var c = logCheck("call", "That is a meeting, not a call. Log a call.")(ev, d); if (c !== true) return c;
      var v = d.vals || {};
      return { items: [
        { label: "Type: Transition", w: 0.15, ok: d.type === "Transition", exp: "Transition" },
        { label: "Call Outcome: Connected", w: 0.1, ok: d.outcome === "Connected", exp: "Connected" },
        { label: "Contact: Ramon Villanueva", w: 0.05, ok: norm(d.contact).indexOf("ramon") >= 0, exp: "Ramon Villanueva" },
        { label: "Playbook: Transition Call", w: 0.2, ok: d.playbook === "Transition Call", exp: "Transition Call" },
        { label: "Main POC filled (name, number)", w: 0.15, ok: has(v.poc, /ramon/) && has(v.poc, /0917|917/), exp: "Ramon Villanueva, 09171230777, Viber" },
        { label: "Alternative contact filled (Lorna)", w: 0.1, ok: has(v.alt, /lorna/), exp: "Lorna Cruz, 09181230777, SMS only, payment and statement concerns" },
        { label: "Insights for the new RM", w: 0.1, ok: has(v.insight, /15|30|10 am|before 10|morning/), exp: "pays on the 15th and 30th, calls before 10 AM" },
        { label: "Discussed principal paydown: Yes", w: 0.15, ok: v.paydown === "Yes", exp: "Yes" }] };
    }, undo: undoFeed };

  var T = [tPros, tDiscQ, tDisc, tBcl, tAmt, tPay, tTrans];
  T.forEach(function(t){ t.noHint = true; t.hint = ""; });
  window.ACQUI_EXAM = {
    graded: true, examId: "exam-acqui-activities-2", minutes: 30, passing: 75, askName: true, backLabel: "Back to Day 10",
    events: ["activity-logged", "contact-added", "note-added"],
    title: "Acqui Service Exam (Part 2): Log Calls and Meetings",
    intro: "You will get " + T.length + " situations about one lead, Villanueva Hardware Trading: a prospecting call, a discovery call, and later, after the BCL is opened and used, a transition call. Read the messages on the right, then do it in Acqui Service. Open the lead from the Lead List or search it.",
    scoring: "Every question is worth 1 point. Each wrong answer costs 0.25. Questions where you log something are graded per part (type, outcome, contact, playbook answers...). There are no hints. Questions you did not answer get 0.",
    tasks: T
  };
})();
