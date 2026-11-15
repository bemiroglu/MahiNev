# Translation brief — Mâh-ı Nev language packs (fr, es, bs)

Mâh-ı Nev is an offline crescent-sighting (rü'yet-i hilâl) assistant. It is strictly based on the Turkish book
**Tam İlmihâl Se’âdet-i Ebediyye** (Hakîkat Kitâbevi). Its English version is **Endless Bliss** (EB). The program is not
a calendar: it shows only the *calculated possibility* of seeing the crescent and never declares that a month "has begun"
without a sighting. Keep this cautious, conditional tone exactly ("possible", "visible by calculation", "if it is seen and
established …"). Never turn a conditional into a certainty.

## Sources and authority
- `kaynak/<chunk>.tr.js` = the authoritative Turkish text (MEANING comes from here).
- `kaynak/<chunk>.en.js` = the English text, already aligned with Endless Bliss. Use it for TERMS, for sentences quoted from
  the book, for citation form, and as a structural template. Where Turkish and English differ slightly, follow the Turkish
  meaning but keep the English citations (EB …) — the Turkish has "s. 360" style page numbers which must NOT appear.
- There is no French/Spanish/Bosnian translation of Tam İlmihâl. Do not invent quotations; translate the English EB wording
  of quoted sentences faithfully.
- The program's stance: calendar-unification criteria (2016 "Turkey" criterion, MABIMS, Wujudul Hilal, IQG…) are rejected.
  Do not soften such statements.

## Output format (strict)
- Write `<chunk>.<lang>.js` in the same directory layout as the sources: a single JavaScript object literal with EXACTLY the
  same keys, the same nesting, the same array lengths and the same order as `<chunk>.en.js`.
- Translate only human-readable text inside string literals and template literals.
- Functions (arrow functions) must keep the same parameter list and the same `${…}` expressions and logic. You may reorder
  words around the `${…}` placeholders and adapt grammar (plural branches like `n > 1 ? … : …` can be kept or adapted, but
  keep conditions working). Do not add new variables.
- Keep unchanged: keys, URLs, HTML tags and attributes, CSS classes, symbols (°, ′, ″, ▶, ◀, ⓘ, ↶, ↷, ⚙, →, ·, ≈, ≥, ≤),
  numbers, units (°, m, km, UT), "Mâh-ı Nev", "Tam İlmihâl", "Tam İlmihâl Se’âdet-i Ebediyye", "Endless Bliss",
  "Hakîkat Kitâbevi", "Astronomy Engine", "Yallop", "Odeh", "ARCV", "DAZ", "SD", "HP", "JSON", "SHA-256", "PNG", "JPG", "PDF", "CSV",
  "ZIP", "A4", Turkish book/paper titles in <em> (e.g. <em>Naklî ve Aklî Delîllerle Rü’yet-i Hilâl</em>), personal names.
- File-name slugs (SLUG) must be lowercase ASCII with hyphens, no accents (e.g. fr "plan-d-observation").
- Use JSON-style double-quoted strings or keep the template literals; the file must parse as JS. Escape inner double quotes
  or use typographic quotes. Do not use backticks inside template literals.
- Short UI labels (buttons, tabs, table headers, select options) must stay short — roughly the English length.
- Decimal separator in prose: comma for fr, es and bs ("7,5°", "29,53 jours"). In function code keep the code as is.
- After writing, run:  `node /home/user/MahiNev/tools/dil/pack_check.js <your file> <the .en.js file>`
  It must print "yapı tamam" (structure OK). Fix every "HATA". Review "uyarı" (warnings): "çevrilmemiş görünüyor" means a
  string identical to English — fine only for proper names, otherwise translate it.

## Citations
English form: "EB V, p. 137", "EB V, pp. 55–57", "EB IV, p. 160". Use:
- fr: "EB V, p. 137", plural "EB V, p. 55–57" (French uses "p." for both)
- es: "EB V, pág. 137", plural "EB V, págs. 55–57"
- bs: "EB V, str. 137", plural "EB V, str. 55–57"
The S.pg function (page label) adapts the same way. "EB" stays "EB". Fascicle numbers stay Roman.

## Typography
- fr: guillemets « … » with a no-break space (U+00A0) inside; no-break space before : ; ! ? and before %.
- es: comillas “…”; ¿…? and ¡…! where needed.
- bs: „…“ quotation marks. Latin script, ijekavian (e.g. "vrijeme", "mjesec", "lijevo"), Bosnian (not Serbian/Croatian
  lexical choices where they differ: e.g. "hiljada", "historija", "sedmica").
- Apostrophe in Arabic-Turkish terms is the typographic ’ (Sha’bân, ijtimâ’).

## Terms (use consistently)
| Turkish | English (program) | French | Spanish | Bosnian |
|---|---|---|---|---|
| hilâl | crescent (new moon in EB) | croissant (lunaire) — never "nouvelle lune" for the crescent | el creciente (lunar) — MASCULINE ("la creciente" means a flood); never "luna nueva" for the crescent | hilal (mlađak); use "hilal" |
| rü’yet | sighting (ru’yat) | observation, vue du croissant (ru’yat) | avistamiento (ru’yat) | viđenje (ru’jet) |
| rasad / râsıd | observation / observer (râsid) | observation / observateur | observación / observador | osmatranje / osmatrač |
| ictimâ | conjunction (ijtimâ’) | conjonction (ijtimâ’) | conjunción (ijtimâ’) | konjunkcija (idžtima’) |
| muhak | muhâq | muhâq | muhâq | muhâq |
| beynûnet | beynûnet (elongation) | beynûnet (élongation) | beynûnet (elongación) | beynûnet (elongacija) |
| ihtilâf-ı manzar | parallax | parallaxe | paralaje | paralaksa |
| irtifâ | altitude | hauteur (altitude) | altura | visina |
| semt | azimuth | azimut | acimut | azimut |
| gurûb / şer’î gurûb | sunset / shar’î sunset | coucher du soleil / coucher shar’î | puesta del sol / puesta shar’î | zalazak sunca / šer’i zalazak |
| zâhirî / hakîkî | apparent / true | apparent / vrai | aparente / verdadero | prividni / pravi |
| üfk-ı şer’î | shar’î horizon | horizon shar’î | horizonte shar’î | šer’i horizont |
| temkin | Tamkin | Tamkin | Tamkin | temkin |
| ezânî saat | adhânî time | heure adhânî | hora adhânî | ezani vrijeme |
| hesâbî | calculated / computed | calculé | calculado | izračunati (hesabi) |
| Ramezân | Ramadân | Ramadan | Ramadán | Ramazan |
| Ramazan bayramı | ’Iyd of Fitr | Aïd al-Fitr | ’Id al-Fitr | Ramazanski bajram |
| Kurban bayramı | ’Iyd of Qurbân | Aïd al-Qurbân | ’Id de Qurbân | Kurban-bajram |
| bayram | ’Iyd | Aïd | ’Id | bajram |
| kurban | qurbân (sacrifice) | qurbân (sacrifice) | qurbân (sacrificio) | kurban |
| Arefe | ’Arafa | ’Arafa | ’Arafa | Arefe |
| kâdî | Qâdî | qâdî (juge) | qâdî (juez) | kadija |
| âdil | ’âdil (just) | ’âdil (juste) | ’âdil (justo) | adil (pravedan) |
| şâhid / şahitlik | witness / testimony | témoin / témoignage | testigo / testimonio | svjedok / svjedočenje |
| vâcib-i kifâye | wâjib-i kifâya | wâjib-i kifâya | wâŷib-i kifâya | vadžib-i kifaje |
| kazâ | qadâ | qadâ (rattrapage) | qadâ | kada (naknada) |
| oruç | fast | jeûne | ayuno | post |
| namaz / vakit | prayer (namâz) / prayer time | prière (namâz) / heure de prière | namâz / tiempo del namâz | namaz / namasko vrijeme |
| akşam / yatsı | evening (maghrib) / night prayer (’ishâ) | maghrib / ’ichâ’ (prière de la nuit) | maghrib / ’ishâ | akšam / jacija |
| şafak; kızıllık / beyazlık | shafaq; redness / whiteness | shafaq (crépuscule); rougeur / blancheur | shafaq (crepúsculo); rojez / blancura | šafak; crvenilo / bjelina |
| fecr-i sâdık | fajr-i sâdiq (true dawn) | fajr-i sâdiq (aube vraie) | fajr-i sâdiq (alba verdadera) | fedžr-i sadik (prava zora) |
| ihtiyât | precaution | précaution | precaución | opreznost (ihtijat) |
| hicrî | Hijri | hégirien (de l’Hégire) | de la Hégira (hiŷrî) | hidžretski |
| takvim | calendar | calendrier | calendario | takvim (kalendar) |
| Işık usulü | Işık method | méthode Işık | método Işık | metoda Işık |
| Uluğ Bey, Kindî, Ebüzziyâ | Uluğ Bey, Kindî, Abuzziyâ | same | same | same |
| Osmanlı âlimleri | Ottoman scholars | savants ottomans | sabios otomanos | osmanski učenjaci (alimi) |
| İmâm-ı a’zam / İmâmeyn | Imâm-i a’zam / Imâmeyn | Imâm-i a’zam / Imâmeyn | Imâm-i a’zam / Imâmeyn | Imam-i A’zam / Imamejn |
| İmâm-ı Sübkî | Imâm-i Subkî | Imâm-i Subkî | Imâm-i Subkî | Imam-i Subki |
| İbni Âbidîn | Ibni ’Âbidîn | Ibni ’Âbidîn | Ibni ’Âbidîn | Ibni Abidin |
| Kâdîhân | Qâdî-Khân | Qâdî-Khân | Qâdî-Khân | Kadihan |
| Ehl-i sünnet | Ahl as-Sunnat | Ahl as-Sunna | Ahl as-Sunnat | Ehl-i sunnet |
| Hanefî | Hanafî | hanafite | hanafí (Hanafî) | hanefijski |
| gözlem gecesi | observation night / watch night | nuit d’observation | noche de observación | noć osmatranja |
| kesin red | rejected (definite) | rejet certain | rechazo definitivo | sigurno odbijanje |
| ek bilgi | additional information | information complémentaire | información adicional | dodatna informacija |
| Kongre tebliği | congress paper | communication au congrès | ponencia del congreso | kongresni referat |
| Diyanet | Presidency of Religious Affairs | Présidence des affaires religieuses (Diyanet) | Presidencia de Asuntos Religiosos (Diyanet) | Diyanet (Predsjedništvo za vjerske poslove) |

Hijri month names (MONTHS):
- fr: Muharram, Safar, Rabî’ al-awwal, Rabî’ al-âkhir, Jumâdâ al-ûlâ, Jumâdâ al-âkhira, Rajab, Sha’bân, Ramadan, Shawwâl, Dhû al-qa’da, Dhû al-hijja
- es: Muharram, Safar, Rabî’ al-awwal, Rabî’ al-âjir, Ŷumâdà al-ûlà, Ŷumâdà al-âjira, Rayab, Sha’bân, Ramadán, Shawwâl, Dhu’l-qa’da, Dhu’l-hiŷŷa
- bs: Muharrem, Safer, Rebiu-l-evvel, Rebiu-l-ahir, Džumade-l-ula, Džumade-l-uhra, Redžeb, Ša’ban, Ramazan, Ševval, Zu-l-ka’de, Zu-l-hidždže
Use the same month spellings wherever a month is named in running text of that language.

## Special items
- GX.srcRead: describe Endless Bliss as the English version of Tam İlmihâl (six fascicles), explain "EB V, p. 137" in your
  language's citation form, keep the editions sentence, and ADD one sentence: quotations from Tam İlmihâl in this program
  are translated from Endless Bliss (fr: « Les passages cités de Tam İlmihâl sont traduits de Endless Bliss. »; es: “Los
  pasajes citados de Tam İlmihâl están traducidos de Endless Bliss.”; bs: „Navodi iz Tam İlmihâla prevedeni su iz Endless Blissa.“).
- GX.canonNote: "<Language> rendering of the Turkish canonical text. The Turkish text is authoritative."
- GX.srcBook: keep the EB citation list, but in your citation form; "January 2026 printing" translated.
- CANON (canonical text): translate from the Turkish (tr file) faithfully and completely, paragraph by paragraph (same
  number of paragraphs), using the English as a guide. Keep the concept "the birth of the crescent" (hilâlin doğması,
  a calculation) distinct from "the sighting of the crescent" (rü’yet).
- Language/script names in T (e.g. language selector) — keep as in English if they are names of languages.
- CITIES / MAPCITIES: use the usual exonym in your language (fr: La Mecque, Médine, Le Caire, Londres…; es: La Meca,
  Medina, El Cairo, Londres, Nueva York…; bs: Meka, Medina, Kairo, London, Istanbul, Sarajevo…).
- CARD16 / STX.card8: compass point abbreviations in your language (fr N, NNE, NE, ENE, E, ESE, SE, SSE, S, SSO, SO, OSO,
  O, ONO, NO, NNO; es N, NNE, NE, ENE, E, ESE, SE, SSE, S, SSO, SO, OSO, O, ONO, NO, NNO; bs S, SSI, SI, ISI, I, IJI, JI,
  JJI, J, JJZ, JZ, ZJZ, Z, ZSZ, SZ, SSZ).
- SX.dec / STX.dec: "," for all three languages. STX.star stays 1 (English star names).
