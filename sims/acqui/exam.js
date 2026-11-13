/* Acqui Service navigation check: a mini hands-on exam with situational questions.
   Question types: nav (find your way there in the sim), input (type the answer you find), mcq (pick the answer you find).
   Scoring: every question starts at 1 point. A hint costs 0.5. Each wrong answer costs 0.25 (typed / multiple choice). Skip = 0. Never below 0.
   Pass mark 80%. Nothing is saved yet: when this is attached to a day, send the result with LMS.saveResult (see finish()). */
(function(){
  /* An exam file can set window.ACQUI_EXAM = { title, intro, taskId, nextHref, nextLabel, tasks } before this file loads. Without it, this is the navigation check. */
  var CFG = window.ACQUI_EXAM || {};
  var G = !!CFG.graded, PASS = CFG.passing || 80, HINT_COST = 0.5, WRONG_COST = 0.25, SCALE = CFG.scale || 1;   /* costs are fractions of one question; SCALE = points per question */
  var st = document.createElement("style");
  st.textContent =
    "#ex{position:fixed;left:50%;transform:translateX(-50%);bottom:22px;width:780px;max-width:94vw;background:#fff;border-radius:16px;box-shadow:0 14px 50px rgba(0,0,0,.4);padding:16px 22px;z-index:1000;border-top:5px solid var(--teal)}" +
    "#ex.full{top:50%;bottom:auto;transform:translate(-50%,-50%);width:600px;padding:24px 28px;max-height:90vh;overflow:auto}" +
    "#ex h2{margin:0 0 6px;font-size:20px}#ex .k{font-size:12px;color:var(--mut);letter-spacing:.5px;text-transform:uppercase;font-weight:700}" +
    "#ex .qt{font-size:18px;font-weight:600;line-height:1.45;margin:6px 0 12px}" +
    "#ex .hint{background:#fff7e6;border:1px solid #f5a623;border-radius:10px;padding:8px 12px;font-size:14px;color:#7a4a00;margin-bottom:10px}" +
    "#ex .row{display:flex;justify-content:space-between;align-items:center;gap:10px}" +
    "#ex .btn{font-size:14px;padding:8px 16px}" +
    "#ex .bar{height:6px;background:#e7efee;border-radius:4px;margin-bottom:10px;overflow:hidden}#ex .bar i{display:block;height:100%;background:var(--teal)}" +
    "#ex input[type=text]{width:100%;height:40px;border:1px solid var(--line);border-radius:8px;padding:0 12px;font-size:16px;outline:none}#ex input[type=text]:focus{border-color:var(--teal)}" +
    "#ex #exch{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:6px}" +
    "#ex .opt2{display:inline-flex;gap:6px;align-items:center;border:1px solid var(--line);border-radius:999px;padding:5px 13px;font-size:13px;cursor:pointer}#ex .opt2:hover{background:#f1f8f6}#ex .opt2.sel{border-color:var(--teal);background:#e9f6f3}" +
    "#ex .msg{font-size:14px;font-weight:600;margin:8px 0}.bad{color:#b3243a}" +
    "#ex .done{background:#e7f6ea;border:1px solid #9bd3a8;border-radius:12px;padding:12px 16px;display:flex;justify-content:space-between;align-items:flex-end;gap:12px}#ex .done>div{flex:1}" +
    "#ex .done b{font-size:18px;color:#1c7a40}#ex .done small{display:block;color:#456;font-size:12px;margin-top:2px}" +
    "#exdim{position:fixed;inset:0;background:rgba(10,25,28,.55);z-index:900;display:none}" +
    "#ex table{width:100%;border-collapse:collapse;margin:12px 0}#ex td{padding:8px 4px;font-size:14px;border-top:1px solid #eef2f2;vertical-align:top}" +
    
    "#ex .bd{margin-top:8px;font-size:13px;font-weight:400;color:#345}#ex .bd div{display:flex;justify-content:space-between;gap:10px;padding:1px 0}#ex .bd .y{color:#1c7a40}#ex .bd .n{color:#b3243a}" +
    "#xp{position:fixed;top:0;right:0;bottom:0;width:340px;background:#fff;border-left:1px solid var(--line);z-index:960;display:none;flex-direction:column;padding-top:72px}" +
    "body.has-xp.xp-on #xp{display:flex}" +
    "#xp .xh{padding:12px 16px;border-bottom:1px solid var(--line);display:flex;gap:10px;align-items:center}" +
    "#xp .av{width:36px;height:36px;border-radius:50%;background:#F4B63F;color:#fff;display:grid;place-items:center;font-weight:700;font-size:13px;flex:none}" +
    "#xp .xh b{display:block;font-size:14px}#xp .xh small{color:var(--mut);font-size:11px}" +
    "#xp .xb{flex:1;overflow:auto;padding:14px;display:flex;flex-direction:column;gap:10px;background:#fafbfb}" +
    "#xp .m{background:#fff;border:1px solid var(--line);border-radius:4px 14px 14px 14px;padding:9px 12px;font-size:13px;line-height:1.5;max-width:90%;align-self:flex-start}" +
    "#xp .m.me{align-self:flex-end;background:#e9f6f3;border-color:#bfe3db;border-radius:14px 4px 14px 14px}" +
    "#xp .m.sys{align-self:stretch;background:#fff8e6;border:1px solid #f0dca8;color:#4a3b10;font-size:13px;line-height:1.55;text-align:left;padding:10px 12px;max-width:100%;border-radius:10px}" +
    "#xp .m.old{opacity:.55}#xp .m.new{animation:xpin .35s}@keyframes xpin{from{opacity:0;transform:translateY(8px)}}" +
    "#xp .att{display:flex;gap:10px;align-items:center;margin-top:8px;border:1px solid var(--line);border-radius:10px;padding:6px;cursor:pointer;background:#f6fbf6}#xp .att:hover{background:#eaf6ea}" +
    "#xp .th{width:54px;height:54px;border-radius:6px;background:#f4fbf4;border:1px solid #9fcfa6;display:grid;place-items:center;font-size:8px;color:#4a7a50;text-align:center;line-height:1.3;flex:none}" +
    "#xp .att small{display:block;color:var(--mut);font-size:11px}" +
    "#xp #ex{position:static;transform:none;width:auto;max-width:none;border-radius:0;box-shadow:none;border-top:5px solid var(--teal);padding:12px 16px;max-height:58vh;overflow:auto;flex:none}#xp #ex .qt{font-size:15px;margin:4px 0 10px}#xp #ex .btn{font-size:13px;padding:7px 12px}" +
    "#ex .copts{display:flex;flex-direction:column;gap:6px;margin-top:8px}#ex .copts .btn{text-align:left}#ex .copts .btn.on{background:var(--teal);color:#fff;border-color:var(--teal)}" +
    "#xp .xf{padding:10px 16px;border-top:1px solid var(--line);font-size:11.5px;color:var(--mut);line-height:1.5}" +
    "#ex .big{font-size:40px;font-weight:800;margin:6px 0}.ok{color:#1c7a40}.no{color:#b3243a}";
  document.head.appendChild(st);
  var dim = document.createElement("div"); dim.id = "exdim"; document.body.appendChild(dim);
  var box = document.createElement("div"); box.id = "ex"; document.body.appendChild(box);

  var panel = document.createElement("div"); panel.id = "xp"; document.body.appendChild(panel);
  panel.innerHTML = '<div class="xh" id="xph"></div><div class="xb" id="xpb"></div><div id="xpq"></div>';
  var thread = { id: "", msgs: [] };
  /* chat: { thread, who:{name, sub}, msgs:[{from:"them"|"me"|"sys", text, att:{name, sub, cert:[kind,no,name,owner]}}] }.
     Messages from earlier questions of the same thread stay above, dimmed. */
  function drawPanel(c){
    if (!c) { document.body.classList.remove("xp-on"); return; }
    document.body.classList.add("has-xp", "xp-on");
    if (thread.id !== c.thread) { thread.id = c.thread; thread.msgs = []; }
    thread.msgs = thread.msgs.filter(function(m){ return m.q !== n; });
    c.msgs.forEach(function(m){ thread.msgs.push({ q: n, m: m }); });
    document.getElementById("xph").innerHTML = '<div class="av">' + esc(c.who.av || c.who.name.split(" ").map(function(w){ return w[0]; }).join("").slice(0, 2)) + '</div><div><b>' + esc(c.who.name) + '</b><small>' + esc(c.who.sub || "") + '</small></div>';
    document.getElementById("xpb").innerHTML = thread.msgs.map(function(x, i){
        var m = x.m, att = m.att ? '<div class="att" data-i="' + i + '"><div class="th">' + (m.att.cert[0] === "dti" ? "DTI" : "SEC") + '<br>CERT</div><div><b style="font-size:12px">' + esc(m.att.name) + '</b><small>' + esc(m.att.sub || "Photo · tap to open") + '</small></div></div>' : "";
        return '<div class="m ' + (m.from === "me" ? "me" : m.from === "sys" ? "sys" : "") + (x.q < n ? " old" : " new") + '">' + (m.text ? esc(m.text.replace(/\{ME\}/g, (AM_NAME || ME).split(" ")[0])) : "") + att + '</div>';
      }).join("");
    panel.querySelectorAll(".att").forEach(function(a){ a.onclick = function(){ showCert.apply(null, thread.msgs[+a.getAttribute("data-i")].m.att.cert); }; });
    var xb = document.getElementById("xpb"); if (xb) xb.scrollTop = xb.scrollHeight;
  }
  function lead(id){ return LEADS.filter(function(l){ return l.id === id; })[0]; }
  function shuffle(a){ a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }

  /* nav: check(ev, data, ctx) -> true when done.  input: answer() -> accepted string(s).  mcq: choices + answer(). */
  var DEFAULT_TASKS = [
    { type: "nav", text: "You want to see your list of leads. Where do you go?",
      hint: "Look at the menu on the left. The Lead List icon is a star.",
      check: function(ev){ return ev === "render" && location.hash.indexOf("#/leads") === 0; } },
    { type: "nav", text: "You want to see more information about Angel's Catering Services. How do you check?",
      hint: "That lead is not on your list. Use the search bar at the top.",
      check: function(ev){ return ev === "render" && location.hash === "#/lead/156661"; } },
    { type: "input", text: "What is the Lead ID of Angel's Catering Services?",
      hint: "The Lead ID is shown on the lead page, next to the lead name.",
      answer: function(){ return ["156661"]; }, placeholder: "Type the Lead ID" },
    { type: "nav", text: "You want to check your summary of originations. Where do you go?",
      hint: "Originations is the card icon in the menu.",
      check: function(ev){ return ev === "render" && location.hash.indexOf("#/originations") === 0; } },
    { type: "nav", text: "You want to see your Open BCLs. Where do you go?",
      hint: "It is the layers icon, below Referrers.",
      check: function(ev){ return ev === "render" && location.hash.indexOf("#/open-bcls") === 0; } },
    { type: "nav", text: "You want to see the history of the BCL status of Metro Courier Services. How do you check?",
      hint: "Open the lead, then look for the clock icon inside the BCL STATUS box.",
      check: function(ev, d){ return ev === "status-history" && d.kind === "BCL" && d.id === "350115"; } },
    { type: "mcq", text: "What is the status of lead 316266?",
      hint: "You can search by Lead ID, not just by name.",
      choices: ["For Engagement", "Prospecting", "Discovery", "Onboarded", "Utilized"],
      answer: function(){ return [lead("316266").status]; } },
    { type: "nav", text: "You want to see only your leads that are Onboarded. How do you do that?",
      hint: "Go to the Lead List and use the Status filter.",
      check: function(ev, d){ return ev === "filter" && d.key === "status" && d.vals.indexOf("Onboarded") >= 0 && location.hash.indexOf("#/leads") === 0; } },
    { type: "input", text: "How many of your leads are Onboarded?",
      hint: "Look at the number of entries at the bottom of the Lead List after you filter.",
      answer: function(){ return [String(LEADS.filter(function(l){ return l.owner === "me" && l.status === "Onboarded"; }).length)]; }, placeholder: "Type a number" },
    { type: "nav", text: "You are talking to your referrer, Bea Salonga. She asks which leads she has referred to you. Where do you go?",
      hint: "Referrers is the person icon in the menu. Click her name.",
      check: function(ev, d){ return ev === "referrer-open" && d === "Bea Salonga"; } },
    { type: "input", text: "How many leads has Bea Salonga referred to you?",
      hint: "It is shown when you open her name in Referrers.",
      answer: function(){ return [String(LEADS.filter(function(l){ return l.refBy === "Bea Salonga"; }).length)]; }, placeholder: "Type a number" },
    { type: "nav", text: "You want to see only the referrers of type RPP. How do you do that?",
      hint: "Go to Referrers and use the Type filter.",
      check: function(ev, d){ return ev === "filter" && d.key === "rty" && d.vals.indexOf("RPP") >= 0; } },
    { type: "nav", text: "You want to see the details of one of your originations. How do you check?",
      hint: "Go to Originations. Each row has an eye icon on the right.",
      check: function(ev){ return ev === "orig-detail"; } },
    { type: "nav", text: "You want to see only your originations from September 2026. How do you do that?",
      hint: "On Originations, change the date filter on the right side to September 2026.",
      check: function(ev, d){ return ev === "filter" && d.key === "cov" && d.by === "Monthly" && d.mo === 8 && d.yr === 2026; } },
    { type: "input", text: "What is the total Amount of your originations in September 2026?",
      hint: "The Total row is at the top of the Originations list. Filter to September 2026 first.",
      answer: function(){ var t = ORIG.filter(function(o){ return o.ym === "2026-09"; }).reduce(function(a, o){ return a + o.amt; }, 0); return [String(t)]; }, placeholder: "Type the amount" }
  ];

  var TASKS = CFG.tasks || DEFAULT_TASKS;
  var TASK_ID = CFG.taskId || "d5-acqui-practice", NEXT_HREF = CFG.nextHref || "acqui-tour.html", NEXT_LABEL = CFG.nextLabel || "Review the tour";
  var AM_NAME = "", n = 0, res = [], flags = {}, hintUsed = false, wrongs = 0, loss = 0, started = 0, state = "idle", picked = null;

  var timedOut = false, tmEl = null, tmId = null;
  function startTimer(){
    timedOut = false; stopTimer();
    tmEl = document.createElement("div"); tmEl.style.cssText = "position:fixed;top:10px;left:50%;transform:translateX(-50%);z-index:1210;background:#fff;border:1px solid var(--line);border-radius:999px;padding:5px 16px;font-weight:800;font-size:16px;font-variant-numeric:tabular-nums;box-shadow:0 4px 14px rgba(0,0,0,.18)";
    document.body.appendChild(tmEl);
    var end = started + CFG.minutes * 60000;
    var tick = function(){ var left = Math.max(0, Math.round((end - Date.now()) / 1000)); tmEl.textContent = "⏱ " + Math.floor(left / 60) + ":" + ("0" + (left % 60)).slice(-2); tmEl.style.color = left <= 120 ? "#b3243a" : "#17323a"; if (left <= 0) { stopTimer(); if (state !== "idle") { timedOut = true; ACQUI.emit("finish-test"); } } };
    tick(); tmId = setInterval(tick, 1000);
  }
  function stopTimer(){ clearInterval(tmId); if (tmEl) { tmEl.remove(); tmEl = null; } }
  function esc(s){ return String(s).replace(/</g, "&lt;"); }
  function fmtPts(x){ return (Math.round(x * SCALE * 100) / 100).toString(); }
  function pointsNow(raw){ return Math.max(0, (raw == null ? 1 : raw) - (hintUsed ? HINT_COST : 0) - loss); }

  function intro(){
    state = "idle"; dim.style.display = "block"; box.className = "full"; document.body.classList.remove("xp-on");
    box.innerHTML = '<div class="k">' + (G ? 'Graded exam · ' + CFG.minutes + ' minutes' : 'Practice check · not graded') + '</div><h2>' + esc(CFG.title || "Find your way around Acqui Service") + '</h2>' +
      '<p style="font-size:15px;line-height:1.55;margin:8px 0 10px">' + (CFG.intro || ('You will get ' + TASKS.length + ' short situations, one at a time. Use the simulation behind this box to find the answer or the right place. Some questions ask you to type or pick what you find.')) + '</p>' +
      '<p style="font-size:14px;line-height:1.55;margin:0 0 14px;color:#456">' + (CFG.scoring || ('Every question starts with 1 point. A hint costs ' + fmtPts(HINT_COST) + ' point, and each wrong answer costs ' + fmtPts(WRONG_COST) + '.')) + (G ? ' This exam is graded and you get one attempt. You have ' + CFG.minutes + ' minutes: the timer starts when you press Start, and unanswered questions get 0 when time is up. Pass mark ' + PASS + '%.' : ' This is practice, so your score is not recorded as a grade. Aim for ' + PASS + '% or more.') + '</p>' +
      (CFG.askName ? '<div style="background:#f4f8f8;border:1px solid var(--line);border-radius:10px;padding:10px 12px;margin:0 0 14px"><div style="font-size:13px;line-height:1.5;color:#345;margin-bottom:8px"><b>Honor code.</b> I will answer this test on my own. I will not ask anyone for help, and I will not share the questions or answers.</div><label style="font-size:13px;font-weight:700">AM name: <input type="text" id="exname" placeholder="Type your name" autocomplete="off" style="margin-top:4px"></label><div style="font-size:11px;color:var(--mut);margin-top:4px">This is the name you will use in the Acqui Service simulation.</div></div>' : '') +
      '<div class="row"><span>' + (window.ACQUI_STANDALONE ? '' : G ? '<a href="../dashboard.html" style="font-size:13px;color:var(--teal)">' + (CFG.backLabel || "Back") + '</a>' : '<a href="../dashboard.html" style="font-size:13px;color:var(--teal)">Back to Day 5</a> · <a href="' + NEXT_HREF + '" style="font-size:13px;color:var(--teal)">' + NEXT_LABEL + ' first</a>') + '</span><button class="btn dark" id="exgo">Start</button></div>';
    document.body.appendChild(box);
    document.getElementById("exgo").onclick = function(){
      if (CFG.askName) {
        var nm = document.getElementById("exname").value.trim();
        if (nm.length < 2) { document.getElementById("exname").style.borderColor = "#b3243a"; document.getElementById("exname").focus(); return; }
        AM_NAME = nm; ME = nm; FC_STAFF[0] = "1368 - " + nm; ORIG.concat(BCLS).forEach(function(o){ o.am = nm; }); render();
      }
      begin();
    };
  }
  function begin(){ n = 0; res = []; started = Date.now(); if (G) startTimer(); TASKS.forEach(function(t){ if (t.reset) t.reset(); }); location.hash = "#/home"; dim.style.display = "none"; show(); }

  function show(){
    flags = {}; hintUsed = false; wrongs = 0; loss = 0; picked = null; state = "asking"; box.className = "";
    var t = TASKS[n];
    if (t.setup) t.setup();
    drawPanel(t.chat);
    if (t.chat) document.getElementById("xpq").appendChild(box); else document.body.appendChild(box);
    var answerUi = "";
    if (t.type === "input") answerUi = '<input type="text" id="exin" placeholder="' + esc(t.placeholder || "Type your answer") + '" autocomplete="off"><div id="exmsg"></div>';
    if (t.type === "mcq") answerUi = '<div id="exch">' + shuffle(t.choices).map(function(c){ return '<div class="opt2" data-c="' + esc(c) + '"><span>○</span> ' + esc(c) + '</div>'; }).join("") + '</div><div id="exmsg"></div>';
    if (t.type === "nav" || t.type === "act") answerUi = '<div id="exmsg"></div>';
    box.innerHTML = '<div class="bar"><i style="width:' + (n / TASKS.length * 100) + '%"></i></div><div class="k">Question ' + (n + 1) + ' of ' + TASKS.length + '</div>' +
      '<div class="qt">' + (t.html ? t.text : esc(t.text)) + '</div>' + answerUi + '<div id="exh"></div>' +
      (t.choice ? ((t.noHint ? '' : '<button class="btn" id="exhint" style="margin-top:8px">Show hint (-' + fmtPts(HINT_COST) + ')</button>') + '<div class="copts"><button class="btn" id="exproc">Proceed with getting lead</button><button class="btn" id="exstop">Do not proceed with getting lead</button><button class="btn" id="exskip2">Skip task (0 pts)</button><button class="btn dark" id="exdec" disabled style="text-align:center;opacity:.5">Submit</button></div>') : '<div class="row"><span style="display:flex;gap:8px">' + (t.noHint ? '' : '<button class="btn" id="exhint">Show hint (-' + fmtPts(HINT_COST) + ')</button>') + ((t.type === "input" || t.type === "mcq") ? '<button class="btn dark" id="exsub">Submit</button>' : '') + (t.alt ? '<button class="btn dark" id="exalt">' + esc(t.alt.label) + '</button>' : '') + '</span><button class="btn" id="exskip">Skip (0 points)</button></div>');
    if (t.choice) {
      var sel = "", decided = false, ids = ["exproc", "exstop", "exskip2"];
      ids.forEach(function(id){ document.getElementById(id).onclick = function(){
        if (decided) {   /* after Proceed is submitted, Skip is still possible, with a confirm */
          if (id === "exskip2" && !document.getElementById("exconf")) {
            var c = document.createElement("div"); c.id = "exconf";
            c.style.cssText = "margin-top:8px;background:#fff;border:1px solid var(--line);border-radius:12px;box-shadow:0 8px 28px rgba(0,0,0,.25);padding:10px 14px;font-size:13px";
            c.innerHTML = '<div style="margin-bottom:8px"><b>Skip this question?</b><br>You will get 0 points for it.</div><div style="display:flex;gap:8px;justify-content:flex-end"><button class="btn" id="exback">Go back</button><button class="btn dark" id="exsure">Yes, skip</button></div>';
            box.appendChild(c);
            document.getElementById("exback").onclick = function(){ c.remove(); };
            document.getElementById("exsure").onclick = function(){ finishQ(0, "skipped"); };
          }
          return;
        }
        sel = id;
        ids.forEach(function(x){ document.getElementById(x).classList.toggle("on", x === id); });
        var d = document.getElementById("exdec"); d.disabled = false; d.style.opacity = 1;
        var rs = document.getElementById("exreason");   /* "Do not proceed" needs a reason (not scored) */
        if (id === "exstop" && !rs) { rs = document.createElement("textarea"); rs.id = "exreason"; rs.placeholder = "Why are you not proceeding? (required)"; rs.style.cssText = "width:100%;height:58px;border:1px solid var(--line);border-radius:8px;padding:8px 10px;font:inherit;font-size:13px;outline:none;resize:none"; d.parentNode.insertBefore(rs, d); }
        if (rs) rs.style.display = id === "exstop" ? "block" : "none";
        document.getElementById("exmsg").innerHTML = '<div class="msg" style="color:#456">' + (id === "exstop" ? "Write your reason, then press Submit." : "Press Submit to confirm your decision.") + '</div>';
      }; });
      document.getElementById("exdec").onclick = function(){
        if (!sel || decided) return;
        if (sel === "exskip2") { finishQ(0, "skipped"); return; }
        if (sel === "exstop") {
          var why = (document.getElementById("exreason") || {}).value || "";
          if (!why.trim()) { document.getElementById("exmsg").innerHTML = '<div class="msg bad">Please write your reason first. It has no effect on your score.</div>'; return; }
          var rd = '<div class="bd"><div><span>Your reason: ' + esc(why.trim()) + '</span></div></div>';
          if (t.proceed === false) {
            if (!(flags.visited || {})[t.leadId]) { handle(t, "Look up the lead first before you decide."); return; }
            finishQ(pointsNow(), hintUsed ? "hint" : "ok", "", rd);
          } else finishQ(0, "wrong", "You could have gone ahead with this one. Always search the lead first, then decide.", rd);
          return;
        }
        decided = true; flags.proceed = true;
        ["exproc", "exstop"].forEach(function(x){ document.getElementById(x).disabled = true; }); this.style.display = "none";
        document.getElementById("exmsg").innerHTML = '<div class="msg" style="color:#1c7a40">Decision submitted. Now do it in Acqui Service.</div>';
      };
    }
    if (t.alt) document.getElementById("exalt").onclick = function(){ handle(t, t.alt.check({ flags: flags })); };
    if (!t.noHint) document.getElementById("exhint").onclick = function(){
      if (!hintUsed) hintUsed = true;
      document.getElementById("exh").innerHTML = '<div class="hint">Hint: ' + esc(t.hint) + '</div>';
      this.textContent = "Hint used (-" + fmtPts(HINT_COST) + ")";
    };
    document.getElementById("exskip").onclick = function(){
      /* mini confirm bubble: skipping is 0 points, so give them a way back */
      if (document.getElementById("exconf")) return;
      var c = document.createElement("div"); c.id = "exconf";
      c.style.cssText = "margin-top:8px;background:#fff;border:1px solid var(--line);border-radius:12px;box-shadow:0 8px 28px rgba(0,0,0,.25);padding:10px 14px;font-size:13px;z-index:2";
      c.innerHTML = '<div style="margin-bottom:8px"><b>Skip this question?</b><br>You will get 0 points for it.</div><div style="display:flex;gap:8px;justify-content:flex-end"><button class="btn" id="exback">Go back</button><button class="btn dark" id="exsure">Yes, skip</button></div>';
      box.appendChild(c);
      document.getElementById("exback").onclick = function(){ c.remove(); };
      document.getElementById("exsure").onclick = function(){ finishQ(0, "skipped"); };
    };
    if (t.type === "input") {
      var inp = document.getElementById("exin");
      document.getElementById("exsub").onclick = submit;
      inp.onkeydown = function(e){ if (e.key === "Enter") submit(); };
    }
    if (t.type === "mcq") {
      document.querySelectorAll("#exch .opt2").forEach(function(o){ o.onclick = function(){
        picked = o.dataset.c;
        document.querySelectorAll("#exch .opt2").forEach(function(x){ x.classList.remove("sel"); x.firstChild.textContent = "○"; });
        o.classList.add("sel"); o.firstChild.textContent = "●";
      }; });
      document.getElementById("exsub").onclick = submit;
    }
  }
  function norm(x){ return String(x).toLowerCase().replace(/[\s,\u20b1]/g, "").replace(/\.0+$/, ""); }
  function submit(){
    var t = TASKS[n], val = t.type === "input" ? document.getElementById("exin").value : picked;
    var msg = document.getElementById("exmsg");
    if (!val) { msg.innerHTML = '<div class="msg bad">Please give an answer first.</div>'; return; }
    var ok = t.answer().some(function(a){ return norm(a) === norm(val); });
    if (ok) { finishQ(pointsNow(), hintUsed ? "hint" : "ok"); }
    else { wrongs++; msg.innerHTML = '<div class="msg bad">Not quite. Check the simulation and try again. (-' + fmtPts(WRONG_COST) + ')</div>'; }
  }

  /* a question is finished: show the green "Done!" strip and wait for the learner to continue */
  function finishQ(pts, how, why, detail){
    if (state !== "asking") return;
    state = "done";
    res.push({ text: TASKS[n].text.replace(/<[^>]+>/g, " "), pts: pts, how: how, hint: hintUsed, wrongs: wrongs, why: why || "", detail: detail || "" });
    var last = n === TASKS.length - 1;
    var note = how === "skipped" ? "Skipped" : how === "wrong" ? why : how === "graded" ? fmtPts(pts) + " / " + SCALE + " points" + (hintUsed || wrongs ? " (" + [hintUsed ? "hint -" + fmtPts(HINT_COST) : "", wrongs ? wrongs + " wrong -" + fmtPts(loss) : ""].filter(Boolean).join(", ") + ")" : "") : fmtPts(pts) + (fmtPts(pts) === "1" ? " point" : " points") + (hintUsed || wrongs ? " (" + [hintUsed ? "hint -" + fmtPts(HINT_COST) : "", wrongs ? wrongs + " wrong -" + fmtPts(loss) : ""].filter(Boolean).join(", ") + ")" : "");
    box.innerHTML = '<div class="bar"><i style="width:' + ((n + 1) / TASKS.length * 100) + '%"></i></div><div class="k">Question ' + (n + 1) + ' of ' + TASKS.length + '</div>' +
      '<div class="qt" style="font-size:15px;color:#456">' + (TASKS[n].html ? TASKS[n].text : esc(TASKS[n].text)) + '</div>' +
      '<div class="done"' + (how === "wrong" ? ' style="background:#fde8ea;border-color:#e5a3ad"' : '') + '><div><b' + (how === "wrong" ? ' style="color:#b3243a"' : '') + '>' + (how === "skipped" ? "Skipped" : how === "wrong" ? "✗ Not correct" : how === "graded" ? (pts >= 0.8 ? "✓ Done!" : pts >= 0.5 ? "Done. Some parts were missed" : "Done. Most parts were missed") : "✓ Done!") + '</b><small>' + note + '</small>' + (detail || "") + '</div><button class="btn dark" id="exnext">' + (last ? "See my result" : "Next question →") + '</button></div>';
    document.getElementById("exnext").onclick = function(){ n++; if (n >= TASKS.length) finish(); else show(); };
  }

  function finish(){
    state = "idle";
    var total = res.reduce(function(a, r){ return a + r.pts; }, 0), capped = Math.min(total, TASKS.length), pct = Math.round(capped / TASKS.length * 100), pass = pct >= PASS;
    var secs = Math.round((Date.now() - started) / 1000);
    box.className = "full"; dim.style.display = "block"; document.body.appendChild(box);
    box.innerHTML = '<div class="k">' + (G ? 'Exam result' : 'Practice check · result') + '' + (AM_NAME ? ' · ' + esc(AM_NAME) : '') + '</div><div class="big ' + (pass ? "ok" : "no") + '">' + pct + '%</div><div style="font-size:16px;font-weight:600">' + (pass ? "Passed" : G ? "Not passed" : "Not yet. Review the tour and try again.") + ' (' + fmtPts(capped) + ' / ' + (TASKS.length * SCALE) + ' points' + (total > TASKS.length ? ', bonus included, capped at ' + (TASKS.length * SCALE) : '') + ', ' + Math.floor(secs / 60) + 'm ' + (secs % 60) + 's)</div>' +
      '<table>' + res.map(function(r){
        var why = r.how === "skipped" ? "skipped" : r.how === "wrong" ? "wrong" : r.how === "graded" ? (r.pts < 1 ? "partly right" : "") : [r.hint ? "hint" : "", r.wrongs ? r.wrongs + " wrong" : ""].filter(Boolean).join(", ");
        var bad = r.how === "skipped" || r.how === "wrong" || (r.how === "graded" && r.pts < 0.5);
        return '<tr><td style="width:24px" class="' + (bad ? "no" : "ok") + '">' + (bad ? "✗" : "✓") + '</td><td>' + esc(r.text) + (r.detail ? r.detail : "") + '</td><td style="white-space:nowrap;color:var(--mut)">' + why + '</td><td style="text-align:right"><b>' + fmtPts(r.pts) + '</b></td></tr>'; }).join("") + '</table>' +
      '<div class="row"><span>' + (window.ACQUI_STANDALONE ? '' : G ? '<a href="../dashboard.html" style="font-size:13px;color:var(--teal)">' + (CFG.backLabel || "Back") + '</a>' : '<a href="../dashboard.html" style="font-size:13px;color:var(--teal)">Back to Day 5</a> · <a href="' + NEXT_HREF + '" style="font-size:13px;color:var(--teal)">' + NEXT_LABEL + '</a>') + '</span>' + (G && !(window.LMS && LMS.preview && LMS.preview()) ? '<a class="btn dark" href="../dashboard.html" id="exagain" style="text-decoration:none">Back to dashboard</a>' : '<button class="btn dark" id="exagain">Try again</button>') + '</div>';
    if (!G || (window.LMS && LMS.preview && LMS.preview())) document.getElementById("exagain").onclick = intro;
    stopTimer();
    if (G) { try { LMS.saveResult(CFG.examId, { score: Math.round(capped * 100) / 100, max: TASKS.length, passed: pass, details: "Time used " + Math.floor(secs / 60) + ":" + ("0" + (secs % 60)).slice(-2) + " of " + CFG.minutes + ":00" + (timedOut ? " (time ran out)" : "") + (AM_NAME ? " | " + AM_NAME : ""), breakdown: res.map(function(r, i){ return (i + 1) + ". " + fmtPts(r.pts) + " " + (r.how === "skipped" ? "(skipped)" : ""); }).join("\n"), items: JSON.stringify({ rev: res.map(function(r){ return [r.text, r.pts, r.how]; }) }) }); } catch (err) {} }
    else try { if (window.LMS && LMS.user && LMS.user() && !(LMS.preview && LMS.preview())) LMS.complete(TASK_ID); } catch (err) {}   /* practice: ticks the Day 5 task, no grade saved */
    /* If this ever becomes graded: LMS.saveResult({ id:"d5-nav-check", label:"Acqui navigation check", score:total, max:TASKS.length, pct:pct, kind:"lms", passing:PASS }) */
    window.ACQUI_EXAM_RESULT = { name: AM_NAME, score: capped, max: TASKS.length, pct: pct, passed: pass, seconds: secs, tasks: res };
  }

  /* a graded answer: r.items = [{label, w, ok}] (the weights add up to 1), r.bonus = same, r.extra = [{label, loss}], r.factor = multiplier (e.g. 0.5) */
  function gradeIt(t, r){
    var sum = function(a, f){ return (a || []).reduce(function(x, i){ return x + f(i); }, 0); };
    var raw = sum(r.items, function(i){ return i.ok ? i.w : 0; }) + sum(r.bonus, function(i){ return i.ok ? i.w : 0; }) - sum(r.extra, function(i){ return i.loss; });
    raw = Math.max(0, raw) * (r.factor || 1);
    var line = function(label, ok, val, exp){ return '<div class="' + (ok ? "y" : "n") + '"><span>' + (ok ? "✓ " : "✗ ") + esc(label) + '</span><span>' + (!ok && exp ? "Expected: " + esc(exp) + " · " : "") + val + '</span></div>'; };
    var d = '<div class="bd">' +
      r.items.map(function(i){ return line(i.label, i.ok, i.ok ? "+" + fmtPts(i.w) : "0", i.exp); }).join("") +
      (r.bonus || []).map(function(i){ return line(i.label, i.ok, i.ok ? "bonus +" + fmtPts(i.w) : "no bonus"); }).join("") +
      (r.extra || []).map(function(i){ return i.loss ? line(i.label, false, "-" + fmtPts(i.loss)) : ""; }).join("") +
      (r.factor && r.factor < 1 ? '<div class="n"><span>✗ ' + esc(r.factorLabel || "Score reduced") + '</span><span>x ' + r.factor + '</span></div>' : "") + '</div>';
    finishQ(pointsNow(raw), "graded", "", d);
  }

  /* result of a check: true = done. "text" = wrong, try again (-0.25). { fatal: "text" } = wrong for good (0 points). false = nothing yet. */
  function handle(t, r){
    if (state !== "asking") return;
    if (r === true) { finishQ(pointsNow(), hintUsed ? "hint" : "ok"); return; }
    if (r && r.items) { gradeIt(t, r); return; }
    if (r && r.fatal) { if (t.undo) t.undo(); finishQ(0, "wrong", r.fatal); return; }
    if (typeof r === "string" || (r && r.msg)) {
      var text = typeof r === "string" ? r : r.msg, cost = typeof r === "string" ? WRONG_COST : (r.cost || WRONG_COST);
      wrongs++; loss += cost;
      var m = document.getElementById("exmsg"); if (m) m.innerHTML = '<div class="msg bad">' + esc(text) + ' (-' + fmtPts(cost) + ')</div>';
      if (t.undo) t.undo();
    }
  }
  ["render", "search-pick", "status-history", "lead-status-history", "orig-detail", "bcl-detail", "filter", "status-set", "referrer-open", "request-sent", "lead-created", "lead-create-blocked", "bookmark-open", "sec-search", "dti-search"].concat(CFG.events || []).forEach(function(ev){
    ACQUI.on(ev, function(d){
      if (state !== "asking") return;
      var t = TASKS[n]; if (!t || (t.type !== "nav" && t.type !== "act")) return;
      if (ev === "render" && d && d.route === "lead") { flags.visited = flags.visited || {}; flags.visited[d.id] = true; }
      if (ev === "lead-create-blocked") flags.dup = true;
      var c = { flags: flags };
      /* check on the next tick so the page has finished drawing */
      setTimeout(function(){ if (state === "asking" && TASKS[n] === t) { c.d = d; t.d = d; var r = (t.grade || t.check)(ev, d, c); if (r) { t._ev = d; handle(t, r); } } }, 30);
    });
  });
  /* "Finish test" (next to Exit): everything not answered yet is 0 points */
  ACQUI.on("finish-test", function(){
    if (state === "idle") return;
    if (state === "asking") res.push({ text: TASKS[n].text.replace(/<[^>]+>/g, " "), pts: 0, how: "skipped", hint: false, wrongs: 0, why: "", detail: "" });
    for (var i = res.length; i < TASKS.length; i++) res.push({ text: TASKS[i].text.replace(/<[^>]+>/g, " "), pts: 0, how: "skipped", hint: false, wrongs: 0, why: "", detail: "" });
    state = "idle"; finish();
  });
  /* Request this lead / Create Lead stay blocked until the learner picks "Proceed with getting lead" */
  window.ACQUI_GATE = function(){
    var t = TASKS[n]; if (state !== "asking" || !t || !t.choice || flags.proceed) return true;
    toast("First choose one of the options in the panel: proceed or not."); return false;
  };
  function taken(rec){
    state = "idle"; dim.style.display = "block"; box.className = "full"; document.body.classList.remove("xp-on"); document.body.appendChild(box);
    box.innerHTML = '<div class="k">Graded exam</div><h2>' + esc(CFG.title) + '</h2><p style="font-size:15px;line-height:1.55">You already took this exam, and it can only be taken once. Your score: <b>' + Math.round(rec.score / rec.max * 100) + '%</b>.</p><div class="row"><span></span><a class="btn dark" href="../dashboard.html" style="text-decoration:none">Back to dashboard</a></div>';
  }
  if (G && window.LMS && !(LMS.preview && LMS.preview())) {
    var go = function(){ if (state !== "idle" || document.getElementById("exgo")) return; var rec = (LMS.progress() || {})[CFG.examId]; (rec && rec.status === "done" && !(LMS.canRetake && LMS.canRetake())) ? taken(rec) : intro(); };
    dim.style.display = "block"; (LMS.ready || Promise.resolve()).then(go, go); setTimeout(go, 8000);
  } else intro();
})();
