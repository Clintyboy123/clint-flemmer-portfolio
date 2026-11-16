# API contract

The single source of truth for what the backend serves and what the frontend calls. Everything is under `/api`.

Response shape (always): `{ "success": true, "data": ..., "message"?: "...", "meta"?: {...} }` or
`{ "success": false, "message": "...", "errors"?: [{ "field", "message" }] }`.
Status codes: 200, 201, 204, 400, 401, 403, 404, 409, 413, 422, 429, 500, 503.

Text fields that allow light formatting use a tiny inline format, never HTML:
`**bold**`, `~~struck through~~`, and a newline for a line break. The frontend renders it safely.

Media paths are stored as site-relative URLs: seeded files live at `/media/work/...` (served by Nginx from
`frontend/public`), admin uploads at `/api/uploads/media/<file>` (served by the API from the uploads volume).

## Public

| Method | Path | Notes |
| --- | --- | --- |
| GET | `/health` | Starter health check. |
| GET | `/site` | Everything the site frame needs in one call. `data: { settings, content, services }` (shapes below). |
| GET | `/works` | `data: [WorkCategory]`, ordered by `position`, each with its `works` ordered by `position`. |
| GET | `/pricing` | `data: [PriceCategory]`, ordered, each with `items` ordered. |
| POST | `/enquiries` | `multipart/form-data`. Rate limited (formLimiter). Returns 201 `{ data: { id } }`. |

`POST /enquiries` fields: `name`* (≤120), `email`* (valid, ≤254), `phone` (≤40), `company` (≤160),
`services`* (repeated field, 1–7 values, each ≤60), `budget` (≤120), `deadline` (≤120), `brief`* (≤5000),
`referenceLinks` (≤2000), `website` (honeypot: must be empty), files in `attachments` (max 5 files, 10 MB in
total, images or PDF only, checked by content not just extension). Validation failure → 422 with `errors`.

## Shapes

```
settings      { email, whatsapp, whatsappUrl, facebook, instagram, tiktok, etsy, musicEnabled (bool), musicTrack }
              whatsapp is what the admin typed (e.g. "082 123 4567"); whatsappUrl is derived ("https://wa.me/27821234567", or "").
              musicTrack is a URL path ("/audio/site-music.mp3" by default). Empty string = not set.
content       { [key]: object }   (keys and shapes under "Page content")
services      [ServiceSlide]
ServiceSlide  { id, title, text, tags, image, video (or null), link, linkLabel, position }
              tags is one string ("Campaigns · Billboards · Print"); link is a site path ("/works#graphic", "/contact").
WorkCategory  { id, slug, name, intro, tags: [string], layout: "gallery" | "sites", position, works: [Work] }
Work          { id, categoryId, title, description, meta, image, imageWidth, imageHeight, video (or null), url (or null), position }
              video = a playable file for the lightbox; url = a live website (layout "sites").
PriceCategory { id, slug, name, intro, position, items: [PriceItem] }
PriceItem     { id, categoryId, title, detail, amount (integer rand, or null = "Get a quote"), isFrom (bool), position }
Enquiry       { id, name, email, phone, company, services: [string], budget, deadline, brief, referenceLinks,
                isRead (bool), createdAt, files: [{ id, originalName, mime, size }] }
User          { id, name, email }
```

## Page content (`content` keys)

```
home.hero        { hi, title, sub, primaryLabel, secondaryLabel, meta }
home.about       { eyebrow, heading, roleTitle, roleOrg, roleYears, bio1, bio2, availability,
                   skills: [{ title, items: [string] }], programsTitle, programs: [{ name, percent }] }
home.highlights  { title, statLabel, statNumber, statVs, client, heading, body, costsLabel, costs: [string], tags: [string] }
home.services    { eyebrow, heading }
home.process     { eyebrow, heading, steps: [{ title, text }] }
home.etsy        { eyebrow, heading, buttonLabel }
home.cta         { lead, heading, buttonLabel }
cta.brief        { lead, heading, buttonLabel }
works.header     { eyebrow, title, intro }
pricing.header   { eyebrow, title, intro }
contact.header   { eyebrow, title, intro }
contact.aside    { nextTitle, nextSteps: [string], talkTitle, followTitle }
footer           { contactTitle, locationTitle, location, followTitle, copyright }
seo              { home: { title, description }, works: {...}, pricing: {...}, contact: {...} }
```

