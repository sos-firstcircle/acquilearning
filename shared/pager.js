/* Compact tables: "Show 10 / 25 / 50 / All rows · 1–10 of 84  ‹ ›" under a table.
   const pg = Pager.page("summary", rowsArray, defaultSize);  -> { rows: the visible slice, bar: controls html }
   Put pg.bar under the table, then call Pager.wire(containerEl, redraw) once the html is on the page.
   The page size and position are kept per key until the default size changes (e.g. another batch is picked). */
(function(){
  const st = {};
  const css = document.createElement("style");
  css.textContent = ".pager{display:flex;gap:8px;align-items:center;flex-wrap:wrap;font-size:13px;color:var(--ink-2,#4a6266);margin:8px 0 0}" +
    ".pager select{font:inherit;padding:3px 6px;border:1px solid var(--line,#dde5e6);border-radius:8px;background:#fff}" +
    ".pager button{font:inherit;min-width:30px;padding:3px 8px;border:1px solid var(--line,#dde5e6);border-radius:8px;background:#fff;cursor:pointer}" +
    ".pager button:disabled{opacity:.4;cursor:default}";
  document.head.appendChild(css);
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[c]));
  window.Pager = {
    page(key, rows, def){
      def = Math.max(1, Number(def) || 10);
      let s = st[key];
      if (!s || s.def !== def) s = st[key] = { def, size: def, p: 0 };
      const n = rows.length, size = s.size === "all" ? Math.max(n, 1) : s.size, pages = Math.max(1, Math.ceil(n / size));
      if (s.p >= pages) s.p = pages - 1;
      if (s.p < 0) s.p = 0;
      const from = s.p * size, vis = rows.slice(from, from + size);
      if (n <= 10 && def <= 10 && s.size !== "all" && s.size >= n) return { rows: vis, bar: n ? `<div class="pager">${n} row${n > 1 ? "s" : ""}</div>` : "" };
      const opts = [...new Set([10, 25, 50, 100, def])].sort((a, b) => a - b);
      const bar = `<div class="pager" data-pkey="${esc(key)}">Show <select data-psize aria-label="Rows per page">${opts.map(o => `<option value="${o}" ${o === s.size ? "selected" : ""}>${o}</option>`).join("")}<option value="all" ${s.size === "all" ? "selected" : ""}>All</option></select> rows
        <span>${n ? (from + 1) + "–" + Math.min(n, from + size) : 0} of ${n}</span>
        <button data-pprev aria-label="Previous rows" ${s.p ? "" : "disabled"}>‹</button><button data-pnext aria-label="Next rows" ${s.p < pages - 1 ? "" : "disabled"}>›</button></div>`;
      return { rows: vis, bar };
    },
    wire(root, redraw){
      (root || document).querySelectorAll(".pager[data-pkey]").forEach(el => {
        const s = st[el.dataset.pkey]; if (!s) return;
        el.querySelector("[data-psize]").onchange = e => { s.size = e.target.value === "all" ? "all" : Number(e.target.value); s.p = 0; redraw(); };
        el.querySelector("[data-pprev]").onclick = () => { s.p--; redraw(); };
        el.querySelector("[data-pnext]").onclick = () => { s.p++; redraw(); };
      });
    }
  };
})();
