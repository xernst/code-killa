# Homepage copy (rewrite)

Final copy for the promptdojo homepage, written to the copywriting brief's
8-section spec. Each section maps to one block on the page. The Platform team
wires this into `app/page.tsx`; the words are final, the layout is theirs.

Rules held: all headlines lowercase, no em dashes, no banned words, no
exclamation points, contractions throughout, no pricing tier, no "founders"
framing for individuals.

---

## Section: page meta

- **Page title:** promptdojo, the free python school for the ai era
- **Meta description:** ai is reshaping every job. promptdojo teaches you to build with it: read what ai writes, catch what it gets wrong, and ship real work. free for individuals, forever.

---

## Section 1: hero

- **Headline:** everyone's a builder now
- **Subheading:** your job just changed. learn to build with AI or fall behind.
- **Supporting line:** 31 chapters. 833 runnable steps. runs in your browser. free for individuals, forever.
- **Primary CTA (individual):** start learning free
- **Secondary CTA (corporate):** for teams

---

## Section 2: the thesis

Headline: **why this exists**

ai is reshaping every job. not the ones in the headlines. yours.

in three years your job assumes you can build. marketers will run campaigns
end to end. lawyers will put ai teams on case prep. designers will program
their own tools. the people who stay valuable are the ones who can point ai
at real work, read what it wrote back, and catch what it got wrong.

that used to be a programmer's skill. it's everyone's skill now, and almost
nobody is being taught it.

promptdojo teaches it, from zero. it's free for individuals and it's staying
that way, because the next five years are going to be brutal for anyone who
can't work with ai, and a paywall on the way out of that is the last thing
people need. companies pay to train their teams on it. that's what keeps it
free for everyone else.

---

## Section 3: the three things you actually learn

(Existing section. Keep the three cards, copy refreshed to sit under the new
thesis. Eyebrow stays lowercase.)

Eyebrow: **the three things you actually learn**

- **read what ai wrote.** most of the code you touch now was written by a model.
  if you can't read it, you can't catch it, change it, or trust it.
- **catch what it got wrong.** the bugs ai ships are not the bugs humans ship.
  nobody trained you on these. we do, on purpose, 833 times.
- **direct it deliberately.** if you don't understand what the code does, you're
  a passenger. this is how you take the wheel.

---

## Section 4: career paths grid

Headline: **find your path**
Intro line: ten roles, ten routes through the course. pick the one closest to
your work. each one ends with something you can actually do.

Each card: role name, one-sentence value prop, estimated time, "explore path"
link to that path's page. promptdojo uses no emoji; icon ideas in brackets are
concepts for the design team.

| Path | Value prop | Time | Link | [icon idea] |
|---|---|---|---|---|
| developer | read, debug, and ship real software with ai instead of guessing. | 20 to 24 hours | explore path | [terminal caret] |
| marketer | build campaign pipelines and generate creative at scale, yourself. | 10 to 12 hours | explore path | [megaphone] |
| designer | program your own tools and batch-generate assets, no clicking through a ui. | 9 to 11 hours | explore path | [layers] |
| customer service | build support agents and catch their bad answers before customers do. | 12 to 14 hours | explore path | [headset] |
| copywriter | run ai writing pipelines that hold your voice and survive a fact-check. | 10 to 12 hours | explore path | [pen nib] |
| data analyst | pull, clean, and analyze data with ai doing the grunt work. | 13 to 15 hours | explore path | [bar chart] |
| project manager | direct ai builds, review the output, and ship internal tools yourself. | 12 to 14 hours | explore path | [checklist] |
| hr specialist | deploy team skills and set the rules for how your org uses ai. | 9 to 11 hours | explore path | [people] |
| operations | automate the repetitive work your department runs on. | 16 to 18 hours | explore path | [gears] |
| lawyer | build document-review tools and catch the citations ai invents. | 13 to 15 hours | explore path | [scales] |

---

## Section 5: the bugs ai shipped this week

(Existing newsletter / content-engine section. Keep the email signup, refresh
the copy to the new positioning.)

Headline: **the bugs ai shipped this week**

every week, the same few bugs. an api the model hallucinated. a loop that runs
one time too many. a traceback nobody read. we pull the realest ones, show the
broken code, and show the fix.

one email a week. the broken code, the fix, the chapter that drills it. no
spam, easy to drop.

- **Field:** your email
- **CTA:** send me the weekly bugs

---

## Section 6: curriculum spine

(Existing PhaseBandedRail. Keep the component, this is the section heading copy.)

Headline: **the whole course, 35 chapters, free on the web.**

from "what is an llm" to shipping your own agent harness. eight phases, in
order. start anywhere. nothing is gated.

---

## Section 7: for teams

Headline: **for teams**

your team is already using claude and cursor. most of them have no idea what
the code says. that's the gap.

promptdojo for teams puts the ten career paths in front of your whole
organization, with the parts a company actually needs:

- **accountability.** assign paths by role. see who started, who's moving,
  who's stuck.
- **completion data.** progress dashboards and completion certificates, not a
  pile of unused logins.
- **built for the role.** each team gets the chapters that matter for its work,
  custom quizzes, and live sessions.

buying promptdojo for your team is what keeps it free for everyone else.
there's no individual paywall, and there won't be one.

- **CTA:** for teams
- **CTA behavior:** opens the /for-teams page, which ends in a contact form. no
  public per-seat pricing; pricing is a conversation scoped to team size.

---

## Section 8: footer

Tagline (also usable in meta, social, the OG image):
**everyone needs to code now. here's how.**

Footer line: the free python school for the ai era.

---

## Notes for the Platform team

- **Removed for good:** the individual paid tier ($9.99/$59/$129), "paid app
  coming after," and any "founders" framing aimed at individuals. The `/pro`
  route should come down or redirect to `/for-teams`.
- **New sections to build:** the career paths grid (section 4) and the for-teams
  section (section 7). The grid's "explore path" links point at `/paths/<slug>`
  (developer, marketer, designer, customer-service, copywriter, data-analyst,
  project-manager, hr-specialist, operations, lawyer); per-path page copy ships
  in `content/marketing/paths/`. "for teams" CTAs point at `/for-teams`; that
  page's copy ships in `content/marketing/for-teams-page.md`.
- **Stat check before publish:** "31 chapters / 833 steps" is the pre-CLI count.
  With ch31-34 the live numbers are higher; `page.tsx` already derives chapter
  and step counts dynamically, so the hero supporting line should use the
  dynamic count, not a hardcoded 31/833.
