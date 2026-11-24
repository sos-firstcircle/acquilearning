/* Attendance tracker (admins only, Sessions page). One batch at a time: people down the side, sessions across the top.
   Each cell: Present / Tardy (present but late: yellow ✓) / Absent / On leave (or blank), plus an optional note (shown on hover). "All present" on a session marks
   everyone who has no mark yet as present; change anyone after that. Saved to the Sheet's "Attendance" tab (Code.gs saveAttendance);
   the latest row per person + session wins.
   "Sessions" button: the batch's sessions (Google Calendar, modules.js, added here) with a switch to hide one from the tracker only
   (Settings key attHide.<session id> = "on"; the dashboard and the session lists are not affected).
   Attendance.mount(el, { batch, sessions:[{ id, title, when }], people:[email], nameOf }) */
(function () {
  const ST = { present: { t: "Present", i: "✓", c: "a-p" }, tardy: { t: "Tardy", i: "✓", c: "a-t" }, absent: { t: "Absent", i: "✗", c: "a-a" }, leave: { t: "On leave", i: "L", c: "a-l" } };
  const hidden = id => LMS.setting("attHide." + id, "") === "on";
  const css = `.att{overflow-x:auto;border:1px solid var(--line);border-radius:var(--r-lg);margin-bottom:8px}
    .att table{border-collapse:collapse;font-size:13px;min-width:100%}
    .att th,.att td{border-bottom:1px solid var(--line);padding:6px 8px;text-align:center;vertical-align:middle}
    .att th{font-size:12px;font-weight:600;color:var(--ink-2);min-width:96px;max-width:150px;vertical-align:bottom}
    .att th .sd{font-weight:400;color:var(--ink-3);display:block}
    .att td.nm,.att th.nm{text-align:left;white-space:nowrap;position:sticky;left:0;background:#fff;z-index:1}
    .att .ab{width:34px;height:30px;border-radius:8px;border:1px solid var(--line);background:#fff;cursor:pointer;font:inherit;font-weight:700;position:relative}
    .att .ab.a-p{background:var(--green-soft);color:var(--green);border-color:transparent}
    .att .ab.a-a{background:var(--coral-soft);color:var(--coral);border-color:transparent}
    .att .ab.a-t{background:#FFF1C2;color:#8A6400;border-color:transparent}
    .att .ab.a-t::before{content:"T";position:absolute;bottom:1px;right:3px;font-size:9px;font-weight:700}
    .att .ab.a-l{background:#E6ECF8;color:#3B5BA9;border-color:transparent}
    .att-wrap{display:flex;gap:16px;align-items:flex-start;flex-wrap:wrap} .att-wrap>.att-main{flex:1 1 480px;min-width:0}
    .att-side{flex:0 0 300px;max-width:100%;border:1px solid var(--line);border-radius:var(--r-lg);padding:12px;font-size:13px}
    .att-side h4{margin:0 0 4px;font-size:14px} .att-side .row{display:flex;gap:10px;align-items:flex-start;padding:8px 0;border-top:1px solid var(--line)}
    .att-side .sw{display:inline-flex;cursor:pointer;position:relative;margin-top:2px} .att-side .sw input{position:absolute;opacity:0;width:1px;height:1px}
    .att-side .sw i{width:36px;height:20px;border-radius:20px;background:#cfd6dc;position:relative;transition:background .15s;flex:none}
    .att-side .sw i::after{content:"";position:absolute;top:2px;left:2px;width:16px;height:16px;border-radius:50%;background:#fff;box-shadow:0 1px 2px rgba(0,0,0,.25);transition:left .15s}
    .att-side .sw input:checked+i{background:var(--green)} .att-side .sw input:checked+i::after{left:18px} .att-side .sw input:focus-visible+i{outline:2px solid var(--teal);outline-offset:2px}
    .att-side .row.off{opacity:.55} .att-side .src{font-size:11px;color:var(--ink-3)}
    .att .ab.hn::after{content:"";position:absolute;top:3px;right:3px;width:6px;height:6px;border-radius:50%;background:var(--ink-2)}
    .att .all{font:inherit;font-size:11px;margin-top:4px;padding:2px 8px;border-radius:20px;border:1px solid var(--line);background:#fff;cursor:pointer}
    .att .cnt{font-weight:400;font-size:11px;color:var(--ink-3)}
    .att-pop{position:absolute;z-index:50;background:#fff;border:1px solid var(--line);border-radius:12px;box-shadow:0 6px 24px rgba(0,0,0,.12);padding:12px;width:320px;font-size:13px}
    .att-pop .opts{display:flex;gap:6px;margin:8px 0}
    .att-pop .opts button{flex:1;font:inherit;padding:6px 4px;border-radius:8px;border:1px solid var(--line);background:#fff;cursor:pointer}
    .att-pop .opts button.on{outline:2px solid var(--teal)}
    .att-pop textarea{width:100%;box-sizing:border-box;font:inherit;min-height:60px;border:1px solid var(--line);border-radius:8px;padding:6px}
    .att-lg{display:flex;gap:14px;flex-wrap:wrap;font-size:12px;color:var(--ink-2);margin:0 0 8px}`;
  const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  function post(action, payload) {
    const C = LMS.config; if (!C.backendUrl) return Promise.resolve(null);
    const u = LMS.user() || {}; let token = "", gtoken = "";
    try { token = sessionStorage.getItem("amacademy.idtoken") || ""; gtoken = localStorage.getItem("amacademy.gtoken") || ""; } catch (e) {}
    return fetch(C.backendUrl, { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ action, token, gtoken, payload, email: u.email, name: u.name, code: u.code || "" }) }).then(r => r.json()).catch(() => null);
  }

  let MARKS = null, EXTRA = [];   // MARKS: "email|session" -> { status, note, at, by }. EXTRA: sessions added by hand here (Attendance sessions tab)
  async function loadMarks() {
    const res = await post("adminAttendance", {});
    if (!res || !res.ok) return res && res.error === "unknown-action" ? "redeploy" : "error";
    MARKS = {}; EXTRA = (res.sessions || []).map(x => ({ ...x, when: /[+Z]/.test(x.when.slice(16)) ? x.when : x.when + "+08:00", manual: true }));
    res.rows.slice().sort((a, b) => String(a.Timestamp).localeCompare(String(b.Timestamp))).forEach(r => {
      MARKS[String(r.Email).toLowerCase() + "|" + r["Session ID"]] = { status: String(r.Status || ""), note: String(r.Note || "").replace(/^'/, ""), at: r.Timestamp, by: r.By };
    });
    return "ok";
  }

  function mount(el, ctx) {
    if (!document.getElementById("att-css")) { const st = document.createElement("style"); st.id = "att-css"; st.textContent = css; document.head.appendChild(st); }
    const nameOf = ctx.nameOf || (e => e);
    let sessions = [], side = false;
    if (!ctx._settings) { ctx._settings = true; LMS.loadSettings().then(() => draw()).catch(() => {}); }   // hidden sessions (attHide.*)
    const people = [...new Set(ctx.people.map(e => String(e).toLowerCase()))].sort((a, b) => nameOf(a).localeCompare(nameOf(b)));
    if (!people.length) { el.innerHTML = '<p class="muted">No onboardees in this batch.</p>'; return; }
    const draw = () => {
      if (!MARKS) { el.innerHTML = '<p class="muted">Loading attendance…</p>'; return; }
      const allS = ctx.sessions.concat(EXTRA.filter(x => x.batch === ctx.batch)).sort((a, b) => new Date(a.when) - new Date(b.when));
      sessions = allS.filter(s => !hidden(s.id));
      const nHid = allS.length - sessions.length;
      const addBtn = `<div style="margin:0 0 10px;display:flex;gap:8px;align-items:center;flex-wrap:wrap"><button class="btn sm" id="attadd">+ Add a session</button><button class="btn sm" id="attside" aria-expanded="${side}">${side ? "Hide" : "Show"} sessions list (${allS.length}${nHid ? ", " + nHid + " hidden" : ""})</button><span class="small muted">Add: for sessions not on the calendar (trainers only). List: choose which sessions show in this tracker.</span></div><div id="attform"></div>`;
      const sideHtml = !side ? "" : `<aside class="att-side"><h4>Sessions for batch ${esc(ctx.batch)}</h4><div class="small muted" style="margin-bottom:6px">Switch off to hide a session from the attendance tracker only. It still shows on the dashboard and in the lists below.</div>
        ${allS.map(s => { const on = !hidden(s.id); return `<div class="row ${on ? "" : "off"}"><label class="sw" title="${on ? "Shown" : "Hidden"} in the attendance tracker"><input type="checkbox" data-hide="${esc(s.id)}" ${on ? "checked" : ""}><i></i></label><div><b>${esc(s.title)}</b><div class="src">${esc(new Date(s.when).toLocaleString("en-PH", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }))} · ${s.manual ? "Added here" : s.cal ? "Google Calendar" : "Hub list (modules.js)"}</div></div></div>`; }).join("") || '<p class="muted">No sessions.</p>'}</aside>`;
      const wrap = inner => `<div class="att-wrap"><div class="att-main">${inner}</div>${sideHtml}</div>`;
      if (!sessions.length) { el.innerHTML = addBtn + wrap(`<p class="muted">${allS.length ? "Every session is hidden from the tracker (Show sessions list to switch them back on)." : "No sessions for this batch yet."}</p>`); wireAdd(); wireSide(); return; }
      const m = (e, s) => MARKS[e + "|" + s.id] || { status: "", note: "" };
      const cnt = s => { const n = { present: 0, tardy: 0, absent: 0, leave: 0 }; people.forEach(e => { const x = m(e, s).status; if (n[x] != null) n[x]++; }); return n; };
      const day = s => new Date(s.when).toLocaleDateString("en-PH", { month: "short", day: "numeric" }) + ", " + new Date(s.when).toLocaleTimeString("en-PH", { hour: "numeric", minute: "2-digit" });
      el.innerHTML = addBtn + wrap(`<div class="att-lg"><span><b style="color:var(--green)">✓</b> Present</span><span><b style="color:#8A6400;background:#FFF1C2;padding:0 4px;border-radius:4px">✓T</b> Tardy (counts as present)</span><span><b style="color:var(--coral)">✗</b> Absent</span><span><b style="color:#3B5BA9">L</b> On leave</span><span>• = has a note (hover to read, click to edit)</span><span id="attmsg"></span></div>
        <div class="att"><table><thead><tr><th class="nm">Onboardee</th>${sessions.map((s, i) => { const n = cnt(s);
          return `<th title="${esc(s.title)}">${esc(s.title.length > 40 ? s.title.slice(0, 38) + "…" : s.title)}<span class="sd">${esc(day(s))}</span><span class="cnt" title="Present (incl. tardy) · Tardy · Absent · On leave">✓${n.present + n.tardy}${n.tardy ? " (T" + n.tardy + ")" : ""} ✗${n.absent} L${n.leave}</span>${s.manual ? `<span class="sd">Added here <button class="all" data-rm="${i}" title="Remove this session (marks stay in the Sheet)" style="margin:0;padding:0 6px">×</button></span>` : ""}<br><button class="all" data-all="${i}" title="Mark everyone without a mark as Present">All present</button></th>`; }).join("")}</tr></thead>
        <tbody>${people.map((e, pi) => `<tr><td class="nm"><b>${esc(nameOf(e))}</b><div class="small muted">${esc(e)}</div></td>${sessions.map((s, si) => { const x = m(e, s), st = ST[x.status];
          const tip = (st ? st.t : "No mark yet") + (x.note ? "\nNote: " + x.note : "") + (x.by ? "\nBy " + x.by : "");
          return `<td><button class="ab ${st ? st.c : ""} ${x.note ? "hn" : ""}" data-c="${pi}|${si}" title="${esc(tip)}" aria-label="${esc(nameOf(e) + ", " + s.title + ": " + tip)}">${st ? st.i : ""}</button></td>`; }).join("")}</tr>`).join("")}</tbody></table></div>`);
      el.querySelectorAll("[data-all]").forEach(b => b.onclick = () => { const s = sessions[+b.dataset.all];
        const todo = people.filter(e => !m(e, s).status);
        if (!todo.length) { msg("Everyone already has a mark for this session."); return; }
        save(todo.map(e => ({ e, s, status: "present", note: m(e, s).note }))); });
      el.querySelectorAll("[data-rm]").forEach(b => b.onclick = async () => { const s = sessions[+b.dataset.rm];
        if (!confirm(`Remove "${s.title}" from the tracker? Its marks stay in the Sheet.`)) return;
        msg("Removing…"); const r = await post("removeAttSession", { id: s.id });
        if (r && r.ok) { EXTRA = EXTRA.filter(x => x.id !== s.id); draw(); } else msg("Couldn't remove. Try again."); });
      wireAdd(); wireSide();
      el.querySelectorAll("[data-c]").forEach(b => b.onclick = ev => { ev.stopPropagation(); const [pi, si] = b.dataset.c.split("|").map(Number); pop(b, people[pi], sessions[si]); });
    };
    function wireSide() {
      const t = document.getElementById("attside"); if (t) t.onclick = () => { side = !side; draw(); };
      el.querySelectorAll("[data-hide]").forEach(cb => cb.onchange = async () => { const id = cb.dataset.hide, on = cb.checked;
        cb.disabled = true; msg("Saving…");
        const r = await LMS.setSetting("attHide." + id, on ? "off" : "on").catch(() => null);
        if (r && r.ok) { draw(); msg(on ? "Shown in the tracker." : "Hidden from the tracker."); }
        else { cb.checked = !on; cb.disabled = false; msg("Couldn't save. Try again."); } });
    }
    function wireAdd() {
      const b = document.getElementById("attadd"); if (!b) return;
      b.onclick = () => { const f = document.getElementById("attform"); if (f.innerHTML) { f.innerHTML = ""; return; }
        f.innerHTML = `<div style="display:flex;gap:8px;flex-wrap:wrap;align-items:end;margin-top:10px;padding:12px;border:1px solid var(--line);border-radius:12px">
          <label class="small">Title<br><input id="atit" style="font:inherit;padding:6px 8px;border:1px solid var(--line);border-radius:8px;width:260px" placeholder="e.g. Day 3: Coaching huddle"></label>
          <label class="small">Date and start<br><input id="awhen" type="datetime-local" style="font:inherit;padding:5px 8px;border:1px solid var(--line);border-radius:8px"></label>
          <label class="small">Minutes<br><input id="amin" type="number" min="0" value="60" style="font:inherit;padding:6px 8px;border:1px solid var(--line);border-radius:8px;width:80px"></label>
          <button class="btn sm primary" id="asave">Add</button><span class="small muted" id="amsg"></span></div>`;
        document.getElementById("asave").onclick = async () => {
          const title = document.getElementById("atit").value.trim(), when = document.getElementById("awhen").value, minutes = +document.getElementById("amin").value || 60, m = document.getElementById("amsg");
          if (!title || !when) { m.textContent = "Add a title and a date and time."; return; }
          m.textContent = "Saving…"; const r = await post("addAttSession", { batch: ctx.batch, title, when, minutes });
          if (r && r.ok) { EXTRA.push({ id: r.id, batch: ctx.batch, title, when: when + "+08:00", minutes, manual: true }); draw(); msg("Session added."); }
          else m.textContent = r && r.error === "unknown-action" ? "The Apps Script needs a New version first." : "Couldn't save. Try again."; };
        document.getElementById("atit").focus(); };
    }
    const msg = t => { const x = document.getElementById("attmsg"); if (x) x.textContent = t; };
    async function save(list) {
      const before = list.map(o => [o.e + "|" + o.s.id, MARKS[o.e + "|" + o.s.id]]);
      list.forEach(o => { MARKS[o.e + "|" + o.s.id] = { status: o.status, note: o.note || "", by: (LMS.user() || {}).email }; });
      draw(); msg("Saving…");
      const res = await post("saveAttendance", { rows: list.map(o => ({ email: o.e, name: nameOf(o.e), batch: ctx.batch, session: o.s.id, title: o.s.title, status: o.status, note: o.note || "" })) });
      if (res && res.ok) { msg("Saved."); setTimeout(() => msg(""), 2000); }
      else { before.forEach(([k, v]) => { if (v) MARKS[k] = v; else delete MARKS[k]; }); draw();
        msg(res && res.error === "unknown-action" ? "Couldn't save: the Apps Script needs a New version first." : "Couldn't save. Try again."); }
    }
    function pop(btn, e, s) {
      closePop(); const cur = MARKS[e + "|" + s.id] || { status: "", note: "" }; let pick = cur.status;
      const p = document.createElement("div"); p.className = "att-pop"; p.id = "attpop";
      p.innerHTML = `<b>${esc(nameOf(e))}</b><div class="small muted">${esc(s.title)}</div>
        <div class="opts">${Object.keys(ST).map(k => `<button data-k="${k}" class="${pick === k ? "on" : ""}">${ST[k].i} ${ST[k].t}</button>`).join("")}</div>
        <textarea id="attnote" placeholder="Note (optional)">${esc(cur.note)}</textarea>
        <div style="display:flex;gap:8px;margin-top:8px;align-items:center"><button class="btn sm primary" id="attok">Save</button><button class="btn sm" id="attclr">Clear mark</button><button class="btn sm" id="attx" style="margin-left:auto">Close</button></div>`;
      document.body.appendChild(p);
      const r = btn.getBoundingClientRect(); p.style.top = (window.scrollY + r.bottom + 6) + "px"; p.style.left = Math.max(8, Math.min(window.scrollX + r.left - 100, window.scrollX + document.documentElement.clientWidth - 266)) + "px";
      p.onclick = ev => ev.stopPropagation();
      p.querySelectorAll("[data-k]").forEach(b => b.onclick = () => { pick = pick === b.dataset.k ? "" : b.dataset.k; p.querySelectorAll("[data-k]").forEach(x => x.classList.toggle("on", x.dataset.k === pick)); });
      p.querySelector("#attok").onclick = () => { const note = p.querySelector("#attnote").value.trim(); closePop();
        if (pick === cur.status && note === cur.note) return; save([{ e, s, status: pick, note }]); };
      p.querySelector("#attclr").onclick = () => { closePop(); if (cur.status || cur.note) save([{ e, s, status: "", note: "" }]); };
      p.querySelector("#attx").onclick = closePop;
      p.querySelector("#attnote").focus();
    }
    draw();
    if (!MARKS) loadMarks().then(r => { if (r === "ok") draw(); else el.innerHTML = `<p class="muted">${r === "redeploy" ? "Attendance needs the Apps Script redeployed (New version) first." : "Couldn't load attendance from the Sheet. Try Refresh."}</p>`; });
  }
  function closePop() { const p = document.getElementById("attpop"); if (p) p.remove(); }
  document.addEventListener("click", closePop);
  document.addEventListener("keydown", e => { if (e.key === "Escape") closePop(); });
  window.Attendance = { mount, reload() { MARKS = null; } };
})();
