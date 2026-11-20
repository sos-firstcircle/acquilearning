/* Manual (trainer-graded) requirements, e.g. 1:1 call simulations graded by the trainer.
   Graded on the Grades page (admins only: "Manual grading"). Saved to the Sheet's "Manual" tab. Admins see all; each AM sees their own
   in My grades when that requirement is switched on for their batch (Grades page > Manual grading > Visible to AMs).
   Same shape for every rubric: SECTION > ITEM | GRADE | NOTE, then the overall result and overall notes.

   - id: starts with "manual-". Never rename once grades exist.
   - scale: the grade choices, best first. Either a preset name from LMS_MANUAL_SCALES below, or a list.
       A choice is "OK" (a label only) or { label:"OK", w:1 } (w = weight, 1 = 100% of the item's points). The label is optional:
       { w:0.8 } shows as "80%".
   - sections: [{ title, items:[...] }]. An item is "Opening" (no points) or { label:"Opening", pts:6 }.
       An item can have its own scale: { label:"...", pts:5, scale:"good-ok-bad-missed" }.
   - Numeric rubric = every item has pts and every choice has a weight. Then the total, the percentage and the pass/fail color
       are worked out automatically (no overall dropdown). Every item must be graded before saving.
       Each item has a "Count" switch: switched off, it is left out of the total (e.g. 100 points becomes 94 without a 6-point item).
       transmute (optional): [[min %, "result"], ...] best first; the result is shown with the %, colored green / amber (2nd lowest) / red (lowest).
       pass: pass mark in % (default 75), used for the color when there is no transmute table.
   - Label rubric (no points): overall: "required" | "optional" (an overall grade dropdown). help: what each grade means (optional).
   - Overall notes are always available (new lines are kept). */
window.LMS_MANUAL_SCALES = {
  "ok-bad": ["OK", "BAD"],
  "good-ok-bad-missed": [{ label: "GOOD", w: 1 }, { label: "OK", w: 0.5 }, { label: "BAD", w: 0 }, { label: "MISSED", w: 0 }],
  "five-to-one": [{ label: "5", w: 1 }, { label: "4", w: 0.8 }, { label: "3", w: 0.6 }, { label: "2", w: 0.4 }, { label: "1", w: 0.2 }]
};

window.LMS_MANUAL = [
  { id: "manual-prospecting-call", title: "Prospecting Call Simulation",
    scale: "ok-bad",
    overall: "optional",
    sections: [{ title: "", items: ["Opening", "Value", "Objection", "Closing"] }] },

  { id: "manual-discovery-call", title: "Discovery Call Simulation",
    scale: "five-to-one",     // 5 = 100%, 4 = 80%, 3 = 60%, 2 = 40%, 1 = 20% of the item's points. Total 100 points (less any item switched off).
    transmute: [[90, "Excellent"], [80, "Good"], [70, "Satisfactory"], [0, "Needs Coaching"]],
    sections: [
      { title: "Opening", items: [
        { label: "Self-introduction and acknowledges the client's presence", pts: 6 },
        { label: "Establish and build initial rapport", pts: 9 } ] },
      { title: "Discovery Questions", items: [
        { label: "Effective probing", pts: 4 },
        { label: "Overview of their specific industry and what they are doing", pts: 4 },
        { label: "Payment terms with suppliers and clients", pts: 4 },
        { label: "Existing bank credit lines (limit, interest rate, etc.)", pts: 4 },
        { label: "Client types they serve", pts: 3 },
        { label: "How they move money (for SBA)", pts: 2 },
        { label: "Maintaining balance and fees with their banks", pts: 2 },
        { label: "Number of employees", pts: 2 } ] },
      { title: "Sales Pitch / Product Knowledge", items: [
        { label: "Presents our platform connected to their pain points", pts: 15 },
        { label: "Basic product knowledge (features, terms, limit, rate)", pts: 10 } ] },
      { title: "Objection Handling", items: [
        { label: "Acknowledges objections and redirects the conversation", pts: 12 },
        { label: "Allows the client to talk and ask questions", pts: 8 } ] },
      { title: "Closing", items: [
        { label: "Checks if they want to onboard or gets endorsement to the person responsible for requirements", pts: 8 },
        { label: "If not, schedules an urgent follow-up with an exact day and time for feedback", pts: 7 } ] }
    ] }
];