## Auth (cookie session)

| Method | Path | Notes |
| --- | --- | --- |
| POST | `/auth/login` | `{ email, password }`. formLimiter. Sets an httpOnly cookie. `data: { user }`. Wrong details → 401, one message for both cases. |
| POST | `/auth/logout` | Clears the cookie. 200. |
| GET | `/auth/me` | `data: { user }`, or 401 when not signed in. |
| PUT | `/auth/password` | Signed in. `{ currentPassword, newPassword (≥10 chars) }`. Wrong current password → 422 on `currentPassword`. |

## Admin (all require the session cookie; 401 otherwise). Prefix `/admin`

| Method | Path | Body / result |
| --- | --- | --- |
| GET | `/dashboard` | `data: { works, workCategories, priceItems, serviceSlides, enquiries, unreadEnquiries }` (counts). |
| GET | `/settings` | `data: settings`. |
| PUT | `/settings` | `{ email, whatsapp, facebook, instagram, tiktok, etsy, musicEnabled, musicTrack }` (any subset). URLs must be http(s) or empty. Returns the saved settings. |
| GET | `/content` | `data: content` (all keys). |
| PUT | `/content/:key` | `{ data: object }`. Key must be one of the known keys. Values may only be strings, numbers, booleans, arrays and plain objects; ≤ 20 kB as JSON. Returns `{ key, data }`. |
| GET | `/work-categories` | Same as public `/works`. |
| POST | `/work-categories` | `{ name*, slug* (a–z, 0–9, dashes; unique), intro, tags: [string], layout }` → 201. |
| PUT | `/work-categories/:id` | Same fields, any subset. |
| DELETE | `/work-categories/:id` | 409 if it still has works. |
| PUT | `/work-categories/order` | `{ ids: [id, ...] }` sets `position` by array order. |
| POST | `/works` | `{ categoryId*, title*, description, meta, image*, imageWidth, imageHeight, video, url }` → 201. Added at the end. |
| PUT | `/works/:id` | Same fields, any subset (may move category). |
| DELETE | `/works/:id` | 204. Also deletes its uploaded files when they live under `/api/uploads/media/`. |
| PUT | `/works/order` | `{ categoryId, ids: [...] }`. |
| GET | `/price-categories` | Same as public `/pricing`. |
| POST | `/price-categories` | `{ name*, slug*, intro }` → 201. |
| PUT | `/price-categories/:id` | Any subset. |
| DELETE | `/price-categories/:id` | 409 if it still has items. |
| PUT | `/price-categories/order` | `{ ids }`. |
| POST | `/price-items` | `{ categoryId*, title*, detail, amount (int ≥ 0 or null), isFrom }` → 201. |
| PUT | `/price-items/:id` | Any subset. |
| DELETE | `/price-items/:id` | 204. |
| PUT | `/price-items/order` | `{ categoryId, ids }`. |
| GET | `/service-slides` | `data: [ServiceSlide]`. |
| POST | `/service-slides` | `{ title*, text, tags, image*, video, link, linkLabel }` → 201. |
| PUT | `/service-slides/:id` | Any subset. |
| DELETE | `/service-slides/:id` | 204. |
| PUT | `/service-slides/order` | `{ ids }`. |
| POST | `/uploads` | `multipart/form-data`, one file in `file`. Images (jpg, png, webp, avif, gif) ≤ 10 MB, video (mp4, webm) ≤ 60 MB, audio (mp3) ≤ 15 MB, checked by content. → 201 `data: { url, mime, size }`. |
| GET | `/enquiries?page=1&pageSize=20` | Newest first. `data: [Enquiry]` (with `files`), `meta: { page, pageSize, total, unread }`. |
| GET | `/enquiries/:id` | `data: Enquiry`. |
| PATCH | `/enquiries/:id` | `{ isRead }`. |
| DELETE | `/enquiries/:id` | 204. Deletes its files from disk too. |
| GET | `/enquiries/:id/files/:fileId` | Streams the attachment (`Content-Disposition: attachment`). Never public. |

## Files served by the API

`GET /api/uploads/media/<file>`: public, long cache, supports range requests (video). Enquiry attachments are
stored outside this folder and are only reachable through the authenticated route above.
