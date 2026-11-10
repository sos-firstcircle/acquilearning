/* =========================================================
   First Circle Acquisition Learning Hub — lms.js
   Loaded by every page. Handles who's signed in and saving progress.

   RIGHT NOW: demo mode. Progress is saved in this browser only,
   so you can test everything offline or on GitHub Pages.

   LATER: fill in googleClientId + backendUrl (Apps Script) and set
   demo:false. Pages don't need to change — they keep calling
   LMS.complete() / LMS.saveResult() exactly the same way.
   ========================================================= */

/* TEMPORARY email login: load the access list that sits next to this file.
   To remove the stopgap, delete this line and shared/roster.js. */
try { document.write('<script src="' + document.currentScript.src.replace(/lms\.js(\?.*)?$/, "roster.js") + '"><\/script>'); } catch(e){}

window.LMS_CONFIG = {
  appName: "Acquisition Learning Hub",
  company: "First Circle",
  programDays: 10,

  demo: false,                        // true = fake demo user, progress in this browser only
  emailLogin: true,                   // TEMPORARY: sign in by typing an email on the list in shared/roster.js. Set false once Google sign-in is live.
  demoUser: { name: "Juan dela Cruz", email: "juan.delacruz@firstcircle.com", startDate: "2026-10-19" },

  googleClientId: "",                 // from Google Cloud (step 4 of the build)
  allowedDomain: "firstcircle.com",    // only these Google accounts can sign in
  backendUrl: "https://script.google.com/macros/s/AKfycbxwD5hJK3xUM2YhMggINVN9j6n__9nFzdE1XM_U8yt3wq2DxJJa68NTtCW4oZpLJqZ0hA/exec",                     // Apps Script web app URL (step 4)
  // Catch-up: onboardees in these batches get a "Mark day done" button on the listed days
  // (for people who did those days before this site existed). Delete a line to turn it off.
  // Batches allowed to retake exams. Everyone else gets one attempt per exam.
  multiAttempt: ["000001", "000002"],
  noReview: ["000002"],               // batches that can retake but cannot reopen their last answers/result
  catchUp: {},                        // e.g. { "101926": [1, 2, 3] }
  adminEmails: [],                    // who can open admin.html, e.g. ["tm.name@firstcircle.com"]

  calendar: {
    // Paste your TL's shared Google Calendar here (Settings → Integrate calendar → "Embed code" src link).
    embedSrc: "",
    // A link that opens the training calendar in Google Calendar.
    link: ""
  }
};

