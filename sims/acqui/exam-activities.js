/* Day 9 graded exam 3: one lead, from first call to first meeting (25 min). Loaded after app.js + lead-ext.js, before exam.js.
   Story: Santos Frozen Foods is already your lead (self-generated) but you only have the applicant's contact. 1) add the owner as a contact, 2) call him
   (Prospecting, with notes: he wants a face-to-face meeting), 3) log the Discovery meeting (F2F, Outbound playbook). Two short knowledge questions in between.
   5 questions, 1 point each, graded per field. No hints. */
(function(){
  function L(id){ return LEADS.filter(function(l){ return l.id === id; })[0]; }
  function norm(s){ return String(s || "").toLowerCase().replace(/[^a-z0-9]/g, ""); }
  var phoneN = function(x){ return String(x || "").replace(/\D/g, "").replace(/^(0|63)/, ""); };
  var ID = "260412";
  if (!L(ID)) LEADS.unshift({ id: ID, name: "Santos Frozen Foods", status: "For Engagement", risk: "-", channel: "KAM - Self Generated Leads", entry: "KAM - Self Generated Leads", touch: "KAM - Self Generated Leads", clo: 0, eng: "2026-11-12", owner: "me", contact: "Ana Santos", task: { pr: "High", due: "Due today" } });
  var C = { fn: "Rolando", ln: "Santos", phone: "09175550199", email: "dado.santos@example.com" };
  var lead = ["Lead", ID];

  var tContact = { type: "act", html: true,
    text: "Add the owner as a contact on <b>Santos Frozen Foods</b>.",
    chat: { thread: "story", who: { name: "Your situation", sub: "Santos Frozen Foods · lead " + ID, av: "!" }, msgs: [
      { from: "sys", text: "Santos Frozen Foods is your own lead. So far the only contact on it is Ana Santos, the applicant (she keeps the shop's books)." },
      { from: "sys", text: "Ana told you the owner decides on financing: her brother Rolando 'Dado' Santos. His number is 09175550199 and his email is dado.santos@example.com. Add him as a contact on the lead before you call." } ] },
    reset: function(){ var l = L(ID); if (l) { delete l.contacts; delete l.feed; l.eng = "2026-11-12"; } },
    grade: function(ev, d){
      if (ev !== "contact-added") return false;
      if (d.id !== ID) return "That contact was added to a different lead. Use Santos Frozen Foods (lead " + ID + ").";
      var c = d.c;
      return { items: [
        { label: "First name", w: 0.15, ok: norm(c.fn) === norm(C.fn), exp: C.fn },
        { label: "Last name", w: 0.15, ok: norm(c.ln) === norm(C.ln), exp: C.ln },
        { label: "Phone number", w: 0.25, ok: c.phones.some(function(p){ return phoneN(p) === phoneN(C.phone); }), exp: C.phone },
        { label: "Email", w: 0.25, ok: c.emails.some(function(e){ return norm(e) === norm(C.email); }), exp: C.email },
        { label: "Relationship Type", w: 0.2, ok: c.rel === "Decision Maker", exp: "Decision Maker" }] };
    },
    undo: function(){ var l = L(ID); if (l && l.contacts) l.contacts.pop(); render(); } };

  var tType = { type: "mcq", text: "You are about to call Dado for the first time. You only want to get through to him and book a meeting. Which call Type do you log?",
    choices: ["Prospecting", "Discovery", "Check-in", "Nurturing", "Referral Related"],
    chat: { thread: "story", who: { name: "Your situation", sub: "Santos Frozen Foods · lead " + ID, av: "!" }, msgs: [{ from: "sys", text: "Dado is now on the lead. Time to call him." }] },
    answer: function(){ return ["Prospecting"]; } };

  var notesOk = function(s){ return String(s || "").trim().length >= 15; };
  var tCall = { type: "act", html: true,
    text: "Log your call with <b>Dado Santos</b>.",
    chat: { thread: "story", who: { name: "Your situation", sub: "Santos Frozen Foods · lead " + ID, av: "!" }, msgs: [
      { from: "sys", text: "You called Dado. He picked up and listened to you. He is open to hear more about a credit line and asked to meet face to face next Tuesday at 10 AM at their cold storage. You agreed." },
      { from: "sys", text: "Log the call on the lead. No playbook, just notes." }] },
    reset: function(){ var l = L(ID); if (l) delete l.feed; },
    grade: function(ev, d){
      if (ev !== "activity-logged") return false;
      if (d.kind !== "call") return "That is a meeting, not a call. Log a call.";
      if (d.id !== ID) return "That call was logged on a different lead. Use Santos Frozen Foods.";
      return { items: [
        { label: "Type: Prospecting", w: 0.3, ok: d.type === "Prospecting", exp: "Prospecting (you are booking a meeting)" },
        { label: "Call Outcome: Connected", w: 0.2, ok: d.outcome === "Connected", exp: "Connected" },
        { label: "Contact: Rolando Santos", w: 0.1, ok: norm(d.contact).indexOf("santos") >= 0 && norm(d.contact).indexOf("rolando") >= 0, exp: "Rolando Santos" },
        { label: "Notes added (what was agreed)", w: 0.3, ok: notesOk(d.notes), exp: "a short note, e.g. meeting Tuesday 10 AM" },
        { label: "No playbook (notes only)", w: 0.1, ok: d.playbook === "No playbook", exp: "No playbook, just notes" }] };
    },
    undo: function(){ var l = L(ID); if (l && l.feed) l.feed.shift(); render(); } };

  var tPb = { type: "mcq", text: "Tuesday came. You are now logging a face-to-face meeting to discover the business and its financing needs. Which playbook fits?",
    choices: ["Outbound - Discovery Meeting Playbook", "Outbound - Ambush Visit Playbook", "Outbound - Follow Up Document Playbook", "Outbound - Drawdown Assist Meeting", "Transition Call"],
    answer: function(){ return ["Outbound - Discovery Meeting Playbook"]; } };

  var M = { heard: "Yes", opyrs: "1-3 years", prod: "Manufacturing", clients: "Businesses Local & Government", emp: "18", banks: "2", rev: "1-4M Php", sup: "No payment terms", cus: "<30 days", fund: "None", pain: "Cannot buy inventory in bulk", role: "Decision Maker - GM/President", proceed: "Yes", feature: "6. Speed of application and draw down" };
  var LAB = { heard: "Heard of First Circle", opyrs: "Years operating", prod: "Products or services", clients: "Type of clients", emp: "Regular employees", banks: "Bank accounts", rev: "Annual gross revenue", sup: "Supplier payment terms", cus: "Customer payment terms", fund: "Existing funding partners", pain: "Main pain point", role: "Highest role met", proceed: "Will proceed to onboard", feature: "Most attractive BCL feature" };
  var tMeet = { type: "act", html: true,
    text: "Log your face-to-face discovery meeting with <b>Dado Santos</b>.",
    chat: { thread: "story", who: { name: "Your meeting notes", sub: "Santos Frozen Foods · face-to-face", av: "👥" }, msgs: [
      { from: "sys", text: "You met Dado at the cold storage on Tuesday. It went well, you were connected the whole time." },
      { from: "sys", text: "What he told you: he has heard of First Circle before. The business has been operating 1 to 3 years and manufactures frozen food for local businesses and government. 18 regular employees, 2 business bank accounts. Annual gross revenue is around 1 to 4 million. He has no payment terms with suppliers (he pays upfront) and gives customers under 30 days. No funding partner right now. His main pain: he can't buy inventory in bulk. You spoke with the owner himself, the decision maker. He will proceed to onboard, and what he likes most about the BCL is the speed of application and drawdown." },
      { from: "sys", text: "Log the meeting on the lead, using the right playbook." }] },
    reset: function(){ var l = L(ID); if (l) delete l.feed; },
    grade: function(ev, d){
      if (ev !== "activity-logged") return false;
      if (d.kind !== "meeting") return "That is a call, not a meeting. Log a meeting.";
      if (d.id !== ID) return "That meeting was logged on a different lead. Use Santos Frozen Foods.";
      var items = [
        { label: "Meeting Format: Face-to-Face", w: 0.05, ok: d.fmt === "Face-to-Face Meeting", exp: "Face-to-Face Meeting" },
        { label: "Meeting Purpose: Discovery Meeting", w: 0.1, ok: d.purpose === "Discovery Meeting", exp: "Discovery Meeting" },
        { label: "Call Outcome: Connected", w: 0.05, ok: d.outcome === "Connected", exp: "Connected" },
        { label: "Playbook: Outbound - Discovery Meeting", w: 0.15, ok: d.playbook === "Outbound - Discovery Meeting Playbook", exp: "Outbound - Discovery Meeting Playbook" },
        { label: "Contact: Rolando Santos", w: 0.05, ok: norm(d.contact).indexOf("rolando") >= 0, exp: "Rolando Santos" }];
      Object.keys(M).forEach(function(k){ items.push({ label: LAB[k], w: 0.6 / 14, ok: String(d.vals[k] || "").trim() === M[k], exp: M[k] }); });
      return { items: items };
    },
    undo: function(){ var l = L(ID); if (l && l.feed) l.feed.shift(); render(); } };

  var T = [tContact, tType, tCall, tPb, tMeet];
  T.forEach(function(t){ t.noHint = true; t.hint = ""; });
  window.ACQUI_EXAM = {
    graded: true, examId: "exam-acqui-activities", minutes: 25, passing: 75, askName: true, backLabel: "Back to Day 9",
    events: ["activity-logged", "contact-added", "note-added"],
    title: "Acqui Service Exam 3: Logging a Call and a Meeting",
    intro: "You will get " + T.length + " situations about one lead, Santos Frozen Foods: add a contact, call him, then meet him. Read the messages on the right, then do it in Acqui Service. Open the lead from the Lead List or search it.",
    scoring: "Every question is worth 1 point. Each wrong answer costs 0.25. Questions where you add or log something are graded per part (type, outcome, notes, playbook answers...). There are no hints. Questions you did not answer get 0.",
    tasks: T
  };
})();
