/* Guided demo (Day 9): add a contact and log a call in Acqui Service. Loaded after app.js + lead-ext.js, before tour.js (which runs these steps).
   Lead: Cruz Bakery Supplies (280117). Rosa Cruz (applicant) is the only contact; the owner Eduardo Cruz decides, so we add him, then log a Prospecting call (no playbook, notes only). */
(function(){
  var ID = "280117", $ = function(id){ return document.getElementById(id); };
  if (!LEADS.some(function(l){ return l.id === ID; })) LEADS.unshift({ id: ID, name: "Cruz Bakery Supplies", status: "For Engagement", risk: "-", channel: "KAM - Self Generated Leads", entry: "KAM - Self Generated Leads", touch: "KAM - Self Generated Leads", clo: 0, eng: "2026-11-12", owner: "me", contact: "Rosa Cruz", task: { pr: "High", due: "Due today" } });
  var LX = window.ACQUI_LX, HASH = "#/lead/" + ID, logged = false;
  ACQUI.on("activity-logged", function(){ logged = true; });
  var lxOn = function(t){ var e = $("lx"); return !!e && getComputedStyle(e).display === "flex" && (!t || e.innerText.indexOf(t) >= 0); };
  var v = function(css){ var e = document.querySelector(css); return e ? e.value : ""; };
  function pickOpt(css, prefix){ var e = document.querySelector(css); if (!e) return; var o = [].filter.call(e.options, function(x){ return x.text.indexOf(prefix) === 0; })[0]; if (o) { e.value = o.value; e.dispatchEvent(new Event("change", { bubbles: true })); } }
  function put(css, val, ev){ var e = document.querySelector(css); if (!e) return; e.value = val; e.dispatchEvent(new Event(ev || "input", { bubbles: true })); }
  var hasContact = function(){ return LX.contactsOf(LX.byId(ID)).some(function(c){ return c.fn === "Eduardo"; }); };

  window.ACQUI_TOUR_META = { taskId: "d9-demo-log-call", nextHref: "acqui-practice-log-call.html", nextLabel: "Practice", backLabel: "Back to Day 9" };
  window.ACQUI_STEPS = [
    { r:"home", dim:"light", say:"Hi, I'm {T}! In this demo you'll learn how to add a contact and how to log a call in Acqui Service. Every call you make to a lead must be logged, so the team can see what was discussed. Click Next." },
    { r:"home", dim:"none", say:"Here's the situation. Cruz Bakery Supplies is your own lead. So far the only contact on the lead is Rosa Cruz, the applicant. Rosa told you the owner, her brother Eduardo Cruz, is the one who decides on financing. His number is 09171230088 and his email is eduardo.cruz@example.com. Click Next." },
    { r:"home", target:'#side .nv[data-r="leads"]', click:true, dim:"none", hint:"Click the star icon (Leads) in the menu.", say:"First, open the lead. Your leads are in the Lead List." },
    { r:"leads", target:'[data-open="' + ID + '"]', click:true, circle:true, dim:"none", hint:"Click Open on Cruz Bakery Supplies.", say:"Click Open on Cruz Bakery Supplies." },
    { r:"lead", hash:HASH, target:"[data-addc]", click:true, dim:"none", hint:"Click + Add contact.", say:"Before you call Eduardo, add him as a contact. Contacts are in Company info, under Business Contacts. Click + Add contact.",
      auto:function(){ var b = document.querySelector("[data-addc]"); if (b) b.click(); } },
    { r:"lead", hash:HASH, modal:"keep", target:"#lx .lxp", dim:"strong", say:"This is the Add Contact form. First name and last name are required. The rest helps you and your team reach the right person." },
    { r:"lead", hash:HASH, modal:"keep", target:"#cf", allow:"#cl", dim:"none", hint:"First name Eduardo, last name Cruz.", say:"Type the first name and the last name of the contact.",
      until:function(){ return v("#cf").trim() !== "" && v("#cl").trim() !== ""; }, auto:function(){ put("#cf", "Eduardo"); put("#cl", "Cruz"); } },
    { r:"lead", hash:HASH, modal:"keep", target:"#ph", allow:"#em", dim:"none", hint:"Phone 09171230088, email eduardo.cruz@example.com.", say:"Add his phone number and email. You can add more than one with + Add phone and + Add email.",
      until:function(){ return v("#ph input") !== "" && v("#em input") !== ""; }, auto:function(){ put("#ph input", "09171230088"); put("#em input", "eduardo.cruz@example.com"); } },
    { r:"lead", hash:HASH, modal:"keep", target:"#cr", dim:"none", hint:"Choose Owner.", say:"Role at this company: Eduardo owns the business, so choose Owner.",
      until:function(){ return v("#cr") === "Owner"; }, wrongIf:function(){ var x = v("#cr"); return x && x !== "Owner" && x !== "—" ? "Not this one. Eduardo is the owner: Owner." : ""; }, auto:function(){ put("#cr", "Owner", "change"); } },
    { r:"lead", hash:HASH, modal:"keep", target:"#cy", dim:"none", hint:"Choose Decision Maker.", say:"Relationship type: how is he to you? Eduardo decides, so he is the Decision Maker. A gatekeeper is someone who only passes you on, like a receptionist.",
      until:function(){ return v("#cy") === "Decision Maker"; }, wrongIf:function(){ var x = v("#cy"); return x && x !== "Decision Maker" && x !== "—" ? "Not this one. He decides on financing: Decision Maker." : ""; }, auto:function(){ put("#cy", "Decision Maker", "change"); } },
    { r:"lead", hash:HASH, modal:"keep", target:"#lx-ok", circle:true, dim:"none", hint:"Click Add Contact.", say:"Click Add Contact.",
      until:hasContact, auto:function(){ var b = $("lx-ok"); if (b) b.click(); } },
    { r:"lead", hash:HASH, good:true, dim:"none", say:"Good job! Eduardo is now a contact on the lead. A green message at the top right also tells you it worked. Now let's call him. Click Next." },

    { r:"lead", hash:HASH, dim:"none", say:"You called Eduardo. He picked up and listened. He is open to hear about a credit line and agreed to meet you face to face this Friday at 10 AM at the bakery. Now log the call. Click Next." },
    { r:"lead", hash:HASH, target:"[data-logmenu]", circle:true, onEnter:function(){ if (!hasContact()) LX.contactsOf(LX.byId(ID)).push({ fn: "Eduardo", ln: "Cruz", role: "Owner", rel: "Decision Maker", phones: ["09171230088"], emails: ["eduardo.cruz@example.com"] }); }, dim:"none", hint:"Click + Log activity.", say:"Click + Log activity. It's near the lead's tasks.",
      until:function(){ return !!document.querySelector(".lxmenu"); }, auto:function(){ setTimeout(function(){ var b = document.querySelector("[data-logmenu]"); if (b) b.click(); }, 60); } },
    { r:"lead", hash:HASH, target:'.lxmenu [data-m="log"]', dim:"none", hint:"Click Log call/meeting.", say:"Choose Log call/meeting. (Add note is for a note without a call or meeting.)",
      until:function(){ return lxOn("Log Activity"); }, auto:function(){ var b = document.querySelector('.lxmenu [data-m="log"]'); if (b) b.click(); } },
    { r:"lead", hash:HASH, modal:"keep", target:"#lx .lxp", dim:"strong", say:"This is Log Activity. On the left, you say what happened: the activity type, date, type of call, outcome and who you talked to. On the right is the playbook and the notes." },
    { r:"lead", hash:HASH, modal:"keep", target:"#seg", dim:"strong", say:"You can log a Call or a Meeting. We called Eduardo, so Call is selected. (Meetings are in the next demo.)" },
    { r:"lead", hash:HASH, modal:"keep", target:'[data-s="type"]', dim:"none", hint:"Choose Prospecting.", say:"Type: what kind of call was it? Each type has a short description to help you. This was your first call to get through to the decision maker and book a meeting. That is a Prospecting call.",
      until:function(){ return v('#lx [data-s="type"]') === "Prospecting"; }, wrongIf:function(){ var x = v('#lx [data-s="type"]'); return x && x !== "Prospecting" ? "Not this one. Read the descriptions: you are booking a meeting with the decision maker. Prospecting." : ""; }, auto:function(){ put('#lx [data-s="type"]', "Prospecting", "change"); } },
    { r:"lead", hash:HASH, modal:"keep", target:'[data-s="outcome"]', dim:"none", hint:"Choose Connected.", say:"Call Outcome: Eduardo picked up and you spoke, so the call was Connected. If nobody answered, you would choose No answer.",
      until:function(){ return v('#lx [data-s="outcome"]') === "Connected"; }, wrongIf:function(){ var x = v('#lx [data-s="outcome"]'); return x && x !== "Connected" ? "Not this one. You spoke with Eduardo: Connected." : ""; }, auto:function(){ put('#lx [data-s="outcome"]', "Connected", "change"); } },
    { r:"lead", hash:HASH, modal:"keep", target:'[data-s="contact"]', dim:"none", hint:"Choose Eduardo Cruz.", say:"Contact: who did you speak with? Eduardo. This is why we added him first: he shows up in this list.",
      until:function(){ return v('#lx [data-s="contact"]').indexOf("Eduardo") === 0; }, wrongIf:function(){ var x = v('#lx [data-s="contact"]'); return x && x.indexOf("Eduardo") !== 0 ? "Not this one. You spoke with Eduardo Cruz." : ""; }, auto:function(){ pickOpt('#lx [data-s="contact"]', "Eduardo"); } },
    { r:"lead", hash:HASH, modal:"keep", target:"#lq", dim:"strong", say:"Is Qualified: leave it on Yes unless the business can't be served (for example a microbusiness). If you choose No, you must say why. Eduardo's bakery supplier business can be served, so it stays Yes. Click Next." },
    { r:"lead", hash:HASH, modal:"keep", target:"#lx-r", allow:"#lx-r", dim:"none", hint:"Write a short note, for example: Eduardo is open to a credit line. Meeting Friday 10 AM at the bakery.",
      say:"Now the notes. A Prospecting call has no playbook, so we keep \"No playbook\" and just write notes: what was discussed and what was agreed. Write that Eduardo is open to a credit line and agreed to meet Friday 10 AM at the bakery.",
      until:function(){ return v('#lx-r textarea[data-k="notes"]').trim().length >= 15; }, auto:function(){ put('#lx-r textarea[data-k="notes"]', "Eduardo is open to a credit line. Agreed to meet face to face on Friday, 10 AM at the bakery."); } },
    { r:"lead", hash:HASH, modal:"keep", target:"#lx-ok", circle:true, dim:"none", hint:"Click Log Call.", say:"Everything is filled in. Click Log Call.",
      until:function(){ return logged; }, auto:function(){ var b = $("lx-ok"); if (b) b.click(); } },
    { r:"lead", hash:HASH, good:true, dim:"none", say:"Good job! The call is logged. A green message appears at the top right, and the call shows in the lead's Engagement tab." },
    { r:"lead", hash:HASH, target:'[data-tab="Engagement"]', click:true, circle:true, dim:"none", hint:"Click the Engagement tab.", say:"Let's see where your call went. Click the Engagement tab, below the lead's header." },
    { r:"lead", hash:HASH, target:"#feed", dim:"strong", say:"This is the Engagement tab. Every call, meeting and note you log on the lead is listed here, newest first. The call you just logged is at the top: the type, the outcome, who you spoke with and your notes. Your team lead can see it too." },
    { r:"lead", hash:HASH, end:true, dim:"light", say:"Let's recap. One: add the decision maker as a contact first, with the right role and relationship type. Two: + Log activity, then Log call/meeting. Three: pick the right call type (Prospecting when you are trying to get a meeting), the outcome and the contact. Four: a Prospecting call has no playbook, just notes about what was discussed and agreed. Next, try it yourself in the practice." }
  ];

  /* the Log / Add Contact windows open on the left, the trainer card sits at the right so it never covers the field being explained */
  var st = document.createElement("style"); st.textContent = "#lx{right:min(400px,31vw) !important;justify-content:safe center}#tour{width:min(430px,29.5vw) !important}#lx .lxp{flex:0 1 auto;min-width:200px;max-width:100%}#lx .lxp .lb{min-height:0}#lx .tour-hl{outline:4px solid #f5a623 !important;outline-offset:3px !important}#lx .tour-hl.circle{border-radius:999px !important}"; document.head.appendChild(st);
  /* while the trainer is explaining (no "Your turn" box), the window can't be typed in or clicked */
  setInterval(function(){ var e = $("lx"); if (!e) return; e.inert = getComputedStyle(e).display === "flex" && !document.querySelector("#tour .try"); }, 120);
  window.ACQUI_STEPS.forEach(function(s){ if (s.modal === "keep") { s.force = true; s.prefer = ["tr", "br"]; } });
})();
