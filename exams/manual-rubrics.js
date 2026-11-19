/* Manual (trainer-graded) requirements, e.g. 1:1 call simulations graded by the trainer.
   Graded on the Grades page (admins only: "Manual grading"). Saved to the Sheet's "Manual" tab. Admins see all; each AM sees only their own (My grades).
   Same shape for every rubric: SECTION > ITEM | GRADE | NOTE, then an overall grade and overall notes.
   - id: starts with "manual-". Never rename once grades exist.
   - scale: the grade choices, best first. help: what each grade means (optional).
   - sections: [{ title, items:[...] }]. A rubric without sections can use one section with no title.
   - overall: "required" | "optional" (overall grade). Overall notes are always available. */
window.LMS_MANUAL = [
  { id: "manual-prospecting-call", title: "Prospecting Call Simulation",
    scale: ["OK", "BAD"],
    overall: "optional",
    sections: [{ title: "", items: ["Opening", "Value", "Objection", "Closing"] }] },

  { id: "manual-discovery-call", title: "Discovery Call Simulation",
    scale: ["GOOD", "OK", "BAD", "MISSED"],
    help: { GOOD: "Able to hit all listed items or exceeded", OK: "Able to hit half or more than half of the listed items",
            BAD: "Not able to hit half or less than half of the listed items", MISSED: "Missed" },
    overall: "required",
    sections: [
      { title: "Opening", items: [
        "Able to acknowledge present and introduce themselves",
        "Establish and built initial rapport" ] },
      { title: "Discovery Questions", items: [
        "Effective probing",
        "Getting overview of their specific industry and what they are doing",
        "Payment terms with suppliers & clients",
        "Existing bank credit lines - limit & interest rate etc.",
        "Able to ask what client types they serve",
        "How they move money - For SBA",
        "How much maintaining balance or fees they have for their banks",
        "How many employees" ] },
      { title: "Sales Pitch", items: [
        "Able to present our platform connecting to their pain points",
        "Basic product knowledge about features, terms, limit, rate" ] },
      { title: "Objection Handling", items: [
        "Able to acknowledge objections and sway the conversation",
        "Allowing the client to talk and ask questions" ] },
      { title: "Closing", items: [
        "Able to check them if they want onboard or get endorsement for the person responsible for requirements",
        "If not - able to schedule urgent action for follow up exact day/time for feedback" ] }
    ] }
];
