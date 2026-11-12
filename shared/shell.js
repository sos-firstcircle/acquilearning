/* Shared page shell: logo, icons, helpers and the sidebar. Loaded by every top-level page after lms.js. */
/* ---------- Shared sidebar (same on every top-level page) ---------- */
const LOGO = '<svg width="30" height="30" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 0 1 10 10h-7a3 3 0 0 0-3-3z" fill="#F0605D"/><path d="M22 12a10 10 0 0 1-10 10v-7a3 3 0 0 0 3-3z" fill="#2BB3A8"/><path d="M12 22A10 10 0 0 1 2 12h7a3 3 0 0 0 3 3z" fill="#F5B83D"/><path d="M2 12A10 10 0 0 1 12 2v7a3 3 0 0 0-3 3z" fill="#8FD3E0"/></svg>';
const ICON = {
  home:'<path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
  grades:'<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
  cal:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  admin:'<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/>',
  lesson:'<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 19a2 2 0 0 1 2-2h13"/>',
  sim:'<rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8M12 17v4"/>',
  exam:'<path d="M9 4h6v3H9z"/><path d="M7 5H5v16h14V5h-2"/><path d="M9 13l2 2 4-4"/>',
  book:'<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M9 7h6M9 11h6"/>',
  session:'<circle cx="9" cy="9" r="3"/><circle cx="17" cy="10" r="2.5"/><path d="M3 20a6 6 0 0 1 12 0M14 20a4 4 0 0 1 7 0"/>',
  chat:'<path d="M4 5h16v11H9l-5 4z"/>',
  check:'<path d="M5 12l5 5 9-10"/>'
};
const ico = (k,s=18) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICON[k]}</svg>`;
const esc = s => String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));

function renderSide(active){
  const u = LMS.user(), C = LMS.config;
  const link = (href,icon,label,key,ext,badge) => `<li><a href="${href}" ${active===key?'aria-current="page"':""} ${ext?'target="_blank" rel="noopener"':""}>${ico(icon)}${label}${badge?`<span class="nav-badge">${badge}</span>`:""}</a></li>`;
  document.getElementById("side").innerHTML = `
    <div class="brand">${LOGO}<div><b>${esc(C.appName)}</b><small>${esc(C.company)}</small></div></div>
    <ul class="nav">
      ${LMS.isAdmin() ? `
      <li class="nav-label">Learning</li>
      ${link("dashboard.html","home","Dashboard (New Hires)","dashboard")}
      ${link("dashboard.html?view=general","home","Dashboard (General)","general")}
      ${C.calendar.link ? link(C.calendar.link,"cal","Training calendar","cal",true) : ""}
      ${link("library.html","book","Library","library")}
      ${link("department.html","session","Department","department")}
      ${link("chatbot.html","chat","Chatbot (pilot)","chatbot")}
      <li class="nav-label">Trainers</li>
      ${link("grades.html","grades","Grades","grades")}${link("sessions.html","cal","Sessions","sessions")}${link("exams.html","exam","Exams","exams")}${link("settings.html","admin","Settings","settings")}` : `
      ${link("dashboard.html","home","Dashboard","dashboard")}
      ${C.calendar.link ? link(C.calendar.link,"cal","Training calendar","cal",true) : ""}
      ${link("grades.html","grades","Grades","grades")}
      ${LMS.isExisting() ? link("library.html","book","Library","library") : ""}
      ${link("department.html","session","Department","department")}`}
    </ul>
    <div class="side-foot"><span class="av">${esc(LMS.initials(u.name))}</span><div><b>${esc(u.name)}</b>${LMS.batchOf(u.email) ? `<small style="display:block;color:#8FB0B6;font-size:11px;line-height:1.3">Batch ${esc(LMS.batchOf(u.email))}</small>` : ""}<button id="signOut">Sign out</button></div></div>`;
  document.getElementById("signOut").onclick = () => LMS.signOut();
  if (C.demo && document.getElementById("strip")) document.getElementById("strip").innerHTML = `<div class="strip">Demo mode: you're signed in as ${esc(u.name)} and progress is saved in this browser only. <a href="#" id="resetDemo">Reset demo progress</a></div>`;
  const r = document.getElementById("resetDemo"); if (r) r.onclick = e => { e.preventDefault(); LMS.resetDemo(); };
}
