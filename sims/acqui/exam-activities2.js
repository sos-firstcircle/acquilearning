/* Day 10 graded exam: Acqui Service Exam (Part 2): Log Calls and Meetings (30 min). Loaded after app.js + lead-ext.js, before exam.js.
   Story: Super Construction Inc. 1) a PHONE call with the receptionist Darna Custodio (gatekeeper), who will endorse you to the owner Pedro Penduko for a face-to-face meeting.
   2) the meeting with Pedro (he is NOT a contact yet: adding him is part of the task and is never stated). 3) time skip: docs submitted, BCL verified. 4) time skip: 30 days after the drawdown, transition.
   Rules: concept questions (the "ask" helper below) are ONE attempt, no hints, a wrong answer is 0 with no deduction. Log tasks are graded once, per field; logging the wrong kind of activity or on the wrong lead is 0.
   Points (35 total): call type 1 | log call 6 (type, outcome, contact, playbook: 1 each, notes 2: endorsement + meeting, schedule) | meeting type 1 | add Pedro + log meeting 14.5 (5 contact details x 0.5, 5 call details x 1, 14 playbook answers x 0.5)
   | next step after meeting 1 | BCL status 1 | next step after credit limit 1 | unused BCL amount 1 | name of the 30-day handover 1 | paydown 1 | log transition call 6.5 (type, outcome, contact, playbook, paydown x 1, 3 notes x 0.5). */