(function(){
  const C = window.LMS_CONFIG;
  const KEY = "amacademy";

  function read(k, fallback){ try { const v = localStorage.getItem(`${KEY}.${k}`); return v ? JSON.parse(v) : fallback; } catch(e){ return fallback; } }
  function write(k, v){ try { localStorage.setItem(`${KEY}.${k}`, JSON.stringify(v)); } catch(e){} }

  function currentUser(){
    if (C.demo) return read("user", null) || { ...C.demoUser };
    return read("user", null);          // set by index.html after Google sign-in
  }
  function storedUser(){ return read("user", null); }
  /* Read lazily: roster.js loads just after this file. Returns { admins, learners, batches }. */
  const roster = () => { const r = window.LMS_ROSTER || {}, batches = r.batches || {};
    return { admins: r.admins || [], batches, learners: [].concat(...Object.values(batches)) }; };
  function batchOf(email){ const e = String(email||"").trim().toLowerCase(), b = roster().batches;
    return Object.keys(b).find(k => lc(b[k]).includes(e)) || ""; }
  const lc = a => (a||[]).map(e => String(e).trim().toLowerCase());
  function isCompanyEmail(email){
    const d = String(C.allowedDomain||"").toLowerCase();
    return !!email && String(email).toLowerCase().endsWith("@"+d);
  }
  /* Temporary email login: must be on the roster. Google mode: any company email. */
  function isAllowed(email){
    if (!isCompanyEmail(email)) return false;
    if (!C.emailLogin) return true;
    const e = String(email).trim().toLowerCase();
    return lc(roster().admins).includes(e) || lc(roster().learners).includes(e);
  }
  /* Decode the payload of a Google ID token (for display only; the backend does the real check). */
  function decodeJwt(t){
    try { const b = t.split(".")[1].replace(/-/g,"+").replace(/_/g,"/");
      return JSON.parse(decodeURIComponent(atob(b).split("").map(c=>"%"+c.charCodeAt(0).toString(16).padStart(2,"0")).join(""))); }
    catch(e){ return null; }
  }
  /* Send an event to the Apps Script backend (which writes to the Google Sheet). No-op in demo mode. */
  /* Talk to the Apps Script. Google's script server is usually quick (2-4s) but sometimes stalls, so:
     - every call gives up after a timeout and returns null (pages show an error instead of waiting forever);
     - reads (opts.retry) are "hedged": if no answer after 6s a second copy is sent alongside (and again at 14s),
       and the first good answer wins. Writes are sent once, so nothing is recorded twice. */
  function send(action, payload, opts){
    if (C.demo || !C.backendUrl) return Promise.resolve(null);
    opts = opts || {};
    const body = () => { let token = ""; try { token = sessionStorage.getItem(`${KEY}.idtoken`) || ""; } catch(e){}
      return JSON.stringify({ action, token, payload, email: (currentUser()||{}).email, name: (currentUser()||{}).name }); };   // email/name are used only in the temporary email-list mode
    const once = ms => { const ctl = new AbortController(), t = setTimeout(() => ctl.abort(), ms);
      return fetch(C.backendUrl, { method:"POST", headers:{ "Content-Type":"text/plain;charset=utf-8" }, body: body(), signal: ctl.signal, keepalive: true })   // text/plain avoids a CORS preflight, which Apps Script can't answer
        .then(r => r.json()).then(j => { clearTimeout(t); return j; }).catch(() => { clearTimeout(t); return null; }); };
    if (!opts.retry) return once(opts.timeout || 30000);
    return new Promise(resolve => {
      let finished = false, failed = 0; const delays = [0, 6000, 14000];
      const fin = v => { if (!finished) { finished = true; resolve(v); } };
      delays.forEach(d => setTimeout(() => { if (finished) return;
        once(25000).then(r => { if (r) fin(r); else if (++failed === delays.length) fin(null); }); }, d));
      setTimeout(() => fin(null), 34000);
    });
  }

  /* Progress lives in the Google Sheet (so it follows the person to any browser). The browser copy is just a cache.
     sync() loads it and merges it in; LMS.ready resolves (to true if anything changed) when that's done. */
  function sync(){
    if (C.demo || !C.backendUrl || !currentUser()) return Promise.resolve(false);
    const email = currentUser().email;
    if (Date.now() - read("lastsync." + email, 0) < 20000) return Promise.resolve(false);   // synced a moment ago (another page): use the saved copy
    return send("myProgress", {}, { retry:true }).then(res => {
      if (!res || !res.ok) return false;
      write("lastsync." + email, Date.now());
      const key = progressKey(), local = read(key, {}), merged = {}, now = Date.now();
      (res.done || []).forEach(id => { merged[id] = { ...(local[id] || {}), status:"done", updated:(local[id] && local[id].updated) || 0 }; });
      Object.entries(res.results || {}).forEach(([id, r]) => { merged[id] = r; });
      Object.entries(local).forEach(([id, r]) => { if (!merged[id] && now - (r.updated || 0) < 60000) merged[id] = r; });   // very recent local change the Sheet may not have yet
      const changed = JSON.stringify(merged) !== JSON.stringify(local);
      write(key, merged);
      return changed;
    }).catch(() => false);
  }
  /* Preview mode: an admin opening an exam with ?preview=1 can take it for real but nothing is saved or sent.
     The page still gets its result back, so the score shows at the end. */
  function isPreview(){ try { return new URLSearchParams(location.search).get("preview") === "1" && window.LMS.isAdmin(); } catch(e){ return false; } }
  /* "Fake security" for admins: after signing in they must type a password before the page shows.
     NOT real protection (the site is public and this runs in the browser); it only stops casual poking.
     The repo keeps a SHA-256 hash, not the password itself. To change it: replace ADMIN_GATE_HASH with the hash of the new password. */
  const ADMIN_GATE_HASH = "131d35aeef06649ddae6b8e4e822911b17a204b6f8b70a96970a32c3ac1b899f";
  function adminGate(){
    try {
      const u = currentUser();
      if (!u || C.demo || !window.LMS.isAdmin()) return;
      if (sessionStorage.getItem(`${KEY}.adminok`) === u.email.toLowerCase()) return;
      const box = document.createElement("div");
      box.style.cssText = "position:fixed;inset:0;z-index:99999;background:#0F2A2E;display:flex;align-items:center;justify-content:center;font-family:system-ui,sans-serif";
      box.innerHTML = '<form style="background:#fff;border-radius:16px;padding:28px;width:340px;max-width:92vw;box-shadow:0 14px 50px rgba(0,0,0,.4)"><h2 style="margin:0 0 6px;font-size:20px">Trainer access</h2><p style="margin:0 0 16px;color:#5B6B6E;font-size:14px">Enter the trainer password to continue.</p><input type="password" autocomplete="off" placeholder="Password" style="width:100%;box-sizing:border-box;padding:11px 12px;border:1px solid #CFD9DB;border-radius:10px;font:inherit;margin-bottom:10px"><div class="e" style="color:#b3243a;font-size:13px;min-height:18px;margin-bottom:8px"></div><button type="submit" style="width:100%;padding:11px;border:0;border-radius:10px;background:#0E6F6A;color:#fff;font:inherit;font-weight:700;cursor:pointer">Continue</button><button type="button" class="so" style="width:100%;margin-top:8px;padding:9px;border:0;background:none;color:#5B6B6E;font:inherit;cursor:pointer">Sign out</button></form>';
      const mount = () => { document.body.appendChild(box); box.querySelector("input").focus(); };
      if (document.body) mount(); else document.addEventListener("DOMContentLoaded", mount);
      box.querySelector(".so").onclick = () => window.LMS.signOut();
      box.querySelector("form").onsubmit = async ev => {
        ev.preventDefault();
        const pw = box.querySelector("input").value;
        const h = Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(pw)))).map(b => b.toString(16).padStart(2, "0")).join("");
        if (h === ADMIN_GATE_HASH) { try { sessionStorage.setItem(`${KEY}.adminok`, u.email.toLowerCase()); } catch(e){} box.remove(); }
        else { box.querySelector(".e").textContent = "Wrong password."; box.querySelector("input").select(); }
      };
    } catch(e){}
  }
  function progressKey(){ const u = currentUser(); return `progress.${u ? u.email : "anon"}`; }

  const LMS = {
    config: C,

    /** Who's signed in. Returns null if nobody (non-demo). */
    user: currentUser,

    /** The saved user, or null. Unlike user(), never falls back to the demo user. */
    storedUser,

    /** The access list: { admins, learners, batches }, and which batch an email is in ("" for none). */
    roster, batchOf,

    /** May the signed-in person retake exams? (their batch is listed in multiAttempt) */
    canRetake(){ const u = currentUser(); return !!u && (C.multiAttempt || []).includes(batchOf(u.email)); },

    /** True if this email belongs to the allowed company domain. */
    isCompanyEmail,

    /** True if this email may sign in (company domain, and on the roster while emailLogin is on). */
    isAllowed,

    /**
     * Sign in with a Google ID token (the "credential" Google hands back).
     * Rejects if the account isn't on the company domain. The backend repeats the
     * check on its side, because anything in the browser can be bypassed.
     */
    async signInWithGoogle(credential){
      const claims = decodeJwt(credential);
      if (!claims || !isCompanyEmail(claims.email)) throw new Error("not-company");
      if (C.backendUrl) {
        try { sessionStorage.setItem(`${KEY}.idtoken`, credential); } catch(e){}
        const res = await send("verify", {});
        if (!res || !res.ok) { try { sessionStorage.removeItem(`${KEY}.idtoken`); } catch(e){} throw new Error(res && res.error || "backend"); }
      }
      write("user", { name: claims.name || claims.email, email: claims.email.toLowerCase(), picture: claims.picture || "", startDate: C.demoUser.startDate });
    },

    /** Temporary sign-in by typed email (stopgap until Google sign-in is live). */
    signInDemo(email){
      email = String(email).trim();
      if (!isAllowed(email)) throw new Error(isCompanyEmail(email) ? "not-on-list" : "not-company");
      const local = String(email).split("@")[0];
      const name = local.split(/[._-]/).map(w=>w.charAt(0).toUpperCase()+w.slice(1)).join(" ");
      write("user", { name, email:String(email).toLowerCase(), batch: batchOf(email), startDate: C.demoUser.startDate });
    },

    /** Send people to the sign-in page if they're not signed in. */
    requireSignIn(){
      if (!currentUser() || (!C.demo && !isAllowed(currentUser().email))){ location.href = (location.pathname.includes("/lessons/")||location.pathname.includes("/sims/")) ? "../index.html" : "index.html"; return false; }
      adminGate();
      return true;
    },

    /** May the signed-in person reopen an earlier attempt's result? (false for batches listed in noReview) */
    /** Last attempt's graded rows, kept in this browser only so "Review your answers" can show them again. */
    saveReview(id, g){ try { write("review." + ((currentUser()||{}).email||"") + "." + id, g); } catch(e){} },
    getReview(id){ return read("review." + ((currentUser()||{}).email||"") + "." + id, null); },
    canReview(){ const u = currentUser(); return !u || !(C.noReview || []).includes(batchOf(u.email)); },

    /** Existing AMs (batch "000002"): they get the simulations-and-practice dashboard instead of the 10-day path. */
    isExisting(){ const u = currentUser(); return !!u && batchOf(u.email) === "000002"; },

    isAdmin(){ const u = currentUser(); return !!u && (C.demo || [...lc(C.adminEmails), ...lc(roster().admins)].includes(u.email.toLowerCase())); },

    /** All progress for the signed-in person: { moduleId: {status, score, max, attempts, updated} } */
    progress(){ return read(progressKey(), {}); },

    /** Mark a module as opened (only if not already further along). */
    /** True when an admin is previewing an exam (?preview=1): nothing is recorded. */
    preview: isPreview,

    start(id){
      if (isPreview()) return;
      const p = LMS.progress();
      if (!p[id]) { p[id] = { status:"started", attempts:0, updated:Date.now() }; write(progressKey(), p); }
    },

    /** Mark a lesson as done (no score). */
    complete(id){
      if (isPreview()) return Promise.resolve({ status:"done" });
      const p = LMS.progress(), prev = p[id] || {};
      p[id] = { ...prev, status:"done", updated:Date.now() };
      write(progressKey(), p);
      send("complete", { id });
      return Promise.resolve(p[id]);
    },

    /** Undo a tick (task unchecked, exam submission undone). */
    undo(id){
      if (isPreview()) return Promise.resolve(null);
      const p = LMS.progress();
      if (p[id] && !p[id].max) { delete p[id]; write(progressKey(), p); send("undo", { id }); }
      return Promise.resolve(null);
    },

    /** Save a scored attempt (quiz, sim, exam). Keeps every attempt and the best score. */
    saveResult(id, result){
      const p = LMS.progress(), prev = p[id] || { attempts:0, history:[] };
      const attempt = { score:result.score, max:result.max, passed:!!result.passed, at:Date.now() };
      const history = [...(prev.history||[]), attempt];
      const best = history.reduce((a,b)=> (b.score/b.max) > (a.score/a.max) ? b : a);
      const rec = { status:"done", score:best.score, max:best.max, passed:best.passed, attempts:history.length, history, updated:Date.now() };
      if (isPreview()) return Promise.resolve(rec);                 // admin preview: not recorded
      p[id] = rec;
      write(progressKey(), p);
      send("saveResult", { id, score:result.score, max:result.max, passed:!!result.passed, attempt:history.length, details:result.details || "", breakdown:result.breakdown || "", notes:result.notes || "" });
      return Promise.resolve(p[id]);
    },

    /** Admin only: fetch all grades and progress from the Sheet. Needs the admin passcode set in the Apps Script. */
    /** Signed-in person's own grades (rows of the Grades tab for their email). */
    myGrades(){ return send("myGrades", {}, { retry:true }); },

    /** Site settings kept in the Sheet's Settings tab (e.g. "trainer"). setting() reads the cached copy; loadSettings() refreshes it. */
    setting(key, fallback){ const v = (read("settings", {}) || {})[key]; return v ? v : fallback; },
    loadSettings(){ return send("getSettings", {}, { retry:true }).then(res => { if (res && res.ok) write("settings", res.settings || {}); return res && res.ok ? res.settings : null; }); },
    setSetting(key, value){ return send("setSetting", { key, value }).then(res => { if (res && res.ok) write("settings", { ...(read("settings", {}) || {}), [key]: value }); return res; }); },

    /** Yes/No replies to live sessions: { sessionId: { answer:"yes"|"no", note, informed, at } }. The Sheet's Sessions tab is the source of truth; the browser copy is a cache. */
    rsvps(){ return read("rsvp." + ((currentUser()||{}).email||""), {}); },
    saveRsvp(id, answer, note, informed){
      const all = LMS.rsvps(); all[id] = { answer, note: note || "", informed: !!informed, at: Date.now() };
      write("rsvp." + ((currentUser()||{}).email||""), all);
      return send("saveRsvp", { id, answer, note: note || "", informed: !!informed });
    },
    syncRsvps(){
      if (C.demo || !C.backendUrl || !currentUser()) return Promise.resolve(false);
      return send("myRsvps", {}, { retry:true }).then(res => {
        if (!res || !res.ok) return false;
        const local = LMS.rsvps(), merged = { ...(res.rsvps || {}) }, now = Date.now();
        Object.entries(local).forEach(([id, r]) => { if (now - (r.at || 0) < 60000) merged[id] = r; });   // very recent local reply the Sheet may not have yet
        const changed = JSON.stringify(merged) !== JSON.stringify(local);
        write("rsvp." + currentUser().email, merged);
        return changed;
      }).catch(() => false);
    },
    /** Admin only: every reply (all rows of the Sessions tab). */
    adminRsvps(){ return send("adminRsvps", {}, { retry:true }); },

    adminData(passcode){ return send("adminData", { passcode }, { retry:true }); },

    signOut(){
      try { localStorage.removeItem(`${KEY}.user`); sessionStorage.removeItem(`${KEY}.idtoken`); } catch(e){}
      location.href = "index.html";
    },

    /** Reset demo progress (handy while testing). */
    resetDemo(){ try { localStorage.removeItem(`${KEY}.${progressKey()}`); } catch(e){} location.reload(); },

    initials(name){ return String(name||"").trim().split(/\s+/).map(w=>w[0]||"").join("").slice(0,2).toUpperCase(); },
    firstName(name){ return String(name||"").trim().split(/\s+/)[0] || ""; }
  };

  window.LMS = LMS;
  LMS.sync = sync;
  document.addEventListener("DOMContentLoaded", () => {      // banner on preview pages
    if (!isPreview()) return;
    const b = document.createElement("div");
    b.style.cssText = "position:sticky;top:0;z-index:60;background:#FFF4DC;color:#6B4E00;font:600 13px/1.4 system-ui,sans-serif;padding:8px 16px;border-bottom:1px solid #F3E2B5;text-align:center";
    b.textContent = "Preview mode: nothing here is recorded. You still see your score at the end.";
    document.body.prepend(b);
  });
  LMS.settingsDone = currentUser() ? LMS.loadSettings() : Promise.resolve(null);   // trainer name etc. (cached for next time)
  LMS.syncDone = sync();    // resolves (true if anything changed) whenever the Sheet answers, however long it takes
  LMS.ready = Promise.race([LMS.syncDone, new Promise(r => setTimeout(() => r(false), 8000))]);   // pages that must wait on the Sheet wait at most 8s
})();
