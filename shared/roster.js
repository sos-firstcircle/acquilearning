/* =========================================================
   TEMPORARY access list (used while Google sign-in is being set up).

   Only these emails can get in. Admins also see the Admin/Grades pages.
   To REMOVE this stopgap later: set emailLogin:false in shared/lms.js
   and delete this file plus its <script> tag in index.html.

   NOTE: this repo is public, so anything in this file is publicly readable.
   ========================================================= */
window.LMS_ROSTER = {
  admins: [
    "salesoperations@firstcircle.com",
    "nice.junsay@firstcircle.com",
    "hanna.jo@firstcircle.com",
    "reyster.barron@firstcircle.com",
    "charles.allen@firstcircle.com",
    "alan.smyth@firstcircle.com",
    "michael.limandibhratha@firstcircle.com",
    "sophia.pesa@firstcircle.com",
    "ayrton.arteficio@firstcircle.com"
  ],
  // Onboardees grouped by batch. Batch number = start date as MMDDYY (e.g. 101926 = Oct 19, 2026).
  batches: {
    "000000": [   // test batch: no retake
      "test1@firstcircle.com",
      "test2@firstcircle.com",
      "test3@firstcircle.com"
    ],
    "000001": [   // test batch: can retake exams
      "hanna.test@firstcircle.com"
    ],
    "000002": [   // existing AMs: no 10-day path, just the simulations and practice exams (existing/sections.js); can retake
      "acquisitiongroup@firstcircle.com"
    ],
    "110926": [   // first real onboarding batch: starts Nov 9, 2026 (standard 10-day path, one attempt per exam)
      "benedict.oyek@firstcircle.com",
      "alexander.painaga@firstcircle.com",
      "renell.gatchalian@firstcircle.com",
      "raymund.estebar@firstcircle.com",
      "ralph.aniciete@firstcircle.com",
      "melissa.ligeralde@firstcircle.com",
      "jazon.pulmano@firstcircle.com",
      "hyasmin.lascano@firstcircle.com",
      "leslie.reyes@firstcircle.com",
      "jeremiah.veloria@firstcircle.com",
      "alyssa.moncada@firstcircle.com"
    ]
  }
};
