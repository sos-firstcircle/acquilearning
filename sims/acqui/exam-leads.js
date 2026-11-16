/* Day 9 graded exam 2: lead creation and reassignment in Acqui Service (25 min). Loaded after app.js (+ lead-ext.js), before exam.js.
   Same idea as the Day 5 practice check (sims/acqui/reassign-exam.js) with different leads. 5 situations, graded per field, no hints:
   1 an Onboarded lead that belongs to another AM (must NOT be requested)   2 self-generated, existing lead -> request it
   3 self-generated, new lead, DTI certificate in the camera roll -> create     4 referral from Mia, new lead, only the business name (find it on the DTI site) -> create
   5 referral from Mia, existing lead -> request it. Creating a lead that already exists = error and half the points. */
(function(){
  if (window.ACQUI_ONE_REFERRER) ACQUI_ONE_REFERRER();   /* one referrer (Mia Santos) enrolled, no leads yet */
  function norm(s){ return String(s || "").toLowerCase().replace(/[^a-z0-9]/g, ""); }
  function unrequest(d){ if (d && d.req && d.id && typeof pending !== "undefined") delete pending[d.id]; render(); }
  function removeLead(d){ if (d && d.ch && d.id) { for (var i = 0; i < LEADS.length; i++) { if (LEADS[i].id === d.id) { LEADS.splice(i, 1); break; } } } render(); }
  function removeByName(name){ for (var i = LEADS.length - 1; i >= 0; i--) { if (LEADS[i].owner === "me" && norm(LEADS[i].name) === norm(name)) LEADS.splice(i, 1); } }
  function clearPending(id){ if (typeof pending !== "undefined") delete pending[id]; }
  var dupMsg = function(ev){ return ev === "lead-create-blocked" ? { msg: "That lead already exists. You can't create it again. Request the lead instead.", cost: 0.5 } : null; };
  var notesOk = function(q){ return String(q.notes || "").trim().length > 0; };
  var phoneN = function(x){ return String(x || "").replace(/\D/g, "").replace(/^(0|63)/, ""); };
  var isFake = function(reg){ return !REGISTRY.some(function(r){ return norm(r.no) === norm(reg); }); };

  var A = { kind: "dti", name: "Mabini Hardware and Supply", no: "7005521", owner: "Rico Santos", email: "rico.santos@example.com", phone: "09175550142" };
  var B = { kind: "dti", name: "Kuya Nonoy Lechon House", no: "7006789", owner: "Nonoy Villar", email: "nonoy.villar@example.com", phone: "09189990011" };
  (function(){
    var has = function(n){ return REGISTRY.some(function(r){ return r.name === n; }); };
    var dti = function(n, no, o){ if (!has(n)) REGISTRY.push({ kind: "DTI", name: n, no: no, owner: o, territory: "REGIONAL - REGION IV-A (CALABARZON)", date: "Mar 3 2024", status: "REGISTERED", scope: "REGIONAL" }); };
    dti(A.name.toUpperCase(), A.no, A.owner.toUpperCase()); dti(B.name.toUpperCase(), B.no, B.owner.toUpperCase());
    dti("MABINI HARDWARE AND SUPPLIES", "7005588", "ROMEO SANTOS"); dti("KUYA NONOY LECHON HAUS", "7006790", "NONOY VILLARIN"); dti("KUYA NONOY LECHON HOUSE AND CATERING", "7006801", "NORMAN VILLAR");
  })();
  var certOf = function(c){ return ["dti", c.no, c.name.toUpperCase(), c.owner.toUpperCase()]; };

  function request(id, name, referral){
    return function(ev, d, c){
      if (ev === "lead-create-blocked") { if (referral) return false; return dupMsg(ev); }
      if (ev === "lead-created" && referral) { c.flags.dup = true; return false; }
      if (ev !== "request-sent") return false;
      var q = d.req;
      if (d.id !== id) return "That request is for a different lead. The lead you need is " + name + ".";
      var items = referral ? [
        { label: "Approver chosen", w: 0.2, ok: !!q.approver, exp: "any approver" },
        { label: "Channel (Last Touch)", w: 0.2, ok: q.channel === "Referrals", exp: "Referrals" },
        { label: "Referral Channel", w: 0.2, ok: q.rc === "Drip", exp: "Drip" },
        { label: "Referrer", w: 0.2, ok: !!q.ref && q.ref.k === "Mia Santos", exp: "Mia Santos" },
        { label: "FC Referrer", w: 0.2, ok: !!q.fc && /^1368/.test(q.fc.k), exp: "you" }
      ] : [
        { label: "Approver chosen", w: 0.5, ok: !!q.approver, exp: "any approver" },
        { label: "Channel (Last Touch)", w: 0.5, ok: q.channel === "KAM - Self Generated Leads", exp: "KAM - Self Generated Leads" }
      ];
      var r = { items: items };
      if (c.flags.dup) { r.factor = 0.5; r.factorLabel = "You created a lead that already exists. You should have requested it"; }
      return r;
    };
  }
  function create(c, ch, ref, w){
    return function(ev, d){
      if (ev === "lead-create-blocked") return dupMsg(ev);
      if (ev !== "lead-created") return false;
      var items = [{ label: "Channel", w: w.ch, ok: d.ch === ch, exp: ch }];
      if (ref) items.push(
        { label: "Referral Channel", w: w.rc, ok: d.rc === "Drip", exp: "Drip" },
        { label: "Referrer", w: w.ref, ok: d.ref === "Mia Santos", exp: "Mia Santos" },
        { label: "FC Referrer", w: w.fc, ok: /^1368/.test(d.fc || ""), exp: "you" });
      items.push(
        { label: "Company name", w: w.name, ok: norm(d.name) === norm(c.name), exp: c.name },
        { label: "Company type", w: w.type, ok: d.type === "Sole Proprietorship", exp: "Sole Proprietorship" },
        { label: "DTI Business Name No.", w: w.reg, ok: norm(d.reg) === norm(c.no), exp: c.no },
        { label: "Contact name", w: w.cn, ok: norm(d.fn + d.ln) === norm(c.owner), exp: c.owner },
        { label: "Contact email", w: w.em, ok: norm(d.em) === norm(c.email), exp: c.email },
        { label: "Contact phone", w: w.ph, ok: phoneN(d.ph) === phoneN(c.phone) && phoneN(d.ph) !== "", exp: c.phone });
      var r = { items: items };
      if (norm(d.reg) !== norm(c.no) && isFake(d.reg)) r.extra = [{ label: "You typed a registration number that doesn't exist (fake number)", loss: w.fake }];
      return r;
    };
  }

  var T = [
    { type: "act", html: true, choice: true, proceed: false, leadId: "287450", pts: 3,
      text: "Decide what to do about <b>Pioneer Steel Works</b>",
      chat: { thread: "s1", who: { name: "Your situation", sub: "Self-generated lead", av: "!" }, msgs: [
        { from: "sys", text: "A friend of yours, Vic Lee, owns Pioneer Steel Works. He needs a business credit line and asked if you can handle it." } ] },
      setup: function(){ clearPending("287450"); }, reset: function(){ clearPending("287450"); },
      grade: function(ev, d){ if (dupMsg(ev)) return dupMsg(ev); return ev === "request-sent" && d.id === "287450" ? { fatal: "Pioneer Steel Works is already Onboarded and belongs to another AM. Leads in Risk Review, Onboarded, Unserviceable or Utilized cannot be requested. Always check the status first." } : false; },
      undo: function(){ unrequest(this._ev); } },

    { type: "act", html: true, choice: true, proceed: true, leadId: "228764", pts: 2,
      text: "Decide what to do about <b>Lakeshore Hardware</b>",
      chat: { thread: "s2", who: { name: "Your situation", sub: "Self-generated lead", av: "!" }, msgs: [
        { from: "sys", text: "You know a business owner personally: Ramon Cruz, owner of Lakeshore Hardware. You played basketball together for years and he wants to work with you on a loan." } ] },
      setup: function(){ clearPending("228764"); }, reset: function(){ clearPending("228764"); },
      grade: request("228764", "Lakeshore Hardware", false),
      undo: function(){ unrequest(this._ev); } },

    { type: "act", html: true, choice: true, proceed: true, leadId: "", pts: 7,
      text: "Decide what to do about <b>" + A.name + "</b>",
      chat: { thread: "s3", who: { name: "Your situation", sub: "Self-generated lead", av: "!" }, msgs: [
        { from: "sys", text: "You met a business owner at a forum: " + A.owner + ", owner of " + A.name + ". Email: " + A.email + ". Phone: " + A.phone + ". You took a photo of their DTI certificate. It's in your camera roll." },
        { from: "me", text: "", att: { name: "IMG_0431.jpg", sub: "Camera roll · tap to open", cert: certOf(A) } } ] },
      reset: function(){ removeByName(A.name); },
      grade: create(A, "KAM Self Generated", false, { ch: 1/7, name: 1/7, type: 1/7, reg: 1/7, cn: 1/7, em: 1/7, ph: 1/7, fake: 1/7 }),
      undo: function(){ removeLead(this._ev); } },

    { type: "act", html: true, noHint: true, choice: true, proceed: true, leadId: "", pts: 10,
      text: "Take care of Mia's referral.",
      chat: { thread: "mia", who: { name: "Mia Santos", sub: "Your referrer · she refers a lot" }, msgs: [
        { from: "them", text: "Hi {ME}! Busy week, I've got a few friends who need financing 🙌" },
        { from: "them", text: "First one: " + B.owner + ". Owner of " + B.name + ", looking for a business loan." },
        { from: "them", text: B.email + " · " + B.phone + ". Close friend of mine. We already talked and they're okay with me referring them to you." },
        { from: "them", text: "I don't have any certificate with me, sorry! I only know the business name." } ] },
      reset: function(){ removeByName(B.name); },
      grade: create(B, "Referral", true, { ch: 0.1, rc: 0.1, ref: 0.1, fc: 0.1, name: 0.1, type: 0.1, reg: 0.1, cn: 0.1, em: 0.1, ph: 0.1, fake: 0.1 }),
      undo: function(){ removeLead(this._ev); } },

    { type: "act", html: true, noHint: true, choice: true, proceed: true, leadId: "133901", pts: 5,
      text: "Take care of Mia's next referral.",
      chat: { thread: "mia", who: { name: "Mia Santos", sub: "Your referrer · she refers a lot" }, msgs: [
        { from: "me", text: "Got it Mia, I'll take care of " + B.owner.split(" ")[0] + "!" },
        { from: "them", text: "Thank you!! Next one 😄 Joel Santos of Metro Print and Pack. Also a close friend. We talked about it and they're interested in a loan." },
        { from: "them", text: "joel.santos@example.com · 09175559999" } ] },
      setup: function(){ clearPending("133901"); }, reset: function(){ clearPending("133901"); },
      grade: request("133901", "Metro Print and Pack", true),
      undo: function(){ unrequest(this._ev); } }
  ];
  T.forEach(function(t){ t.noHint = true; t.hint = ""; });
  window.ACQUI_EXAM = {
    graded: true, examId: "exam-acqui-leads", minutes: 25, passing: 75, askName: true, scale: 10, backLabel: "Back to Day 9",
    title: "Acqui Service Exam 2: Lead Creation and Reassignment",
    intro: "You will get " + T.length + " situations. Read the messages on the right, then do what you would really do in Acqui Service: check the lead first, then request it or create it. Use the three tabs at the top: Acqui Service, the SEC website and the DTI website.",
    scoring: "Every question is worth 10 points, " + (T.length * 10) + " in total. You get points for each part you do right: the channel, the referrer, the registration number, the contact details... Creating a lead that already exists, or typing a fake registration number, is a deduction. There are no hints. Questions you did not answer get 0.",
    tasks: T
  };
})();
