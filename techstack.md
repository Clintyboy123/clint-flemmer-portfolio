# Clint Flemmer Portfolio: the tech stack, explained

A plain-language walkthrough of what this website is made of, how the pieces talk to each other, and how it gets
from this computer to the VPS. Written 16 November 2026, alongside the rebuild.

For the day-to-day commands (start, stop, logs, backups) see [README.md](README.md). For every API endpoint and
field see [docs/API.md](docs/API.md).

## Contents

1. [The idea in one paragraph](#1-the-idea-in-one-paragraph)
2. [How a visit works](#2-how-a-visit-works)
3. [The three containers](#3-the-three-containers)
4. [Frontend: the website people see](#4-frontend-the-website-people-see)
5. [The admin](#5-the-admin)
6. [Backend: the API](#6-backend-the-api)
7. [Database](#7-database)
8. [Files: images, video, music, attachments](#8-files-images-video-music-attachments)
9. [Security](#9-security)
10. [Testing](#10-testing)
11. [Deployment with Docker and GitHub Actions](#11-deployment-with-docker-and-github-actions)
12. [Running the live site](#12-running-the-live-site)
13. [Versions](#13-versions)
14. [Known limits and what's next](#14-known-limits-and-whats-next)

---

## 1. The idea in one paragraph

The site looks exactly like the hand-built portfolio it replaces, but everything on it (works, prices, the
services carousel, every line of text, contact details, music) now lives in a database and is edited in a private
admin at `/admin/`. It runs as one self-contained Docker "stack" of three containers, the same shape as every
other site on the VPS, so it can be started, backed up, updated and moved with the same handful of commands.
GitHub Actions tests the whole stack on every change and deploys it to the server when it passes.

## 2. How a visit works

```
Visitor's browser
      |  https://your-domain
      v
VPS Nginx  ─────────────  already on the server: domain, HTTPS certificate. Not part of this project.
      |  http://127.0.0.1:8101
      v
┌──────────────────────── this project's Docker stack ────────────────────────┐
│                                                                              │
│  frontend  (Nginx)                                                           │
│     ├── /            the public site   (React, pre-built files)              │
│     ├── /admin/      the admin         (React, pre-built files)              │
│     ├── /media/      the original work images and videos                     │
│     └── /api/*  ──►  backend  (Node.js + Express)                            │
│                         ├── reads and writes ──►  database  (MySQL)          │
│                         └── stores uploads   ──►  uploads volume             │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

1. The browser asks for the page. Frontend Nginx sends the pre-built React site: one HTML file, one JavaScript
   file, one stylesheet.
2. React starts in the browser and asks the API for the content: `GET /api/site` (text, settings, slides), then
   `/api/works` or `/api/pricing` depending on the page. The preloader covers this, so the visitor never sees an
   empty page.
3. Those `/api` requests go to the same domain. Frontend Nginx passes them to the backend container over Docker's
   private network. The backend reads MySQL and answers in JSON.
4. Moving between pages doesn't reload anything: React swaps the page in place, which is why the music keeps
   playing without a break.

**Why it's built this way:** the browser only ever talks to one address (the site's own domain). The API and the
database have no public door at all, so there's nothing for anyone to attack directly, and no cross-site
(CORS) configuration is needed.

## 3. The three containers

| Container | What runs in it | Reachable from |
| --- | --- | --- |
| `frontend` | Nginx serving the built site, the admin and the original media, and passing `/api` on to the backend | The server itself only (`127.0.0.1:8101`), so only the VPS Nginx can reach it |
| `backend` | Node.js running the Express API | Inside the stack only |
| `database` | MySQL 8.4 | Inside the stack only |

Two **named volumes** hold everything that must survive an update:

- `db_data`: the MySQL database (all content, settings, enquiries, the admin account)
- `uploads`: files uploaded in the admin, and enquiry attachments

Containers are thrown away and recreated on every update; volumes never are. That's why an update never loses
content. The one command that *does* delete volumes is `docker compose down -v`: never run it on the live site.

All three containers have **health checks**. The backend only starts once MySQL reports healthy, and the frontend
only once the backend does. The deployment uses the same checks to decide whether an update worked.

The stack's name (`COMPOSE_PROJECT_NAME=clint-flemmer-portfolio`) keeps its containers, network and volumes
separate from every other site on the VPS.

## 4. Frontend: the website people see

**Folder:** `frontend/` · **Built with:** React, Vite, Tailwind CSS, Motion, React Router, Axios, Lucide

| Tool | What it does here |
| --- | --- |
| **React** | Builds the pages from components (Hero, About, ServicesCarousel, Lightbox, EnquiryForm, ...). JavaScript only, no TypeScript. |
| **Vite** | Turns the source into small, fast files for production (`npm run build`), and runs a live-reloading preview during development. Builds two separate apps: the public site and the admin. |
| **Your stylesheet** (`src/styles/site.css`) | The original `style.css`, moved over unchanged: the 8-point spacing system, the type scale, the Capsize text trimming, optical edges, the red gradient, every hover. |
| **Tailwind CSS 4** | Holds the design tokens (colours, font, easing) in one `@theme` block, matched to the stylesheet. Used for new UI, such as the loading and error states, and for the whole admin. |
| **Motion for React** | Triggers the scroll reveals (the exact timings come from the stylesheet), runs the scroll progress bar and the transitions of the lightbox, menu and page curtain, and respects "reduce motion" settings. |
| **React Router** | The four pages plus a 404, with working links like `/works#motion` and `/#about`. |
| **Axios** | The one place the site talks to the API (`src/services/api.js`). Every error comes back in the same shape, so every screen handles failures the same way. |
| **Lucide** | Icons for new UI. Your own SVG icons from the original site are kept where the design uses them. |
| **Urbanist** | Self-hosted from the build (no Google Fonts call), so the site doesn't depend on a third party and loads faster. |

**One deliberate exception.** The skill this site was built with says "Tailwind for all styling". Here the public
pages keep the original stylesheet instead, because the design depends on precise measurements (text trimmed to
cap-height, optical margins) that would be risky to translate into utility classes, for no visible gain. The
rebuild was measured element by element against the original at desktop, tablet and phone widths: Home, Works and
Pricing match to within a pixel.

**How the code is organised** (`frontend/src/`):

```
pages/          Home, Works, Pricing, Contact, NotFound (thin: they assemble components)
components/
  layout/       Loader, Nav, Footer, SocialRail, MusicControl, WhatsAppButton, ToTop, CursorTag ...
  home/         Hero, PenLogo, About, Programs, Highlights, ServicesCarousel, Process, EtsyBand
  works/        WorkCategory, Piece, SiteCard, Lightbox, IconFlick
  pricing/      PriceCategory, PriceRow
  contact/      EnquiryForm, FileDrop, ContactAside, SentMessage
  ui/           Reveal, SplitText, RichText, PageHero, CategoryBar, CtaBanner, Seo ...
context/        SiteContext (the content), IntroContext (preloader), MusicContext (one audio player for the visit)
hooks/          useReveal, useOpticalEdge, useMagnetic, useHashScroll, useSectionSpy ...
services/       api.js plus one file per area: site, works, pricing, enquiries
lib/            the original pen-drawing animation, wrapped so React can start and stop it
```

**Text formatting.** Content from the admin can use `**bold**`, `~~strike-through~~` and line breaks. The site
turns that into styled text itself: it never inserts raw HTML from the database, which closes off a whole class
of security problems.

**Settings shape the page.** An empty social link hides its icon, no WhatsApp number hides the WhatsApp button,
no Etsy link hides the Etsy band. Nothing ever links to `#`.

## 5. The admin

**Address:** `/admin/` · **Folder:** `frontend/src/admin/`

A separate small React app, so visitors never download it and its styling can never affect the public design.
Built with Tailwind, in the site's own palette and type.

| Area | What you can do |
| --- | --- |
| Dashboard | Counts at a glance and the latest unread enquiries |
| Works | Add, edit, delete and reorder projects and categories; upload images and videos; link live websites |
| Pricing | Add, edit, delete and reorder price rows and categories; "From" prices; "quoted per project" |
| Services | The home page carousel: image, optional video, text, tags, link |
| Page text | Every heading and line on the site, grouped by page, each section saved on its own |
| Settings | Contact email, WhatsApp, Facebook, Instagram, TikTok, Etsy, music on/off and track; change password |
| Enquiries | Inbox for the contact form: read, mark read/unread, download attachments, reply by email, delete |

Public pages cache the content for 60 seconds, so an edit can take up to a minute to appear.

## 6. Backend: the API

**Folder:** `backend/` · **Built with:** Node.js 24, Express 5, Sequelize 6

Every request passes through the same layers, top to bottom:

```
route        which address, which checks (validation, rate limit, signed in?)
controller   reads the cleaned request, calls a service, sends the answer
service      the actual work: the rules of the site and the database queries
model        a description of one database table
```

| Tool | What it does here |
| --- | --- |
| **Express** | The web server for the API. |
| **Sequelize** | Talks to MySQL in JavaScript instead of hand-written SQL, which also protects against SQL injection. |
| **sequelize-cli** | Runs **migrations** (changes to the database structure) and **seeders** (the starting content). |
| **express-validator** | Checks every piece of incoming data (required fields, lengths, valid email, valid links) before anything else happens. |
| **Helmet** | Adds security headers to every API response. |
| **express-rate-limit** | Limits how often one visitor can call the API, submit the contact form or try to sign in. |
| **bcrypt** | Stores the admin password as a one-way hash, never as the password itself. |
| **jsonwebtoken + cookie-parser** | The admin sign-in session, kept in a secure cookie. |
| **multer** | Receives uploaded files. |
| **morgan** | Writes a line to the log for every request (`docker compose logs backend`). |

**What happens when the backend container starts** (`backend/docker-entrypoint.sh`):

1. Wait until MySQL accepts connections (important after a server reboot, when everything starts at once).
2. Apply any new migrations.
3. Load the starting content, **only if it has never been loaded**. Your edits are never overwritten by an update.
4. Start the API.

If step 2 fails, the container stops instead of running against a half-changed database.

**Answers always have the same shape.** Success is `{ "success": true, "data": ... }`, and failure is
`{ "success": false, "message": "...", "errors": [...] }`. Visitors only ever see friendly messages; the full
technical detail goes to the server log.

## 7. Database

**MySQL 8.4**, in its own container, with its data in the `db_data` volume.

| Table | Holds |
| --- | --- |
| `users` | The admin account (password stored as a bcrypt hash) |
| `settings` | Email, WhatsApp, social links, Etsy, music |
| `page_contents` | All the page text, one row per section (hero, about, highlights ...) |
| `work_categories` → `works` | The six Works categories and the 32 projects in them |
| `price_categories` → `price_items` | The six price categories and 28 rows |
| `service_slides` | The home page carousel |
| `enquiries` → `enquiry_files` | Contact form submissions and their attachments |

Relationships are enforced by the database itself. A category can't be deleted while it still has works in it,
and deleting an enquiry deletes its attachment records with it.

**Migrations** (`backend/src/migrations/`) are the history of the database's structure. Each one is a small file
that makes one change and knows how to undo it. They run automatically on every start; one that has already run
is skipped. To change the structure later you add a new migration, never edit an old one.

## 8. Files: images, video, music, attachments

| What | Where it lives | Served at |
| --- | --- | --- |
| The original work images and videos | Inside the frontend image (`frontend/public/media/`) | `/media/work/...` |
| Site images: logo, portrait, icons | Inside the frontend image (`frontend/public/img/`) | `/img/...` |
| The default music track | Inside the frontend image | `/audio/site-music.mp3` |
| Anything uploaded in the admin | The `uploads` volume | `/api/uploads/media/<random name>` |
| Enquiry attachments | The `uploads` volume, private area | Only through the admin, signed in |

Uploads are checked by their actual contents, not just their file extension, so a renamed file can't slip
through. They're given random names, and size limits are enforced in three places (the API, the frontend Nginx and
the VPS Nginx). Deleting a work or slide also deletes its uploaded file, unless something else still uses it.

## 9. Security

- **Only one way in.** The frontend port is bound to `127.0.0.1`, so only the VPS Nginx can reach it. The API and
  database have no published ports at all.
- **Secrets stay on the server.** Passwords and keys live in `.env`, which is never committed to git, never copied
  by the deployment, and never sent to the browser.
- **Admin sign-in:**
  - The session lives in an httpOnly cookie, which page scripts can't read. On the live site it is HTTPS-only.
  - Wrong-email and wrong-password give the same message, so the form doesn't reveal which accounts exist.
  - Changing the password signs out every other session.
  - Sign-in attempts are rate limited separately from the contact form.
- **The contact form:**
  - Every field is validated and rate limited.
  - A hidden "honeypot" field catches simple spam bots.
  - Attachments are checked by their real contents.
- **Every admin endpoint refuses visitors who aren't signed in.** The check is in the API itself, not just a
  hidden button.
- **Security headers:** Helmet on API responses; on the pages, Nginx adds `nosniff`, framing protection and a
  referrer policy. The admin is also marked `noindex` and is blocked in `robots.txt`.
- **No raw HTML from the database** is ever put on a page (see "Text formatting" in section 4).

## 10. Testing

| Test | What it proves | Where it runs |
| --- | --- | --- |
| `scripts/smoke-test.sh` | Builds the real production stack and runs 16 checks. The site, admin and deep links load; the API answers through Nginx with the database connected; content is seeded; the admin refuses visitors who aren't signed in; nothing is exposed that shouldn't be; it survives a backend rebuild and a full restart. | On your Mac, and on GitHub for every change |
| Frontend build | Both apps compile | GitHub, every change |
| Backend syntax check | Every backend file parses | GitHub, every change |
| Deploy health gate | All three containers healthy after an update, or automatic rollback | The VPS, every deploy |

During the rebuild it was also tested by hand: every admin area against the real API; side-by-side screenshots
and measurements against the original site; behaviours tested as a visitor would use them; and a full deploy
rehearsal (first deploy, update, failed update with automatic rollback).

## 11. Deployment with Docker and GitHub Actions

The same pattern as your other sites (FOONGS, the earlier portfolio): **test → build images → push to GitHub's
registry (GHCR) → the server pulls them over SSH**. The server never builds anything itself, and never needs the
source code.

### What happens on every push to `main`

```
push to main
   │
   ▼
1. verify     (GitHub's machine)
   install → build both apps → check the backend → build the real Docker stack → run smoke-test.sh
   │  any failure stops everything here: nothing reaches the server
   ▼
2. image      (GitHub's machine, frontend and backend side by side)
   build each image → push to ghcr.io/<you>/<repo>-frontend and -backend,
   tagged with the commit (sha-3f2a1bc) and "latest"
   │
   ▼
3. deploy     (over SSH, on the VPS)
   copy docker-compose.yml + deploy/deploy.sh → run deploy.sh, which:
     a. backs up the database and uploads into backups/
     b. writes the new image names into .env
     c. pulls the images and restarts the stack
     d. waits until all three containers are healthy
     e. if not healthy: puts the previous images back and restarts (automatic rollback), and fails the job
     f. removes old images; keeps the last 14 backups
   │
   ▼
4. check      (GitHub's machine): the live site and /api/health answer (when SITE_URL is set)
```

Pull requests only run step 1, so you see whether a change is safe before merging it. Dependabot opens weekly pull
requests for package updates, and each one goes through the same test.

### Why images and not source code on the server

- What was tested on GitHub is exactly what runs on the server, byte for byte.
- The VPS doesn't need Node.js, build tools or the source code, just Docker.
- Every version stays in the registry, tagged with its commit, so going back is one command.
- Builds don't eat the server's CPU and memory while it's serving the live sites.

### What the deployment never touches

The server's `.env`, the `db_data` volume (all content and enquiries) and the `uploads` volume. Only the two
application images, `docker-compose.yml` and `deploy/deploy.sh` are updated.

### One-time setup

**1. GitHub repository**

```bash
cd ~/Projects/clint-flemmer-portfolio
```

```bash
git init -b main && git add . && git commit -m "Portfolio rebuild: React + Express + MySQL on Docker"
```

Create an empty **private** repository on GitHub, then:

```bash
git remote add origin git@github.com:<you>/clint-flemmer-portfolio.git && git push -u origin main
```

`.env`, `node_modules`, builds and backups are in `.gitignore` and never go to GitHub.

**2. Repository secrets** (GitHub → the repo → Settings → Secrets and variables → Actions)

| Secret | Value |
| --- | --- |
| `DEPLOY_HOST` | The VPS hostname or IP |
| `DEPLOY_USER` | The SSH user that deploys (must be in the `docker` group) |
| `DEPLOY_SSH_KEY` | That user's private key (ed25519 recommended) |
| `DEPLOY_PATH` | The site's folder on the VPS, e.g. `/srv/clint-flemmer-portfolio` |
| `DEPLOY_PORT` | Optional: the SSH port, if it isn't 22 |

Optional **variable** (same page, Variables tab): `SITE_URL`, e.g. `https://clintflemmer.co.za`. With it set, each
deployment links to the site and checks it answers.

If you use the same deploy user and key as your other sites, the first four values are the same as theirs, apart
from `DEPLOY_PATH`.

**3. On the VPS (once)**

Create the folder and the settings file:

```bash
sudo mkdir -p /srv/clint-flemmer-portfolio && sudo chown "$USER" /srv/clint-flemmer-portfolio
```

Copy `.env.example` there as `.env` and fill it in with **new** values for the server, not your Mac's. In
particular, set these:

- `FRONTEND_PORT`: a port no other site uses
- `MYSQL_PASSWORD`, `MYSQL_ROOT_PASSWORD` and `JWT_SECRET`: generated with `openssl rand -base64 32`
- `ADMIN_EMAIL` and `ADMIN_PASSWORD`: your real admin login

Let the server pull from GHCR. Use a GitHub token with only the `read:packages` permission (skip this if the server
is already logged in for your other sites):

```bash
echo "<token>" | docker login ghcr.io -u <github-username> --password-stdin
```

Add the site to the VPS Nginx using the server block in [README.md](README.md) ("VPS Nginx"), pointing at
`http://127.0.0.1:<FRONTEND_PORT>`, issue the certificate the way you do for your other sites, and reload Nginx.

**4. First deploy**

Push to `main` (or run the workflow by hand: Actions → CI/CD → Run workflow). The first start creates the
database, runs the migrations, loads the starting content and creates your admin account. Then sign in at
`https://<domain>/admin/` and fill in Settings.

### Rolling back by hand

Every deploy is tagged with its commit. On the VPS, in the site's folder, pick an earlier tag from the repo's
Packages page or the Actions history, then run:

```bash
./deploy/deploy.sh ghcr.io/<you>/clint-flemmer-portfolio-frontend:sha-<old> ghcr.io/<you>/clint-flemmer-portfolio-backend:sha-<old>
```

It backs up first, like any deploy. If a database migration was the problem, also restore the backup taken just
before the bad deploy (`backups/db-<date>.sql.gz`, restore command in the README).

### Deploying without GitHub (fallback)

The stack also runs straight from the source on any Docker host: copy the project (without `node_modules`), add a
`.env`, then run:

```bash
docker compose up -d --build
```

Leave `FRONTEND_IMAGE` and `BACKEND_IMAGE` out of `.env` and the server builds the images itself.

### What the deploy rehearsal proved

On 16 November 2026 `deploy/deploy.sh` ran against a simulated server: a separate stack on this Mac, pulling
images from a local registry in place of GHCR. Every scenario passed:

| Scenario | Result |
| --- | --- |
| First deploy, empty server | Database created, content seeded, all healthy; no backup (nothing to back up yet) |
| Normal update | Database and uploads backed up first, new version live and healthy |
| Update whose backend crashes on start | Rolled back to the previous version by itself; site stayed up; job reported failure |
| Deploy while the live backend is crash-looping | Backup still worked; healthy afterwards |
| Manual rollback to an older version | Worked, with a backup first |
| Content after all of the above | Intact (6 categories, 32 works) |

The rehearsal also found and fixed three bugs before they could reach the server:

- a successful first deploy reported failure;
- the automatic rollback never ran when the new backend crashed;
- the uploads backup failed while the backend was down.

**Not yet proven:**

- the GitHub Actions run itself (it needs the repository and secrets);
- the SSH step;
- a real deployment behind the VPS Nginx with HTTPS.

The first real push to `main` will show all three.

## 12. Running the live site

All from the site's folder on the VPS:

| Task | Command |
| --- | --- |
| Is it healthy? | `docker compose ps` |
| Logs | `docker compose logs -f backend` (or `frontend`, `database`) |
| Back up now | The two commands under "Back up the database" in the README |
| Restart | `docker compose restart` |
| Stop (keeps data) | `docker compose down` |
| Which version is live? | `grep IMAGE .env` |

Automatic backups are taken before every deploy. Copy the `backups/` folder off the server regularly, because a
backup that only exists on the same machine doesn't protect against losing that machine.

## 13. Versions

Current stable versions on 16 November 2026, pinned in each `package-lock.json`.

| Frontend | Version | Backend | Version |
| --- | --- | --- | --- |
| React / React DOM | 19.3.1 | Node.js (Docker image) | 24 (alpine) |
| Vite | 8.3.8 | Express | 5.3.0 |
| @vitejs/plugin-react | 6.3.0 | Sequelize | 6.37.8 |
| Tailwind CSS + @tailwindcss/vite | 4.3.5 | sequelize-cli | 6.6.5 |
| Motion | 14.14.0 | mysql2 | 3.24.6 |
| React Router | 8.5.1 | Helmet | 8.3.0 |
| Axios | 1.21.1 | express-rate-limit | 8.7.4 |
| Lucide React | 1.73.0 | express-validator | 7.3.2 |
| Urbanist (Fontsource, variable) | 5.3.0 | bcrypt | 6.0.0 |
| Nginx (Docker image) | stable-alpine | jsonwebtoken | 9.0.3 |
| | | cookie-parser | 1.4.7 |
| | | multer | 2.5.0 |
| | | morgan | 1.12.1 |
| | | dotenv | 18.0.10 |
| | | MySQL (Docker image) | 8.4 |

Sequelize stays on version 6 on purpose: version 7 is still in alpha.

## 14. Known limits and what's next

- **Search engines and link previews.** The pages are drawn in the browser, so search engines and link previews see
  less than they did with the old static HTML. Google still indexes the site; each page sets its own title and
  description, and the share tags are in `index.html`. If search traffic becomes important, pre-rendering the four
  public pages would close the gap.
- **No email alerts for new enquiries yet.** They're saved to the admin inbox. Adding alerts needs your mail
  service's SMTP details.
- **Placeholders carried over from the old site:** contact email, WhatsApp, social links, Etsy. These are set in
  admin → Settings.
- **Music licence:** confirm "Dreamy Chill 2" may be used on a public website.
- **Browsers:** tested in Chrome on desktop and phone widths only. Safari, Firefox and real phones still need a
  look.
- **Admin:** works, prices and slides are reordered with up/down arrows; drag-and-drop can be added later.
- **Works page at 768–820px wide:** one project in the 3D gallery is cut off. This came over from the original
  site; the page no longer scrolls sideways because of it, but a full fix slightly changes the gallery layout at
  every width.
