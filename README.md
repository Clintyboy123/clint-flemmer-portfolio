# Clint Flemmer Portfolio

Portfolio site for Clint Flemmer, multimedia designer: Home, Works, Pricing and Contact, with a private admin at `/admin` for editing the content and reading enquiries.

- **Domain:** YOUR-DOMAIN.TLD
- **Compose project name:** `clint-flemmer-portfolio`
- **Host port (VPS Nginx forwards here):** `8101`

## How it fits together

```
Browser
   |
VPS Nginx  (HTTPS, domain; lives on the server, not in this project)
   |
frontend container  (Nginx: serves the built React site)
   |-- /api/*  -->  backend container  (Express API)
                        |
                    database container  (MySQL, data kept in a Docker volume)
```

Only the frontend is reachable from the server itself (on `127.0.0.1:8101`). The API and the database
can only be reached from inside this site's own Docker network. Every website on the VPS is its own stack like
this one, with its own database, so sites cannot affect each other.

## Technologies

| Part | Built with |
| --- | --- |
| Frontend | React (JavaScript), Vite, Tailwind CSS, Motion for React, React Router, Axios, Lucide React |
| Backend | Node.js, Express, Sequelize, express-validator, Helmet, express-rate-limit |
| Database | MySQL 8.4 |
| Hosting | Docker Compose, Nginx |

## Folders

```
frontend/   the website people see
  src/pages        one file per page
  src/components   reusable pieces (ui/ = buttons, fields, cards ...)
  src/layouts      shared page frames (header, footer)
  src/services     api.js: the one place that talks to the backend
  src/styles       index.css: colours, fonts and easing (the design tokens)
  nginx/           how the site and /api are served in production
backend/    the API and business logic
  src/routes -> controllers -> services -> models   one request, top to bottom
  src/migrations   every change to the database structure, in order
  src/seeders      starting data
docker-compose.yml       the production stack
docker-compose.dev.yml   extra settings for local development only
.env.example             list of settings; copy to .env
scripts/smoke-test.sh    builds the stack and checks it works
deploy/deploy.sh         run on the VPS by GitHub Actions: backup, update, health check, rollback
.github/workflows/       the CI/CD pipeline
techstack.md             the whole stack and the deployment, explained
```

## Settings (.env)

```bash
cp .env.example .env
```

Open `.env` and set the name, port and passwords. Generate each password with:

```bash
openssl rand -base64 32
```

`.env` holds real passwords. It is ignored by git and must never be committed or sent to anyone.

Settings specific to this site:

| Setting | What it is |
| --- | --- |
| `JWT_SECRET` | Signs the admin login cookie. Generate with `openssl rand -base64 48`. Changing it signs everyone out. |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_NAME` | The admin account, created the first time the site starts and only then. Afterwards, change the password inside the admin (Settings). |

> **Before going live:** the domain above is a placeholder, and port `8101` must be free on the VPS. Set both for real,
> and set `ADMIN_EMAIL` to your own address before the first start on the server.

## Run it

Build and start (also the command for the first launch on the VPS):

```bash
docker compose up -d --build
```

Check that all three containers are `healthy`:

```bash
docker compose ps
```

Stop the site (the database is kept):

```bash
docker compose down
```

> Never add `-v` to `down` unless you mean to delete the database. `docker compose down -v` erases all saved data.

Full check of the production build:

```bash
./scripts/smoke-test.sh
```

## Logs

```bash
docker compose logs -f backend
```

Swap `backend` for `frontend` or `database`, or leave the name off to see all three.

## Database migrations

Migrations run automatically every time the backend container starts. To run or inspect them by hand:

```bash
docker compose exec backend npm run migrate
```

```bash
docker compose exec backend npm run migrate:status
```

Undo the most recent migration:

```bash
docker compose exec backend npm run migrate:undo
```

Load starting data (only when the project has seeders):

```bash
docker compose exec backend npm run seed
```

## The API

The API is not public on its own port. It is reached through the site: `https://YOUR-DOMAIN.TLD/api/...`

Health check, from the VPS:

```bash
curl http://127.0.0.1:8101/api/health
```

Expected: `{"success":true,"message":"API is operational","database":"connected"}`

The full list of endpoints, with every field, is in [docs/API.md](docs/API.md). In short:

| Area | Endpoints |
| --- | --- |
| Public site | `GET /api/site` (settings, page text, service slides), `GET /api/works`, `GET /api/pricing`, `POST /api/enquiries` (the contact form, with attachments) |
| Sign in | `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/me`, `PUT /api/auth/password` |
| Admin (signed in only) | `/api/admin/...`: dashboard, settings, page text, works and their categories, prices and their categories, service slides, uploads, enquiries |
| Files | `GET /api/uploads/media/...` (images, video and audio uploaded in the admin) |

## The admin

Open `https://YOUR-DOMAIN.TLD/admin/` and sign in with the admin email and password. From there you can edit works,
prices, the services carousel, all page text and the site settings (email, WhatsApp, social links, Etsy, music),
and read the enquiries sent through the contact form.

