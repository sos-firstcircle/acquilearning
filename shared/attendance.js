/* Attendance tracker (admins only, Sessions page). One batch at a time: people down the side, sessions across the top.
   Each cell: Present / Absent / On leave (or blank), plus an optional note (shown on hover). "All present" on a session marks
   everyone who has no mark yet as present; change anyone after that. Saved to the Sheet's "Attendance" tab (Code.gs saveAttendance);
   the latest row per person + session wins.
   Attendance.mount(el, { batch, sessions:[{ id, title, when }], people:[email], nameOf }) */
(function () {
  const ST = { present: { t: "Present", i: "✓", c: "a-p" }, absent: { t: "Absent", i: "✗", c: "a-a" }, leave: { t: "On leave", i: "L", c: "a-l" } };
  const css = `.att{overflow-x:auto;border:1px solid var(--line);border-radius:var(--r-lg);margin-bottom:8px}
    .att table{border-collapse:collapse;font-size:13px;min-width:100%}
    .att th,.att td{border-bottom:1px solid var(--line);padding:6px 8px;text-align:center;vertical-align:middle}
    .att th{font-size:12px;font-weight:600;color:var(--ink-2);min-width:96px;max-width:150px;vertical-align:bottom}
    .att th .sd{font-weight:400;color:var(--ink-3);display:block}
    .att td.nm,.att th.nm{text-align:left;white-space:nowrap;position:sticky;left:0;background:#fff;z-index:1}
    .att .ab{width:34px;height:30px;border-radius:8px;border:1px solid var(--line);background:#fff;cursor:pointer;font:inherit;font-weight:700;position:relative}
    .att .ab.a-p{background:var(--green-soft);color:var(--green);border-color:transparent}
    .att .ab.a-a{background:var(--coral-soft);color:var(--coral);border-color:transparent}
    .att .ab.a-l{background:#FFF4DC;color:#9A6A00;border-color:transparent}
    .att .ab.hn::after{content:"";position:absolute;top:3px;right:3px;width:6px;height:6px;border-radius:50%;background:var(--ink-2)}
    .att .all{font:inherit;font-size:11px;margin-top:4px;padding:2px 8px;border-radius:20px;border:1px solid var(--line);background:#fff;cursor:pointer}
    .att .cnt{font-weight:400;font-size:11px;color:var(--ink-3)}
    .att-pop{position:absolute;z-index:50;background:#fff;border:1px solid var(--line);border-radius:12px;box-shadow:0 6px 24px rgba(0,0,0,.12);padding:12px;width:250px;font-size:13px}
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

  let MARKS = null;   // "email|session" -> { status, note, at, by }
  async function loadMarks() {
    const res = await post("adminAttendance", {});
    if (!res || !res.ok) return res && res.error === "unknown-action" ? "redeploy" : "error";
    MARKS = {};
    res.rows.slice().sort((a, b) => String(a.Timestamp).localeCompare(String(b.Timestamp))).forEach(r => {
      MARKS[String(r.Email).toLowerCase() + "|" + r["Session ID"]] = { status: String(r.Status || ""), note: String(r.Note || "").replace(/^'/, ""), at: r.Timestamp, by: r.By };
    });
    return "ok";
  }

  function mount(el, ctx) {
    if (!document.getElementById("att-css")) { const st = document.createElement("style"); st.id = "att-css"; st.textContent = css; document.head.appendChild(st); }
    const nameOf = ctx.nameOf || (e => e);
    const sessions = ctx.sessions.slice().sort((a, b) => new Date(a.when) - new Date(b.when));
    const people = [...new Set(ctx.people.map(e => String(e).toLowerCase()))].sort((a, b) => nameOf(a).localeCompare(nameOf(b)));
    if (!sessions.length) { el.innerHTML = '<p class="muted">No sessions for this batch yet.</p>'; return; }
    if (!people.length) { el.innerHTML = '<p class="muted">No onboardees in this batch.</p>'; return; }
    const draw = () => {
      if (!MARKS) { el.innerHTML = '<p class="muted">Loading attendance…</p>'; return; }
      const m = (e, s) => MARKS[e + "|" + s.id] || { status: "", note: "" };
      const cnt = s => { const n = { present: 0, absent: 0, leave: 0 }; people.forEach(e => { const x = m(e, s).status; if (n[x] != null) n[x]++; }); return n; };
      const day = s => new Date(s.when).toLocaleDateString("en-PH", { month: "short", day: "numeric" }) + ", " + new Date(s.when).toLocaleTimeString("en-PH", { hour: "numeric", minute: "2-digit" });
      el.innerHTML = `<div class="att-lg"><span><b style="color:var(--green)">✓</b> Present</span><span><b style="color:var(--coral)">✗</b> Absent</span><span><b style="color:#9A6A00">L</b> On leave</span><span>• = has a note (hover to read, click to edit)</span><span id="attmsg"></span></div>
        <div class="att"><table><thead><tr><th class="nm">Onboardee</th>${sessions.map((s, i) => { const n = cnt(s);
          return `<th title="${esc(s.title)}">${esc(s.title.length > 40 ? s.title.slice(0, 38) + "…" : s.title)}<span class="sd">${esc(day(s))}</span><span class="cnt">✓${n.present} ✗${n.absent} L${n.leave}</span><br><button class="all" data-all="${i}" title="Mark everyone without a mark as Present">All present</button></th>`; }).join("")}</tr></thead>
        <tbody>${people.map((e, pi) => `<tr><td class="nm"><b>${esc(nameOf(e))}</b><div class="small muted">${esc(e)}</div></td>${sessions.map((s, si) => { const x = m(e, s), st = ST[x.status];
          const tip = (st ? st.t : "No mark yet") + (x.note ? "\nNote: " + x.note : "") + (x.by ? "\nBy " + x.by : "");
          return `<td><button class="ab ${st ? st.c : ""} ${x.note ? "hn" : ""}" data-c="${pi}|${si}" title="${esc(tip)}" aria-label="${esc(nameOf(e) + ", " + s.title + ": " + tip)}">${st ? st.i : ""}</button></td>`; }).join("")}</tr>`).join("")}</tbody></table></div>`;
      el.querySelectorAll("[data-all]").forEach(b => b.onclick = () => { const s = sessions[+b.dataset.all];
        const todo = people.filter(e => !m(e, s).status);
        if (!todo.length) { msg("Everyone already has a mark for this session."); return; }
        save(todo.map(e => ({ e, s, status: "present", note: m(e, s).note }))); });
      el.querySelectorAll("[data-c]").forEach(b => b.onclick = ev => { ev.stopPropagation(); const [pi, si] = b.dataset.c.split("|").map(Number); pop(b, people[pi], sessions[si]); });
    };
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
