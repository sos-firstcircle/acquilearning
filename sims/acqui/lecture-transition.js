/* Guided demo (Day 10): log a Transition call once the BCL has been opened and utilized. Loaded after app.js + lead-ext.js, before tour.js.
   Lead: Reyes Paper Trading (290318), status Utilized. Marites Reyes (owner) is the contact. Transition call, Transition Call playbook. */
(function(){
  var ID = "290318", $ = function(id){ return document.getElementById(id); };
  var l0 = LEADS.filter(function(l){ return l.id === ID; })[0];
  if (!l0) { l0 = { id: ID, name: "Reyes Paper Trading", channel: "KAM - Self Generated Leads", entry: "KAM - Self Generated Leads", touch: "KAM - Self Generated Leads", owner: "me", contact: "Marites Reyes" }; LEADS.unshift(l0); }
  l0.status = "Utilized"; l0.risk = "Fully Verified with Provisional Limit"; l0.ba = "Approved"; l0.bclAmt = 300000; l0.clo = 300000; l0.eng = "2026-10-12";
  l0.contacts = [{ fn: "Marites", ln: "Reyes", role: "Owner", rel: "Decision Maker", phones: ["09171230321"], emails: [] }];
  if (!BCLS.some(function(b){ return b.id === ID; })) BCLS.unshift({ co: "Reyes Paper Trading", id: ID, team: "Region Team 2", am: ME, bcl: 300000, orig30: 180000, login: "2026-10-12", ym: "2026-10", date: "Oct 12, 2026" });
  var HASH = "#/lead/" + ID, logged = false;
  ACQUI.on("activity-logged", function(){ logged = true; });
  var v = function(css){ var e = document.querySelector(css); return e ? e.value : ""; };
  var lxOn = function(t){ var e = $("lx"); return !!e && getComputedStyle(e).display === "flex" && (!t || e.innerText.indexOf(t) >= 0); };
  function pickOpt(css, prefix){ var e = document.querySelector(css); if (!e) return; var o = [].filter.call(e.options, function(x){ return x.text.indexOf(prefix) === 0; })[0]; if (o) { e.value = o.value; e.dispatchEvent(new Event("change", { bubbles: true })); } }
  function put(css, val, ev){ var e = document.querySelector(css); if (!e) return; e.value = val; e.dispatchEvent(new Event(ev || "input", { bubbles: true })); }
  var ta = function(k){ return v('#lx-r textarea[data-k="' + k + '"]').trim(); };

  window.ACQUI_TOUR_META = { taskId: "d10-demo-transition", nextHref: "../dashboard.html", nextLabel: "Back to Day 10", backLabel: "Back to Day 10" };
  window.ACQUI_STEPS = [
    { r:"home", dim:"light", say:"Hi, I'm {T}! In this demo you'll learn how to log a Transition call. After a client's BCL is opened and used, you hand the account over to the RM / Customer Success. Before you do, you call the client, and that call must be logged. Click Next." },
    { r:"home", dim:"none", say:"Here's the situation. Reyes Paper Trading opened a BCL of 300,000 and did a drawdown on Oct 12. The 30 days to trigger another drawdown are over, so it is time to transition the account. Click Next." },
    { r:"home", target:'#side .nv[data-r="open-bcls"]', click:true, dim:"none", hint:"Click the layers icon (Open BCLs) in the menu.", say:"First, check the BCL. Open BCLs shows your approved BCLs." },
    { r:"open-bcls", target:"[data-beye]", click:true, circle:true, dim:"none", hint:"Click the eye icon on the first row (Reyes Paper Trading).", say:"Click the eye icon on Reyes Paper Trading to see its BCL details." },
    { r:"open-bcls", modal:"bcl", target:"#md", dim:"strong", say:"The BCL amount is 300,000 and the total originations in the last 30 days is 180,000. So 120,000 of the BCL is still unused. Good to know before you call the client. Click Next." },
    { r:"open-bcls", modal:"bcl", target:"#mx", click:true, circle:true, dim:"none", say:"Let's close it.", hint:"Click the X." },
    { r:"open-bcls", dim:"none", say:"Now call Marites Reyes, the owner. You explain the Principal Paydown Policy: to request another loan from the credit limit, she must repay at least 50% of the outstanding balance. She understood. Click Next." },
    { r:"open-bcls", target:'#side .nv[data-r="leads"]', click:true, dim:"none", hint:"Click the star icon (Leads) in the menu.", say:"Open the lead to log the call." },
    { r:"leads", target:'[data-open="' + ID + '"]', click:true, circle:true, dim:"none", hint:"Click Open on Reyes Paper Trading.", say:"Click Open on Reyes Paper Trading." },
    { r:"lead", hash:HASH, target:"[data-logmenu]", circle:true, dim:"none", hint:"Click + Log activity.", say:"Click + Log activity.",
      until:function(){ return !!document.querySelector(".lxmenu"); }, auto:function(){ setTimeout(function(){ var b = document.querySelector("[data-logmenu]"); if (b) b.click(); }, 60); } },
    { r:"lead", hash:HASH, target:'.lxmenu [data-m="log"]', dim:"none", hint:"Click Log call/meeting.", say:"Choose Log call/meeting.",
      until:function(){ return lxOn("Log Activity"); }, auto:function(){ var b = document.querySelector('.lxmenu [data-m="log"]'); if (b) b.click(); } },
    { r:"lead", hash:HASH, modal:"keep", target:"#seg", dim:"strong", say:"We called Marites, so Call is selected." },
    { r:"lead", hash:HASH, modal:"keep", target:'[data-s="type"]', dim:"none", hint:"Choose Transition.", say:"Type: you are handing the account over to the RM / Customer Success after the drawdown window. That is a Transition call.",
      until:function(){ return v('#lx [data-s="type"]') === "Transition"; }, wrongIf:function(){ var x = v('#lx [data-s="type"]'); return x && x !== "Transition" ? "Not this one. Read the descriptions: handing the account over after the drawdown window is Transition." : ""; }, auto:function(){ put('#lx [data-s="type"]', "Transition", "change"); } },
    { r:"lead", hash:HASH, modal:"keep", target:'[data-s="outcome"]', dim:"none", hint:"Choose Connected.", say:"Call Outcome: Marites picked up and you spoke, so Connected.",
      until:function(){ return v('#lx [data-s="outcome"]') === "Connected"; }, wrongIf:function(){ var x = v('#lx [data-s="outcome"]'); return x && x !== "Connected" ? "Not this one. You spoke with Marites: Connected." : ""; }, auto:function(){ put('#lx [data-s="outcome"]', "Connected", "change"); } },
    { r:"lead", hash:HASH, modal:"keep", target:'[data-s="contact"]', dim:"none", hint:"Choose Marites Reyes.", say:"Contact: Marites Reyes.",
      until:function(){ return v('#lx [data-s="contact"]').indexOf("Marites") === 0; }, wrongIf:function(){ var x = v('#lx [data-s="contact"]'); return x && x.indexOf("Marites") !== 0 ? "Not this one. You spoke with Marites Reyes." : ""; }, auto:function(){ pickOpt('#lx [data-s="contact"]', "Marites"); } },
    { r:"lead", hash:HASH, modal:"keep", target:"#pbsel", dim:"none", hint:"Choose Transition Call.", say:"Playbook: a Transition call has its own playbook. Choose Transition Call. It asks for four things for the new RM.",
      until:function(){ return v("#pbsel") === "Transition Call"; }, wrongIf:function(){ var x = v("#pbsel"); return x && x !== "Transition Call" && x !== "No playbook" ? "Not this one. Choose Transition Call." : ""; }, auto:function(){ put("#pbsel", "Transition Call", "change"); } },
    { r:"lead", hash:HASH, modal:"keep", target:"#lx-r", allow:"#lx-r", dim:"none", hint:"Main POC: Marites Reyes, 09171230321, Viber. Alternative: Gina Reyes, 09181230321, Viber calls only, cheque pick-up.",
      say:"Main POC: who is the main contact, with number, nickname and preferred way to communicate. Alternative contact: someone else the RM can reach, with number and what they handle. Write: Marites Reyes, 09171230321, prefers Viber. Alternative: her sister Gina Reyes, 09181230321, Viber calls only, for cheque pick-up.",
      until:function(){ return ta("poc").length >= 10 && ta("alt").length >= 10; }, auto:function(){ put('#lx-r textarea[data-k="poc"]', "Marites Reyes, 09171230321, prefers Viber"); put('#lx-r textarea[data-k="alt"]', "Gina Reyes (sister), 09181230321, Viber calls only - all concerns regarding cheque pick-up"); } },
    { r:"lead", hash:HASH, modal:"keep", target:"#lx-r", allow:"#lx-r", dim:"none", hint:"Example: pays suppliers every 5th of the month and likes a reminder the day before.",
      say:"Insights: anything useful for the new RM. For example, Marites pays suppliers every 5th of the month and likes a reminder the day before. Then tap Yes on the principal paydown question, because you explained it.",
      until:function(){ return ta("insight").length >= 10 && !!document.querySelector('#lx-r .lx-yn[data-k="paydown"] button.on[data-v="Yes"]'); }, auto:function(){ put('#lx-r textarea[data-k="insight"]', "Pays suppliers every 5th of the month. Likes a reminder the day before."); var b = document.querySelector('#lx-r .lx-yn[data-k="paydown"] button[data-v="Yes"]'); if (b) b.click(); } },
    { r:"lead", hash:HASH, modal:"keep", target:"#lx-ok", circle:true, dim:"none", hint:"Click Log Call.", say:"Everything is filled in. Click Log Call.",
      until:function(){ return logged; }, auto:function(){ var b = $("lx-ok"); if (b) b.click(); } },
    { r:"lead", hash:HASH, good:true, dim:"none", say:"Good job! The Transition call is logged. It shows in the lead's Engagement tab, so the new RM can read it. Click Next." },
    { r:"lead", hash:HASH, end:true, dim:"light", say:"Let's recap. One: check the Open BCL and how much is unused. Two: call the client and explain the Principal Paydown Policy. Three: + Log activity, Log call/meeting, type Transition, outcome and contact. Four: use the Transition Call playbook: main POC, alternative contact, insights for the new RM, and paydown discussed. Well done!" }
  ];

  var st = document.createElement("style"); st.textContent = "#lx{right:min(400px,31vw) !important;justify-content:safe center}#tour{width:min(430px,29.5vw) !important}#lx .lxp{flex:0 1 auto;min-width:200px;max-width:100%}#lx .lxp .lb{min-height:0}#lx .tour-hl{outline:4px solid #f5a623 !important;outline-offset:3px !important}#lx .tour-hl.circle{border-radius:999px !important}"; document.head.appendChild(st);
  setInterval(function(){ var e = $("lx"); if (!e) return; e.inert = getComputedStyle(e).display === "flex" && !document.querySelector("#tour .try"); }, 120);
  window.ACQUI_STEPS.forEach(function(s){ if (s.modal === "keep") { s.force = true; s.prefer = ["tr", "br"]; } });
})();
