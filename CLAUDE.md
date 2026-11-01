# PataBook — language rules (always follow when adding/changing any page)

1. Default language = English. Language is stored in localStorage key `pb-lang`.
   Only the value `"hi"` means Hindi; empty / missing / anything else = English.
   Use exactly: `(localStorage.getItem("pb-lang")||"en")!=="hi"`  (never `==="en"`, never default to "hi").
2. Public site pages: use `PB.lang()` (i18n.js). Panels (admin/team): `pb-panel-lang.js` (PBL) + dictionaries in `lang/panel-*-en.js`.
   Forms: `data-en` / `data-en-ph` attributes or `EN()?english:hindi` pairs.
3. Every new label, placeholder, option, error message, popup, aria-label/title MUST have both Hindi and English.
   English mode must show no Devanagari; Hindi mode must show no English sentences (brand names / technical words excepted).
4. Test before push: open page with no `pb-lang` (expect English) and with `pb-lang=hi` (expect Hindi), click through every step/popup.
5. New popup/overlay must support the phone Back button.