(function(){
  function L(id){ return LEADS.filter(function(l){ return l.id === id; })[0]; }
  function norm(s){ return String(s || "").toLowerCase().replace(/[^a-z0-9]/g, ""); }
  var phoneN = function(x){ return String(x || "").replace(/\D/g, "").replace(/^(0|63)/, ""); };
  var has = function(s, re){ return re.test(String(s || "").toLowerCase()); };
  var ID = "262005";
  if (!L(ID)) LEADS.unshift({ id: ID, name: "Super Construction Inc.", channel: "KAM - Self Generated Leads", entry: "KAM - Self Generated Leads", touch: "KAM - Self Generated Leads", owner: "me", contact: "Darna Custodio" });
  function hasPedro(l){ return (l.contacts || []).some(function(c){ return c.fn === "Pedro"; }); }
  function dropBcl(){ for (var i = BCLS.length - 1; i >= 0; i--) if (BCLS[i].id === ID) BCLS.splice(i, 1); }
  /* the lead at each point of the story (Pedro is only a contact when the learner adds him) */
  function stage1(){ var l = L(ID); l.status = "Prospecting"; l.risk = "-"; delete l.ba; delete l.bclAmt; delete l.rev; l.clo = 0; l.eng = "2026-11-12"; l.task = { pr: "High", due: "Due today" };
    l.contacts = [{ fn: "Darna", ln: "Custodio", role: "Receptionist", rel: "Gatekeeper", phones: ["09171230100"], emails: [] }]; dropBcl(); }
  function stage2(){ var l = L(ID); l.status = "Onboarded"; l.risk = "Fully Verified with Provisional Limit"; l.ba = "Approved"; l.bclAmt = 500000; l.rev = 30000000; l.clo = 500000; l.eng = "2026-11-19"; delete l.task; dropBcl();
    BCLS.unshift({ co: "Super Construction Inc.", id: ID, team: "Region Team 2", am: ME, bcl: 500000, orig30: 0, login: "-", ym: "2026-11", date: "Nov 19, 2026" }); }
  function stage3(){ var l = L(ID); stage2(); l.status = "Utilized"; l.eng = "2026-10-12"; dropBcl();
    BCLS.unshift({ co: "Super Construction Inc.", id: ID, team: "Region Team 2", am: ME, bcl: 500000, orig30: 300000, login: "2026-10-12", ym: "2026-10", date: "Oct 12, 2026" }); }
  stage1();
  var story = { thread: "story", who: { name: "Your situation", sub: "Super Construction Inc. · lead " + ID, av: "!" } };
  var callSum = { thread: "darna", who: { name: "Call summary: Darna Custodio", sub: "Super Construction Inc. · PHONE CALL", av: "📞" } };
  var meetSum = { thread: "pedro", who: { name: "Meeting summary: Pedro Penduko", sub: "Super Construction Inc. · face to face", av: "👥" } };
  var viber = { thread: "viber", who: { name: "Pedro Penduko", sub: "Super Construction Inc. · Viber", av: "PP" } };
  var wipe = function(){ if (L(ID)) { stage1(); delete L(ID).feed; } };
  var undoFeed = function(){ var l = L(ID); if (l && l.feed) l.feed.shift(); render(); };
  var BAD = { wrongKind: function(k){ return { fatal: "That is " + (k === "call" ? "a meeting, not a call" : "a call, not a meeting") + ". You only get one chance to log it, so this one is 0." }; },
              wrongLead: { fatal: "That was logged on a different lead. You only get one chance to log it, so this one is 0." } };
  /* total = the points of the task; each item has its own pts. Returns {items} with weights that add up to 1. */
  function mk(total, items){ return { items: items.map(function(i){ return { label: i.label, w: i.pts / total, ok: !!i.ok, exp: i.exp }; }) }; }

  /* ---- concept question: ONE attempt, no deduction. opts: {text, choices, answer, wrong, chat, input, placeholder, setup} ---- */
  function shuffle(a){ a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function esc(s){ return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }
  function ask(o){
    var t = { type: "act", text: o.text, chat: o.chat,
      setup: function(){ if (o.setup) o.setup(); setTimeout(function(){
        var m = document.getElementById("exmsg"); if (!m || m.dataset.ask) return; m.dataset.ask = "1"; var pick = null;
        if (o.input) { m.innerHTML = '<input type="text" id="exin" placeholder="' + esc(o.placeholder || "Type your answer") + '" autocomplete="off"><div style="margin-top:8px"><button class="btn dark" id="exsub">Submit</button></div>'; }
        else { m.innerHTML = '<div id="exch">' + shuffle(o.choices).map(function(c){ return '<div class="opt2" data-c="' + esc(c) + '"><span>○</span> ' + esc(c) + '</div>'; }).join("") + '</div><div style="margin-top:8px"><button class="btn dark" id="exsub">Submit</button></div>';
          [].forEach.call(m.querySelectorAll(".opt2"), function(e){ e.onclick = function(){ pick = e.dataset.c; [].forEach.call(m.querySelectorAll(".opt2"), function(x){ x.classList.remove("sel"); x.firstChild.textContent = "○"; }); e.classList.add("sel"); e.firstChild.textContent = "●"; }; }); }
        m.querySelector("#exsub").onclick = function(){ var v = o.input ? m.querySelector("#exin").value : pick; if (!String(v || "").trim()) return; ACQUI.emit("concept", v); };
      }, 0); },
      grade: function(ev, d){
        if (ev !== "concept") return false;
        var ok = (o.input ? [o.answer] : [o.answer]).some(function(a){ return norm(a).replace(/\.0+$/, "") === norm(d); });
        return ok ? true : { fatal: o.wrong || "Not correct." };
      } };
    return t;
  }
  /* full-screen "time skip" card on top of the simulation; the sim goes back to the home screen */
  function skip(title, sub){
    location.hash = "#/home";
    var old = document.getElementById("tskip"); if (old) old.remove();
    var d = document.createElement("div"); d.id = "tskip";
    d.style.cssText = "position:fixed;inset:0;background:rgba(10,25,28,.82);z-index:5000;display:grid;place-items:center;font-family:inherit";
    d.innerHTML = '<div style="background:#fff;border-radius:16px;padding:28px 34px;max-width:440px;text-align:center;box-shadow:0 12px 40px rgba(0,0,0,.35)"><div style="font-size:34px">⏩</div><h2 style="margin:8px 0 6px">' + esc(title) + '</h2><p style="margin:0 0 16px;color:#456;line-height:1.5;font-size:15px">' + esc(sub) + '</p><button class="btn dark" id="tskip-go">Continue</button></div>';
    document.body.appendChild(d);
    d.querySelector("#tskip-go").onclick = function(){ d.remove(); };
  }

  /* ---- Part 1: the call with the receptionist ---- */
  var callMsgs = [
      { from: "sys", text: "PHONE CALL: you phoned Super Construction Inc. today. The call was answered by the receptionist, Darna Custodio. You did not speak with the owner yet." },
      { from: "sys", text: "Darna said the owner, Pedro Penduko, is the one who decides on financing and is hard to reach by phone. She agreed to endorse you to Pedro for a face-to-face meeting. Pedro is free this Thursday at 2 PM at their office. Darna will tell him that you are coming." },
      { from: "sys", text: "Darna's number is 09171230100. She is already a contact on the lead." }];
  var tCallQ = ask({ text: "Part 1 · The phone call. You called Super Construction Inc. and spoke with the receptionist, Darna, who agreed to endorse you to the owner. What type of call is this?",
    choices: ["Prospecting", "Discovery", "Check-in", "Nurturing", "Referral Related"], answer: "Prospecting",
    wrong: "Not correct. Speaking to a gatekeeper to get through to the decision maker is a Prospecting call.",
    chat: { thread: callSum.thread, who: callSum.who, msgs: callMsgs } });

  var tPros = { type: "act", html: true, pts: 6, text: "Document this call in Acqui Service. Make sure to include all necessary details about the call.",
    chat: { thread: callSum.thread, who: callSum.who, msgs: callMsgs.concat([{ from: "sys", text: "Log your call with Darna on Super Construction Inc. (lead " + ID + ")." }]) },
    reset: wipe,
    grade: function(ev, d){
      if (ev !== "activity-logged") return false;
      if (d.kind !== "call") return BAD.wrongKind("call");
      if (d.id !== ID) return BAD.wrongLead;
      var n = (d.vals && d.vals.notes) || d.notes || "";
      return mk(6, [
        { label: "Type: Prospecting", pts: 1, ok: d.type === "Prospecting", exp: "Prospecting (speaking to a gatekeeper to get through to the decision maker)" },
        { label: "Call Outcome: Connected", pts: 1, ok: d.outcome === "Connected", exp: "Connected" },
        { label: "Contact: Darna Custodio", pts: 1, ok: norm(d.contact).indexOf("darna") >= 0, exp: "Darna Custodio (you spoke with her, not the owner)" },
        { label: "No playbook (notes only)", pts: 1, ok: d.playbook === "No playbook", exp: "No playbook, just notes" },
        { label: "Notes: Darna will endorse you to the owner, Pedro, for a meeting", pts: 1, ok: has(n, /meet|f2f|face/) && has(n, /pedro|owner|endors/), exp: "Darna will endorse you to the owner, Pedro Penduko, for a face-to-face meeting" },
        { label: "Notes: the schedule, Thursday at 2 PM", pts: 1, ok: has(n, /thursday|thurs|2 ?pm|2:00|14:00/), exp: "Thursday at 2 PM" }]);
    }, undo: undoFeed };

  /* ---- Part 2: the meeting ---- */
  var tMeetQ = ask({ text: "Part 2 · Thursday, 2 PM. You are at the Super Construction Inc. office, about to sit down with the owner, Pedro Penduko, for the first time to learn about his business and its financing needs. What kind of meeting is this?",
    choices: ["Discovery Meeting", "Ambush Meeting", "Follow up Document", "Assist in Drawdown", "Referral Generation/Others"], answer: "Discovery Meeting",
    wrong: "Not correct. A first sit-down with the decision maker to learn about the business and its financing needs is a Discovery Meeting.",
    chat: { thread: story.thread, who: story.who, msgs: [{ from: "sys", text: "It is Thursday, 2 PM. Darna endorsed you and Pedro Penduko, the owner, is meeting you at the office. This is the first time you sit down with him." }] } });

  var C = { fn: "Pedro", ln: "Penduko", phone: "09171230999", email: "pedro.penduko@example.com" };
  var M = { heard: "Yes", opyrs: "5+ years", prod: "Services (B2B)", clients: "Businesses Local & Government", emp: "45", banks: "3", rev: ">20M to 50M", sup: "<30 days", cus: ">30 days", fund: "Bank", pain: "Not able to serve bigger projects", role: "Decision Maker - GM/President", proceed: "Yes", feature: "3. No Collateral" };
  var LAB = { heard: "Heard of First Circle", opyrs: "Years operating", prod: "Products or services", clients: "Type of clients", emp: "Regular employees", banks: "Bank accounts", rev: "Annual gross revenue", sup: "Supplier payment terms", cus: "Customer payment terms", fund: "Existing funding partners", pain: "Main pain point", role: "Highest role met", proceed: "Will proceed to onboard", feature: "Most attractive BCL feature" };
  /* Pedro is not a contact yet and the task never says to add him: adding him (contact-added) is graded together with the meeting log */
  var tMeet = { type: "act", html: true, pts: 14.5, text: "Document this meeting in Acqui Service. Make sure to include all necessary details about the meeting.",
    reset: function(){ tMeet._c = null; },
    chat: { thread: meetSum.thread, who: meetSum.who, msgs: [
      { from: "sys", text: "FACE-TO-FACE MEETING: you met Pedro Penduko of Super Construction Inc. at his office. At the start of the meeting he told you he is the highest person in the company. He was there the whole time and you spoke with him directly. Darna was not part of the meeting. You also got his contact details: mobile 09171230999, email pedro.penduko@example.com." },
      { from: "sys", text: "What Pedro told you: he has heard of First Circle before, from a fellow contractor. Super Construction Inc. has been operating for 12 years. It is a construction company. Its clients are DPWH and Ayala Land. It has 45 regular employees and 3 business bank accounts." },
      { from: "sys", text: "Annual gross revenue is around 30 million. His suppliers give him terms of less than 30 days, while his customers (mostly government) pay after more than 30 days. He has a bank as his funding partner. His main pain point: he is not able to serve bigger projects because of cash flow." },
      { from: "sys", text: "He needs the money for his company because they have a potential big project coming. He is excited to onboard and will submit the documents, especially because of the no collateral requirement." }] },
    grade: function(ev, d){
      if (ev === "contact-added") { if (d.id === ID) tMeet._c = d.c; return false; }
      if (ev !== "activity-logged") return false;
      if (d.kind !== "meeting") return BAD.wrongKind("meeting");
      if (d.id !== ID) return BAD.wrongLead;
      var c = tMeet._c, v = d.vals || {};
      var items = [
        { label: "Pedro added as a contact: first name", pts: 0.5, ok: !!c && norm(c.fn) === norm(C.fn), exp: C.fn },
        { label: "Pedro added as a contact: last name", pts: 0.5, ok: !!c && norm(c.ln) === norm(C.ln), exp: C.ln },
        { label: "Pedro added as a contact: phone number", pts: 0.5, ok: !!c && c.phones.some(function(p){ return phoneN(p) === phoneN(C.phone); }), exp: C.phone },
        { label: "Pedro added as a contact: email", pts: 0.5, ok: !!c && c.emails.some(function(e){ return norm(e) === norm(C.email); }), exp: C.email },
        { label: "Pedro added as a contact: relationship Decision Maker", pts: 0.5, ok: !!c && c.rel === "Decision Maker", exp: "Decision Maker" },
        { label: "Meeting Format: Face-to-Face", pts: 1, ok: d.fmt === "Face-to-Face Meeting", exp: "Face-to-Face Meeting" },
        { label: "Meeting Purpose: Discovery Meeting", pts: 1, ok: d.purpose === "Discovery Meeting", exp: "Discovery Meeting" },
        { label: "Outcome: Connected", pts: 1, ok: d.outcome === "Connected", exp: "Connected" },
        { label: "Contact: Pedro Penduko (not Darna)", pts: 1, ok: norm(d.contact).indexOf("pedro") >= 0, exp: "Pedro Penduko" },
        { label: "Playbook: Outbound - Discovery Meeting", pts: 1, ok: d.playbook === "Outbound - Discovery Meeting Playbook", exp: "Outbound - Discovery Meeting Playbook" }];
      Object.keys(M).forEach(function(k){ items.push({ label: LAB[k], pts: 0.5, ok: String(v[k] || "").trim() === M[k], exp: M[k] }); });
      return mk(14.5, items);
    }, undo: function(){ var l = L(ID); if (l && l.feed) l.feed.shift(); if (l && l.contacts && hasPedro(l)) l.contacts = l.contacts.filter(function(x){ return x.fn !== "Pedro"; }); render(); } };

  var tNext = ask({ text: "Pedro will proceed to onboard and submit his documents. As the AM, what is the next stage of the lead after the discovery meeting?",
    choices: ["Completing requirements", "Risk review", "Open BCL", "Drawdown / utilization", "Transition"], answer: "Completing requirements",
    wrong: "Not correct. Before the risk team can review the application, the client has to complete the requirements (documents). Next stage: Completing requirements.",
    chat: { thread: story.thread, who: story.who, msgs: [{ from: "sys", text: "The meeting is logged. Pedro is interested and will proceed to onboard." }] } });

  /* ---- time skip 1: docs submitted, the BCL is verified ---- */
  var tStat = ask({ text: "Part 3 · Pedro followed up. Search the lead in Acqui Service. What is the status of Super Construction Inc. now?",
    choices: ["BCL is verified", "Still in risk review", "Still completing requirements", "Already transitioned to the RM"], answer: "BCL is verified",
    wrong: "Not correct. The lead page shows the BCL is already verified.",
    setup: function(){ stage2(); skip("A few days later...", "Pedro has submitted his documents and the risk team finished their review. Search the lead again to see the update."); },
    chat: { thread: viber.thread, who: viber.who, msgs: [{ from: "them", text: "Hi! This is Pedro of Super Construction. I submitted all the documents a few days ago. Any update? (Lead ID " + ID + ")" }] } });

  var tCredit = ask({ text: "Pedro can see his credit limit now and says he wants to take a loan. What do you do next?",
    choices: ["Guide Pedro through his first drawdown", "Do the Transition call", "Ask Pedro to submit the documents again", "Close the lead"], answer: "Guide Pedro through his first drawdown",
    wrong: "Not correct. Pedro already has his credit line and wants to take a loan, so you guide him through his first drawdown.",
    chat: { thread: viber.thread, who: viber.who, msgs: [{ from: "them", text: "I can see my credit limit now in Connect! So our company has a credit line now, right? 🎉 I want to take a loan now, how do I do it?" }] } });

  /* ---- time skip 2: 30 days after the drawdown ---- */
  var tAmt = ask({ text: "Part 4 · It has been more than 30 days since Pedro's first drawdown on Oct 12. How much of the BCL is still unused?",
    input: true, placeholder: "Type the amount", answer: "200000",
    wrong: "Not correct. Unused = BCL amount minus Total originations (30D), in Open BCLs.",
    setup: function(){ stage3(); skip("30 days later...", "Pedro did his first drawdown and the 30 days after it are over. Look up his BCL in Acqui Service."); },
    chat: { thread: story.thread, who: story.who, msgs: [{ from: "sys", text: "Pedro did one drawdown on Oct 12 and the 30 days after it are over." }] } });
  var tName = ask({ text: "The 30 days are over, so you now hand Super Construction's account over to the RM / Customer Success. What is this step called?",
    choices: ["Transition", "Renewal", "Nurturing", "Check-in", "Referral Related"], answer: "Transition",
    wrong: "Not correct. Handing the account over to the RM / Customer Success after the drawdown window is the Transition." });
  var tPay = ask({ text: "What is the important thing to discuss with the client before the transition?",
    choices: ["Principal Paydown Policy", "The referral bonus", "A new interest rate promo", "The annual fee"], answer: "Principal Paydown Policy",
    wrong: "Not correct. Before the transition you remind the client of the Principal Paydown Policy." });

  var tTrans = { type: "act", html: true, pts: 6.5, text: "Document your <b>call with Pedro</b> in Acqui Service. Make sure to include all necessary details about the call.",
    chat: { thread: story.thread, who: story.who, msgs: [
      { from: "sys", text: "You called Pedro and he answered. You explained the Principal Paydown Policy and he understood it. This is the call where you hand his account over to the new RM." },
      { from: "sys", text: "His main contact is himself: 09171230999, prefers Viber. Alternative contact: the receptionist Darna Custodio, 09171230100, calls only, for scheduling and payment follow-ups. Helpful for the new RM: he pays his suppliers every 15th and 30th, and he prefers calls before 10 AM." }] },
    grade: function(ev, d){
      if (ev !== "activity-logged") return false;
      if (d.kind !== "call") return BAD.wrongKind("call");
      if (d.id !== ID) return BAD.wrongLead;
      var v = d.vals || {};
      return mk(6.5, [
        { label: "Type: Transition", pts: 1, ok: d.type === "Transition", exp: "Transition" },
        { label: "Call Outcome: Connected", pts: 1, ok: d.outcome === "Connected", exp: "Connected" },
        { label: "Contact: Pedro Penduko", pts: 1, ok: norm(d.contact).indexOf("pedro") >= 0, exp: "Pedro Penduko" },
        { label: "Playbook: Transition Call", pts: 1, ok: d.playbook === "Transition Call", exp: "Transition Call" },
        { label: "Main POC (name, number)", pts: 0.5, ok: has(v.poc, /pedro/) && has(v.poc, /0917|917/), exp: "Pedro Penduko, 09171230999, Viber" },
        { label: "Alternative contact (Darna)", pts: 0.5, ok: has(v.alt, /darna/), exp: "Darna Custodio, 09171230100, calls only, scheduling and payment follow-ups" },
        { label: "Insights for the new RM", pts: 0.5, ok: has(v.insight, /15|30|10 am|before 10|morning/), exp: "pays on the 15th and 30th, calls before 10 AM" },
        { label: "Discussed principal paydown: Yes", pts: 1, ok: v.paydown === "Yes", exp: "Yes" }]);
    }, undo: undoFeed };

  var T = [tCallQ, tPros, tMeetQ, tMeet, tNext, tStat, tCredit, tAmt, tName, tPay, tTrans];
  T.forEach(function(t){ t.noHint = true; t.hint = ""; });
  window.ACQUI_EXAM = {
    graded: true, examId: "exam-acqui-activities-2", minutes: 30, passing: 75, askName: true, backLabel: "Back to Day 10",
    events: ["activity-logged", "contact-added", "note-added", "concept"],
    title: "Acqui Service Exam (Part 2): Log Calls and Meetings",
    intro: "You will get " + T.length + " situations about one lead, Super Construction Inc.: a phone call with the receptionist, the meeting with the owner, what happens when the BCL opens, and later a transition call. Read the messages on the right, then do it in Acqui Service. Open the lead from the Lead List or search it. The screen goes dark when time passes in the story: the simulation goes back to the home screen, so search the lead again.",
    scoring: "The exam is worth 35 points. Concept questions (pick or type the answer) are worth 1 point each and you have ONE attempt: a wrong answer is 0, nothing more is deducted. When you log or add something, every part is graded on its own (type, outcome, contact, playbook, notes...) and you also get ONE chance: if you log the wrong kind of activity, or on the wrong lead, it is 0. There are no hints. Questions you did not answer get 0.",
    tasks: T
  };
})();
