/* Day 9 graded exam 1: Acqui Service Navigation + General Information (20 min). Loaded before exam.js. Hints are off (graded).
   Part 1 navigation (7 questions), Part 2 general information on a lead (6 questions). Each question is worth 1 point; a wrong answer costs 0.25. */
(function(){
  function L(id){ return LEADS.filter(function(l){ return l.id === id; })[0]; }
  var onLead = function(id, tab){ return function(ev, d){ return ev === "render" && d.route === "lead" && d.id === id && (!tab || S.ltab === tab); }; };
  var T = [
    /* ---- Part 1: navigation ---- */
    { type: "nav", text: "Part 1 · Navigation. You want to see the list of leads assigned to you. Where do you go?",
      check: function(ev){ return ev === "render" && location.hash.indexOf("#/leads") === 0; } },
    { type: "nav", text: "Your referrer, Carlo Mendez, asks which leads he has referred to you. Where do you check?",
      check: function(ev, d){ return ev === "referrer-open" && d === "Carlo Mendez"; } },
    { type: "input", text: "How many leads has Carlo Mendez referred to you?", placeholder: "Type a number",
      answer: function(){ return [String(LEADS.filter(function(l){ return l.refBy === "Carlo Mendez"; }).length)]; } },
    { type: "nav", text: "Show only your leads that are Utilized.",
      check: function(ev, d){ return ev === "filter" && d.key === "status" && d.vals.length === 1 && d.vals[0] === "Utilized" && location.hash.indexOf("#/leads") === 0; } },
    { type: "input", text: "How many of your leads are Utilized?", placeholder: "Type a number",
      answer: function(){ return [String(LEADS.filter(function(l){ return l.owner === "me" && l.status === "Utilized"; }).length)]; } },
    { type: "nav", text: "Show only your Disbursed originations from October 2026.",
      check: function(ev, d){ var mo = (S.by || "Monthly") === "Monthly" && +(S.mo == null ? 9 : S.mo) === 9 && +(S.yr || 2026) === 2026, st = S.ost && S.ost.length === 1 && S.ost[0] === "Disbursed";
        return ev === "filter" && (d.key === "cov" || d.key === "ost") && mo && st && location.hash.indexOf("#/originations") === 0; } },
    { type: "nav", text: "Open the Open BCL details of Golden Rice and Feeds.",
      check: function(ev, d){ return ev === "bcl-detail" && d === "371014"; } },
    /* ---- Part 2: general information on a lead ---- */
    { type: "input", text: "Part 2 · General information. Find <b>Mike's Banana Chips (Test)</b>. What is its Lead ID?", html: true, placeholder: "Type the Lead ID",
      answer: function(){ return ["212766"]; } },
    { type: "mcq", text: "What is the BCL application status of Metro Courier Services (lead 350115)?", choices: ["Fully Verified with Future Revenue", "Fully Verified with Provisional Limit", "Information Missing", "For Clarification", "Account Ready for Review"],
      answer: function(){ return [L("350115").risk]; } },
    { type: "mcq", text: "What is the BCL application status of Davao Highland Coffee (lead 305522)?", choices: ["Fully Verified with Future Revenue", "Fully Verified with Provisional Limit", "Information Missing", "For Clarification", "Account Ready for Review"],
      answer: function(){ return [L("305522").risk]; } },
    { type: "mcq", text: "Is Angel's Catering Services (lead 156661) a B2B or a B2C business?", choices: ["B2B", "B2C"],
      answer: function(){ return [L("156661").seg || "B2B"]; } },
    { type: "input", text: "What is the Regular Limit (credit limit) of the BCL of Metro Courier Services?", placeholder: "Type the amount",
      answer: function(){ return ["100000"]; } },
    { type: "input", text: "What is the BCL Price (interest rate) of the BCL of Metro Courier Services?", placeholder: "Type the rate",
      answer: function(){ return ["2.49%", "2.49"]; } }
  ];
  T.forEach(function(t){ t.noHint = true; t.hint = ""; });
  window.ACQUI_EXAM = {
    graded: true, examId: "exam-acqui-nav", minutes: 20, passing: 75, askName: true, backLabel: "Back to Day 9",
    title: "Acqui Service Exam, Part 1: Navigation and General Information",
    intro: "You will get " + T.length + " short situations, one at a time. Use the Acqui Service simulation behind this box to find the answer or the right place. Some questions ask you to type or pick what you find.",
    scoring: "Every question is worth 1 point. Each wrong answer costs 0.25. There are no hints. Skip = 0.",
    tasks: T
  };
})();
