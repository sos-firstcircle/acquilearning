/* Practice: register a referrer in Slack on your own. Honor code + AM name first. Scored out of 100, pass mark 80. Not graded (nothing is saved).
   The referrer (Lorna Mae Villareal) sent her details; her documents are in the Downloads folder, mixed with ones that must NOT be sent (blurry, cut off,
   no name, no account number). Scoring: command 10, form sent 5, fields 40, reply in the thread 5, ID 20, proof 20, ... a wrong document is -10 each. */
(function(){
  var $ = function(s){ return document.querySelector(s); };
  var esc = function(s){ return String(s).replace(/[&<>"]/g, function(c){ return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };
  var norm = SLK.norm, phoneN = function(x){ return String(x || "").replace(/\D/g, "").replace(/^(0|63)/, ""); };
  var TASK_ID = "d5-referrer-practice", NEXT = { href: "slack-referrer-demo.html", label: "Review the guided demo" };
  var R = { name: "Lorna Mae Villareal", phone: "0917 111 2233", email: "lorna.villareal@example.com", addr: "45 Mabini St., Brgy. San Roque, Antipolo City, Rizal", tin: "123-456-789-000", bank: "Sample National Bank", accno: "0123 4567 89", team: "INBOUND" };
  var BAD = { "id-blurry": "the ID is blurry", "id-cropped": "the ID is cut off (no name)", "proof-noname": "the proof has no name", "proof-noacct": "the proof has no account number" };
  var AM = "", started = false, done = false, cmdOk = false, wrongCmds = 0, t0 = 0;
  SLK.on("command", function(d){ if (!started || done) return; if (d.ok) cmdOk = true; else if (!d.why) wrongCmds++; });
  
  var layer = document.createElement("div"); layer.id = "res"; document.body.appendChild(layer);
  function intro(){
    layer.style.display = "flex";
    layer.innerHTML = '<div class="box" style="width:560px"><div style="font-size:12px;letter-spacing:.5px;text-transform:uppercase;font-weight:700;color:#616061">Practice · not graded</div><h2 style="margin:4px 0 8px">Register a referrer in Slack</h2>' +
      '<p style="font-size:15px;line-height:1.55;margin:0 0 10px">A new referrer sent you her details and her documents. Register her in Slack, the way you would really do it. Use the commands, the form and the thread in the Slack practice site behind this box. Nothing tells you what to click.</p>' +
      '<p style="font-size:14px;line-height:1.55;margin:0 0 12px;color:#456">You get points for the command, each field of the form, replying in the thread, and the right documents. Download her ID and proof first, view them to check that the full name is correct, then register her. Total: 100 points. Aim for 80 or more.</p>' +
      '<div style="background:#f4f8f8;border:1px solid #dde6e6;border-radius:10px;padding:10px 12px;margin:0 0 14px"><div style="font-size:13px;line-height:1.5;color:#345;margin-bottom:8px"><b>Honor code.</b> I will do this practice on my own. I will not ask anyone for help, and I will not share the situation or the answers.</div>' +
      '<label style="font-size:13px;font-weight:700">AM name: <input type="text" id="amn" placeholder="Type your name" autocomplete="off" style="width:100%;margin-top:4px;height:38px;border:1px solid #ccc;border-radius:8px;padding:0 10px;font-size:15px"></label><div style="font-size:11px;color:#616061;margin-top:4px">This is the name you will use in the Slack practice site.</div></div>' +
      '<div style="display:flex;justify-content:space-between;align-items:center"><span>' + (window.SLK_STANDALONE ? "" : '<a href="../dashboard.html" style="font-size:13px;color:#1c6a66">Back to Day 5</a> · <a href="' + NEXT.href + '" style="font-size:13px;color:#1c6a66">' + NEXT.label + ' first</a>') + '</span><button class="gbtn dark" id="amgo">Start</button></div></div>';
    $("#amgo").onclick = function(){
      var nm = $("#amn").value.trim(); if (nm.length < 2) { $("#amn").style.borderColor = "#b3243a"; $("#amn").focus(); return; }
      AM = nm; SLK.me = nm; layer.style.display = "none"; begin();
    };
  }
  function begin(){
    started = true; t0 = Date.now(); var first = AM.split(" ")[0];
    document.body.classList.add("has-g");
    var sit = document.createElement("div"); sit.id = "sit";
    sit.innerHTML = '<h4>Your situation</h4><div class="m">Hi ' + esc(first) + '! I\'d like to be your referrer 🙌 Here are my details:<br><br><b>Name:</b> ' + R.name + '<br><b>Mobile:</b> ' + R.phone + '<br><b>Email:</b> ' + R.email + '<br><b>Address:</b> ' + R.addr + '<br><b>TIN:</b> ' + R.tin + '<br><b>Bank:</b> ' + R.bank + '<br><b>Account name:</b> ' + R.name + '<br><b>Account number:</b> ' + R.accno + '<br><br>And here are my documents:' +
      '<div class="doc"><b>ID</b><button data-dl="id-lorna">Download ID</button><button data-view="id-lorna" style="display:none">View ID</button><button data-dd="id">Do\'s and don\'ts for ID</button></div>' +
      '<div class="doc"><b>Proof of bank account</b><button data-dl="proof-lorna">Download proof</button><button data-view="proof-lorna" style="display:none">View proof</button><button data-dd="proof">Do\'s and don\'ts for proof</button></div></div>' +
      '<div class="m sys">Register Lorna as a regular referrer in Slack.</div>';
    document.body.appendChild(sit);
    sit.querySelectorAll("[data-dl]").forEach(function(b){ b.onclick = function(){ SLK.addFile(b.dataset.dl); b.textContent = "✓ Downloaded"; b.className = "done"; var v = sit.querySelector('[data-view="' + b.dataset.dl + '"]'); if (v) v.style.display = ""; SLK.toast("Saved to your Downloads folder."); }; });
    sit.querySelectorAll("[data-view]").forEach(function(b){ b.onclick = function(){ SLK.viewFile(b.dataset.view); }; });
    sit.querySelectorAll("[data-dd]").forEach(function(b){ b.onclick = function(){ SLK.openDocs(b.dataset.dd); }; });
    var b = document.createElement("div"); b.id = "exitbub";
    b.innerHTML = '<span class="live"></span><span>In training</span><button class="fin" id="finbtn">Done</button><button id="exitbtn">Exit</button>';
    document.body.appendChild(b);
    var mk = function(id, h, p, yes, cb){ var d = document.createElement("div"); d.id = id; d.className = "xdlg"; d.innerHTML = '<div class="box"><h3>' + h + '</h3><p>' + p + '</p><div class="r"><button class="gbtn" data-n>Keep going</button><button class="gbtn dark" data-y>' + yes + '</button></div></div>'; document.body.appendChild(d); d.querySelector("[data-n]").onclick = function(){ d.style.display = "none"; }; d.querySelector("[data-y]").onclick = function(){ d.style.display = "none"; cb(); }; return d; };
    var fd = mk("findlg", "Are you done enrolling?", "You will see your result right away. Anything you have not done yet gets 0 points.", "Yes, I\'m done", function(){ finish(); });
    var ed = mk("exdlg", "Exit training?", "If you exit now, your progress in this practice will be reset and you will have to start again.", "Exit", function(){ if (window.SLK_STANDALONE) location.reload(); else location.href = "../dashboard.html"; });
    $("#finbtn").onclick = function(){ fd.style.display = "flex"; }; $("#exitbtn").onclick = function(){ ed.style.display = "flex"; };
  }

  function finish(){
    if (done) return; done = true;
    var S = SLK.state(), F = S.form, items = [], extra = [];
    var replied = S.replies.length > 0, ids = [].concat.apply([], S.replies.map(function(r){ return (r.files || []).map(function(f){ return f.id; }); }));
    items.push({ l: "Used the /regularnew command", w: 10, ok: cmdOk, exp: "/regularnew (Regular Referrer Enrollment Form)" });
    items.push({ l: "Sent the form", w: 5, ok: !!F, exp: "fill in and submit the form" });
    var f = F || {};
    var fx = function(l, w, ok, exp){ items.push({ l: l, w: w, ok: !!F && ok, exp: exp }); };
    fx("Full name (as stated in ID)", 8, norm(f.name) === norm(R.name), R.name);
    fx("Contact number", 5, phoneN(f.phone) === phoneN(R.phone) && !!f.phone, "09171112233");
    fx("Email", 5, norm(f.email) === norm(R.email), R.email);
    fx("Mailing address", 4, norm(f.addr).indexOf("mabini") >= 0 && norm(f.addr).indexOf("antipolo") >= 0, R.addr);
    fx("Bank name", 5, norm(f.bank) === norm(R.bank), R.bank);
    fx("Account name in bank", 5, norm(f.accname) === norm(R.name), R.name);
    fx("Account number", 6, String(f.accno || "").replace(/\D/g, "") === R.accno.replace(/\D/g, ""), "0123456789");
    fx("Name of FC Employee", 1, norm(f.fc).indexOf(norm(AM.split(" ")[0])) >= 0, AM);
    fx("Team (your own team)", 1, !!f.team, "any team: choose your own");
    items.push({ l: "Replied in the thread of the confirmation", w: 5, ok: replied && !!F, exp: "reply in the thread, not in the channel" });
    items.push({ l: "Sent the referrer's ID (clear, full name and photo)", w: 20, ok: ids.indexOf("id-lorna") >= 0, exp: "Lorna_ID.png" });
    items.push({ l: "Sent the proof of bank account (name, bank name, account number)", w: 20, ok: ids.indexOf("proof-lorna") >= 0, exp: "Lorna_bank.png" });
    ids.forEach(function(id){ if (BAD[id]) extra.push({ l: "Sent " + SLK.ALL_FILES[id].name + ": " + BAD[id], loss: 10 }); });
    if (wrongCmds) extra.push({ l: "Tried " + wrongCmds + " other command" + (wrongCmds > 1 ? "s" : ""), loss: 5 * wrongCmds });
    var sum = items.reduce(function(a, i){ return a + (i.ok ? i.w : 0); }, 0) - extra.reduce(function(a, e){ return a + e.loss; }, 0);
    var pts = Math.max(0, Math.min(100, sum)), pass = pts >= 80, secs = Math.round((Date.now() - t0) / 1000);
    layer.style.display = "flex";
    layer.innerHTML = '<div class="box"><div style="font-size:12px;letter-spacing:.5px;text-transform:uppercase;font-weight:700;color:#616061">Practice · result · ' + esc(AM) + '</div><div class="big ' + (pass ? "ok" : "no") + '">' + pts + ' / 100</div>' +
      '<div style="font-size:16px;font-weight:600">' + (pass ? "Passed" : "Not yet. Review the guided demo and try again.") + ' (' + Math.floor(secs / 60) + 'm ' + (secs % 60) + 's)</div><table>' +
      items.map(function(i){ return '<tr><td style="width:22px" class="' + (i.ok ? "ok" : "no") + '">' + (i.ok ? "✓" : "✗") + '</td><td>' + esc(i.l) + (i.ok ? "" : '<div style="color:#616061;font-size:12.5px">Expected: ' + esc(i.exp) + '</div>') + '</td><td class="r">' + (i.ok ? "+" + i.w : "0") + '</td></tr>'; }).join("") +
      extra.map(function(e){ return '<tr><td class="no">✗</td><td>' + esc(e.l) + '</td><td class="r no">-' + e.loss + '</td></tr>'; }).join("") + '</table>' +
      '<div style="display:flex;justify-content:space-between;align-items:center"><span>' + (window.SLK_STANDALONE ? "" : '<a href="../dashboard.html" style="font-size:13px;color:#1c6a66">Back to Day 5</a> · <a href="' + NEXT.href + '" style="font-size:13px;color:#1c6a66">' + NEXT.label + '</a>') + '</span><button class="gbtn dark" id="again">Try again</button></div></div>';
    $("#again").onclick = function(){ location.reload(); };
    try { if (window.LMS && LMS.user && LMS.user() && !(LMS.preview && LMS.preview())) LMS.complete(TASK_ID); } catch (e) {}
    window.SLK_RESULT = { name: AM, score: pts, max: 100, passed: pass };
  }
  intro();
})();
