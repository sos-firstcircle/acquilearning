/* Slack look-alike: the #acquisition_partnerships channel, the /regularnew command, the Regular Enrollment Form, a thread with file upload,
   and the Do's and don'ts for the ID and the proof of bank account. All fake. A guide (guide.js) or the practice (practice.js) drives it.
   Config (set before this file loads): window.SLK_CONFIG = { me:"Name", files:["sample-id", ...] }  (ids from ALL_FILES below)
   Events (SLK.on): channel, command {cmd, ok}, form-open, form-submit {data}, reply-open, plus-menu, picker-open, picker-select, attach, thread-reply {text, files}, docs-open, docs-close */
(function(){
  var CFG = window.SLK_CONFIG || {}, H = {};
  var SLK = window.SLK = { me: CFG.me || "Hanna Test", sent: null, attached: [],
    on: function(n, f){ (H[n] = H[n] || []).push(f); },
    emit: function(n, d){ (H[n] = H[n] || []).forEach(function(f){ try { f(d); } catch (e) { console.error(e); } }); } };
  var $ = function(s, r){ return (r || document).querySelector(s); };
  var esc = function(s){ return String(s == null ? "" : s).replace(/[&<>"]/g, function(c){ return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };
  var norm = SLK.norm = function(s){ return String(s || "").toLowerCase().replace(/[^a-z0-9]/g, ""); };
  var toast = SLK.toast = function(m){ var t = $("#toast"); t.textContent = m; t.style.display = "block"; clearTimeout(toast.h); toast.h = setTimeout(function(){ t.style.display = "none"; }, 2600); };

  /* all pictures that can show up in the Downloads folder (assets made by make-assets.py) */
  var ALL_FILES = {
    "sample-id":      { id: "sample-id", name: "Maria_ID.png", size: "186 KB", src: "slack/assets/sample-id.png" },
    "sample-proof":   { id: "sample-proof", name: "Maria_bank_statement.png", size: "142 KB", src: "slack/assets/sample-proof-of-account.png" },
    "id-lorna":       { id: "id-lorna", name: "Lorna_ID.png", size: "190 KB", src: "slack/assets/id-lorna.png" },
    "id-blurry":      { id: "id-blurry", name: "Lorna_ID_old.png", size: "74 KB", src: "slack/assets/id-lorna-blurry.png" },
    "id-cropped":     { id: "id-cropped", name: "ID_scan.png", size: "98 KB", src: "slack/assets/id-lorna-cropped.png" },
    "proof-lorna":    { id: "proof-lorna", name: "Lorna_bank.png", size: "151 KB", src: "slack/assets/proof-lorna.png" },
    "proof-noname":   { id: "proof-noname", name: "bank_screenshot.png", size: "118 KB", src: "slack/assets/proof-lorna-no-name.png" },
    "proof-noacct":   { id: "proof-noacct", name: "passbook.png", size: "121 KB", src: "slack/assets/proof-lorna-no-account.png" }
  };
  SLK.ALL_FILES = ALL_FILES;
  var FILES = (CFG.files || ["sample-id", "sample-proof"]).map(function(id){ return ALL_FILES[id]; });

  var CHS = ["acq-am-onboarding", "acquisition-general", "acquisition-locals", "general", "fc-random", "vigilance", "it-support-requests", "acquisition_bvp", "acquisition_partnerships", "fc-shoutout"];
  var PRIV = { "acquisition_partnerships": 1, "acquisition_bvp": 1 };
  var MSGS = [
    { id: "m1", bot: true, time: "2:40 PM", lines: ["✅ Hello <span class=at>@SalesOps</span>! Requesting to enroll regular referrer.", "Submitted by: <span class=at>@Carla Mendoza</span>", "Name: Rej Santiago", "Email: rej.santiago@example.com", "Team: OUTBOUND", "Please attach ID and proof of bank account in this thread. Thank you!"], replies: "4 replies" },
    { id: "m2", bot: true, time: "6:45 PM", lines: ["✅ Hello <span class=at>@SalesOps</span>! Requesting to enroll regular referrer.", "Submitted by: <span class=at>@Paolo Reyes</span>", "Name: KAREN NAPILI", "Email: karen.napili@example.com", "Team: OUTBOUND", "Please attach ID and proof of bank account in this thread. Thank you!"], replies: "1 reply" }
  ];
  var note = "", cur = CFG.channel || "acq-am-onboarding", threadOf = null, replies = [], picked = [];

  /* ---------- page skeleton ---------- */
  document.body.innerHTML =
    '<div id="top"><div class="s">🔍 Describe what you are looking for</div></div>' +
    '<div id="ws">' +
    '<aside id="chs"><h2>First Circle ⌄</h2><div class="sec">Channels</div>' + CHS.map(function(c){ return '<a class="ch" data-ch="' + c + '">' + (PRIV[c] ? "🔒" : "#") + " " + c + '</a>'; }).join("") + '</aside>' +
    '<main id="chan"><div class="hd"><span>👥 216</span><b id="chn"></b><div class="tabs"><i class="on">Messages</i><i>Pins</i><i>Files &amp; links</i><i>Bookmarks</i><i>Workflows</i></div></div>' +
    '<div id="msgs"></div>' +
    '<div id="compose"><div id="acmenu"></div><div class="tb"><b>B</b><i>I</i><u>U</u><s>S</s><span>🔗</span><span>☰</span><span>&lt;/&gt;</span></div><textarea id="cin" rows="1"></textarea><div class="cf"><span>＋</span><span>Aa</span><span>☺</span><span>@</span><button class="send" disabled>➤</button></div></div></main>' +
    '<aside id="thr"><div class="th"><span>Thread</span><button class="x" title="Close">×</button></div><div class="body" id="thb"></div>' +
    '<div class="comp"><div id="plusmenu"><div data-pm="x">File, canvas, or list</div><div data-pm="x">GIF</div><div data-pm="x">Text snippet</div><div data-pm="x">Workflow</div><div data-pm="up">Upload from your computer <small style="float:right;opacity:.7">⌘O</small></div></div>' +
    '<div class="tb"><b>B</b><i>I</i><u>U</u><s>S</s><span>🔗</span><span>☰</span></div><textarea id="tin" rows="1" placeholder="Reply to thread..."></textarea><div class="att" id="tatt"></div><div class="cf"><button class="plus" title="Add files">＋</button><span>Aa</span><span>☺</span><span>@</span><button class="send" id="tsend" disabled>➤</button></div></div></aside></div>' +
    '<div id="fm"><div class="box"><div class="bh"><span>👥 Regular Enrollment Form</span><button id="fx" title="Close">×</button></div><div class="bb" id="fbody"></div><div class="bf"><button class="sbtn" id="fcancel">Cancel</button><button class="sbtn go" id="fsubmit">Submit</button></div></div></div>' +
    '<div id="pk"><div class="box"><div class="bar"><b>Downloads</b><span>Click a file to select it. Click again to unselect.</span></div><div class="list" id="pkl"></div><div class="pv" id="pkv"><span>Select a file to see a preview.</span></div><div class="bt"><span id="pkc"></span><span><button class="sbtn" id="pkcancel">Cancel</button> <button class="sbtn go" id="pkopen" disabled>Open</button></span></div></div></div>' +
    '<div id="docs"><div class="box"><button class="dx" title="Close">×</button><div id="docsb"></div></div></div>' +
    '<div id="iv"><div class="box"><button class="dx" title="Close">×</button><div class="t" id="ivt"></div><img id="ivi" alt=""></div></div><div id="toast"></div>';

  /* ---------- channel ---------- */
  function msgHtml(m){
    var mine = m.me, name = mine ? esc(SLK.me) : "Regular Referrer Enrollment Form";
    var body = m.files ? '<div class="mt">' + (m.text ? esc(m.text) + "<br>" : "") + '<span style="font-size:12px;color:#616061">' + m.files.length + ' attachment' + (m.files.length > 1 ? "s" : "") + '</span></div><div class="files">' + m.files.map(function(f){ return '<div class="fc"><img src="' + f.src + '" alt=""><span>' + esc(f.name) + '</span></div>'; }).join("") + '</div>'
      : '<div class="mt">' + m.lines.join("<br>") + '</div>';
    var rl = m.reply ? '<a class="rl" data-new="1" data-open="' + m.id + '">' + (m.replyN ? m.replyN + " repl" + (m.replyN > 1 ? "ies" : "y") : "Reply in thread") + '</a>' : (m.replies ? '<a class="rl static">' + m.replies + '</a>' : "");
    return (m.only ? '<div class="only">👁 Only visible to you</div>' : "") + '<div class="msg" id="' + m.id + '"><div class="av ' + (mine ? "me" : "bot") + '">' + (mine ? esc(SLK.me.charAt(0)) : "👥") + '</div><div class="mb"><div class="mh"><b>' + name + '</b>' + (mine ? "" : ' <span class="app">APP</span>') + '<span class="t">' + (m.time || "Just now") + '</span></div>' + body + rl + '</div></div>';
  }
  function drawMsgs(){
    $("#chn").textContent = (PRIV[cur] ? "🔒 " : "# ") + cur;
    document.querySelectorAll("#chs .ch").forEach(function(a){ a.classList.toggle("on", a.dataset.ch === cur); });
    $("#cin").placeholder = "Message " + (PRIV[cur] ? "🔒" : "#") + cur;
    $("#msgs").innerHTML = cur === "acquisition_partnerships" ? MSGS.map(msgHtml).join("") : (note ? '<div class="only">👁 Only visible to you</div><div class="msg"><div class="av bot">👥</div><div class="mb"><div class="mh"><b>Regular Referrer Enrollment Form</b> <span class="app">APP</span><span class="t">Just now</span></div><div class="mt">⚠️ ' + note + '</div></div></div>' : "");
    $("#msgs").scrollTop = 1e6;
    document.querySelectorAll("#msgs .rl[data-open]").forEach(function(a){ a.onclick = function(){ openThread(a.dataset.open); }; });
  }
  document.getElementById("chs").onclick = function(e){ var a = e.target.closest(".ch"); if (!a) return; cur = a.dataset.ch; note = ""; drawMsgs(); SLK.emit("channel", cur); };
  SLK.channel = function(){ return cur; };

  /* ---------- composer + slash commands ---------- */
  var CMDS = [
    { c: "/regularnew", app: "Regular Referrer Enrollment Form", d: "Enroll a new regular referrer", ok: true },
    { c: "/record", app: "Loom", d: "Record a Loom from Slack" },
    { c: "/remind", app: "Slack", d: "Set a reminder" }
  ];
  var acIdx = 0, acItems = [];
  function drawAc(){
    var v = $("#cin").value, m = $("#acmenu");
    if (v.charAt(0) !== "/") { m.style.display = "none"; acItems = []; return; }
    var q = v.slice(1).toLowerCase();
    acItems = CMDS.filter(function(x){ return x.c.slice(1).toLowerCase().indexOf(q) === 0 || (q.length > 2 && x.app.toLowerCase().indexOf(q) >= 0); });
    if (!acItems.length) { m.style.display = "none"; return; }
    acIdx = Math.min(acIdx, acItems.length - 1);
    m.innerHTML = acItems.map(function(x, i){ return '<div class="it' + (i === acIdx ? " on" : "") + '" data-cmd="' + x.c + '"><b>' + x.c + '</b><span>' + esc(x.app) + ' <small>' + esc(x.d) + '</small></span></div>'; }).join("");
    m.style.display = "block";
    m.querySelectorAll(".it").forEach(function(it){ it.onclick = function(){ runCmd(it.dataset.cmd); }; });
  }
  function runCmd(c){
    var def = CMDS.filter(function(x){ return x.c === c; })[0];
    $("#cin").value = ""; $("#acmenu").style.display = "none"; acItems = [];
    if (def && def.ok && cur !== "acquisition_partnerships") {   /* the workflow only works in #acquisition_partnerships */
      note = "This workflow can't be used in this channel. Please only use /regularnew in #acquisition_partnerships."; drawMsgs();
      SLK.emit("command", { cmd: c, ok: false, why: "channel" }); return;
    }
    SLK.emit("command", { cmd: c, ok: !!(def && def.ok) });
    if (!def || !def.ok) { toast(c + " is not part of this practice."); return; }
    MSGS.push({ id: "e1", bot: true, only: true, time: "Just now", lines: ["Opening Regular form..."] });
    drawMsgs(); setTimeout(openForm, 500);
  }
  $("#cin").addEventListener("input", function(){ acIdx = 0; drawAc(); $("#compose .send").disabled = !this.value.trim(); });
  $("#cin").addEventListener("keydown", function(e){
    if (acItems.length && (e.key === "ArrowDown" || e.key === "ArrowUp")) { e.preventDefault(); acIdx = (acIdx + (e.key === "ArrowDown" ? 1 : acItems.length - 1)) % acItems.length; drawAc(); return; }
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      var v = this.value.trim();
      if (acItems.length) { runCmd(acItems[acIdx].c); return; }
      if (v.charAt(0) === "/") { runCmd(v.split(/\s/)[0]); return; }
      if (v) { MSGS.push({ id: "p" + Date.now(), me: true, lines: [esc(v)] }); this.value = ""; drawMsgs(); }
    }
  });
  $("#compose .send").onclick = function(){ var e = new KeyboardEvent("keydown", { key: "Enter" }); $("#cin").dispatchEvent(e); };

  /* ---------- Regular Enrollment Form ---------- */
  var FIELDS = [
    ["f_name", "Full name (as stated in ID)", "text"], ["f_phone", "Contact number (digits only)", "text"], ["f_email", "Email", "text"], ["f_addr", "Mailing Address", "area"],
    ["f_tin", "TIN (optional)", "text"], ["f_bank", "Bank name", "text"], ["f_accname", "Account name in bank", "text"], ["f_accno", "Account number (digits only)", "text"], ["f_fc", "Name of FC Employee", "text"]
  ];
  var TEAMS = ["INBOUND", "OUTBOUND"];
  function openForm(){
    $("#fbody").innerHTML = FIELDS.map(function(f){ return '<label for="' + f[0] + '">' + f[1].replace("(optional)", "<small>(optional)</small>") + '</label>' + (f[2] === "area" ? '<textarea id="' + f[0] + '" placeholder="Write something"></textarea>' : '<input type="text" id="' + f[0] + '" placeholder="Write something" autocomplete="off">'); }).join("") +
      '<label for="f_team">Team</label><select id="f_team"><option value="">Select team</option>' + TEAMS.map(function(t){ return '<option>' + t + '</option>'; }).join("") + '</select>' +
      '<label>Acknowledgement</label><label class="ack"><input type="checkbox" id="f_ack"> <span>I understand: I will submit required ID and proof of bank account in the thread.</span></label><div class="err" id="ferr"></div>';
    ["f_phone", "f_accno"].forEach(function(id){ $("#" + id).addEventListener("input", function(){ var d = this.value.replace(/\D/g, ""); if (d !== this.value) this.value = d; }); });
    $("#fm").style.display = "flex"; SLK.emit("form-open");
  }
  function closeForm(){ $("#fm").style.display = "none"; }
  $("#fx").onclick = $("#fcancel").onclick = closeForm;
  $("#fsubmit").onclick = function(){
    var d = {}, miss = [];
    FIELDS.forEach(function(f){ d[f[0].slice(2)] = $("#" + f[0]).value.trim(); if (f[0] !== "f_tin" && !d[f[0].slice(2)]) miss.push(f[1].replace(/ \(.*\)/, "")); });
    d.team = $("#f_team").value; if (!d.team) miss.push("Team");
    d.ack = $("#f_ack").checked; if (!d.ack) miss.push("Acknowledgement");
    if (miss.length) { $("#ferr").textContent = "Please fill in: " + miss.join(", "); return; }
    closeForm();
    SLK.sent = d;
    MSGS = MSGS.filter(function(m){ return m.id !== "e1"; });
    MSGS.push({ id: "mine", bot: true, time: "Just now", reply: true, lines: ["✅ Hello <span class=at>@SalesOps</span>! Requesting to enroll regular referrer.", "Submitted by: <span class=at>@" + esc(SLK.me) + "</span>", "Name: " + esc(d.name), "Email: " + esc(d.email), "Team: " + esc(d.team), "Please attach ID and proof of bank account in this thread. Thank you!"] });
    drawMsgs(); SLK.emit("form-submit", { data: d });
  };

  /* ---------- thread, upload, picker ---------- */
  function openThread(id){
    threadOf = id; var root = MSGS.filter(function(m){ return m.id === id; })[0];
    $("#thr").classList.add("open"); drawThread(root); SLK.emit("reply-open", id);
  }
  function drawThread(root){
    var rootHtml = msgHtml(Object.assign({}, root, { reply: false, replies: null }));
    $("#thb").innerHTML = rootHtml + '<div class="cnt">' + (replies.length ? replies.length + " repl" + (replies.length > 1 ? "ies" : "y") : "") + '</div>' + replies.map(msgHtml).join("");
    $("#thb").scrollTop = 1e6;
    $("#tatt").innerHTML = SLK.attached.map(function(f, i){ return '<div class="chip">📄 ' + esc(f.name) + ' <b data-rm="' + i + '">×</b></div>'; }).join("");
    $("#tatt").querySelectorAll("[data-rm]").forEach(function(b){ b.onclick = function(){ SLK.attached.splice(+b.dataset.rm, 1); drawThread(root); }; });
    $("#tsend").disabled = !($("#tin").value.trim() || SLK.attached.length);
  }
  SLK.rootMsg = function(){ return MSGS.filter(function(m){ return m.id === threadOf; })[0]; };
  $("#thr .x").onclick = function(){ $("#thr").classList.remove("open"); };
  $("#tin").addEventListener("input", function(){ $("#tsend").disabled = !(this.value.trim() || SLK.attached.length); });
  var canUp = true;
  SLK.setUpload = function(on){ canUp = !!on; $("#thr .plus").classList.toggle("dis", !on); };
  $("#thr .plus").onclick = function(e){ e.stopPropagation(); if (!canUp) { toast("Not yet. Follow the steps first."); return; } var m = $("#plusmenu"); m.style.display = m.style.display === "block" ? "none" : "block"; SLK.emit("plus-menu"); };
  document.addEventListener("click", function(e){ if (!e.target.closest("#plusmenu") && !e.target.closest(".plus")) $("#plusmenu").style.display = "none"; });
  $("#plusmenu").onclick = function(e){
    var it = e.target.closest("[data-pm]"); if (!it) return; $("#plusmenu").style.display = "none";
    if (it.dataset.pm === "up") openPicker(); else toast("Not part of this practice. Use Upload from your computer.");
  };
  function openPicker(){
    picked = []; drawPicker(); $("#pk").style.display = "flex"; SLK.emit("picker-open");
  }
  function drawPicker(){
    $("#pkl").innerHTML = '<div class="row h"><span>Name</span><span>Size</span><span>Kind</span></div>' + (FILES.length ? "" : '<div class="row" style="cursor:default"><span>Nothing here yet. Download the files first.</span><span></span><span></span></div>') + FILES.map(function(f){ return '<div class="row' + (picked.indexOf(f.id) >= 0 ? " on" : "") + '" data-f="' + f.id + '"><span><img src="' + f.src + '" alt="">' + esc(f.name) + '</span><span>' + f.size + '</span><span>PNG image</span></div>'; }).join("");
    $("#pkl").querySelectorAll("[data-f]").forEach(function(r){ r.onclick = function(){
      var id = r.dataset.f, i = picked.indexOf(id); if (i >= 0) picked.splice(i, 1); else picked.push(id);
      drawPicker(); SLK.emit("picker-select", picked.slice());
    }; });
    var last = picked.length ? ALL_FILES[picked[picked.length - 1]] : null;
    $("#pkv").innerHTML = last ? '<img src="' + last.src + '" alt=""><span>' + esc(last.name) + '<br>Preview</span>' : '<span>Select a file to see a preview.</span>';
    $("#pkc").textContent = picked.length + " selected"; $("#pkopen").disabled = !picked.length; $("#pkopen").textContent = "Open";
  }
  $("#pkcancel").onclick = function(){ $("#pk").style.display = "none"; };
  $("#pkopen").onclick = function(){
    picked.forEach(function(id){ if (!SLK.attached.some(function(f){ return f.id === id; })) SLK.attached.push(ALL_FILES[id]); });
    $("#pk").style.display = "none"; drawThread(SLK.rootMsg()); SLK.emit("attach", SLK.attached.slice());
  };
  $("#tsend").onclick = function(){
    var text = $("#tin").value.trim(), files = SLK.attached.slice();
    if (!text && !files.length) return;
    replies.push({ id: "r" + replies.length, me: true, text: text, files: files.length ? files : null, lines: [esc(text)] });
    var root = SLK.rootMsg(); root.replyN = replies.length;
    $("#tin").value = ""; SLK.attached = []; drawThread(root); drawMsgs();
    SLK.emit("thread-reply", { text: text, files: files, root: root.id });
  };

  /* ---------- Do's and don'ts ---------- */
  /* which = "id" or "proof": a small window with the do's and don'ts of that one document */
  var DOCS = {
    id: { title: "ID", img: "slack/assets/sample-id.png", file: "sample-id.png", dl: "Download sample ID",
      dos: ["Full name visible, the same as in the form.", "The photo of the person is visible.", "Clear picture: all four corners, good light, easy to read.", "Valid (not expired) ID with a photo."],
      donts: ["Blurry, dark, or glare over the name.", "Cut off, so the name or photo is missing.", "Expired, or somebody else's ID.", "Edited, or a photocopy with no photo."] },
    proof: { title: "Proof of bank account", img: "slack/assets/sample-proof-of-account.png", file: "sample-proof-of-account.png", dl: "Download sample proof of account",
      dos: ["Account holder's full name visible.", "Bank name visible.", "Complete account number visible.", "A statement, first page of the passbook, or bank app screenshot with all three."],
      donts: ["No name, or a different name from the ID.", "Account number missing, cut off or hidden.", "No bank name.", "Blurry, edited, or a receipt that doesn't show the account."] }
  };
  SLK.openDocs = function(which){
    var d = DOCS[which || "id"], li = function(a){ return a.map(function(x){ return "<li>" + x + "</li>"; }).join(""); };
    $("#docsb").innerHTML = '<div class="col"><h3>' + d.title + ': do\'s and don\'ts</h3><div class="two"><div><h4 class="d">Do</h4><ul class="do">' + li(d.dos) + '</ul></div><div><h4 class="n">Don\'t</h4><ul class="dont">' + li(d.donts) + '</ul></div></div>' +
      '<img src="' + d.img + '" alt="Sample"><a class="dl" href="' + d.img + '" download="' + d.file + '">⬇ ' + d.dl + '</a><span class="fk">Fake sample, for training only.</span></div>';
    $("#docs").style.display = "flex"; SLK.emit("docs-open", which);
  };
  SLK.docsOpen = function(){ return $("#docs").style.display === "flex"; };
  /* View a downloaded file (to check the full name before using it) */
  SLK.viewFile = function(id){ var f = ALL_FILES[id]; $("#ivt").textContent = f.name; $("#ivi").src = f.src; $("#iv").style.display = "flex"; SLK.emit("file-view", id); };
  $("#iv .dx").onclick = function(){ $("#iv").style.display = "none"; };
  SLK.addFile = function(id){ if (!FILES.some(function(f){ return f.id === id; })) FILES.push(ALL_FILES[id]); };
  $("#docs .dx").onclick = function(){ $("#docs").style.display = "none"; SLK.emit("docs-close"); };
  SLK.state = function(){ return { form: SLK.sent, attached: SLK.attached.slice(), replies: replies.slice() }; };
  SLK.formOpen = function(){ return $("#fm").style.display === "flex"; };
  SLK.pickerOpen = function(){ return $("#pk").style.display === "flex"; };
  SLK.plusOpen = function(){ return $("#plusmenu").style.display === "block"; };
  SLK.picked = function(){ return picked.slice(); };
  drawMsgs();
})();
