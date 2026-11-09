# Acquisition Learning Hub: project notes for Claude
Nickname: "Acqui Learning". Live at https://sos-firstcircle.github.io/acquilearning/

A learning site for new First Circle Account Managers (AMs): sign in, work through a 10-day path, take exams, get graded.
Static site on GitHub Pages (`sos-firstcircle/acquilearning`), no build step. Plain HTML/CSS/JS plus a Google Apps Script backend that writes to a Google Sheet.

## Working with the owner
- Owner: Sales Operations (salesoperations@firstcircle.com). Mixes English and Filipino; keep replies short and plain.
- Commit only when asked. End commit messages with `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`.
- Nothing is pushed or live until they click **Push origin** / merge in GitHub Desktop. Never push without being told.
- Preview locally: `python3 -m http.server 8000` in this folder, open http://localhost:8000/index.html. Test sign-in with an email from `shared/roster.js`.
- Their IT is away until Thursday (2026-10-22): no Google Cloud project, so no real Google sign-in or OAuth client ID yet.

## Branches and state
- Work is on branch `google-signin-sheets` (not yet pushed). `main` has only the rename commit on top of the original upload.
- To go live: Publish branch in GitHub Desktop, open a PR, merge to `main`. GitHub Pages serves `main`.

## How it works
- `index.html`: sign-in. Shows a Google-styled button that opens an email box (stopgap). Not-on-list message: "Email unauthorized. Please contact Salesops." Success shows a 1s "Signing you in" screen.
- `shared/lms.js`: config, sign-in checks, progress saving (browser localStorage, key `amacademy`), sends results to the backend.
  - `emailLogin: true` = TEMPORARY email-list login. To remove it: set false, delete `shared/roster.js` and the `document.write` line near the top of lms.js, switch `AUTH_MODE` to "google" in the Apps Script.
- `shared/roster.js`: allowed emails. `admins` see the Grades page. Onboardees are grouped in `batches`, keyed by batch number = start date as MMDDYY (e.g. `101926` = Oct 19, 2026). Batch 110926 (Nov 9 2026, 11 onboardees) is the first real batch; 101926 was removed (`000000`: test1-3@, no retakes; `000001`: hanna.test@, can retake via `multiAttempt` in lms.js); the batch shows in the sidebar, on the Grades page (column + filter) and in the Sheet's `Batch` column. The same lists are duplicated in `apps-script/Code.gs` (`BATCHES`, `ADMIN_EMAILS`; keep in sync). Repo is public, so these emails are public.
- `shared/shell.js`: sidebar and helpers shared by pages. `shared/theme.css`: look and feel.
- `dashboard.html`: 10 day cells (5 x 2). Clicking a cell opens a dropdown under that row. Static icons: padlock (locked), check (complete), half circle (in progress). Right column: Upcoming sessions, Graded exams.
- `grades.html`: admin-only. Loads grades from the Sheet via the backend (needs an admin passcode).
- `days/day-01.js` ... `day-10.js`: ONE FILE PER DAY (title, brief, tasks, materials, exam). To work on a day, edit only its file (plus its own lesson pages, e.g. `lessons/d02-*.html`), so several chats can work on different days at once without conflicts. Day 1 has a SAMPLE task and exam to replace. Days 2 to 10 have titles and a short `brief`.
- `modules.js`: loads the day files, then `days/build.js` assembles `window.LMS_DAYS`. Also holds week labels and live sessions. Don't put day content here.
- `sims/connect-exam.html`: Connect simulation exam. Kept in the repo but not linked from any day. Reports its score as `exam-connect-sim`.
- `apps-script/Code.gs`: backend. Deployed as a web app (Execute as owner, access Anyone). `backendUrl` in lms.js points to it. Writes to the `Grades` and `Progress` tabs BY COLUMN NAME (columns can be reordered or added). `ADMIN_PASSCODE` is "" (no extra passcode; admins are identified by email only). Set a value to require one. After editing Code.gs, redeploy as a New version.

## Exams, preview and extra tabs
- `exams/product-exam.html?e=2|3`: generic multiple-choice exam engine, questions in `exams/questions.js`. Product Knowledge Examination 2 is on Day 4 with the Connect sim exam; Product Knowledge Examination 3 is on Day 5 (`exams/product-knowledge-3.html`, questions in `exams/product-knowledge-3-questions.js`). Product Exam 1 is the real "Product Knowledge Examination 1" on Day 3 (`exams/product-knowledge-1.html`). A day file can hold one exam (`exam:{...}`) or several (`exams:[{...},{...}]`; days/build.js normalizes both into `d.exams`). `soon:true` on an exam shows it as "Soon" and does not block the day. To attach an engine exam to a day, add `exam:{ id:"exam-product-2", label:"Product Exam 2", href:"exams/product-exam.html?e=2", kind:"lms", passing:80 }` to a day file.
- `exams.html` (admins only, "Trainers > Exams" in the sidebar) lists every exam from `exams/registry.js` in three sections (`group`: product / simulation / other; add new exams there) and opens them with `?preview=1`. Preview mode (`LMS.preview()`, admins only; ignored for everyone else) records nothing (no localStorage, no Sheet) but `saveResult` still returns the record so the score shows at the end; a banner shows on the page. New exam pages should use `LMS.preview()` to skip any "already taken" logic and any private storage.
- Existing AMs: batch `000002` (acquisitiongroup@firstcircle.com, can retake) gets a one-screen dashboard of lectures, simulations and practice exams instead of the 10-day path: `existing/sections.js` (items), `renderExisting()` in `dashboard.html`, hover thumbnails in `existing/thumbs/`. `LMS.isExisting()` switches it on.
- `department.html`: visible to everyone, "Coming soon" (internal jargon, team directory, ways of working).

## Progress storage
- The Google Sheet is the source of truth for progress and grades; the browser copy (localStorage `amacademy`) is a cache. On every page load `LMS.ready = sync()` calls the script's `myProgress` action and merges the result in (so progress follows a person to any browser). Pages that decide on "already taken" wait on `LMS.ready`.
- Completions go to the `Progress` tab; unticks are logged as a row whose Item ID is `UNDO:<id>` (latest row per item wins). Scored attempts go to `Grades` (and per-exam tabs).
- One attempt per exam is enforced on the server too (`RETAKE_BATCHES` in Code.gs, same list as `multiAttempt` in lms.js). The sim's "last result" text is still stored per browser only.
- Auth is separate from storage: all of this keys off `user.email`, so switching `AUTH_MODE` to "google" later changes nothing about the data.

## Rules built into the dashboard
- A day completes when all its tasks are ticked and its exam (if any) is done. Day N+1 unlocks when day N is complete.
- A day with no content yet can't be completed, so it keeps later days locked.
- Start date for everyone is 2026-10-19 (`demoUser.startDate` in lms.js).

## Known gaps and next steps
- The new Code.gs (header-based writes + `adminData`) has been committed but may not be deployed yet. The earlier version is live.
- Set the real `ADMIN_PASSCODE`, redeploy, then test grades.html with real data.
- Real Google sign-in once IT creates the Cloud project (see `apps-script/README.md`).
- Google Form and trainer-scored exams do not auto-report scores; trainers add them to the Grades tab by hand (the Grades page will show them).
- Content is being rewritten day by day, one chat per day. A day-chat edits only its `days/day-NN.js` (and its own lesson files). New exams go in one at a time. Exam ids must be unique and never renamed once people have results.
- Email-only login is spoofable (anyone who knows a listed email). Fine as a stopgap only.