Locally, with the stack running: http://127.0.0.1:8101/admin/

## Back up the database

```bash
mkdir -p backups && docker compose exec -T database sh -c 'exec mysqldump --single-transaction --no-tablespaces -u root -p"$MYSQL_ROOT_PASSWORD" "$MYSQL_DATABASE"' | gzip > "backups/$(date +%F-%H%M).sql.gz"
```

Restore a backup (replaces the current data):

```bash
gunzip -c backups/FILE.sql.gz | docker compose exec -T database sh -c 'exec mysql -u root -p"$MYSQL_ROOT_PASSWORD" "$MYSQL_DATABASE"'
```

The database backup does **not** contain uploaded files (images, videos and music added in the admin, and
attachments sent with enquiries). Back those up too:

```bash
mkdir -p backups && docker compose run --rm --no-deps -T --entrypoint tar backend -czf - -C /app uploads > "backups/uploads-$(date +%F-%H%M).tar.gz"
```

Restore uploads (adds to and overwrites what is there):

```bash
docker compose exec -T backend tar -xzf - -C /app < backups/uploads-FILE.tar.gz
```

Take both backups before every update. Keep copies somewhere other than the VPS.

## Update and redeploy

**Normally this is automatic:** push to `main` on GitHub and GitHub Actions tests the stack, builds the images,
backs up the live database and uploads, deploys, and rolls back by itself if the new version isn't healthy.
Setup and details: [techstack.md, section 11](techstack.md#11-deployment-with-docker-and-github-actions).

By hand, without GitHub (on a server that builds from the source):

1. Back up the database (above).
2. Get the new version of the project onto the VPS (replace the project files, keeping `.env`).
3. Rebuild and restart. New migrations are applied on start:

```bash
docker compose up -d --build
```

4. Confirm everything is healthy:

```bash
docker compose ps
```

5. Clear out old image layers:

```bash
docker image prune -f
```

## Local development

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d --build database backend
```

```bash
cd frontend && npm install && npm run dev
```

The site runs on the address Vite prints, with live reload. `/api` is forwarded to the backend container.

## VPS Nginx (the server's own reverse proxy)

This project does not touch the VPS-level Nginx. Add a server block like this on the VPS by hand, then reload Nginx.
The certificate paths assume Let's Encrypt; adjust them to how SSL is managed on the server.

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name YOUR-DOMAIN.TLD www.YOUR-DOMAIN.TLD;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    listen [::]:443 ssl;
    http2 on;   # Nginx older than 1.25.1: remove this line and use "listen 443 ssl http2;"
    server_name YOUR-DOMAIN.TLD www.YOUR-DOMAIN.TLD;

    ssl_certificate     /etc/letsencrypt/live/YOUR-DOMAIN.TLD/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/YOUR-DOMAIN.TLD/privkey.pem;

    # Keep in step with client_max_body_size in frontend/nginx/default.conf
    client_max_body_size 64m;

    location / {
        proxy_pass http://127.0.0.1:8101;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # Only if this site uses WebSockets:
        # proxy_set_header Upgrade $http_upgrade;
        # proxy_set_header Connection "upgrade";
    }
}
```

## Technical decisions, in plain language

- **Two apps in one site.** The public pages and the admin are built as two separate React apps. Visitors never
  download the admin, and the admin's styling can't disturb the public design.
- **Your stylesheet is the design.** The public pages use your existing hand-tuned stylesheet (text trimming, optical
  edges, the 8-point spacing system), moved into the new build unchanged, so the design is the same to the pixel.
  Tailwind's design tokens mirror it, and the admin is built with Tailwind utilities. This is a deliberate exception
  to "Tailwind for all styling": rewriting the stylesheet as utilities would have risked the design for no visible gain.
- **Content lives in the database.** Works, prices, service slides, page text and settings are rows in MySQL, edited in
  the admin. The starting content is loaded automatically the first time the site starts, and never again, so your
  edits are not overwritten by an update.
- **Media in two places.** The images and videos the site launched with ship inside the frontend (`/media/...`).
  Anything uploaded in the admin is stored in its own Docker volume (`uploads`) and served at `/api/uploads/media/...`.
- **Enquiries are private.** Contact-form messages and their attachments are saved on the server and can only be
  read after signing in. They are not emailed yet; that needs mail-server details (see "Not done yet").
- **Sign-in.** One admin account. The session is an httpOnly cookie, which page scripts cannot read. Passwords are
  stored hashed. Sign-in attempts and the contact form are rate limited.
- **Search engines.** The site is drawn in the browser, so search engines and link previews see less than with the
  old static HTML. Each page sets its own title and description, and share tags are in `index.html`.
- **The database is never reachable from outside**, and the API is only reachable through the site's own `/api`.

## Not done yet

- **Email notifications** for new enquiries: needs SMTP details for your mail service.
- **Real domain and port**, and the placeholders that were already open on the old site (contact email, WhatsApp,
  social links, Etsy link): set these in the admin under Settings.
- **Music licence:** confirm "Dreamy Chill 2" is licensed for use on a public website.
