/* Day 9 graded exam 2: Acqui Service lead level (40 min). Loaded after app.js + lead-ext.js, before exam.js.
   Story: three leads come in. A self-generated one (you create it), a referral from Mia (you request it, your Team Lead approves), and one that is already
   Onboarded (you must not request it). Then you add a contact, log a Prospecting call on the new lead and log a Discovery meeting (F2F) on the referral.
   6 questions, 1 point each, graded per field. No hints. */
(function(){
  if (window.ACQUI_ONE_REFERRER) ACQUI_ONE_REFERRER();
  var X = window.ACQUI_LX, FM = {};   /* FM keeps what the learner created in question 2 */
  function L(id){ return LEADS.filter(function(l){ return l.id === id; })[0]; }
  function norm(s){ return String(s || "").toLowerCase().replace(/[^a-z0-9]/g, ""); }
  var phoneN = function(x){ return String(x || "").replace(/\D/g, "").replace(/^(0|63)/, ""); };
  var isFake = function(reg){ return !REGISTRY.some(function(r){ return norm(r.no) === norm(reg); }); };
  function unrequest(d){ if (d && d.id && typeof pending !== "undefined") delete pending[d.id]; render(); }
  function removeLead(d){ if (d && d.ch && d.id) { for (var i = 0; i < LEADS.length; i++) { if (LEADS[i].id === d.id) { LEADS.splice(i, 1); break; } } } render(); }
  function removeByName(name){ for (var i = LEADS.length - 1; i >= 0; i--) { if (LEADS[i].owner === "me" && norm(LEADS[i].name) === norm(name)) LEADS.splice(i, 1); } }
  function clearPending(id){ if (typeof pending !== "undefined") delete pending[id]; }

  var C1 = { name: "Mabini Hardware and Supply", no: "7005521", owner: "Rico Santos", email: "rico.santos@example.com", phone: "09175550142" };
  (function(){ if (!REGISTRY.some(function(r){ return r.name === C1.name.toUpperCase(); })) REGISTRY.push({ kind: "DTI", name: C1.name.toUpperCase(), no: C1.no, owner: C1.owner.toUpperCase(), territory: "REGIONAL - REGION IV-A (CALABARZON)", date: "Mar 3 2024", status: "REGISTERED", scope: "REGIONAL" });
    REGISTRY.push({ kind: "DTI", name: "MABINI HARDWARE AND SUPPLIES", no: "7005588", owner: "ROMEO SANTOS", territory: "REGIONAL - REGION IV-A (CALABARZON)", date: "Mar 3 2024", status: "REGISTERED", scope: "REGIONAL" }); })();
  var D = { id: "341907", name: "Delta Packaging Inc." };
  var C2 = { fn: "Carmela", ln: "Ramos", phone: "09175551234", email: "carmela.ramos@example.com" };

  /* Pioneer Steel Works (287450) is Onboarded and belongs to another AM: it must NOT be requested */
  var tNo = { type: "act", html: true, choice: true, proceed: false, leadId: "287450", noHint: true, hint: "",
    text: "Decide what to do about <b>Pioneer Steel Works</b>",
    chat: { thread: "s1", who: { name: "Your situation", sub: "Lead 1 of 3", av: "!" }, msgs: [
      { from: "sys", text: "A friend of yours, Vic Lee, says his company Pioneer Steel Works needs a business credit line. He asked if you can handle it." } ] },
    reset: function(){ clearPending("287450"); }, setup: function(){ clearPending("287450"); },
    grade: function(ev, d){ return ev === "request-sent" && d.id === "287450" ? { fatal: "Pioneer Steel Works is already Onboarded and belongs to another AM. Always check the status first: Onboarded, Utilized and Transitioned leads cannot be requested." } : ev === "lead-create-blocked" ? { msg: "That lead already exists. You can't create it again.", cost: 0.5 } : false; },
    undo: function(){ unrequest(this._ev); } };

  /* create the self-generated lead from the certificate photo */
  var tCreate = { type: "act", html: true, noHint: true, hint: "", choice: true, proceed: true, leadId: "",
    text: "Decide what to do about <b>" + C1.name + "</b>",
    chat: { thread: "s2", who: { name: "Your situation", sub: "Lead 2 of 3 · self-generated", av: "!" }, msgs: [
      { from: "sys", text: "You met a business owner at a forum: " + C1.owner + ", owner of " + C1.name + ". Email: " + C1.email + ". Phone: " + C1.phone + ". You took a photo of their DTI certificate. It's in your camera roll. You don't know yet if they are really interested." },
      { from: "me", text: "", att: { name: "IMG_0431.jpg", sub: "Camera roll · tap to open", cert: ["dti", C1.no, C1.name.toUpperCase(), C1.owner.toUpperCase()] } } ] },
    reset: function(){ removeByName(C1.name); FM.id = null; },
    grade: function(ev, d){
      if (ev === "lead-create-blocked") return { msg: "That lead already exists. You can't create it again.", cost: 0.5 };
      if (ev !== "lead-created") return false;
      FM.id = d.id;
      var items = [
        { label: "Channel", w: 0.15, ok: d.ch === "KAM Self Generated", exp: "KAM Self Generated" },
        { label: "Company name", w: 0.1, ok: norm(d.name) === norm(C1.name), exp: C1.name },
        { label: "Company type", w: 0.15, ok: d.type === "Sole Proprietorship", exp: "Sole Proprietorship" },
        { label: "DTI Business Name No.", w: 0.3, ok: norm(d.reg) === norm(C1.no), exp: C1.no },
        { label: "Contact name", w: 0.1, ok: norm(d.fn + d.ln) === norm(C1.owner), exp: C1.owner },
        { label: "Contact email", w: 0.1, ok: norm(d.em) === norm(C1.email), exp: C1.email },
        { label: "Contact phone", w: 0.1, ok: phoneN(d.ph) === phoneN(C1.phone) && phoneN(d.ph) !== "", exp: C1.phone }];
      var r = { items: items };
      if (norm(d.reg) !== norm(C1.no) && isFake(d.reg)) r.extra = [{ label: "You typed a registration number that doesn't exist (fake number)", loss: 0.25 }];
      return r;
    },
    undo: function(){ removeLead(this._ev); FM.id = null; } };

  /* request Delta Packaging (referral from Mia) */
  var tReq = { type: "act", html: true, noHint: true, hint: "", choice: true, proceed: true, leadId: D.id,
    text: "Take care of Mia's referral.",
    chat: { thread: "mia", who: { name: "Mia Santos", sub: "Your referrer" }, msgs: [
      { from: "them", text: "Hi {ME}! I have a referral for you 🙌 Paolo Ramos of Delta Packaging Inc. Close friend of mine, and we already talked: he's open to a business credit line." },
      { from: "them", text: "paolo.ramos@example.com · 09175550000" } ] },
    setup: function(){ clearPending(D.id); }, reset: function(){ clearPending(D.id); },
    grade: function(ev, d, c){
      if (ev === "lead-create-blocked") return false;
      if (ev === "lead-created") { c.flags.dup = true; return false; }
      if (ev !== "request-sent") return false;
      if (d.id !== D.id) return "That request is for a different lead. The lead you need is Delta Packaging Inc.";
      var q = d.req;
      var r = { items: [
        { label: "Approver chosen", w: 0.1, ok: !!q.approver, exp: "any approver" },
        { label: "Channel (Last Touch)", w: 0.3, ok: q.channel === "Referrals", exp: "Referrals" },
        { label: "Referral Channel", w: 0.2, ok: q.rc === "Drip", exp: "Drip" },
        { label: "Referrer", w: 0.2, ok: !!q.ref && q.ref.k === "Mia Santos", exp: "Mia Santos" },
        { label: "FC Referrer", w: 0.2, ok: !!q.fc && /^1368/.test(q.fc.k), exp: "you" }] };
      if (c.flags.dup) { r.factor = 0.5; r.factorLabel = "You created a lead that already exists. You should have requested it"; }
      return r;
    },
    undo: function(){ unrequest(this._ev); } };

  function approve(){ var l = L(D.id); if (l) { l.owner = "me"; l.entry = "Referrals"; l.touch = "Referrals"; l.refBy = "Mia Santos"; } clearPending(D.id); }
  var tContact = { type: "act", html: true, noHint: true, hint: "",
    text: "Add the new contact to <b>Delta Packaging Inc.</b>",
    chat: { thread: "mia", who: { name: "Mia Santos", sub: "Your referrer" }, msgs: [
      { from: "sys", text: "Your Team Lead approved your request. Delta Packaging Inc. is now assigned to you." },
      { from: "them", text: "Thank you!! Paolo is the GM, but his finance manager Carmela Ramos is the one who decides on financing. Please add her. Her number is 09175551234, email carmela.ramos@example.com." } ] },
    setup: function(){ approve(); },
    reset: function(){ var l = L(D.id); if (l) { delete l.contacts; l.owner = "none"; } clearPending(D.id); },
    grade: function(ev, d){
      if (ev !== "contact-added") return false;
      if (d.id !== D.id) return "That contact was added to a different lead. The lead you need is Delta Packaging Inc.";
      var c = d.c;
      return { items: [
        { label: "First name", w: 0.15, ok: norm(c.fn) === norm(C2.fn), exp: C2.fn },
        { label: "Last name", w: 0.15, ok: norm(c.ln) === norm(C2.ln), exp: C2.ln },
        { label: "Phone number", w: 0.25, ok: c.phones.some(function(p){ return phoneN(p) === phoneN(C2.phone); }), exp: C2.phone },
        { label: "Email", w: 0.25, ok: c.emails.some(function(e){ return norm(e) === norm(C2.email); }), exp: C2.email },
        { label: "Relationship Type", w: 0.2, ok: c.rel === "Decision Maker", exp: "Decision Maker" }] };
    },
    undo: function(){ var l = L(D.id); if (l && l.contacts) l.contacts.pop(); render(); } };

  var notesOk = function(s){ return String(s || "").trim().length > 0; };
  var tCall = { type: "act", html: true, noHint: true, hint: "",
    text: "Log your call with <b>" + C1.owner + "</b> of " + C1.name + ".",
    chat: { thread: "call", who: { name: "Your call notes", sub: C1.name, av: "☎" }, msgs: [
      { from: "sys", text: "You just called " + C1.owner + ". He picked up. He remembers you from the forum and is open to hear more, but you don't know yet if they really need a credit line. He agreed to a meeting this Thursday at 2 PM at his shop." },
      { from: "sys", text: "Log this call on the lead. Use the lead you created. Add notes." } ] },
    grade: function(ev, d){
      if (ev !== "activity-logged") return false;
      if (d.kind !== "call") return "That is a meeting, not a call. Log a call.";
      if (FM.id && d.id !== FM.id) return "That call was logged on a different lead. Use " + C1.name + ".";
      return { items: [
        { label: "Type: Prospecting", w: 0.35, ok: d.type === "Prospecting", exp: "Prospecting (you are booking a meeting)" },
        { label: "Call Outcome: Connected", w: 0.2, ok: d.outcome === "Connected", exp: "Connected" },
        { label: "Contact: " + C1.owner, w: 0.1, ok: norm(d.contact) === norm(C1.owner), exp: C1.owner },
        { label: "Notes added", w: 0.35, ok: notesOk(d.notes) && String(d.notes).trim().length >= 15, exp: "a short note of what was agreed" }] };
    },
    undo: function(){ var l = L(FM.id); if (l && l.feed) l.feed.shift(); render(); } };

  var M = { heard: "No", opyrs: "3-5 years", prod: "Trading / Distribution", clients: "Businesses Local only", emp: "35", banks: "3", rev: ">5M to 20M", sup: "<30 days", cus: ">30 days", fund: "Bank", pain: "Delayed customer payments", role: "Decision Maker - GM/President", proceed: "Yes", feature: "3. No Collateral" };
  var LAB = { heard: "Heard of First Circle", opyrs: "Years operating", prod: "Products or services", clients: "Type of clients", emp: "Regular employees", banks: "Bank accounts", rev: "Annual gross revenue", sup: "Supplier payment terms", cus: "Customer payment terms", fund: "Existing funding partners", pain: "Main pain point", role: "Highest role met", proceed: "Will proceed to onboard", feature: "Most attractive BCL feature" };
  var tMeet = { type: "act", html: true, noHint: true, hint: "",
    text: "Log your face-to-face meeting with <b>Delta Packaging Inc.</b>",
    chat: { thread: "meet", who: { name: "Your meeting notes", sub: "Delta Packaging Inc. · face-to-face", av: "👥" }, msgs: [
      { from: "sys", text: "You met Paolo Ramos (GM) and Carmela Ramos at their office for a discovery meeting. It went well, they were connected the whole time." },
      { from: "sys", text: "What they told you: they have not heard of First Circle before. Operating 3-5 years. They trade and distribute packaging materials to local businesses only. 35 regular employees, 3 business bank accounts. Annual gross revenue is around 5M to 20M. They pay suppliers in under 30 days but wait more than 30 days for their customers. They already work with a bank. Their main pain: customers pay late. You spoke with the GM, the decision maker. They will proceed to onboard, and what they like most about the BCL is that there is no collateral." },
      { from: "sys", text: "Log the meeting on the lead, using the right playbook." } ] },
    grade: function(ev, d){
      if (ev !== "activity-logged") return false;
      if (d.kind !== "meeting") return "That is a call, not a meeting. Log a meeting.";
      if (d.id !== D.id) return "That meeting was logged on a different lead. Use Delta Packaging Inc.";
      var items = [
        { label: "Meeting Format: Face-to-Face", w: 0.05, ok: d.fmt === "Face-to-Face Meeting", exp: "Face-to-Face Meeting" },
        { label: "Meeting Purpose: Discovery Meeting", w: 0.1, ok: d.purpose === "Discovery Meeting", exp: "Discovery Meeting" },
        { label: "Call Outcome: Connected", w: 0.05, ok: d.outcome === "Connected", exp: "Connected" },
        { label: "Playbook: Outbound - Discovery Meeting", w: 0.15, ok: d.playbook === "Outbound - Discovery Meeting Playbook", exp: "Outbound - Discovery Meeting Playbook" },
        { label: "Contact", w: 0.05, ok: norm(d.contact).indexOf("ramos") >= 0, exp: "Paolo or Carmela Ramos" }];
      Object.keys(M).forEach(function(k){ items.push({ label: LAB[k], w: 0.6 / 14, ok: String(d.vals[k] || "").trim() === M[k], exp: M[k] }); });
      return { items: items };
    },
    undo: function(){ var l = L(D.id); if (l && l.feed) l.feed.shift(); render(); } };

  var T = [tNo, tCreate, tReq, tContact, tCall, tMeet];
  window.ACQUI_EXAM = {
    graded: true, examId: "exam-acqui-lead", minutes: 40, passing: 75, askName: true, backLabel: "Back to Day 9",
    events: ["activity-logged", "contact-added", "note-added"],
    title: "Acqui Service Exam, Part 2: Lead Level",
    intro: "You will get " + T.length + " situations. Read the messages on the right, then do what you would really do in Acqui Service: check the lead first, create or request it, add the contact, log the call and log the meeting.",
    scoring: "Every question is worth 1 point. You get points for each part you do right (channel, referrer, registration number, call type, playbook answers...). Creating a lead that already exists, or a fake registration number, is a deduction. There are no hints. Questions you did not answer get 0.",
    tasks: T
  };
})();
