# Engagement component — submission notes

*Draft. The voice is mine, not yours — rewrite it before you hand it in.*

**Link:** `[your site]/prosthesis-memoir.html` — final page
**Screenshot:** the poll after voting, showing the four result bars, alongside the
`polls/post-trauma` document open in the Firestore console.

---

## What it is

A single question at the end of *Prosthesis for Memoir*:

> **In your imagined world, what should happen to post-trauma environments?**
> Rebuild them exactly as they were · Stabilise the ruin and leave it ·
> Build something new in their place · Leave them untouched

It sits on the last page, laid out identically to page 2 — same Fayte Pixel Hard at 128px,
same stroke-only treatment, same 40px margin, and the same scroll-linked fade the rest of the
display type uses, so the question surfaces and recedes with the scroll rather than arriving
once and staying put. That was deliberate: the poll is written in the argument's own
typographic voice, so it reads as the closing line of the memoir rather than a survey stapled
to the end of it. You have just been walked through six pages arguing that reconstruction is
inference rather than measurement; the question asks you to take a position on what that
inference should be *for*.

Responses are stored in Cloud Firestore and the totals stream back live — a second visitor
voting updates the bars in an already-open window without a reload.

## How the data is collected

One document, four integers:

```
polls/post-trauma → { rebuild: n, stabilise: n, new: n, untouched: n }
```

A vote is an atomic increment on one field, inside a transaction so simultaneous votes can't
overwrite each other. **There is no per-response record at all** — no user id, no timestamp,
no IP, no free text, no row of any kind. The aggregate is the entire dataset.

The Firestore security rules enforce this rather than merely documenting it: they reject any
document that isn't exactly those four non-negative integers, and any write that changes the
total by more than one. Even with console access I couldn't attach identifying information to
a response without changing the rules first.

## The longer-term ethics

The assignment asks about the ethics of this kind of collection, and this project makes the
question sharper than usual, because the subject is a real building in a real city where real
people were displaced.

**What I chose not to collect, and why.** The obvious "better" design — log each response with
a timestamp and a session id — would let me chart opinion over time and detect ballot
stuffing. It would also create a file of individual positions on the reconstruction of a
Syrian monument, attached to a browsing session, held by me indefinitely. For a diaspora
respondent that is not a neutral artefact. The analytical gain is small; the exposure is
open-ended, because data outlives the intentions of whoever gathered it. So the schema stores
counts and nothing else, and the rules make that structural rather than a promise on a page.

**What the guard actually guarantees.** One-vote-per-browser is a `localStorage` flag. A
private window defeats it. I left it weak on purpose: making it robust means fingerprinting or
sign-in, i.e. buying integrity with identity. For a poll whose findings carry no consequence,
that trade is wrong. If the results ever needed to be *authoritative* the honest answer
wouldn't be more surveillance — it would be a different method entirely.

**Who is being asked.** Whoever finds a thesis website is not a sample of anyone. The people
with the most standing to answer this question — those who lived beside al-Adiliyah — are the
least likely to be in the room. Presenting the results as a finding about what *people* want
would be a misrepresentation; they are a record of what an audience for this argument
answered after reading it. The interesting number isn't the winner but the spread: whether an
argument about inference and absence moves people toward the ruin or away from it.

## How I'd use this in a project

The mechanism generalises beyond a poll. What Firestore adds here is a **shared, live state
between visitors**, and that is a different medium from a static page.

- **Disagreement as a layer of the map.** The same tally, but per building part — let people
  mark which losses they consider reconstructible, and render that as a second layer over the
  mosque model, beside the documented damage. The building would then carry two records: what
  was destroyed, and what an audience believes should return. Those two rarely agree, and the
  gap is the actual research object.
- **A visible, contestable archive.** Let visitors submit a photograph or a memory of a
  building and see it enter the reconstruction — turning the point clouds from something I
  authored into something accumulating. That inverts the ethics completely: contributed
  content is identifying by nature, so it would need consent, moderation, a deletion route,
  and a real answer to what happens to it when the thesis is over. The right architecture
  depends entirely on which of those two projects it is, which is exactly why starting with
  the narrowest possible schema is the defensible default.
