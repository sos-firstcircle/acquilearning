/* Acqui Service sim extension for the Day 9 exams (loaded after app.js; Day 5 pages do not load it, so they are unchanged).
   Adds on the lead page: the Risk tab (CLO / BCL / Documents / Underwriting), the Engagement tab (activity feed), "+ Log activity" (Log Call / Log Meeting
   with playbooks), Add Note, Add Contact, Update Response (underwriting clarification) and the green "logged successfully" banner.
   Events for the exams (ACQUI.on): "activity-logged", "contact-added", "note-added", "uw-response". The Risk tab can be read from S.ltab after "render".
   Everything here is fake data. Screens copied from the real Acqui Service (AM view). */
(function(){
  function byId(id){ return LEADS.filter(function(l){ return l.id === id; })[0]; }
  function nm(s){ return String(s || "").toLowerCase().replace(/[^a-z0-9]/g, ""); }
  function stamp(){ var d = new Date(); return MONTHS[d.getMonth()].slice(0, 3) + " " + d.getDate() + ", " + d.getFullYear() + ", " + d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }); }
  function dtNow(){ var d = new Date(); return (d.getMonth() + 1) + "/" + d.getDate() + "/" + d.getFullYear() + " " + d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }); }

  /* ---------- styles ---------- */
  var css = document.createElement("style");
  css.textContent =
    "#lx{position:fixed;inset:0;background:rgba(10,30,30,.55);display:none;align-items:center;justify-content:center;gap:12px;z-index:900;padding:14px}body.has-xp #lx{right:340px}" +
    ".lxp{background:#fff;border-radius:12px;box-shadow:0 12px 40px rgba(0,0,0,.35);max-height:92vh;display:flex;flex-direction:column;overflow:hidden;font-size:12px;color:#17323a}" +
    ".lxp .lh2{padding:16px 18px 8px;display:flex;justify-content:space-between;align-items:flex-start}.lxp .lh2 h3{margin:0;font-size:16px}.lxp .lh2 small{display:block;font-size:9px;letter-spacing:.5px;color:#6a8087;font-weight:700;margin-bottom:2px}" +
    ".lxp .lb{padding:4px 18px 8px;overflow:auto;flex:1}.lxp .lf{padding:10px 18px 14px;display:flex;justify-content:flex-end;gap:8px;border-top:1px solid #eef2f2}" +
    ".lxp .lf .btn{font-size:12px;padding:8px 16px}.lx-x{cursor:pointer;font-size:18px;border:0;background:none;color:#6a8087}" +
    ".lx-l{display:block;font-size:11.5px;font-weight:600;margin:12px 0 5px}.lx-l i{color:#b3243a;font-style:normal}" +
    ".lxp select,.lxp input[type=text],.lxp textarea{width:100%;border:1px solid #d5dfe0;border-radius:8px;padding:9px 11px;font:inherit;font-size:12px;background:#fff;outline:none}.lxp textarea{min-height:70px;resize:vertical}" +
    ".lxp select:focus,.lxp input:focus,.lxp textarea:focus{border-color:var(--teal)}" +
    ".lx-seg,.lx-yn{display:flex;border:1px solid #d5dfe0;border-radius:8px;overflow:hidden}.lx-seg button,.lx-yn button{flex:1;border:0;background:#f6f9f9;padding:9px;font:inherit;font-size:12px;font-weight:600;cursor:pointer}.lx-seg button.on,.lx-yn button.on{background:#0d2b30;color:#fff}" +
    ".lx-tb{border:1px solid #d5dfe0;border-bottom:0;border-radius:8px 8px 0 0;padding:5px 9px;font-size:11px;color:#6a8087;display:flex;gap:12px;background:#fbfdfd}.lx-tb span{margin-left:auto}.lx-tb span+span{margin-left:6px}" +
    ".lx-tb+textarea{border-radius:0 0 8px 8px}" +
    ".lx-warn{background:#fff8e6;border:1px solid #f0dca8;border-radius:8px;padding:10px;margin-top:10px;font-size:11.5px;color:#7a4a00}.lx-warn .btn{margin:8px 6px 0 0}.lx-warn .btn.red{background:#a01a4a;color:#fff;border-color:#a01a4a}" +
    ".lx-sug{background:#e9f6f3;border-radius:8px;padding:8px 10px;margin:8px 0;font-size:11px}.lx-sug b{display:block;font-size:12px}" +
    ".lx-dq label{display:flex;gap:8px;align-items:center;font-size:11.5px;padding:3px 0}.lx-dq input{width:auto!important}" +
    "#lxb{position:fixed;top:56px;right:16px;z-index:1250;background:#e7f6ea;border:1px solid #9bd3a8;color:#14532d;border-radius:10px;padding:10px 14px;font-size:12.5px;font-weight:600;box-shadow:0 8px 24px rgba(0,0,0,.2);display:none;align-items:center;gap:12px;max-width:340px}body.has-xp #lxb{right:356px}#lxb button{border:0;background:none;cursor:pointer;font-size:16px;color:#14532d}" +
    ".lxmenu{position:fixed;z-index:880;background:#fff;border-radius:10px;box-shadow:0 8px 28px rgba(0,0,0,.25);padding:6px 0;min-width:170px}.lxmenu div{padding:9px 16px;font-size:12px;cursor:pointer}.lxmenu div:hover{background:#f1f8f6}" +
    ".rk-h{background:#0f4a3c;color:#fff;padding:9px 14px;font-size:11px;font-weight:800;letter-spacing:.5px;border-radius:10px 10px 0 0;display:flex;gap:10px;align-items:center}.rk-h a{font-weight:500;font-size:10px;background:rgba(255,255,255,.15);padding:2px 8px;border-radius:10px}" +
    ".rk-c{background:#fff;border:1px solid #e3ecec;border-top:0;border-radius:0 0 10px 10px;padding:6px 14px 12px;margin-bottom:12px}.rk-c table{width:100%;border-collapse:collapse}.rk-c th{font-size:10px;color:#6a8087;text-align:left;padding:8px 6px;font-weight:600}.rk-c td{padding:9px 6px;font-size:11.5px;border-top:1px solid #f0f4f4;vertical-align:top}" +
    ".rk-kv{display:flex;justify-content:space-between;gap:8px;padding:7px 0;border-bottom:1px solid #f0f4f4;font-size:11.5px}.rk-kv small{display:block;font-size:9.5px;color:#6a8087}.rk-kv b{font-weight:600}.rk-kv .btn{font-size:10px;padding:2px 8px}" +
    ".rp{display:inline-block;font-size:10px;font-weight:700;padding:2px 9px;border-radius:999px;background:#eef2f2;color:#456}.rp.g{background:#e3f6e8;color:#1c7a40}.rp.r{background:#fde8ea;color:#b3243a}.rp.b{background:#e4ecff;color:#2742c9}" +
    "tr.rk-bad td{border-left:0}tr.rk-bad td:first-child{box-shadow:inset 3px 0 #d9435a}" +
    ".fd{display:flex;gap:10px;align-items:flex-start;background:#fff;border:1px solid #e3ecec;border-radius:10px;padding:10px 12px;margin-bottom:8px;font-size:11.5px}.fd .ik{width:24px;height:24px;border-radius:50%;background:#eef2f2;display:grid;place-items:center;font-size:11px;flex:none}.fd .tg{font-size:9px;font-weight:800;background:#eef2f2;padding:1px 6px;border-radius:4px;margin-right:6px}.fd .at{margin-left:auto;font-size:10px;color:#6a8087;white-space:nowrap}.fd small{display:block;color:#6a8087;margin-top:2px}" +
    ".fchips{display:flex;gap:14px;margin:6px 0 10px;font-size:11.5px}.fchips span{cursor:pointer;padding:5px 0;color:#456}.fchips span.on{border-bottom:2px solid var(--teal);font-weight:700;color:#17323a}";
  document.head.appendChild(css);
  var lx = document.createElement("div"); lx.id = "lx"; document.body.appendChild(lx);
  var bn = document.createElement("div"); bn.id = "lxb"; document.body.appendChild(bn);

  function banner(msg){ bn.innerHTML = '<span>✓ ' + esc(msg) + '</span><button type="button" aria-label="Close">×</button>'; bn.style.display = "flex"; bn.querySelector("button").onclick = function(){ bn.style.display = "none"; }; clearTimeout(banner.h); banner.h = setTimeout(function(){ bn.style.display = "none"; }, 7000); }
  function closeLx(){ lx.style.display = "none"; lx.innerHTML = ""; }
  function contactsOf(l){
    if (l.contacts) return l.contacts;
    var p = String(l.contact || "").split(" ");
    l.contacts = [{ fn: p[0] || "", ln: p.slice(1).join(" "), role: "Applicant", rel: "Primary Contact", phones: [], emails: [] }];
    return l.contacts;
  }
  function cname(c){ return (c.fn + " " + c.ln).trim(); }

  /* ---------- playbooks ---------- */
  var Y = function(k, l, req){ return { k: k, t: "yn", l: l, req: req }; };
  var SEL = function(k, l, o, req){ return { k: k, t: "sel", l: l, o: o, req: req }; };
  var NUM = function(k, l, req){ return { k: k, t: "num", l: l, req: req }; };
  var TXT = function(k, l, req){ return { k: k, t: "rt", l: l, req: req }; };
  var REV = ["<1M Php", "1-4M Php", ">5M to 20M", ">20M to 50M", ">50M Php"];
  var TERMS = ["No payment terms", "<30 days", ">30 days"];
  var PB = {
    "No playbook": [],
    "Inbound Discovery Call": [TXT("spoke", "Spoke with (include designation)"), SEL("region", "Which region do you operate in?", ["NCR (National Capital Region)", "Luzon (outside NCR)", "Visayas", "Mindanao"]), TXT("years", "Years in Operation"), TXT("nature", "Nature of Business / Buyers"), SEL("rev", "What is your latest annual revenue?", REV), SEL("funds", "What will the funds be used for?", ["OPEX (Rent, Utilities, Logistics, etc.)", "Inventory / Supplies", "Equipment", "Expansion"]), SEL("driver", "What's driving the need right now?", ["Delayed collections", "Seasonal demand", "New project", "Other"]), SEL("partner", "Do they currently have a financial partner?", ["None", "Bank", "Lending company", "Friends/Family/Network"]), TXT("thoughts", "What are their thoughts on our services? Did they raise any objections?"), TXT("other", "Other Notes"), TXT("next", "Next Steps")],
    "Outbound - Ambush Visit Playbook": [Y("conn", "Where you able to connect to the business?", 1), Y("dm", "Where you able to get a contact for the decision maker or influencer?", 1), TXT("note", "Any additional to note for the activity?")],
    "Outbound - Discovery Meeting Playbook": [Y("heard", "Have you heard of First Circle before?", 1), SEL("opyrs", "How long has the business been operating?", ["<1 year", "1-3 years", "3-5 years", "5+ years"], 1), SEL("prod", "Can you tell me more about your products or services? (to determine industry & segment)", ["Services (B2B)", "Trading / Distribution", "Manufacturing", "Retail (B2C)", "Others"], 1), SEL("clients", "What type of clients do you usually serve?", ["Businesses Local & Government", "Businesses Local only", "Consumers (B2C)", "Export"], 1), NUM("emp", "How many regular employees do you have? (input number)", 1), NUM("banks", "How many business bank account do you use?", 1), SEL("rev", "What is your estimated annual gross revenue, estimate ending this year?", REV, 1), SEL("sup", "What usually is your payment terms with your suppliers?", TERMS, 1), SEL("cus", "What are your usual payment terms you give to your customers?", TERMS, 1), SEL("fund", "Do you have existing business funding partners?", ["None", "Bank", "Lending company", "Friends/Family/Network"], 1), SEL("pain", "What is the identified main business pain point with regards to business funding?", ["Not able to serve bigger projects", "Delayed customer payments", "Cannot buy inventory in bulk", "Slow bank approvals"], 1), SEL("role", "What is the highest role of the person you had the discovery meeting?", ["Decision Maker - GM/President", "Influencer - Finance Manager", "Gatekeeper"], 1), SEL("proceed", "Will they proceed to onboard and submit documents?", ["Yes", "No"], 1), SEL("feature", "If the customer will proceed to onboard, what is the most attractive feature of the BCL they like?", ["1. A credit line not term loan", "2. Interest Rate Pricing", "3. No Collateral", "4. Possible max size of the limit", "5. Flexibility i.e. early repayment", "6. Speed of application and draw down", "7. Self-service \"Connect\"", "Will not onboard", "Will need higher approval before onboard"], 1), SEL("why", "If they will not proceed to onboard, what is the main reason?", ["Not interested in a credit line", "Rates too high", "Needs approval from owner", "Not ready with documents", "Others"])],
    "Outbound - Drawdown Assist Meeting": [Y("dd", "Did the draw down proceed?", 1), SEL("ddwhy", "If draw down did not proceed, why?", ["Customer not ready", "Technical issue in Connect", "Missing documents", "Others"])],
    "Outbound - Follow Up Document Playbook": [Y("docs", "Where you able to get additional documents?", 1), TXT("note", "Any additional to note for the activity?")],
    "Transition Call": [TXT("poc", "Who is your main POC? Please include contact number, any nicknames, and their preferred mode of communication", 1), TXT("alt", "Who are your alternative contact persons? Please include contact numbers, their preferred mode of communication, and main areas of concern e.g., Juan 09171234567 (Viber calls only) - all concerns regarding cheque pick-up", 1), TXT("insight", "Share any unique behaviors or important insights about the lead that would be helpful to the new RM", 1), Y("paydown", "Were you able to discuss principal paydown? Script: I just want to remind you of our Principal Paydown Policy. In order for you to request again a loan from your Credit Limit, we need to repay atleast 50% or more of your outstanding balance. If you have further clarifications, [RM Name] will be able to support you.", 1)]
  };
  var PB_LIST = ["No playbook", "Inbound Discovery Call", "Outbound - Ambush Visit Playbook", "Outbound - Discovery Meeting Playbook", "Outbound - Drawdown Assist Meeting", "Outbound - Follow Up Document Playbook", "Transition Call"];
  var CALL_TYPES = [["BA Decision", "Relaying the BA decision, whether approved or rejected."], ["BCL Decision", "Presenting the approved or rejected BCL application, typically via the Offer Presentation."], ["Renewal", "Calls related to expired open RCLs."], ["BVP", "Risk clarifications, document resubmissions, or contestations (e.g. credit check, c..."], ["BA Related", "Calls related to BA concerns."], ["Check-in", "Any call to influence the client to utilise our products."], ["Discovery", "A call to learn about the business and its financing needs."], ["FSA Decision", "Relaying the FSA decision, whether approved or rejected."], ["FSA Related", "Calls related to FSA concerns."], ["Nurturing", "Any call related to getting the lead to complete BVP submission."], ["Prospecting", "Speaking to a gatekeeper to book a meeting with, or get through to, a decision maker."], ["Referral Related", "Anything to do with asking about or discussing a referral."], ["Transition", "Handing the account over to the RM / Customer Success after the drawdown window."]];
  var OUTCOMES = ["Connected", "Contacted - SMS/Viber/etc", "No Reply - SMS/Viber/etc", "No answer", "Replied - SMS/Viber/etc"];
  var FORMATS = ["Face-to-Face Meeting", "Video Conference", "Phone Meeting"];
  var PURPOSES = ["Discovery Meeting", "Ambush Meeting", "Follow up Document", "Assist in Drawdown", "Referral Generation/Others"];
  var SUGGEST = { "Discovery Meeting": "Outbound - Discovery Meeting Playbook", "Ambush Meeting": "Outbound - Ambush Visit Playbook", "Follow up Document": "Outbound - Follow Up Document Playbook", "Assist in Drawdown": "Outbound - Drawdown Assist Meeting" };
  var DQ = ["B2B Microbusiness", "B2C Microbusiness", "<1 Year B2C", "Industry Restriction", "Missing Documents/Unregistered", "Managed Account", "Employee Looking for Personal Loan"];

  function fld(f, v){
    var h = '<label class="lx-l">' + esc(f.l) + (f.req ? ' <i>*</i>' : '') + '</label>';
    if (f.t === "yn") return h + '<div class="lx-yn" data-k="' + f.k + '"><button type="button" data-v="Yes" class="' + (v === "Yes" ? "on" : "") + '">Yes</button><button type="button" data-v="No" class="' + (v === "No" ? "on" : "") + '">No</button></div>';
    if (f.t === "sel") return h + '<select data-k="' + f.k + '"><option value="">Select an option</option>' + f.o.map(function(o){ return '<option' + (o === v ? " selected" : "") + '>' + esc(o) + '</option>'; }).join("") + '</select>';
    if (f.t === "num") return h + '<input type="text" inputmode="numeric" data-k="' + f.k + '" value="' + esc(v || "") + '">';
    return h + '<div class="lx-tb"><b>B</b><i>I</i><span>•</span><span>1.</span><span style="margin-left:auto">Write</span><span>Preview</span></div><textarea data-k="' + f.k + '">' + esc(v || "") + '</textarea>';
  }
  function bindVals(root, get){   /* get() returns the current answers object (it is replaced when a playbook is switched) */
    root.addEventListener("input", function(e){ var k = e.target.dataset && e.target.dataset.k; if (k) get()[k] = e.target.value; });
    root.addEventListener("change", function(e){ var k = e.target.dataset && e.target.dataset.k; if (k) get()[k] = e.target.value; });
    root.addEventListener("click", function(e){ var b = e.target.closest(".lx-yn button"); if (!b) return; var g = b.parentNode; get()[g.dataset.k] = b.dataset.v; g.querySelectorAll("button").forEach(function(x){ x.classList.toggle("on", x === b); }); });
  }

  /* ---------- Log Activity ---------- */
  function openLog(l){
    var st = { kind: "call", date: dtNow(), type: "", outcome: "", contact: "", q: "Yes", dq: [], cash: "", fmt: "Face-to-Face Meeting", purpose: "", pb: "No playbook", sug: "", vals: {}, notes: "", warn: "" };
    var cs = contactsOf(l);
    lx.innerHTML = '<div class="lxp" style="width:430px"><div class="lh2"><h3>Log Activity</h3><button class="lx-x" id="lx-x">×</button></div><div class="lb" id="lx-l"></div><div class="lf" id="lx-f"></div></div><div class="lxp" id="lx-r" style="width:320px;align-self:stretch;max-height:92vh"></div>';
    lx.style.display = "flex";
    var Lb = lx.querySelector("#lx-l"), Lf = lx.querySelector("#lx-f"), R = lx.querySelector("#lx-r");
    function left(){
      var s = '<label class="lx-l" style="margin-top:4px">Activity Type</label><div class="lx-seg" id="seg"><button type="button" data-kind="call" class="' + (st.kind === "call" ? "on" : "") + '">Call</button><button type="button" data-kind="meeting" class="' + (st.kind === "meeting" ? "on" : "") + '">Meeting</button></div>' +
        '<label class="lx-l">Date &amp; Time <i>*</i></label><input type="text" data-s="date" value="' + esc(st.date) + '">';
      if (st.kind === "call") s += '<label class="lx-l">Type <i>*</i></label><select data-s="type"><option value="">Select type</option>' + CALL_TYPES.map(function(t){ return '<option value="' + t[0] + '"' + (st.type === t[0] ? " selected" : "") + '>' + t[0] + ' (' + esc(t[1]) + ')</option>'; }).join("") + '</select>';
      else s += '<label class="lx-l">Meeting Format <i>*</i></label><select data-s="fmt">' + FORMATS.map(function(o){ return '<option' + (st.fmt === o ? " selected" : "") + '>' + o + '</option>'; }).join("") + '</select>' +
        '<label class="lx-l">Meeting Purpose <i>*</i></label><select data-s="purpose"><option value="">Select purpose</option>' + PURPOSES.map(function(o){ return '<option' + (st.purpose === o ? " selected" : "") + '>' + o + '</option>'; }).join("") + '</select>';
      s += '<label class="lx-l">Call Outcome <i>*</i></label><select data-s="outcome"><option value="">Select outcome</option>' + OUTCOMES.map(function(o){ return '<option' + (st.outcome === o ? " selected" : "") + '>' + o + '</option>'; }).join("") + '</select>' +
        '<label class="lx-l">Contact <i>*</i></label><select data-s="contact"><option value="">Select contact</option>' + cs.map(function(c){ return '<option' + (st.contact === cname(c) ? " selected" : "") + '>' + esc(cname(c)) + ' · FINANCE_TEAM</option>'; }).join("") + '</select>' +
        '<label class="lx-l">Is Qualified</label><div class="lx-yn" id="lq"><button type="button" data-v="Yes" class="' + (st.q === "Yes" ? "on" : "") + '">Yes</button><button type="button" data-v="No" class="' + (st.q === "No" ? "on" : "") + '">No</button></div>';
      if (st.q === "No") s += '<label class="lx-l">SQL Disqualification Reasons</label><div class="lx-dq">' + DQ.map(function(d){ return '<label><input type="checkbox" data-dq="' + esc(d) + '"' + (st.dq.indexOf(d) >= 0 ? " checked" : "") + '> ' + esc(d) + '</label>'; }).join("") + '</div>';
      s += '<label class="lx-l">What date in the next 12 months is the business most likely to be short of cash?</label><input type="text" data-s="cash" placeholder="Select date (optional)" value="' + esc(st.cash) + '">';
      Lb.innerHTML = s;
      Lf.innerHTML = '<button class="btn" id="lx-c">Cancel</button><button class="btn dark" id="lx-ok">' + (st.kind === "call" ? "Log Call" : "Log Meeting") + '</button>';
      Lf.querySelector("#lx-c").onclick = closeLx; Lf.querySelector("#lx-ok").onclick = submit;
    }
    function right(){
      var fields = PB[st.pb], any = Object.keys(st.vals).some(function(k){ return String(st.vals[k] || "").trim(); });
      var h = '<div class="lh2"><div><small>' + (st.pb === "No playbook" ? "PLAYBOOK" : "USING PLAYBOOK") + '</small><h3>' + esc(st.pb === "No playbook" ? "No playbook" : st.pb) + '</h3></div></div><div class="lb">';
      if (st.sug && st.kind === "meeting") h += '<div class="lx-sug"><b>Suggested: ' + esc(st.sug) + '</b>' + esc(st.fmt + " · " + st.purpose) + '</div>';
      h += '<label class="lx-l" style="margin-top:4px">Playbook</label><select id="pbsel">' + PB_LIST.map(function(p){ return '<option' + (p === st.pb ? " selected" : "") + '>' + esc(p) + '</option>'; }).join("") + '</select>';
      if (st.warn) h += '<div class="lx-warn">Switching playbooks discards what you have typed so far.<br><button class="btn" id="pw-keep">Keep answers</button><button class="btn red" id="pw-go">Discard and switch</button></div>';
      if (st.pb === "No playbook") h += '<label class="lx-l">Notes</label><div class="lx-tb"><b>B</b><i>I</i><span>•</span><span>1.</span><span style="margin-left:auto">Write</span><span>Preview</span></div><textarea data-k="notes" placeholder="Add any notes...">' + esc(st.vals.notes || "") + '</textarea>';
      else h += fields.map(function(f){ return fld(f, st.vals[f.k]); }).join("");
      R.innerHTML = h + '</div>';
      var sel = R.querySelector("#pbsel");
      sel.onchange = function(){
        if (any && !st.warn) { st.warn = sel.value; right(); R.querySelector("#pbsel").value = st.pb; return; }
        st.pb = sel.value; st.warn = ""; st.sug = SUGGEST[st.purpose] === st.pb ? st.pb : ""; if (any) st.vals = {}; right();
      };
      var pk = R.querySelector("#pw-keep"), pg = R.querySelector("#pw-go");
      if (pk) pk.onclick = function(){ st.warn = ""; right(); };
      if (pg) pg.onclick = function(){ st.pb = st.warn; st.warn = ""; st.vals = {}; right(); };
    }
    bindVals(R, function(){ return st.vals; });
    Lb.addEventListener("input", function(e){ var k = e.target.dataset && e.target.dataset.s; if (k === "date" || k === "cash") st[k] = e.target.value; });
    Lb.addEventListener("change", function(e){
      var t = e.target, k = t.dataset && t.dataset.s;
      if (t.dataset && t.dataset.dq) { var i = st.dq.indexOf(t.dataset.dq); if (t.checked && i < 0) st.dq.push(t.dataset.dq); if (!t.checked && i >= 0) st.dq.splice(i, 1); return; }
      if (!k || k === "date" || k === "cash") return;
      st[k] = k === "contact" ? t.value.replace(/ · .*$/, "") : t.value;
      if (k === "purpose") { var sg = SUGGEST[st.purpose]; if (sg && Object.keys(st.vals).every(function(x){ return !String(st.vals[x] || "").trim(); })) { st.pb = sg; st.sug = sg; st.vals = {}; right(); } else if (sg) st.sug = sg; }
    });
    Lb.addEventListener("click", function(e){
      var b = e.target.closest("#seg button"), y = e.target.closest("#lq button");
      if (b && b.dataset.kind !== st.kind) { st.kind = b.dataset.kind; st.outcome = ""; st.pb = "No playbook"; st.sug = ""; st.vals = {}; st.warn = ""; left(); right(); }
      if (y) { st.q = y.dataset.v; left(); }
    });
    lx.querySelector("#lx-x").onclick = closeLx;
    function submit(){
      var need = [];
      if (st.kind === "call" && !st.type) need.push("Type");
      if (st.kind === "meeting" && !st.purpose) need.push("Meeting Purpose");
      if (!st.outcome) need.push("Call Outcome");
      if (!st.contact) need.push("Contact");
      PB[st.pb].forEach(function(f){ if (f.req && !String(st.vals[f.k] || "").trim()) need.push(f.l.length > 40 ? f.l.slice(0, 38) + "..." : f.l); });
      if (need.length) { toast("Please fill in: " + need.join(", ")); return; }
      var d = { id: l.id, kind: st.kind, type: st.kind === "call" ? st.type : "Meeting", outcome: st.outcome, contact: st.contact, qualified: st.q, playbook: st.pb, vals: JSON.parse(JSON.stringify(st.vals)), notes: st.vals.notes || "", fmt: st.kind === "meeting" ? st.fmt : "", purpose: st.purpose, dq: st.dq.slice() };
      l.feed = l.feed || defaultFeed(l);
      l.feed.unshift({ k: st.kind, t: (st.kind === "call" ? st.type : "Meeting · " + st.purpose) + " - " + st.outcome, s: st.contact + (d.notes ? ": " + d.notes : st.pb !== "No playbook" ? ": " + st.pb : ""), at: stamp() });
      l.eng = new Date().toISOString().slice(0, 10);
      closeLx(); banner((st.kind === "call" ? "Call" : "Meeting") + " logged successfully."); ACQUI.emit("activity-logged", d); render();
    }
    left(); right();
  }

  /* ---------- Add Note ---------- */
  function openNote(l){
    lx.innerHTML = '<div class="lxp" style="width:420px"><div class="lh2"><h3>Add Note</h3><button class="lx-x" id="lx-x">×</button></div><div class="lb"><label class="lx-l">Note <i>*</i></label><div class="lx-tb"><b>B</b><i>I</i><span>•</span><span>1.</span><span style="margin-left:auto">Write</span><span>Preview</span></div><textarea id="nt"></textarea></div><div class="lf"><button class="btn" id="lx-c">Cancel</button><button class="btn dark" id="lx-ok">Add Note</button></div></div>';
    lx.style.display = "flex"; lx.querySelector("#lx-x").onclick = lx.querySelector("#lx-c").onclick = closeLx;
    lx.querySelector("#lx-ok").onclick = function(){ var v = lx.querySelector("#nt").value.trim(); if (!v) { toast("Please write a note first"); return; } l.feed = l.feed || defaultFeed(l); l.feed.unshift({ k: "note", t: v, s: "Added by " + ME, at: stamp() }); closeLx(); banner("Note added successfully."); ACQUI.emit("note-added", { id: l.id, text: v }); render(); };
  }

  /* ---------- Add Contact ---------- */
  function openContact(l){
    var ROLES = ["", "Applicant", "Shareholder", "Director", "Authorized Signatory", "Finance Head", "Others"], RELS = ["", "Gatekeeper", "Stakeholder", "Decision Maker", "Primary Contact"];
    lx.innerHTML = '<div class="lxp" style="width:420px"><div class="lh2"><h3>Add Contact</h3><button class="lx-x" id="lx-x">×</button></div><div class="lb">' +
      '<label class="lx-l" style="margin-top:0"><b>Contact Details</b></label><label class="lx-l">First Name <i>*</i></label><input type="text" id="cf">' +
      '<label class="lx-l">Last Name <i>*</i></label><input type="text" id="cl">' +
      '<label class="lx-l">Phone Numbers</label><div id="ph"><input type="text" class="ph" placeholder="09XXXXXXXXX"></div><a class="link" id="aph" style="font-size:11px;cursor:pointer;display:block;margin-top:5px">+ Add phone</a>' +
      '<label class="lx-l">Email Addresses</label><div id="em"><input type="text" class="em" placeholder="email@example.com"></div><a class="link" id="aem" style="font-size:11px;cursor:pointer;display:block;margin-top:5px">+ Add email</a>' +
      '<label class="lx-l"><b>Role at This Company</b></label><label class="lx-l">Role</label><select id="cr">' + ROLES.map(function(o){ return '<option>' + (o || "—") + '</option>'; }).join("") + '</select>' +
      '<label class="lx-l">Relationship Type</label><select id="cy">' + RELS.map(function(o){ return '<option>' + (o || "—") + '</option>'; }).join("") + '</select>' +
      '<label class="lx-l">Left Company At</label><input type="text" id="cd" placeholder="mm/dd/yyyy"></div><div class="lf"><button class="btn" id="lx-c">Cancel</button><button class="btn dark" id="lx-ok">Add Contact</button></div></div>';
    lx.style.display = "flex"; lx.querySelector("#lx-x").onclick = lx.querySelector("#lx-c").onclick = closeLx;
    var add = function(box, cls, ph){ var i = document.createElement("input"); i.type = "text"; i.className = cls; i.placeholder = ph; i.style.marginTop = "6px"; lx.querySelector(box).appendChild(i); };
    lx.querySelector("#aph").onclick = function(){ add("#ph", "ph", "09XXXXXXXXX"); }; lx.querySelector("#aem").onclick = function(){ add("#em", "em", "email@example.com"); };
    lx.querySelectorAll(".ph").forEach(function(i){ i.addEventListener("input", function(){ var d = this.value.replace(/[^\d+]/g, ""); if (d !== this.value) this.value = d; }); });
    lx.querySelector("#lx-ok").onclick = function(){
      var v = function(s){ return lx.querySelector(s).value.trim(); }, need = [];
      if (!v("#cf")) need.push("First Name"); if (!v("#cl")) need.push("Last Name");
      if (need.length) { toast("Please fill in: " + need.join(", ")); return; }
      var vals = function(c){ return [].map.call(lx.querySelectorAll("." + c), function(i){ return i.value.trim(); }).filter(Boolean); };
      var c = { fn: v("#cf"), ln: v("#cl"), phones: vals("ph"), emails: vals("em"), role: v("#cr") === "—" ? "" : v("#cr"), rel: v("#cy") === "—" ? "" : v("#cy"), left: v("#cd") };
      contactsOf(l).push(c); closeLx(); banner("Contact added successfully."); ACQUI.emit("contact-added", { id: l.id, c: c }); render();
    };
  }

  /* ---------- Update Response (underwriting clarification) ---------- */
  function openResponse(l, row){
    var txt = row.resp || "";
    function step1(){
      lx.innerHTML = '<div class="lxp" style="width:430px"><div class="lh2"><div><small>CLARIFICATION · STEP 1 OF 2</small><h3>' + esc(row.stage) + '</h3><div style="font-size:11px;color:#6a8087;margin-top:4px">Write a clear message for the risk ops team. You can review it before it syncs to BVP.</div></div><button class="lx-x" id="lx-x">×</button></div><div class="lb"><div style="background:#f6f9f9;border-radius:8px;padding:10px 12px"><div style="font-size:9px;font-weight:800;color:#6a8087;letter-spacing:.5px;margin-bottom:5px">RISK NOTES</div>' + esc(row.notes) + '</div><label class="lx-l">Your response</label><textarea id="rt" style="min-height:120px">' + esc(txt) + '</textarea></div><div class="lf"><button class="btn" id="lx-c">Cancel</button><button class="btn dark" id="lx-ok">Review →</button></div></div>';
      lx.style.display = "flex"; lx.querySelector("#lx-x").onclick = lx.querySelector("#lx-c").onclick = closeLx;
      lx.querySelector("#lx-ok").onclick = function(){ txt = lx.querySelector("#rt").value.trim(); if (!txt) { toast("Please write your response first"); return; } step2(); };
    }
    function step2(){
      lx.innerHTML = '<div class="lxp" style="width:430px"><div class="lh2"><div><small>CLARIFICATION · STEP 2 OF 2</small><h3>Review your response</h3></div><button class="lx-x" id="lx-x">×</button></div><div class="lb"><div style="background:#f6f9f9;border-radius:8px;padding:10px 12px;white-space:pre-wrap">' + esc(txt) + '</div></div><div class="lf"><button class="btn" id="lx-b">Back</button><button class="btn dark" id="lx-ok">Send to BVP</button></div></div>';
      lx.querySelector("#lx-x").onclick = closeLx; lx.querySelector("#lx-b").onclick = step1;
      lx.querySelector("#lx-ok").onclick = function(){ row.resp = txt; closeLx(); banner("Response sent to Risk successfully."); ACQUI.emit("uw-response", { id: l.id, stage: row.stage, text: txt }); render(); };
    }
    step1();
  }

  /* ---------- Engagement tab ---------- */
  function defaultFeed(l){ return [{ k: "assign", t: "Assigned to " + (l.owner === "me" ? ME : l.owner), s: "", at: "Nov 9, 2026" }]; }
  var IK = { call: "📞", meeting: "👥", note: "📝", task: "☑", email: "✉", assign: "⟳" }, TG = { call: "CALL", meeting: "MEETING", note: "NOTE", task: "TASK", email: "EMAIL", assign: "ASSIGNMENT" };
  function feedHtml(l, f){
    var fd = (l.feed || defaultFeed(l)).filter(function(x){ return f === "All" || (f === "Calls" && x.k === "call") || (f === "Meetings" && x.k === "meeting") || (f === "Notes" && x.k === "note") || (f === "Tasks" && x.k === "task") || (f === "Emails" && x.k === "email") || (f === "Assignment history" && x.k === "assign"); });
    return fd.length ? fd.map(function(x){ return '<div class="fd"><span class="ik">' + IK[x.k] + '</span><div><span class="tg">' + TG[x.k] + '</span><b>' + esc(x.t) + '</b>' + (x.s ? '<small>' + esc(x.s) + '</small>' : "") + '</div><span class="at">' + esc(x.at) + '</span></div>'; }).join("") : '<div class="empty" style="padding:14px">No activity here yet.</div>';
  }
  function engHtml(l){
    return '<div class="card"><div class="ctitle">Engagement summary</div><div class="sub" style="font-size:11px">Generate an AI recap of the most recent connected calls and meetings with this lead.</div><button class="btn" data-soon>Generate summary</button></div>' +
      '<div class="fchips" id="fch">' + ["All", "Calls", "Meetings", "Notes", "Tasks", "Assignment history", "Emails"].map(function(c){ return '<span data-f="' + c + '" class="' + (c === "All" ? "on" : "") + '">' + c + '</span>'; }).join("") + '</div><div id="feed">' + feedHtml(l, "All") + '</div>';
  }

  /* ---------- Risk tab ---------- */
  var DOC_TYPES = ["Audited Financial Statement", "Bank Statement", "DTI COR", "Future Revenue", "Income Tax Return", "Personal ID", "Trading Relationship"];
  var UW_STAGES = ["Business profile", "Credit check", "ESMS", "Financial assessment"];
  function pillFor(s){ return /Verified|Complete$/.test(s) ? "g" : /resubmission|Clarification/.test(s) ? "r" : /processing/.test(s) ? "b" : ""; }
  function rkOf(l){
    var r = l.rk || {}, bc = bclOf(l), fv = /Fully Verified/.test(bc || ""), done = fv || l.status === "Onboarded" || l.status === "Utilized";
    var b = r.bcl || {};
    return {
      clo: { status: l.clo ? "Clo approved · Oct 22, 2026" : "—", amt: r.cloAmt != null ? r.cloAmt : l.clo, premier: "No", prob: "—", afs: r.afs || "—", rej: "—" },
      bcl: { status: bc || "—", limit: b.limit != null ? b.limit : fv ? (l.bclAmt || 100000) : null, expiry: b.expiry || (fv ? "Jun 30, 2027" : "—"), granted: b.granted || (fv ? "Oct 27, 2026" : "—"), price: b.price || (fv ? "2.49%" : "—"), boost: b.boost || (fv ? "Not eligible" : "—"), plus: b.plus || (fv ? "Not eligible" : "—"), ebl: b.ebl || (fv ? "4.00%" : "—"), fee: b.fee || (fv ? "Processing Fee" : "—") },
      docs: r.docs || DOC_TYPES.map(function(t){ return { t: t, s: done ? "Verified" : "Not available", why: "" }; }),
      uw: r.uw || UW_STAGES.map(function(t){ return { stage: t, status: done ? "Complete" : "Not Started", notes: "", resp: "" }; })
    };
  }
  function money(n){ return n ? "₱" + Number(n).toLocaleString("en-US") : "—"; }
  function kv(lab, val, hist){ return '<div class="rk-kv"><div><small>' + lab + '</small><b>' + val + '</b></div>' + (hist ? '<button class="btn" data-soon>History →</button>' : "") + '</div>'; }
  function riskHtml(l){
    var r = rkOf(l);
    var top = '<div class="two"><div><div class="rk-h">CLO</div><div class="rk-c">' + kv("CLO Status", esc(r.clo.status)) + kv("CLO Amount", money(r.clo.amt), 1) + kv("Premier Pricing Possible", r.clo.premier) + kv("Conversion Probability", r.clo.prob) + kv("AFS / ITR Revenue", esc(r.clo.afs)) + kv("Rejection Reasons", r.clo.rej) + '</div></div>' +
      '<div><div class="rk-h">BCL</div><div class="rk-c">' + kv("Status", esc(r.bcl.status), 1) + kv("Regular Limit", money(r.bcl.limit), 1) + kv("Expiry", r.bcl.expiry) + kv("Last Granted", r.bcl.granted) + kv("BCL Price", r.bcl.price, 1) + kv("Boost Eligible", r.bcl.boost) + kv("BCL Plus", r.bcl.plus) + kv("EBL Price", r.bcl.ebl) + kv("Fee Type", r.bcl.fee) + '</div></div></div>';
    var docs = '<div class="rk-h">DOCUMENTS <a>Open in Connect ↗</a></div><div class="rk-c"><table><thead><tr><th>Type</th><th>Status</th><th>Resubmission reason</th></tr></thead><tbody>' +
      r.docs.map(function(d){ return '<tr class="' + (/resubmission/.test(d.s) ? "rk-bad" : "") + '"><td>' + esc(d.t) + '</td><td><span class="rp ' + pillFor(d.s) + '">' + esc(d.s) + '</span></td><td>' + (d.why ? esc(d.why) : "—") + '</td></tr>'; }).join("") + '</tbody></table></div>';
    var uw = '<div class="rk-h">Underwriting</div><div class="rk-c"><table><thead><tr><th>Stage</th><th>Status</th><th>Risk Notes</th><th>Response</th></tr></thead><tbody>' +
      r.uw.map(function(u, i){ return '<tr><td>' + esc(u.stage) + '</td><td><span class="rp ' + pillFor(u.status) + '">' + esc(u.status) + '</span></td><td>' + (u.notes ? esc(u.notes) : "—") + '</td><td>' + (u.resp ? esc(u.resp) : "—") + (/Clarification/.test(u.status) ? '<div><button class="btn" data-resp="' + i + '" style="margin-top:6px;color:var(--teal);font-weight:700">Update Response</button></div>' : "") + '</td></tr>'; }).join("") + '</tbody></table></div>';
    return top + docs + uw;
  }

  /* ---------- hook into the lead page ---------- */
  var _page = pageLead, _after = afterLead;
  pageLead = function(id){
    var h = _page(id), l = byId(id);
    if (!l) return h;
    var stub = '<div class="card"><div class="empty">';
    var i = h.indexOf(stub);
    if (S.ltab === "Risk" && i >= 0) h = h.slice(0, i) + riskHtml(l) + h.slice(h.indexOf("</div></div>", i) + 12);
    else if (S.ltab === "Engagement" && i >= 0) h = h.slice(0, i) + engHtml(l) + h.slice(h.indexOf("</div></div>", i) + 12);
    h = h.replace(/<span class="link" data-soon>\+ Add contact<\/span>/, '<span class="link" data-addc>+ Add contact</span>')
         .split('<button class="btn" data-soon>+ Log activity ⌄</button>').join('<button class="btn" data-logmenu>+ Log activity ⌄</button>');
    var cs = l.contacts, extra = "";
    if (cs && cs.length) extra = cs.slice(1).map(function(c){
      return '<div style="background:#f7fafa;border-radius:8px;padding:9px 12px;display:flex;justify-content:space-between;align-items:flex-start;margin-top:6px"><div><b style="font-size:12px">' + esc(cname(c)) + '</b><div class="sub" style="margin:2px 0 0">' + esc(c.role || c.rel || "Contact") + (c.rel ? " · " + esc(c.rel) : "") + '</div>' +
        (c.phones.length ? '<div class="sub" style="margin:2px 0 0">☎ ' + esc(c.phones.join(", ")) + '</div>' : "") + (c.emails.length ? '<div class="sub" style="margin:2px 0 0">✉ ' + esc(c.emails.join(", ")) + '</div>' : "") + '</div><span style="display:flex;gap:14px;font-size:10px"><span class="link" data-soon>View contact info</span><span data-soon style="cursor:pointer">Edit</span><span data-soon style="cursor:pointer;color:#b3243a;font-weight:600">Remove</span></span></div>';
    }).join("");
    if (extra) h = h.replace(/>Remove<\/span><\/span><\/div>/, function(m){ return m + extra; });
    return h;
  };
  afterLead = function(root, id){
    _after(root, id);
    var l = byId(id); if (!l) return;
    root.querySelectorAll("[data-addc]").forEach(function(b){ b.onclick = function(){ openContact(l); }; });
    root.querySelectorAll("[data-logmenu]").forEach(function(b){ b.onclick = function(e){
      e.stopPropagation(); document.querySelectorAll(".lxmenu").forEach(function(x){ x.remove(); });
      var r = b.getBoundingClientRect(), m = document.createElement("div"); m.className = "lxmenu"; m.style.top = (r.bottom + 4) + "px"; m.style.left = Math.max(8, r.right - 170) + "px";
      m.innerHTML = '<div data-m="log">Log call/meeting</div><div data-m="note">Add note</div><div data-m="blk">Add Blockers</div>'; document.body.appendChild(m);
      m.onclick = function(ev){ var k = ev.target.dataset.m; m.remove(); if (k === "log") openLog(l); else if (k === "note") openNote(l); else if (k === "blk") toast("Not part of this simulation"); };
    }; });
    root.querySelectorAll("[data-resp]").forEach(function(b){ b.onclick = function(){ openResponse(l, rkOf(l).uw[+b.dataset.resp]); }; });
    var ch = root.querySelector("#fch");
    if (ch) ch.querySelectorAll("span").forEach(function(s){ s.onclick = function(){ ch.querySelectorAll("span").forEach(function(x){ x.classList.toggle("on", x === s); }); root.querySelector("#feed").innerHTML = feedHtml(l, s.dataset.f); }; });
  };
  document.addEventListener("click", function(){ document.querySelectorAll(".lxmenu").forEach(function(x){ x.remove(); }); });
  window.addEventListener("hashchange", closeLx);

  /* ---------- seed data used by the exams (fake) ---------- */
  var m = byId("350115"); if (m) m.rk = { cloAmt: 150000, afs: "₱1,665,278 · Dec 31, 2025" };
  var p = byId("316266"); if (p) p.rp = [{ n: "Pam Reyes Holdings, Inc.", r: "Shareholder (60%)" }, { n: "Palmera Leisure Corp.", r: "Affiliate" }];
  var _pl = pageLead;
  pageLead = function(id){
    var h = _pl(id), l = byId(id);
    if (l && l.rp && S.ltab === "Company info") h = h.replace(/<div style="background:#f7fafa;border-radius:6px;padding:8px 10px;font-size:10.5px;color:var\(--mut\)">ⓘ No confirmed related parties for this lead\.<\/div>/, l.rp.map(function(x){ return '<div style="background:#f7fafa;border-radius:6px;padding:8px 10px;font-size:11px;margin-bottom:4px"><b>' + esc(x.n) + '</b><div class="sub" style="margin:2px 0 0">' + esc(x.r) + '</div></div>'; }).join(""));
    return h;
  };

  window.ACQUI_LX = { byId: byId, contactsOf: contactsOf, cname: cname, nm: nm, banner: banner, openLog: openLog, PB: PB };
})();
