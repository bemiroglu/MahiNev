# Independent back-translation audit — Mâh-ı Nev language packs

You audit a translation that someone else made. The program is an offline crescent-sighting assistant strictly based on
the Turkish book Tam İlmihâl Se’âdet-i Ebediyye (English version: Endless Bliss, "EB"). It never declares a month has begun
without a sighting; it states calculated possibility only, with conditional wording. Rulings from the book must keep their
exact strength (e.g. "cannot be seen" = definite rejection; "possible"; "may be one day later, cannot be one day earlier").

Directory: /tmp/claude-0/-home-user-MahiNev/cdb8989a-67c6-5ece-905d-5a3d104adce1/scratchpad/ceviri

## Step 1 — blind back-translation (do NOT open any .tr.js or .en.js file before Step 1 is written)
For each of your chunks C, read only `kaynak/C.<lang>.js` and translate every human-readable string back into Turkish,
literally and faithfully (do not polish, do not "correct" toward what you think the original was). Write it to
`geri/C.<lang>.geri.txt`, one item per line: `<key path>\t<Turkish back-translation>` (key path like `T.cls.below8[1]`,
`TOPICS.rasad[2]`, `CANON[12]`; for functions write the template text with ${…} kept). Skip pure proper names/symbols.

## Step 2 — comparison
Now open `kaynak/C.tr.js` (authoritative Turkish) and, for terms/citations, `kaynak/C.en.js` and
`YONERGE.md` (the translation brief with the glossary). Compare your back-translation with the Turkish original, item by item,
for MEANING. Flag:
- meaning shift, omission, addition, wrong ruling strength (certain ↔ possible, conditional lost), negation errors;
- wrong or inconsistent terms vs the glossary (e.g. crescent rendered as "new moon"/"nouvelle lune"/"luna nueva"),
  wrong month names;
- citations not in the language's EB form (fr "EB V, p. 137", es "EB V, pág. 137", bs "EB V, str. 137") or wrong numbers;
- untranslated English/Turkish left in the text, grammar errors that change sense, broken placeholders.
Do not flag harmless stylistic differences.

## Step 3 — fix and report
- Fix each real problem directly in `kaynak/C.<lang>.js` (minimal edits; keep structure). Then run
  `node /home/user/MahiNev/tools/dil/pack_check.js kaynak/C.<lang>.js kaynak/C.en.js` — it must print "yapı tamam".
- Write `geri/C.<lang>.rapor.md` (in Turkish): a header line with counts (items checked, problems found, fixed), then a
  table: `| Anahtar | Sorun türü | Aslı (TR, kısa) | Geri çeviri (kısa) | Düzeltme (hedef dilde) |`. Keep cells short.
  End with 2–3 sentences: overall fidelity assessment and anything left for a human to decide.
Write ONLY these files. Final reply: one or two lines (counts and check result).
