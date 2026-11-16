/* Guided demo (Day 9): log a face-to-face Discovery meeting with the Outbound - Discovery Meeting Playbook. Loaded after app.js + lead-ext.js, before tour.js.
   Lead: Cruz Bakery Supplies (280117), Eduardo Cruz (owner) is already a contact. */
(function(){
  var ID = "280117", $ = function(id){ return document.getElementById(id); };
  var l0 = LEADS.filter(function(l){ return l.id === ID; })[0];
  if (!l0) { l0 = { id: ID, name: "Cruz Bakery Supplies", status: "Prospecting", risk: "-", channel: "KAM - Self Generated Leads", entry: "KAM - Self Generated Leads", touch: "KAM - Self Generated Leads", clo: 0, eng: "2026-11-12", owner: "me", contact: "Rosa Cruz", task: { pr: "High", due: "Due today" } }; LEADS.unshift(l0); }
  l0.status = "Prospecting";
  l0.contacts = [{ fn: "Rosa", ln: "Cruz", role: "Applicant", rel: "Primary Contact", phones: [], emails: [] }, { fn: "Eduardo", ln: "Cruz", role: "Owner", rel: "Decision Maker", phones: ["09171230088"], emails: ["eduardo.cruz@example.com"] }];
  var HASH = "#/lead/" + ID, logged = false;
  ACQUI.on("activity-logged", function(){ logged = true; });
  var v = function(css){ var e = document.querySelector(css); return e ? e.value : ""; };
  function pickOpt(css, prefix){ var e = document.querySelector(css); if (!e) return; var o = [].filter.call(e.options, function(x){ return x.text.indexOf(prefix) === 0; })[0]; if (o) { e.value = o.value; e.dispatchEvent(new Event("change", { bubbles: true })); } }
  function put(css, val, ev){ var e = document.querySelector(css); if (!e) return; e.value = val; e.dispatchEvent(new Event(ev || "input", { bubbles: true })); }
  function yn(k, val){ var b = document.querySelector('#lx-r .lx-yn[data-k="' + k + '"] button[data-v="' + val + '"]'); if (b) b.click(); }
  var pbv = function(k){ return v('#lx-r [data-k="' + k + '"]'); };
  var ynv = function(k){ var b = document.querySelector('#lx-r .lx-yn[data-k="' + k + '"] button.on'); return b ? b.dataset.v : ""; };
  var A = { heard: "Yes", opyrs: "3-5 years", prod: "Trading / Distribution", clients: "Businesses Local only", emp: "12", banks: "2", rev: "1-4M Php", sup: "<30 days", cus: ">30 days", fund: "Bank", pain: "Delayed customer payments", role: "Decision Maker - GM/President", proceed: "Yes", feature: "1. A credit line not term loan" };
  function fill(keys){ keys.forEach(function(k){ if (k === "heard") yn(k, A[k]); else put('#lx-r [data-k="' + k + '"]', A[k], /^(emp|banks)$/.test(k) ? "input" : "change"); }); }
  function got(keys){ return keys.every(function(k){ return (k === "heard" ? ynv(k) : pbv(k)).trim() !== ""; }); }
  var G1 = ["heard", "opyrs", "prod", "clients", "emp", "banks"], G2 = ["rev", "sup", "cus", "fund", "pain"], G3 = ["role", "proceed", "feature"];
  var lxOn = function(t){ var e = $("lx"); return !!e && getComputedStyle(e).display === "flex" && (!t || e.innerText.indexOf(t) >= 0); };
  var openLogStep = function(){ var b = document.querySelector("[data-logmenu]"); if (b) b.click(); };

  window.ACQUI_TOUR_META = { taskId: "d9-demo-log-meeting", nextHref: "acqui-practice-log-meeting.html", nextLabel: "Practice", backLabel: "Back to Day 9" };
  window.ACQUI_STEPS = [
    { r:"home", dim:"light", say:"Hi, I'm {T}! This demo is about the Discovery call or meeting. It's the crucial stage where you engage with a lead to understand their pain points and goals. You also gather essential information to determine if the prospect is qualified for First Circle's products. This is where building rapport will help you reach your objectives. It is the call or meeting where you pitch the product. You'll log it using the Outbound - Discovery Meeting Playbook, a list of questions you answer about the meeting so every meeting is recorded the same way. Click Next." },
    { r:"home", dim:"none", say:"Here's the situation. On Friday you met Eduardo Cruz, the owner of Cruz Bakery Supplies, face to face at his bakery. It was your first meeting to discover the business and its financing needs. It went well. Eduardo is already a contact on the lead. Click Next." },
    { r:"home", target:'#side .nv[data-r="leads"]', click:true, dim:"none", hint:"Click the star icon (Leads) in the menu.", say:"Open the lead from the Lead List." },
    { r:"leads", target:'[data-open="' + ID + '"]', click:true, circle:true, dim:"none", hint:"Click Open on Cruz Bakery Supplies.", say:"Click Open on Cruz Bakery Supplies." },
    { r:"lead", hash:HASH, target:"[data-logmenu]", circle:true, dim:"none", hint:"Click + Log activity.", say:"Meetings are logged in the same place as calls. Click + Log activity.", until:function(){ return !!document.querySelector(".lxmenu"); }, auto:function(){ setTimeout(openLogStep, 60); } },
    { r:"lead", hash:HASH, target:'.lxmenu [data-m="log"]', dim:"none", hint:"Click Log call/meeting.", say:"Choose Log call/meeting.", until:function(){ return lxOn("Log Activity"); }, auto:function(){ var b = document.querySelector('.lxmenu [data-m="log"]'); if (b) b.click(); } },
    { r:"lead", hash:HASH, modal:"keep", target:'#seg [data-kind="meeting"]', click:true, circle:true, dim:"none", hint:"Click Meeting.", say:"This time we had a meeting, not a call. Click Meeting at the top.", auto:function(){ var b = document.querySelector('#seg [data-kind="meeting"]'); if (b) b.click(); } },
    { r:"lead", hash:HASH, modal:"keep", target:'[data-s="fmt"]', dim:"strong", say:"Meeting Format: how did you meet? You met Eduardo in person, so Face-to-Face Meeting. It is already selected. If you met by video or by phone, you would change it. Click Next." },
    { r:"lead", hash:HASH, modal:"keep", target:'[data-s="purpose"]', dim:"none", hint:"Choose Discovery Meeting.", say:"Meeting Purpose: why did you meet? To discover the business and its financing needs: Discovery Meeting.",
      until:function(){ return v('#lx [data-s="purpose"]') === "Discovery Meeting"; }, wrongIf:function(){ var x = v('#lx [data-s="purpose"]'); return x && x !== "Discovery Meeting" ? "Not this one. The first meeting to discover the business: Discovery Meeting." : ""; }, auto:function(){ put('#lx [data-s="purpose"]', "Discovery Meeting", "change"); } },
    { r:"lead", hash:HASH, modal:"keep", target:"#lx-r", dim:"strong", say:"Look at the right side. Acqui Service suggested the Outbound - Discovery Meeting Playbook because of the meeting purpose, and selected it for you. Each purpose has its own playbook. If you pick a different playbook after typing answers, you lose what you typed. Click Next." },
    { r:"lead", hash:HASH, modal:"keep", target:'[data-s="outcome"]', dim:"none", hint:"Choose Connected.", say:"Call Outcome: you were speaking with Eduardo the whole time, so Connected.",
      until:function(){ return v('#lx [data-s="outcome"]') === "Connected"; }, auto:function(){ put('#lx [data-s="outcome"]', "Connected", "change"); } },
    { r:"lead", hash:HASH, modal:"keep", target:'[data-s="contact"]', dim:"none", hint:"Choose Eduardo Cruz.", say:"Contact: Eduardo Cruz.",
      until:function(){ return v('#lx [data-s="contact"]').indexOf("Eduardo") === 0; }, auto:function(){ pickOpt('#lx [data-s="contact"]', "Eduardo"); } },

    { r:"lead", hash:HASH, modal:"keep", target:"#lx-r", dim:"strong", say:"Now the playbook questions on the right. Scroll down in that panel. You answer them from what Eduardo told you in the meeting. Questions with a red star are required. We'll do them in three parts: about the business, about the money, and about the decision. Click Next." },
    { r:"lead", hash:HASH, modal:"keep", target:"#lx-r", allow:"#lx-r", dim:"none", hint:"Answer the first six questions.",
      say:"Part 1, about the business. Eduardo told you: yes, he has heard of First Circle before. The business has been operating 3 to 5 years. They sell and distribute bakery supplies (Trading / Distribution) to local businesses only. They have 12 regular employees and 2 business bank accounts. Answer the first six questions.",
      until:function(){ return got(G1) && pbv("opyrs") === A.opyrs && pbv("prod") === A.prod && ynv("heard") === "Yes"; }, auto:function(){ fill(G1); } },
    { r:"lead", hash:HASH, modal:"keep", target:"#lx-r", allow:"#lx-r", dim:"none", hint:"Answer the next five questions.",
      say:"Part 2, about the money. Annual gross revenue: around 1 to 4 million. He pays his suppliers in less than 30 days, but his customers pay in more than 30 days. His only funding partner is a bank. His main pain point: delayed customer payments. Answer the next five questions.",
      until:function(){ return got(G2) && pbv("rev") === A.rev && pbv("sup") === A.sup && pbv("cus") === A.cus; }, auto:function(){ fill(G2); } },
    { r:"lead", hash:HASH, modal:"keep", target:"#lx-r", allow:"#lx-r", dim:"none", hint:"Answer the last three questions.",
      say:"Part 3, the decision. The person you met: Eduardo, the owner, so Decision Maker - GM/President. Will he proceed to onboard and submit documents? Yes. The BCL feature he liked most: a credit line, not a term loan. (If he said No to proceeding, you would answer the \"main reason\" question instead.)",
      until:function(){ return got(G3) && pbv("role") === A.role && pbv("feature") === A.feature && pbv("proceed") === "Yes"; }, auto:function(){ fill(G3); } },
    { r:"lead", hash:HASH, modal:"keep", target:"#lx-ok", circle:true, dim:"none", hint:"Click Log Meeting.", say:"All the required answers are in. Click Log Meeting.",
      until:function(){ return logged; }, auto:function(){ var b = $("lx-ok"); if (b) b.click(); } },
    { r:"lead", hash:HASH, good:true, dim:"none", say:"Good job! The meeting is logged. A green message appears at the top right, and the meeting shows in the lead's Engagement tab." },
    { r:"lead", hash:HASH, target:'[data-tab="Engagement"]', click:true, circle:true, dim:"none", hint:"Click the Engagement tab.", say:"Let's see where your meeting went. Click the Engagement tab, below the lead's header." },
    { r:"lead", hash:HASH, target:"#feed", dim:"strong", say:"This is the Engagement tab. Every call, meeting and note you log on the lead is listed here, newest first. The meeting you just logged is at the top: the type, the outcome, who you spoke with and your notes. Your team lead can see it too." },
    { r:"lead", hash:HASH, end:true, dim:"light", say:"Let's recap. One: + Log activity, then Log call/meeting, then choose Meeting. Two: the format (in person, video or phone) and the purpose. The purpose suggests the playbook. Three: the outcome and the contact. Four: answer the playbook questions from what the client told you. Don't switch playbooks after typing, you lose your answers. Next, try it yourself in the practice." }
  ];

  /* the Log / Add Contact windows open on the left, the trainer card sits at the right so it never covers the field being explained */
  var st = document.createElement("style"); st.textContent = "#lx{right:min(400px,31vw) !important;justify-content:safe center}#tour{width:min(430px,29.5vw) !important}#lx .lxp{flex:0 1 auto;min-width:200px;max-width:100%}#lx .lxp .lb{min-height:0}#lx .tour-hl{outline:4px solid #f5a623 !important;outline-offset:3px !important}#lx .tour-hl.circle{border-radius:999px !important}"; document.head.appendChild(st);
  /* while the trainer is explaining (no "Your turn" box), the window can't be typed in or clicked */
  setInterval(function(){ var e = $("lx"); if (!e) return; e.inert = getComputedStyle(e).display === "flex" && !document.querySelector("#tour .try"); }, 120);
  window.ACQUI_STEPS.forEach(function(s){ if (s.modal === "keep") { s.force = true; s.prefer = ["tr", "br"]; } });
})();
