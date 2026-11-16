/* Day 9 practice (hints allowed, nothing graded for the day): window.ACQUI_PRACTICE = "call" | "meeting" is set by the page. Loaded after app.js + lead-ext.js, before exam.js.
   call:    Ramos Poultry Farm (264088): add the owner as a contact, then log a Prospecting call (no playbook, notes only).
   meeting: Navarro Printing Press (271950): log a face-to-face Discovery meeting with the Outbound - Discovery Meeting Playbook. */
(function(){
  var KIND = window.ACQUI_PRACTICE || "call";
  function L(id){ return LEADS.filter(function(l){ return l.id === id; })[0]; }
  function norm(s){ return String(s || "").toLowerCase().replace(/[^a-z0-9]/g, ""); }
  var phoneN = function(x){ return String(x || "").replace(/\D/g, "").replace(/^(0|63)/, ""); };
  var notesOk = function(s){ return String(s || "").trim().length >= 15; };
  var T = [], CFG;

  if (KIND === "call") {
    var ID = "264088", C = { fn: "Benny", ln: "Ramos", phone: "09175550123", email: "benny.ramos@example.com" };
    if (!L(ID)) LEADS.unshift({ id: ID, name: "Ramos Poultry Farm", status: "For Engagement", risk: "-", channel: "KAM - Self Generated Leads", entry: "KAM - Self Generated Leads", touch: "KAM - Self Generated Leads", clo: 0, eng: "2026-11-12", owner: "me", contact: "Lita Ramos", task: { pr: "High", due: "Due today" } });
    var who = { name: "Your situation", sub: "Ramos Poultry Farm · lead " + ID, av: "!" };
    T.push({ type: "act", html: true,
      text: "Add the owner as a contact on <b>Ramos Poultry Farm</b>.",
      hint: "Open the lead from the Lead List. In Company info, under Business Contacts, click + Add contact. Role: Owner, relationship type: Decision Maker.",
      chat: { thread: "story", who: who, msgs: [
        { from: "sys", text: "Ramos Poultry Farm is your own lead. The only contact on it is Lita Ramos, the applicant (she does the paperwork)." },
        { from: "sys", text: "Lita says the owner is her husband, Benny Ramos. He decides on financing. His number is 09175550123 and his email is benny.ramos@example.com. Add him as a contact on the lead before you call." }] },
      reset: function(){ var l = L(ID); if (l) { delete l.contacts; delete l.feed; } },
      grade: function(ev, d){
        if (ev !== "contact-added") return false;
        if (d.id !== ID) return "That contact was added to a different lead. Use Ramos Poultry Farm (lead " + ID + ").";
        var c = d.c;
        return { items: [
          { label: "First name", w: 0.15, ok: norm(c.fn) === norm(C.fn), exp: C.fn },
          { label: "Last name", w: 0.15, ok: norm(c.ln) === norm(C.ln), exp: C.ln },
          { label: "Phone number", w: 0.2, ok: c.phones.some(function(p){ return phoneN(p) === phoneN(C.phone); }), exp: C.phone },
          { label: "Email", w: 0.2, ok: c.emails.some(function(e){ return norm(e) === norm(C.email); }), exp: C.email },
          { label: "Role: Owner", w: 0.15, ok: c.role === "Owner", exp: "Owner" },
          { label: "Relationship Type: Decision Maker", w: 0.15, ok: c.rel === "Decision Maker", exp: "Decision Maker" }] };
      },
      undo: function(){ var l = L(ID); if (l && l.contacts) l.contacts.pop(); render(); } });
    T.push({ type: "act", html: true,
      text: "Log your call with <b>Benny Ramos</b>.",
      hint: "On the lead page, click + Log activity, then Log call/meeting. A call to get through to the decision maker and book a meeting is a Prospecting call. Prospecting has no playbook: write notes.",
      chat: { thread: "story", who: who, msgs: [
        { from: "sys", text: "You called Benny. He picked up. He is interested in a credit line to buy feed in bulk. You agreed to meet face to face next Wednesday at 2 PM at the farm." },
        { from: "sys", text: "Log the call on the lead. No playbook, just notes." }] },
      reset: function(){ var l = L(ID); if (l) delete l.feed; },
      grade: function(ev, d){
        if (ev !== "activity-logged") return false;
        if (d.kind !== "call") return "That is a meeting, not a call. Log a call.";
        if (d.id !== ID) return "That call was logged on a different lead. Use Ramos Poultry Farm.";
        return { items: [
          { label: "Type: Prospecting", w: 0.3, ok: d.type === "Prospecting", exp: "Prospecting (you are booking a meeting)" },
          { label: "Call Outcome: Connected", w: 0.2, ok: d.outcome === "Connected", exp: "Connected" },
          { label: "Contact: Benny Ramos", w: 0.1, ok: norm(d.contact).indexOf("benny") >= 0, exp: "Benny Ramos" },
          { label: "Notes added (what was agreed)", w: 0.3, ok: notesOk(d.notes), exp: "a short note, e.g. meeting Wednesday 2 PM" },
          { label: "No playbook (notes only)", w: 0.1, ok: d.playbook === "No playbook", exp: "No playbook, just notes" }] };
      },
      undo: function(){ var l = L(ID); if (l && l.feed) l.feed.shift(); render(); } });
    CFG = { taskId: "d9-practice-log-call", title: "Practice: add a contact and log a call", nextHref: "acqui-demo-log-call.html", nextLabel: "Review the demo", events: ["activity-logged", "contact-added", "note-added"],
      intro: "You will get 2 situations about one lead, Ramos Poultry Farm: add the owner as a contact, then log the call you made. Read the messages on the right, then do it in Acqui Service. Open the lead from the Lead List or search it." };
  } else {
    var MID = "271950";
    var ml = L(MID);
    if (!ml) { ml = { id: MID, name: "Navarro Printing Press", status: "Prospecting", risk: "-", channel: "KAM - Self Generated Leads", entry: "KAM - Self Generated Leads", touch: "KAM - Self Generated Leads", clo: 0, eng: "2026-11-12", owner: "me", contact: "Joy Navarro", task: { pr: "High", due: "Due today" } }; LEADS.unshift(ml); }
    ml.status = "Prospecting";
    ml.contacts = [{ fn: "Joy", ln: "Navarro", role: "Applicant", rel: "Primary Contact", phones: [], emails: [] }, { fn: "Ben", ln: "Navarro", role: "Owner", rel: "Decision Maker", phones: ["09175550177"], emails: ["ben.navarro@example.com"] }];
    var M = { heard: "No", opyrs: "5+ years", prod: "Services (B2B)", clients: "Businesses Local & Government", emp: "25", banks: "3", rev: ">5M to 20M", sup: ">30 days", cus: "<30 days", fund: "Bank", pain: "Not able to serve bigger projects", role: "Decision Maker - GM/President", proceed: "Yes", feature: "4. Possible max size of the limit" };
    var LAB = { heard: "Heard of First Circle", opyrs: "Years operating", prod: "Products or services", clients: "Type of clients", emp: "Regular employees", banks: "Bank accounts", rev: "Annual gross revenue", sup: "Supplier payment terms", cus: "Customer payment terms", fund: "Existing funding partners", pain: "Main pain point", role: "Highest role met", proceed: "Will proceed to onboard", feature: "Most attractive BCL feature" };
    T.push({ type: "mcq", text: "You met Ben to discover the business and its financing needs. Which playbook fits?",
      hint: "Each meeting purpose has its own playbook. Discovering the business = Discovery Meeting.",
      choices: ["Outbound - Discovery Meeting Playbook", "Outbound - Ambush Visit Playbook", "Outbound - Follow Up Document Playbook", "Outbound - Drawdown Assist Meeting", "Transition Call"],
      chat: { thread: "story", who: { name: "Your meeting notes", sub: "Navarro Printing Press · face-to-face", av: "👥" }, msgs: [{ from: "sys", text: "Yesterday you met Ben Navarro, the owner of Navarro Printing Press, face to face at his print shop. It was your first meeting with him." }] },
      answer: function(){ return ["Outbound - Discovery Meeting Playbook"]; } });
    T.push({ type: "act", html: true,
      text: "Log your face-to-face discovery meeting with <b>Ben Navarro</b>.",
      hint: "On the lead page: + Log activity, Log call/meeting, then Meeting. Format Face-to-Face, purpose Discovery Meeting (the playbook is suggested). Answer all the playbook questions from the notes.",
      chat: { thread: "story", who: { name: "Your meeting notes", sub: "Navarro Printing Press · face-to-face", av: "👥" }, msgs: [
        { from: "sys", text: "The meeting went well, you were connected the whole time. What Ben told you: he has never heard of First Circle. The business has been operating more than 5 years and offers printing services to local businesses and government. 25 regular employees, 3 business bank accounts. Annual gross revenue is around 5 to 20 million." },
        { from: "sys", text: "He pays suppliers in more than 30 days, and his customers pay in less than 30 days. His funding partner is a bank. His main pain point: he is not able to serve bigger projects. He is the owner, so the highest role you met is Decision Maker. He will proceed to onboard and submit documents. The BCL feature he liked most: the possible max size of the limit." },
        { from: "sys", text: "Log the meeting on the lead, using the right playbook." }] },
      reset: function(){ var l = L(MID); if (l) delete l.feed; },
      grade: function(ev, d){
        if (ev !== "activity-logged") return false;
        if (d.kind !== "meeting") return "That is a call, not a meeting. Log a meeting.";
        if (d.id !== MID) return "That meeting was logged on a different lead. Use Navarro Printing Press.";
        var items = [
          { label: "Meeting Format: Face-to-Face", w: 0.05, ok: d.fmt === "Face-to-Face Meeting", exp: "Face-to-Face Meeting" },
          { label: "Meeting Purpose: Discovery Meeting", w: 0.1, ok: d.purpose === "Discovery Meeting", exp: "Discovery Meeting" },
          { label: "Call Outcome: Connected", w: 0.05, ok: d.outcome === "Connected", exp: "Connected" },
          { label: "Playbook: Outbound - Discovery Meeting", w: 0.15, ok: d.playbook === "Outbound - Discovery Meeting Playbook", exp: "Outbound - Discovery Meeting Playbook" },
          { label: "Contact: Ben Navarro", w: 0.05, ok: norm(d.contact).indexOf("ben") === 0, exp: "Ben Navarro" }];
        Object.keys(M).forEach(function(k){ items.push({ label: LAB[k], w: 0.6 / 14, ok: String(d.vals[k] || "").trim() === M[k], exp: M[k] }); });
        return { items: items };
      },
      undo: function(){ var l = L(MID); if (l && l.feed) l.feed.shift(); render(); } });
    CFG = { taskId: "d9-practice-log-meeting", title: "Practice: log a meeting", nextHref: "acqui-demo-log-meeting.html", nextLabel: "Review the demo", events: ["activity-logged", "contact-added", "note-added"],
      intro: "The Discovery call or meeting is the crucial stage where you engage with a lead to understand their pain points and goals, gather the information to know if the prospect is qualified for First Circle's products, and pitch the product. You will get 2 questions about one lead, Navarro Printing Press: pick the right playbook, then log the face-to-face meeting you had with the owner. Read the messages on the right, then do it in Acqui Service. Open the lead from the Lead List or search it." };
  }
  CFG.askName = true; CFG.backLabel = "Back to Day 9";
  CFG.scoring = "Every question is worth 1 point. Questions where you add or log something are graded per part. A hint costs 0.5 and each wrong answer costs 0.25. Nothing here is graded for the day. You can use Finish test any time. Questions you did not answer get 0.";
  CFG.tasks = T;
  window.ACQUI_EXAM = CFG;
})();
