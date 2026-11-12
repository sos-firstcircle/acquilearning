/* =========================================================
   FC Connect: new drawdown design ("DD2"), shared by sims/connect-exam.html and sims/connect-demo.html.

   Matches the updated Connect staging (Nov 2026): 2 months minimum, base interest 1.39% a month
   (Bi-weekly -0.10%, One-time +1%), processing fee fixed at 1.99%, fixed repayment date or weekday,
   receive in other currencies, View computation, full repayments schedule, early repayment calculator,
   "Confirm drawdown" then "Finish your loan setup" (contract greyed out until First Circle's review is done),
   and a redesigned "view status" page.

   Who sees it: everyone EXCEPT the old batches listed in OLD_BATCHES (batch 110926 keeps the old flow).
   Test either way with ?dd=new or ?dd=old on the page URL.

   Both pages load this file in <head> and call the DD2 hooks. It only reads the pages' own globals
   (S, esc, ico, peso, fmtD, DD_DAY, OWN_BANKS, disbLabel, parseAmt, usedCredit, stepperView, render, toast,
   logAction, fullName, COMPANY) when a function runs, never at load.
   ========================================================= */
(function(){
  const OLD_BATCHES = ["110926"];
  let batch = "";
  try { const u = LMS.user(); batch = (u && (LMS.batchOf(u.email) || u.batch)) || ""; } catch(e){}
  const q = new URLSearchParams(location.search).get("dd");
  const DD2 = window.DD2 = { on: q==="old" ? false : q==="new" ? true : !OLD_BATCHES.includes(batch) };
  if(!DD2.on) return;

  const BASE = 0.0139, BIWEEKLY_DISC = 0.0010, ONETIME_ADD = 0.01, PF = 0.0199, FX = 58.25;   // FX: invented, fixed USD to PHP rate
  const WD = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  const ord = n => n + (n%100>=11&&n%100<=13 ? "th" : ({1:"st",2:"nd",3:"rd"}[n%10]||"th"));
  const rateOf = freq => BASE + (freq==="Bi-weekly" ? -BIWEEKLY_DISC : (freq==="Bullet"||freq==="One-time") ? ONETIME_ADD : 0);
  const pct = r => (Math.round(r*10000)/100).toFixed(2) + "%";
  const freqLabel = f => f==="Bullet" ? "One-time" : f;
  const r2 = x => Math.round(x*100)/100;
  const $q = s => document.querySelector(s);
  DD2.freqLabel = freqLabel; DD2.pct = pct;
  DD2.rateOf = rateOf;

  /* ---------- computation ---------- */
  DD2.optDefault = () => ({ mode:"date", day:DD_DAY.getDate(), weekday:"Monday" });
  function addMonths(i, day){ const y=DD_DAY.getFullYear(), m=DD_DAY.getMonth()+i, last=new Date(y,m+1,0).getDate(); return new Date(y,m,Math.min(day,last)); }
  function schedule(term, freq, opt){
    opt = opt || DD2.optDefault(); const out = [];
    if(freq==="Bullet"||freq==="One-time"){ out.push(addMonths(term, DD_DAY.getDate())); return out; }
    if(freq==="Bi-weekly"){
      let first = new Date(DD_DAY); first.setDate(first.getDate()+14);
      if(opt.mode==="weekday"||opt.fixedWeekday){ first = new Date(DD_DAY); first.setDate(first.getDate()+7); while(WD[first.getDay()]!==opt.weekday) first.setDate(first.getDate()+1); }
      for(let i=0;i<term*2;i++){ const d=new Date(first); d.setDate(d.getDate()+14*i); out.push(d); }
      return out;
    }
    for(let i=1;i<=term;i++){
      if(opt.mode==="weekday"){ const d=addMonths(i, DD_DAY.getDate()); while(WD[d.getDay()]!==opt.weekday) d.setDate(d.getDate()+1); out.push(d); }
      else out.push(addMonths(i, opt.day));
    }
    return out;
  }
  DD2.calc = function(amount, term, freq, opt){
    const rate = rateOf(freq), dates = schedule(term, freq, opt), n = dates.length;
    const fee = r2(amount*PF), interest = r2(amount*rate*term), total = amount+interest, each = n?r2(total/n):0;
    return { n, fee, interest, total, each, receive:amount-fee, dates:dates.map(fmtD), rate, base:BASE };
  };
  const calcOf = d => DD2.calc(d.amount, d.term, d.freq, d.opt);
  const cadence = (c, term, freq) => freq==="Bi-weekly" ? `every 2 weeks for ${c.n} payments` : (freq==="Bullet"||freq==="One-time") ? `one time on ${c.dates[0]}` : `every month for ${term} month${term>1?"s":""}`;

  /* ---------- styles ---------- */
  const css = document.createElement("style");
  css.textContent = `
  .d2-two{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:32px;align-items:start}
  .d2-h{font-size:26px;font-weight:700;margin:0 0 4px;color:var(--ink)}
  .d2-sub{font-size:13px;color:var(--ink-2);margin:0 0 22px}
  .d2-lbl{font-size:13px;color:var(--ink-2);margin:0 0 6px}
  .d2-amt{display:flex;align-items:center;gap:6px;font-size:22px;font-weight:700;color:var(--ink);border-bottom:2px dotted #B9C4C6;width:fit-content;padding-bottom:2px;margin-bottom:12px}
  .d2-amt input{border:0;outline:0;font:inherit;width:200px;background:transparent;color:var(--ink)}
  .d2-term{font-size:19px;font-weight:700;color:var(--ink);border-bottom:2px dotted #B9C4C6;width:fit-content;margin-bottom:12px}
  .d2-two input[type=range]{width:100%;accent-color:var(--teal);margin:2px 0 10px}
  .d2-sec{margin:0 0 26px}
  .d2-chips{display:flex;gap:8px;flex-wrap:wrap}
  .d2-chip{border:1px solid var(--line);background:#fff;border-radius:999px;padding:7px 16px;font-size:13px;cursor:pointer;font-family:inherit;color:var(--ink)}
  .d2-chip.on{background:#0B5C60;border-color:#0B5C60;color:#fff;font-weight:600}
  .d2-box{background:var(--soft,#F4F7F7);border-radius:10px;padding:14px 16px;margin-top:14px}
  .d2-rad{display:flex;gap:10px;align-items:flex-start;font-size:13px;color:var(--ink-2);margin:0 0 10px;cursor:pointer;background:none;border:0;font-family:inherit;text-align:left;padding:0}
  .d2-rad i{width:16px;height:16px;border-radius:50%;border:2px solid #B9C4C6;flex:none;margin-top:1px;display:grid;place-items:center}
  .d2-rad.on i{border-color:var(--teal)} .d2-rad.on i:after{content:"";width:8px;height:8px;border-radius:50%;background:var(--teal)}
  .d2-sel{border:1px solid var(--line);border-radius:8px;padding:9px 12px;font:inherit;font-size:13px;background:#fff;min-width:170px;color:var(--ink)}
  .d2-card{border:1px solid var(--line);border-radius:14px;padding:18px 20px;background:#fff}
  .d2-hl{background:var(--soft,#F4F7F7);border-radius:10px;padding:16px;text-align:center;margin:10px 0 14px}
  .d2-hl b{display:block;font-size:24px;color:var(--ink);margin-bottom:4px}
  .d2-hl small{display:block;font-size:11px;color:var(--ink-2);margin-top:8px}
  .d2-ln{display:flex;justify-content:space-between;font-size:13px;padding:7px 0;color:var(--ink-2)}
  .d2-ln b{color:var(--ink);font-weight:600}
  .d2-ln.tot{border-top:1px solid var(--line);margin-top:6px;padding-top:12px}
  .d2-i{display:inline-grid;place-items:center;width:13px;height:13px;border:1px solid #98A6A8;border-radius:50%;font-size:9px;margin-left:4px;color:#6B7B7E;cursor:pointer;background:none;font-family:inherit;padding:0}
  .d2-tl{display:block;text-align:center;color:var(--teal);font-weight:600;font-size:13px;margin:14px auto 10px;background:none;border:0;cursor:pointer;font-family:inherit}
  .d2-wide{display:block;width:100%;border:1px solid var(--ink);border-radius:8px;background:#fff;padding:9px;font-size:12px;font-weight:600;cursor:pointer;font-family:inherit;color:var(--ink);margin:4px 0 12px}
  .d2-lk{display:flex;gap:8px;align-items:center;font-size:12px;font-weight:600;color:var(--ink);background:none;border:0;cursor:pointer;font-family:inherit;padding:5px 0}
  .d2-rcv{background:linear-gradient(120deg,#FBF3EE,#DDEEEC);border-radius:14px;padding:22px 26px;display:flex;gap:18px;align-items:center;max-width:560px;margin:0 0 26px}
  .d2-rcv .coin{width:38px;height:38px;border-radius:50%;background:linear-gradient(135deg,#F7A07A,#F0506E);flex:none}
  .d2-rcv b.big{display:block;font-size:24px;margin:2px 0 6px}
  .d2-row{display:flex;gap:14px;align-items:flex-start;padding:16px 0;border-top:1px solid var(--line)}
  .d2-row:first-of-type{border-top:0}
  .d2-row .ck{width:22px;height:22px;border-radius:50%;flex:none;display:grid;place-items:center;font-size:12px;color:#fff;background:#C9D2D4;margin-top:1px}
  .d2-row .ck.ok{background:#1E9E6A}
  .d2-row .bd{flex:1;font-size:13px;color:var(--ink-2)} .d2-row .bd b{color:var(--ink);font-size:14px}
  .d2-row.off{opacity:.55} .d2-row.off .bd{color:var(--ink-2)}
  .d2-todo{border:1px solid #F1D9A8;border-radius:14px;background:#fff;overflow:hidden;margin:0 0 22px}
  .d2-todo .hd{background:#FFF4DA;padding:12px 18px;display:flex;justify-content:space-between;align-items:center;font-size:13px;font-weight:600}
  .d2-todo .bd2{padding:2px 18px}
  .d2-bar{height:10px;border-radius:6px;background:#CFEAE4;overflow:hidden;margin:10px 0 8px}.d2-bar div{height:100%;background:#1B9A8B}
  .d2-foot-r{display:flex;gap:10px;align-items:center;margin-left:auto}
  .d2-ghost{background:none;border:0;color:var(--teal);font-weight:600;font-size:13px;cursor:pointer;font-family:inherit;padding:8px 10px}
  .d2-ph{display:block;height:34px;border-radius:8px;background:#EDF1F1;margin:8px 0}
  .d2-rep{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:26px;align-items:start}
  .d2-tbl{width:100%;border-collapse:collapse;font-size:13px} .d2-tbl th,.d2-tbl td{padding:8px 6px;text-align:left;border-bottom:1px solid var(--line)} .d2-tbl th{color:var(--ink-2);font-weight:500;font-size:12px} .d2-tbl td:last-child,.d2-tbl th:last-child{text-align:right}
`;
  document.head.appendChild(css);

  /* ---------- Step 1: choose your loan ---------- */
  const availCredit = () => S.creditLimit - usedCredit();
  function openFlow(){
    S.moreOpen = false;
    const a = activeDD();
    if(a){ S.modal = {type:"dd-pending", ref:a.ref, id:a.id}; render(); return; }
    S.flow = {type:"dd", step:0, data:{amountStr:"", term:2, freq:"Monthly", opt:DD2.optDefault(), name:"", cur:"PHP", curOpen:false}, errs:{}};
    logAction("drawdown","Opened drawdown request"); render();
  }
  function effective(d){   // the repayment choices that apply to the current frequency
    const o = Object.assign({}, d.opt); if(d.freq==="Bi-weekly") o.fixedWeekday = true; return o;
  }
  function calcPanel(f){
    const d = f.data, amt = parseAmt(d.amountStr) || 0;
    if(!amt) return `<div style="text-align:center;font-size:13px;color:var(--ink-2)">You will repay</div><span class="d2-ph" style="height:78px"></span><div style="text-align:center;font-size:13px;color:var(--ink-2)">You will receive ₱ —</div>
      ${["Loan amount","Processing fee","Total interest","Total repayment"].map(t=>`<div class="d2-ln"><span>${t}</span><b>₱ —</b></div>`).join("")}`;
    const c = DD2.calc(amt, d.term, d.freq, effective(d)), usd = c.receive / FX;
    return `<div style="text-align:center;font-size:13px;color:var(--ink-2)">You will repay</div>
      <div class="d2-hl"><b>${peso(c.each)}</b>${cadence(c, d.term, d.freq)}<br>at ${pct(c.rate)} interest<small>Your first repayment starts on <b>${c.dates[0]}</b></small></div>
      <div class="d2-ln"><span>Loan amount</span><b>${peso(amt)}</b></div>
      <div class="d2-ln"><span>Processing fee</span><b>- ${peso(c.fee)}</b></div>
      <div class="d2-ln"><span>Total interest <button class="d2-i" data-act="d2-comp" aria-label="Show computation">i</button></span><b>${peso(c.interest)}</b></div>
      <div class="d2-ln tot"><span>Total repayment</span><b>${peso(c.total)}</b></div>
      <div class="d2-ln"><span>You will receive <button class="d2-i" data-act="d2-comp" aria-label="Show computation">i</button></span><b>${d.cur==="USD"&&d.curOpen?`~ $${usd.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})}`:peso(c.receive)}</b></div>
      ${d.curOpen?`<div style="text-align:right;font-size:11px;color:var(--ink-2);margin:-2px 0 6px">${d.cur==="USD"?`${peso(c.receive)}<br>`:""}1 USD = ${FX.toFixed(4)} PHP (fixed rate for this practice)</div>`:""}
      <button class="d2-tl" data-act="d2-cur">Receive in other currencies ${d.curOpen?"▴":"▾"}</button>
      ${d.curOpen?`<div style="text-align:center;margin:-4px 0 10px"><select class="d2-sel" data-d2sel="cur"><option value="PHP" ${d.cur==="PHP"?"selected":""}>PHP (Philippine peso)</option><option value="USD" ${d.cur==="USD"?"selected":""}>USD (US dollar)</option></select></div>`:""}
      <button class="d2-wide" data-act="d2-comp">View computation →</button>
      <button class="d2-lk" data-act="d2-sched">▤ View full repayments schedule</button>
      <button class="d2-lk" data-act="d2-early">⇅ Calculate making an early repayment</button>`;
  }
  function chooseBody(f){
    const d = f.data, e = f.errs || {}, avail = availCredit(), amt = parseAmt(d.amountStr) || 0;
    const sel = (key, val, opts) => `<select class="d2-sel" data-d2sel="${key}">${opts.map(o=>`<option value="${o[0]}" ${String(o[0])===String(val)?"selected":""}>${o[1]}</option>`).join("")}</select>`;
    const dayOpts = []; for(let k=-3;k<=3;k++){ const x=new Date(DD_DAY); x.setDate(x.getDate()+k); dayOpts.push([x.getDate(), ord(x.getDate())]); }
    let rep = "";
    if(d.freq==="Monthly") rep = `<div class="d2-box">
        <button class="d2-rad ${d.opt.mode==="date"?"on":""}" data-act="d2-mode" data-v="date"><i></i><span>Repay on a fixed date of the month<br>${d.opt.mode==="date"?`<span style="display:block;margin-top:8px">${sel("day",d.opt.day,dayOpts)}</span>`:""}</span></button>
        <button class="d2-rad ${d.opt.mode==="weekday"?"on":""}" data-act="d2-mode" data-v="weekday"><i></i><span>Repay on a fixed weekday each month<br>${d.opt.mode==="weekday"?`<span style="display:block;margin-top:8px">${sel("wd",d.opt.weekday,WD.slice(1).concat(WD[0]).map(w=>[w,w]))}</span>`:""}</span></button></div>`;
    else if(d.freq==="Bi-weekly") rep = `<div class="d2-box"><div class="d2-rad on" style="cursor:default"><i></i><span>Repay on a fixed weekday<br><span style="display:block;margin-top:8px">${sel("wd",d.opt.weekday,WD.slice(1).concat(WD[0]).map(w=>[w,w]))}</span></span></div></div>`;
    else { const c = DD2.calc(amt||1, d.term, "Bullet", d.opt); rep = `<div class="d2-sec" style="margin-top:14px"><div class="d2-lbl" style="font-weight:600;color:var(--ink)">Repayment date</div><div class="d2-sel" style="display:block;background:var(--soft,#F4F7F7)">▦ ${c.dates[0]}</div></div>`; }
    return `<div class="d2-two"><div><h1 class="d2-h">Choose your loan setup</h1><p class="d2-sub">Select your loan amount and repayment schedule.</p>
      <div class="d2-sec"><div class="d2-lbl">Loan amount</div>
        <div class="d2-amt"><span>₱</span><input id="d2Amt" value="${esc(d.amountStr)}" inputmode="decimal" placeholder="0.00" autocomplete="off"></div>
        <input type="range" id="d2AmtR" min="50000" max="${avail}" step="10000" value="${Math.min(Math.max(amt||50000,50000),avail)}">
        <div class="d2-lbl" id="d2Reg">Regular credit: <b style="color:var(--ink)">${peso(amt)}</b> / ${peso(avail)}</div>
        ${e.amount?`<div class="err-msg">${e.amount}</div>`:""}</div>
      <div class="d2-sec"><div class="d2-lbl">Term length</div><div class="d2-term" id="d2TermL">${d.term} months</div>
        <input type="range" id="d2Term" min="2" max="12" step="1" value="${d.term}">
        <div style="display:flex;justify-content:space-between;font-size:11px;color:var(--ink-2)"><span>2 months</span><span>12 months</span></div></div>
      <div class="d2-sec"><div class="d2-lbl" style="font-weight:600;color:var(--ink)">Repayment frequency</div>
        <div class="d2-chips">${["Monthly","Bi-weekly","Bullet"].map(x=>`<button class="d2-chip ${d.freq===x?"on":""}" data-act="d2-freq" data-v="${x}">${freqLabel(x)}</button>`).join("")}</div>${rep}</div>
      </div><div class="d2-card" id="d2Calc">${calcPanel(f)}</div></div>`;
  }

  /* ---------- Step 2: finalise loan details ---------- */
  function finaliseBody(f){
    const d = f.data, amt = parseAmt(d.amountStr), c = DD2.calc(amt, d.term, d.freq, effective(d));
    const cadWord = d.freq==="Bi-weekly" ? "bi-weekly" : (d.freq==="Bullet"?"one time":"monthly");
    return `<h1 class="d2-h">Finalise your loan details</h1><p class="d2-sub"></p>
      <div class="d2-rcv"><span class="coin"></span><div style="font-size:13px"><span>You will receive</span><b class="big">${peso(c.receive)}</b>You will repay <b>${peso(c.each)}</b> ${d.freq==="Bullet"?`one time on <b>${c.dates[0]}</b>`:`${cadWord} for ${d.term} months, starting <b>${c.dates[0]}</b>`}.<br><button class="d2-ghost" style="padding:8px 0 0" data-act="d2-sched">View repayments schedule →</button></div></div>
      <div style="max-width:560px"><div class="d2-lbl" style="font-weight:600;color:var(--ink)">Give your loan a memorable name (optional)</div>
      <input id="d2Name" class="d2-sel" style="width:260px;margin-bottom:26px" placeholder="Loan name" value="${esc(d.name||"")}">
      <div class="d2-lbl" style="font-weight:600;color:var(--ink)">Loan details</div>
      <div class="d2-ln"><span>Loan amount</span><b>${peso(amt)}</b></div>
      <div class="d2-ln"><span>Processing fee <button class="d2-i" data-act="d2-pf" aria-label="About the processing fee">i</button></span><b>- ${peso(c.fee)}</b></div>
      <div class="d2-ln"><span>Total interest</span><b>${peso(c.interest)}</b></div>
      <div class="d2-ln"><span>Total repayment</span><b>${peso(c.total)}</b></div></div>`;
  }

  /* ---------- Step 3: finish your loan setup (after Confirm drawdown) ---------- */
  const drawdownOf = f => S.drawdowns.find(x=>x.id===f.id);
  function signBlock(d){
    if(d.signed) return `<div class="d2-row"><span class="ck ok">✓</span><div class="bd"><b>Sign loan contract</b><br>Loan contract signed on Sep 29, 2026.</div></div>`;
    if(!d.reviewDone) return `<div class="d2-row off"><span class="ck">⋯</span><div class="bd"><b>Sign loan contract</b><br>The loan contract will be sent to your authorized representative(s) once the loan has been approved. They can sign the contract by clicking the link in the email or they can log into their account and sign the contract online.</div></div>`;
    return `<div class="d2-row"><span class="ck"></span><div class="bd"><b>Sign loan contract</b><br>Your loan was approved. Review and sign your loan contract.</div><button class="btn sm primary" data-act="dd-sign" data-id="${d.id}">Sign contract</button></div>`;
  }
  function repayText(d){ return d.repay || ""; }
  function setupBody(f){
    const d = drawdownOf(f), c = calcOf(d), e = f.errs || {};
    if(f.view==="disb"){
      const pick = f.draft;
      const opt = (id,t,sub) => `<button class="opt-card ${pick===id?"sel":""}" data-act="d2-pick" data-g="disb" data-v="${id}"><span class="ic"><span style="color:var(--teal)">●</span></span><span><b>${t}</b>${sub?`<small>${sub}</small>`:""}</span><span class="radio ${pick===id?"on":""}"></span></button>`;
      return `<button class="d2-ghost" style="padding-left:0" data-act="d2-cancel-sub">← Back to loan setup</button><h1 class="d2-h" style="margin-top:12px">Where should we send your funds?</h1><p class="d2-sub">Receive your disbursements instantly with a First Circle Business Account. Selecting an external bank account may take a longer wait time of 1–2 business days.</p>
        <div class="note" style="max-width:640px">ⓘ You won't be able to change your disbursement account after the loan contract is signed.</div>
        <div style="max-width:640px">${opt("payments","Payments Account","Instant transfer to your First Circle Payments Account")}${OWN_BANKS.map(b=>opt(b.id,b.name,b.bank)).join("")}
        <button class="opt-card" data-act="notbuilt"><span class="ic">+</span><span><b>Add new bank account</b><small>Get loan funds after successful verification</small></span></button></div>`;
    }
    if(f.view==="repay"){
      const pick = f.draft, rows = [["Direct debit","Direct debit","Repayments are scheduled transfers from your Payments account.",'<span style="color:var(--teal)">⟳</span>'],["Post-dated checks","Post-dated checks","You'll be asked to prepare and upload your checks after this drawdown. First Circle will arrange pick-up before disbursement.",'▭']];
      return `<button class="d2-ghost" style="padding-left:0" data-act="d2-cancel-sub">← Back to loan setup</button><h1 class="d2-h" style="margin-top:12px">How do you want to repay your loan?</h1><p class="d2-sub">Choose your preferred repayment method.</p>
        <div class="note" style="max-width:700px">ⓘ You won't be able to change your repayment method after your loan contract is signed.</div>
        <div class="d2-rep" style="max-width:860px"><div>${rows.map(r=>`<button class="opt-card ${pick===r[0]?"sel":""}" data-act="d2-pick" data-g="repay" data-v="${r[0]}"><span class="ic">${r[3]}</span><span><b>${r[1]}</b></span><span class="radio ${pick===r[0]?"on":""}"></span></button>`).join("")}</div>
        <div style="font-size:12px;color:var(--ink-2)">${pick?`<b style="font-size:14px;color:var(--ink)">${pick}</b><p>${rows.find(r=>r[0]===pick)[2]}</p><hr class="sep"><div>Your repayment</div><b style="font-size:16px;color:var(--ink)">${peso(c.each)}</b><br>Paid <b>${d.freq==="Bi-weekly"?"bi-weekly":d.freq==="Bullet"?"one time":"monthly"}</b> for ${d.term} months.<br>First payment on <b>${c.dates[0]}</b>.<br><button class="d2-ghost" style="padding:6px 0" data-act="d2-sched" data-id="${d.id}">View repayment schedule →</button>`:`Select a repayment method to see your repayment.`}</div></div>`;
    }
    const disbOk = !!d.disb, repOk = !!d.repay;
    return `<h1 class="d2-h">Finish your loan setup</h1><p class="d2-sub">Tell us how you want to receive your disbursed funds and make repayments for your loan.</p>
      <div style="max-width:760px"><div class="d2-card" style="margin-bottom:18px"><div class="d2-lbl" style="font-weight:600;color:var(--ink)">Loan summary</div>
        <div class="d2-lbl">Total loan amount</div><b>${peso(d.amount)}</b>
        <div class="d2-lbl" style="margin-top:10px">Total repayment</div><b>${peso(c.total)}</b>
        <div class="d2-lbl" style="margin-top:10px">Repayment schedule</div><b style="font-weight:500">${peso(c.each)} ${d.freq==="Bi-weekly"?"bi-weekly":d.freq==="Bullet"?"one time":"monthly"} for ${d.term} months, starting ${c.dates[0]}</b></div>
      <div class="d2-row"><span class="ck ${disbOk?"ok":""}">${disbOk?"✓":""}</span><div class="bd"><b>Set up disbursement</b><br>Disburse to<br><span style="color:var(--ink)">${esc(disbLabel(d))}</span></div>${d.signed?"":`<button class="btn sm" data-act="d2-chg-disb">Change account</button>`}</div>
      <div class="d2-row"><span class="ck ${repOk?"ok":""}">${repOk?"✓":""}</span><div class="bd"><b>Select repayment method</b>${repOk?`<br>${esc(repayText(d))}`:`<br>Choose how you will repay your loan.`}${e.repay?`<div class="err-msg">${e.repay}</div>`:""}</div>${d.signed?"":`<button class="btn sm" data-act="d2-sel-repay">${repOk?"Change method":"Select method"}</button>`}</div>
      ${signBlock(d)}</div>`;
  }

  /* ---------- flow view (header, stepper, footer) ---------- */
  DD2.flow = function(f){
    const steps = ["Choose your loan","Loan details","Setup disbursement & repayment"];
    let cur, pctW, body, foot;
    if(f.type==="dd"){
      cur = f.step; pctW = f.step===0 ? 12 : 55;
      const ok = f.step===1 || (parseAmt(f.data.amountStr) >= 50000 && parseAmt(f.data.amountStr) <= availCredit());
      body = f.step===0 ? chooseBody(f) : finaliseBody(f);
      foot = `<button class="btn" data-act="d2-back">← Back</button>${f.step===0?`<button class="btn primary" id="d2Next" data-act="d2-next" ${ok?"":"disabled"}>Next →</button>`:`<button class="btn primary" data-act="d2-confirm">Confirm drawdown</button>`}`;
    } else {
      const d = drawdownOf(f); cur = 2; pctW = 85; body = setupBody(f);
      if(f.view==="main") foot = `<div class="d2-foot-r"><button class="d2-ghost" data-act="d2-later">Save and return later</button><button class="btn primary" data-act="d2-complete" ${d.signed?"":"disabled"}>Complete loan setup</button></div>`;
      else foot = `<div class="d2-foot-r"><button class="btn" data-act="d2-cancel-sub">Cancel</button><button class="btn primary" data-act="d2-save" ${f.draft?"":"disabled"}>Save selection</button></div>`;
    }
    return `<div class="flow"><div class="flow-h">Request credit drawdown<button class="x" data-act="flow-exit" aria-label="Close">×</button><div class="pbar" style="width:${pctW}%"></div></div>
      <div class="flow-b">${stepperView(steps, cur)}<div class="flow-content" style="width:auto;flex:1">${body}</div></div><div class="flow-foot">${foot}</div></div>`;
  };

  /* ---------- "view status" page ---------- */
  DD2.detail = function(){
    const d = S.drawdowns.find(x=>x.id===S.ddView); if(!d) return creditView();
    const c = calcOf(d), pdc = d.repay==="Post-dated checks", [st,sc] = ddStatus(d);
    const done = d.signed && d.repay && (!pdc || d.pickup);
    const nDone = 1 + (d.repay?1:0) + (d.signed?1:0);
    const checkRow = pdc && d.signed && !d.pickup ? `<button class="btn sm" data-act="d2-upload" data-id="${d.id}">Upload checks</button>` : "";
    const todo = d.cancelled ? "" : done ? `<div class="banner ok">✓ All set! We're processing your disbursement to ${esc(disbLabel(d))}.</div>` :
      `<div class="d2-todo"><div class="hd"><span>To do: Loan setup <span style="font-weight:400;color:var(--ink-2)">${nDone} of 3</span></span><button class="btn sm primary" data-act="d2-continue" data-id="${d.id}">Continue setup →</button></div><div class="bd2">
        <div class="d2-row"><span class="ck ok">✓</span><div class="bd"><b>Set up disbursement</b> › ${esc(disbLabel(d))}</div>${d.signed?"":`<button class="btn sm" data-act="d2-chg-disb" data-id="${d.id}">Change account</button>`}</div>
        <div class="d2-row"><span class="ck ${d.repay?"ok":""}">${d.repay?"✓":""}</span><div class="bd"><b>Select repayment method</b>${d.repay?` › ${esc(d.repay)}`:""}${pdc?`<br>You will be prompted to prepare and upload photos of your repayment checks for this step to be considered fully complete.${d.pickup?`<br>${d.files.length} checks uploaded. Pickup on ${d.pickup.date}, ${d.pickup.slot}.`:""}`:""}</div>${d.signed?checkRow:`<button class="btn sm" data-act="d2-sel-repay" data-id="${d.id}">${d.repay?"Change method":"Select method"}</button>`}</div>
        ${signBlock(d)}</div></div>`;
    return `<div class="page"><button class="icon-btn" data-nav="credit" aria-label="Back">←</button>
      <div class="ddh"><span class="ic">${ico("draw",26,1.6)}</span><div style="flex:1"><span class="type-tag" style="margin:0">Business Credit Line</span><h2>${d.name?esc(d.name):"Drawdown Request"}</h2><small>${d.ref} · Requested on Sep 29, 2026 · <span class="st ${sc}">${st}</span></small></div>
        ${!d.cancelled&&!d.signed?`<div style="position:relative"><button class="dots" data-act="dd-menu" aria-label="More options">⋮</button>${S.rowMenu==="dd"?`<div class="row-menu"><button data-act="dd-cancel">Cancel drawdown request</button></div>`:""}</div>`:""}</div>
      ${d.cancelled?`<div class="banner" style="background:var(--red-soft);border-color:#F2C6CC;color:var(--red)">This drawdown request was ${st.toLowerCase()}.</div>`:""}
      ${todo}
      <div class="d2-card" style="margin-bottom:22px"><div class="d2-rep"><div><div class="d2-lbl">Total repayment</div><b style="font-size:20px">${peso(c.total)}</b>
          <div class="d2-bar"><div style="width:${Math.round(d.amount/c.total*100)}%"></div></div>
          <div style="font-size:12px;color:var(--ink-2)">● Total loan amount <b style="color:var(--ink)">${peso(d.amount)}</b> &nbsp; ○ Base interest <b style="color:var(--ink)">${peso(c.interest)}</b></div></div>
          <div style="font-size:13px"><div class="d2-lbl">Interest rate</div><b>${pct(c.rate)}</b> a month<div class="d2-lbl" style="margin-top:10px">Repayment frequency</div><b>${freqLabel(d.freq)}</b><br><button class="d2-ghost" style="padding:8px 0" data-act="d2-comp" data-id="${d.id}">Show full breakdown →</button></div></div></div>
      <h3 style="font-size:17px;margin:0 0 4px">Repayments</h3><div style="font-size:12px;color:var(--ink-2);margin-bottom:10px">${peso(0)} / ${peso(c.total)} repaid</div>
      <div class="d2-card"><table class="d2-tbl"><thead><tr><th>No.</th><th>Due date</th><th>Amount</th></tr></thead><tbody>${c.dates.map((dt,i)=>`<tr><td>${i+1}</td><td>${dt}</td><td>${peso(c.each)}</td></tr>`).join("")}</tbody></table></div></div>`;
  };

  /* ---------- popups ---------- */
  DD2.modal = function(m){
    const wrap = (title, body, w) => `<div class="dim"><div class="modal" style="width:${w||460}px;max-width:94vw"><div class="modal-h">${title}<button class="x" data-act="close" aria-label="Close">×</button></div><div class="modal-b">${body}</div></div></div>`;
    if(m.type==="d2-pf") return wrap("Processing fee", `<p class="hint" style="margin:0 0 10px">You are currently on a processing fee scheme, where <b>1.99%</b> is charged per drawdown.</p><p class="hint" style="margin:0 0 10px">Borrow often? Switch to a subscription plan, where you can borrow as often as you want for a fixed fee every 3 months, 6 months, or 1 year.</p><p class="hint" style="margin:0">Contact your relationship manager for more details.</p>`, 380);
    if(m.type==="d2-comp"){
      const c = DD2.calc(m.amount, m.term, m.freq, m.opt), disc = m.freq==="Bi-weekly" ? `<br>Includes a 0.10% Bi-weekly discount` : (m.freq==="Bullet"||m.freq==="One-time") ? `<br>Includes +1.00% for One-time repayment` : "";
      return wrap("Loan computation", `<div style="text-align:center;margin-bottom:12px;font-size:13px;color:var(--ink-2)">Based on a total loan amount of<div style="font-size:22px;font-weight:700;color:var(--ink)">${peso(m.amount)}</div></div>
        <div class="d2-ln"><span>Total loan amount</span><b>${peso(m.amount)}</b></div>
        <div class="d2-ln"><span>Processing fee (1.99%)</span><b>${peso(c.fee)}</b></div>
        <div class="d2-ln tot"><span>Total interest payable</span><b>${peso(c.interest)}</b></div>
        <div class="d2-ln" style="padding:2px 0 2px 16px;font-size:11px"><span>Base interest<br>${pct(c.rate)} for ${m.term} months on ${peso(m.amount)}${disc}</span><span>${peso(c.interest)}</span></div>
        <div class="d2-ln"><span>You will receive</span><b>${peso(c.receive)}</b></div>
        <div class="d2-ln tot"><span>Total repayment</span><b>${peso(c.total)}</b></div>`, 420);
    }
    if(m.type==="d2-sched"){
      const c = DD2.calc(m.amount, m.term, m.freq, m.opt);
      return wrap("Repayments schedule", `<div style="max-height:360px;overflow:auto"><table class="d2-tbl"><thead><tr><th>No.</th><th>Due date</th><th>Amount</th></tr></thead><tbody>${c.dates.map((dt,i)=>`<tr><td>${i+1}</td><td>${dt}</td><td>${peso(c.each)}</td></tr>`).join("")}</tbody></table></div><p class="hint" style="margin:10px 0 0">Total repayment: <b style="color:var(--ink)">${peso(c.total)}</b></p>`, 460);
    }
    if(m.type==="d2-early"){
      const c = DD2.calc(m.amount, m.term, m.freq, m.opt), i = m.idx;
      let body = `<p class="hint" style="margin:0 0 12px">Pick the date you plan to make an early repayment.</p><select class="d2-sel" data-d2sel="early" style="width:100%"><option value="" ${i<0?"selected":""}>Select date</option>${c.dates.map((dt,k)=>`<option value="${k}" ${k===i?"selected":""}>${dt}</option>`).join("")}</select>`;
      if(i>=0){ const left=c.n-i, principal=r2(m.amount*left/c.n), remInt=r2(c.interest*left/c.n), pay=r2(principal+remInt*0.5);
        body += `<div class="d2-hl" style="margin-top:16px"><small style="margin:0 0 4px">Estimated amount to settle the loan</small><b>${peso(pay)}</b></div>
          <div class="d2-ln"><span>Remaining principal</span><b>${peso(principal)}</b></div><div class="d2-ln"><span>Interest still due (50%)</span><b>${peso(r2(remInt*0.5))}</b></div><div class="d2-ln"><span>Interest you save</span><b>${peso(r2(remInt*0.5))}</b></div>
          <p class="hint" style="margin:8px 0 0">Estimate for this practice only. The real figure comes from First Circle.</p>`; }
      return wrap("Calculate making an early repayment", body, 420);
    }
    return "";
  };

  /* ---------- actions (called first thing by each page's click handler) ---------- */
  function openModal(type, f){ const d = f.type==="dd" ? f.data : null;
    if(d) S.modal = {type, amount:parseAmt(d.amountStr)||0, term:d.term, freq:d.freq, opt:effective(d), idx:-1};
    render(); }
  function modalFromDrawdown(type, id){ const d = S.drawdowns.find(x=>x.id===id) || S.drawdowns.find(x=>x.id===S.ddView) || (S.flow && S.flow.id && S.drawdowns.find(x=>x.id===S.flow.id));
    S.modal = {type, amount:d.amount, term:d.term, freq:d.freq, opt:d.opt, idx:-1}; render(); }
  DD2.act = function(name, el){
    const f = S.flow;
    switch(name){
      case "open-dd": openFlow(); return true;
      case "d2-freq": f.data.freq = el.dataset.v; render(); return true;
      case "d2-mode": f.data.opt.mode = el.dataset.v; render(); return true;
      case "d2-cur": f.data.curOpen = !f.data.curOpen; render(); return true;
      case "d2-pf": S.modal = {type:"d2-pf"}; render(); return true;
      case "d2-comp": case "d2-sched": case "d2-early": {
        const type = name==="d2-comp" ? "d2-comp" : name==="d2-sched" ? "d2-sched" : "d2-early";
        if(f && f.type==="dd" && f.step===0 && !(parseAmt(f.data.amountStr)>0)){ f.errs = {amount:"Enter a loan amount first."}; render(); return true; }
        if(f && f.type==="dd") openModal(type, f); else modalFromDrawdown(type, el.dataset.id);
        return true; }
      case "d2-back": if(f.step===0){ S.flow = null; render(); } else { f.step = 0; f.errs = {}; render(); } return true;
      case "d2-next": {
        const a = parseAmt(f.data.amountStr), avail = availCredit();
        if(isNaN(a) || a < 50000){ f.errs = {amount:"Enter a loan amount of at least ₱ 50,000.00."}; render(); return true; }
        if(a > avail){ f.errs = {amount:`Amount is more than your available credit of ${peso(avail)}.`}; render(); return true; }
        f.data.amount = a; f.step = 1; f.errs = {}; render(); return true; }
      case "d2-confirm": {
        const d = f.data, ref = `BCL-2609-${String(101+S.drawdowns.length)}`;
        const x = {id:"d"+Date.now(), ref, product:"BCL", name:d.name||"", amount:d.amount, term:d.term, freq:d.freq, opt:effective(d), repay:"", disb:"payments", reviewDone:false, signed:false, files:[], pickup:null, cancelled:false};
        S.drawdowns.push(x); S.flow = {type:"setup", id:x.id, view:"main", errs:{}};
        const c = calcOf(x);
        logAction("drawdown",`Requested drawdown ${ref}: ${peso(x.amount)}, ${x.term} month(s), ${x.freq}, ${pct(c.rate)} interest`);
        render(); if(DD2.onConfirm) DD2.onConfirm(x); return true; }
      case "d2-continue": S.flow = {type:"setup", id:el.dataset.id, view:"main", errs:{}}; render(); return true;
      case "d2-chg-disb": { const id = el.dataset.id || f.id; S.flow = {type:"setup", id, view:"disb", draft:S.drawdowns.find(x=>x.id===id).disb, errs:{}}; render(); return true; }
      case "d2-sel-repay": { const id = el.dataset.id || f.id; S.flow = {type:"setup", id, view:"repay", draft:S.drawdowns.find(x=>x.id===id).repay, errs:{}}; render(); return true; }
      case "d2-pick": f.draft = el.dataset.v; render(); return true;
      case "d2-cancel-sub": S.flow = {type:"setup", id:f.id, view:"main", errs:{}}; render(); return true;
      case "d2-save": { const d = drawdownOf(f);
        if(f.view==="disb"){ d.disb = f.draft; logAction("drawdown",`Chose disbursement account: ${disbLabel(d)}`); }
        else { d.repay = f.draft; logAction("drawdown",`Chose repayment method: ${d.repay}`); }
        S.flow = {type:"setup", id:d.id, view:"main", errs:{}}; render(); return true; }
      case "d2-later": S.flow = null; S.page = "credit"; logAction("drawdown","Saved the loan setup to finish later"); render(); return true;
      case "d2-complete": { const d = drawdownOf(f);
        if(!d.repay){ f.errs = {repay:"Select a repayment method."}; render(); return true; }
        logAction("drawdown",`Completed loan setup for ${d.ref}`);
        if(d.repay==="Post-dated checks" && !d.pickup){ S.ddView = d.id; DD2.openUpload(d); return true; }
        S.flow = null; S.ddView = d.id; S.page = "dd"; toast("Loan setup complete"); return true; }
      case "d2-upload": { const d = S.drawdowns.find(x=>x.id===el.dataset.id); S.ddView = d.id; DD2.openUpload(d); return true; }
      case "dd-sign": { const id = el.dataset.id || S.ddView; S.flow = {type:"sign", id, agree:false, errs:{}, back:true}; render(); return true; }
      case "flow-close": if(f && f.type==="sign" && f.back){ S.flow = {type:"setup", id:f.id, view:"main", errs:{}}; render(); return true; } return false;
    }
    return false;
  };
  DD2.openUpload = function(d){
    S.flow = {type:"upload", id:d.id, step:0, errs:{}, pk:{addr:"", date:"", slot:"1 PM – 5 PM", poc:fullName(S.user), mob:fmtMobile(S.user.mobile).replace("+63 ","")}}; S.ddOpen = null; render();
  };

  /* ---------- typing and picking (no full re-render while typing) ---------- */
  function refreshCalc(){ const f = S.flow; if(!f || f.type!=="dd") return;
    const el = $q("#d2Calc"); if(el) el.innerHTML = calcPanel(f);
    const a = parseAmt(f.data.amountStr), ok = a >= 50000 && a <= availCredit(), n = $q("#d2Next"); if(n) n.disabled = !ok;
    const r = $q("#d2Reg"); if(r) r.innerHTML = `Regular credit: <b style="color:var(--ink)">${peso(a||0)}</b> / ${peso(availCredit())}`; }
  document.addEventListener("input", e=>{
    const t = e.target; if(!t.closest || !t.closest("#screen")) return; const f = S.flow; if(!f) return;
    if(t.id==="d2Amt"){ f.data.amountStr = t.value; const a = parseAmt(t.value); if(!isNaN(a)){ const r=$q("#d2AmtR"); if(r) r.value = a; } f.errs = {}; refreshCalc(); }
    else if(t.id==="d2AmtR"){ const v = +t.value; f.data.amountStr = v.toLocaleString("en-PH"); $q("#d2Amt").value = f.data.amountStr; f.errs = {}; refreshCalc(); }
    else if(t.id==="d2Term"){ f.data.term = +t.value; $q("#d2TermL").textContent = `${f.data.term} months`; refreshCalc(); }
    else if(t.id==="d2Name"){ f.data.name = t.value; }
  });
  document.addEventListener("change", e=>{
    const t = e.target; if(!t.dataset || !t.dataset.d2sel) return; const k = t.dataset.d2sel, f = S.flow;
    if(k==="early"){ S.modal.idx = t.value==="" ? -1 : +t.value; render(); return; }
    if(!f) return;
    if(k==="day") f.data.opt.day = +t.value; else if(k==="wd") f.data.opt.weekday = t.value; else if(k==="cur") f.data.cur = t.value;
    render();
  });
})();
