# HE THONG PORTFOLIO TICH HOP NGINX REVERSE PROXY, GIAM SAT PROMETHEUS/GRAFANA VA CENTRALIZED LOGGING LOKI/PROMTAIL (DE 13)

> **Ten de tai:** DE 13: HE THONG PORTFOLIO TICH HOP NGINX REVERSE PROXY, GIAM SAT PROMETHEUS/GRAFANA VA CENTRALIZED LOGGING LOKI/PROMTAIL
> **Sinh vien thuc hien:** Duong Anh Hoan — **MSSV:** DTC245200241
> **Repository:** https://github.com/memecoincall1/portfolio-de13-Dtc245200241
> **Cong nghe:** TanStack Start / React 19 / Node.js 20 + MySQL 8.0 + Nginx 1.27 + Prometheus 2.53 + Grafana 11.2 + Loki 2.9 + Promtail 2.9
> **Dieu phoi:** Docker Compose (`name: portfolio-de13`) — 10 services, 3 networks, 5 volumes

Tai lieu nay duoc bien soan sau khi quet truc tiep `docker-compose.yml`, `.env.example`, `Dockerfile`, `nginx/default.conf`, `prometheus/prometheus.yml`, `grafana/provisioning/*`, `loki/loki-config.yml`, `promtail/promtail-config.yml`, `mysql/init.sql` va ma nguon `src/`, `public/`.

## Muc luc

1. [Mo va chay tren VS Code](#1-mo-va-chay-tren-vs-code)
2. [Chuc nang website va quan tri](#2-chuc-nang-website--quan-tri)
3. [Cau truc du an va luong du lieu](#3-cau-truc-du-an--luong-du-lieu)
4. [Giam sat va log (LogQL)](#4-giam-sat-va-log-logql)
5. [Bao mat va hardening](#5-bao-mat-va-hardening)
6. [Kiem thu va van hanh](#6-kiem-thu-va-van-hanh)
7. [Quan ly ma nguon GitHub](#7-quan-ly-ma-nguon-github)

---

## 1. Mo va chay tren VS Code

### 1.1. Yeu cau moi truong

- Docker Desktop (Linux containers / WSL2), Docker Compose v2+, VS Code, Git.
- Cac cong con trong tren host: `81`, `3001`, `9090`, `3100`, `8080`, `9100`.
- File `.env` la bat buoc (compose dung `${VAR:?set-in-.env}`).

### 1.2. Clone va mo trong VS Code

```powershell
git clone https://github.com/memecoincall1/portfolio-de13-Dtc245200241.git
cd portfolio-de13-Dtc245200241
code .
```

### 1.3. Khoi tao .env va khoi chay

```powershell
Copy-Item .env.example .env -Force
docker compose config --quiet
docker compose up -d --build
docker compose ps
```

```bash
cp .env.example .env
docker compose config --quiet
docker compose up -d --build
docker compose ps
```
> Khuyen nghi mo `.env` doi mat khau manh truoc khi up. Giu `NGINX_PORT=81`, `GRAFANA_PORT=3001`, `PROMETHEUS_PORT=9090` de khop bang URL ben duoi.

### 1.4. Bang thanh phan va cong ket noi thuc te (Host:Container)

Quet truc tiep tu `docker-compose.yml` + `.env.example`:

| # | Thanh phan (`container_name`) | Image | Cong Host:Container | URL truy cap |
|---|---|---|---|---|
| 1 | Portfolio Web qua Nginx Proxy (`portfolio-nginx`) | `nginx:1.27-alpine` | `81:80` (`${NGINX_PORT:-80}:80`) | http://localhost:81/ |
| 2 | Portfolio App noi bo (`portfolio-app`) | build `Dockerfile` (Node 20-alpine) | chi `expose: 3000` (qua Nginx) | qua http://localhost:81/ |
| 3 | phpMyAdmin (`portfolio-phpmyadmin`) | `phpmyadmin/phpmyadmin:5.2` | chi `expose: 80` (qua Nginx `/phpmyadmin/`) | http://localhost:81/phpmyadmin/ |
| 4 | MySQL DB (`portfolio-db`) | `mysql:8.0` | chi `expose: 3306` (co lap) | `db:3306` noi bo |
| 5 | Grafana Dashboard (`portfolio-grafana`) | `grafana/grafana:11.2.0` | `3001:3000` (`${GRAFANA_PORT:-3001}:3000`) | http://localhost:3001 |
| 6 | Prometheus (`portfolio-prometheus`) | `prom/prometheus:v2.53.0` | `9090:9090` | http://localhost:9090 |
| 7 | Loki Engine (`portfolio-loki`) | `grafana/loki:2.9.8` | `3100:3100` | http://localhost:3100 |
| 8 | Promtail (`portfolio-promtail`) | `grafana/promtail:2.9.8` | noi bo `:9080` | `docker compose logs promtail` |
| 9 | cAdvisor (`portfolio-cadvisor`) | `gcr.io/cadvisor/cadvisor:v0.49.1` | `8080:8080` | http://localhost:8080 |
| 10 | Node Exporter (`portfolio-node-exporter`) | `prom/node-exporter:v1.8.2` | `9100:9100` | http://localhost:9100 |

Tai khoan: Grafana user `GF_ADMIN_USER` (mac dinh `admin`) / pass `GF_ADMIN_PASSWORD` trong `.env`. Bien thuc te la `GF_ADMIN_PASSWORD`. phpMyAdmin dang nhap bang `MYSQL_USER/MYSQL_PASSWORD` hoac `root/MYSQL_ROOT_PASSWORD` trong `.env`.

> Doi chieu dan y: code thuc te Nginx la `81:80`; phpMyAdmin khong publish rieng ma qua Nginx tai `http://localhost:81/phpmyadmin/`; cAdvisor thuc te la `8080:8080`.
## 2. Chuc nang website & quan tri

Ung dung Portfolio (TanStack Start + TanStack Router + React 19 + Vite, SSR qua Nitro `node-server`) render noi dung tinh tu module du lieu trinh duyet an toan (`src/lib/hoan-content.ts`), khong phu thuoc runtime phia server:

- **Trang chu (`/`):** gioi thieu Duong Anh Hoan (ICTU — Thai Nguyen), motto, lien ket LinkedIn/X/email (`src/components/home-page.tsx`).
- **Gioi thieu (`/about`):** ghi chu accordion ve nen tang, trai nghiem, hanh trinh hoc tap (`about-page.tsx`).
- **Du an (`/projects`):** danh sach `ProjectItem` (vai tro, cong nghe, bai hoc) (`projects-page.tsx`).
- **Bai viet (`/blogs`, digest):** danh sach `ArticleItem` kem noi dung chi tiet (`blogs-page.tsx`, `digest-page.tsx`).
- **Tu sach (`/reading-list`):** danh sach `BookItem` voi anh bia trong `src/assets/books/` + `public/covers/` (`reading-page.tsx`).
- **Lien he (`/contact`, `/reach-out`):** form gui loi nhan qua Web3Forms (`VITE_WEB3FORMS_ACCESS_KEY`) + xac minh Cloudflare Turnstile (`VITE_TURNSTILE_SITE_KEY`), honeypot `botcheck`; dong thoi giu nguyen 2 endpoint Google Apps Script goc (`gasEndpoints.message/notify` trong `contact-page.tsx`) lam mirror best-effort. Khong tuyen bo da xac minh delivery tu response opaque.
- **Trang quan tri noi dung:** bien tap noi dung qua file du lieu `src/lib/hoan-content.ts` + `src/lib/laura-content.json`; quan tri du lieu form lien he qua phpMyAdmin tai `http://localhost:81/phpmyadmin/` (bang `contacts` tu `mysql/init.sql`).
- **Tien ich chung:** `SiteHeader`/`SiteFooter` trong root layout (`src/routes/__root.tsx`), TanStack leaf routes cho tung trang (`src/routes/*.tsx`), meta/SEO (`src/lib/page-meta.ts`), kiem thu `src/test/app-routing.test.tsx` (`npm run test`).

## 3. Cau truc du an & luong du lieu

### 3.1. Cay thu muc chinh

```text
.
|-- docker-compose.yml
|-- .env.example
|-- Dockerfile
|-- .gitignore / .dockerignore
|-- nginx/default.conf
|-- prometheus/prometheus.yml
|-- grafana/provisioning/datasources/datasources.yml
|-- grafana/provisioning/dashboards/dashboards.yml
|-- loki/loki-config.yml
|-- promtail/promtail-config.yml
|-- mysql/init.sql
|-- src/routes/ (index, about, projects, blogs, reading-list, contact, reach-out, sfnewsletter, __root)
|-- src/components/ (*-page.tsx + ui/* + site-header/footer)
|-- src/lib/ (hoan-content.ts, page-meta.ts, utils.ts)
|-- src/assets/books/ + public/covers/
```

- `.env.example`: MYSQL_ROOT_PASSWORD, MYSQL_DATABASE=portfolio_db, MYSQL_USER=portfolio, MYSQL_PASSWORD, GF_ADMIN_USER=admin, GF_ADMIN_PASSWORD, NGINX_PORT=81, GRAFANA_PORT=3001, PROMETHEUS_PORT=9090.
- `prometheus/prometheus.yml`: scrape_interval 15s, 3 jobs prometheus -> localhost:9090, node-exporter -> node-exporter:9100, cadvisor -> cadvisor:8080.
- `loki/loki-config.yml`: auth_enabled false, http 3100, grpc 9096, filesystem /loki, schema v11 boltdb-shipper.
- `promtail/promtail-config.yml`: clients http://loki:3100/loki/api/v1/push; job docker (/var/lib/docker/containers/*/*.log); job nginx-access (/var/log/nginx/access.log); job nginx-error (/var/log/nginx/error.log).
- `grafana/.../datasources.yml`: Prometheus http://prometheus:9090 isDefault true + Loki http://loki:3100.
- `mysql/init.sql`: bang contacts(id, name, email, message, created_at).
- `Dockerfile`: builder npm ci + npm run build (NITRO_PRESET=node-server), runner copy .output + package.json + public, chown node:node, USER node, EXPOSE 3000.

### 3.2. Luong du lieu

- **Luong Web:** Trinh duyet -> Nginx:81 (portfolio-nginx) -> app:3000 (portfolio-app, DATABASE_URL=mysql://...@db:3306/...) -> db:3306 (portfolio-db). phpMyAdmin (PMA_HOST=db:3306) cung qua Nginx tai /phpmyadmin/.
- **Luong Metrics:** node-exporter:9100 + cadvisor:8080 + prometheus tu scrape -> Prometheus:9090 (luu prometheus_data) -> Grafana:3001 (datasource Prometheus).
- **Luong Log:** Log file Docker + volume nginx_logs (/var/log/nginx/*.log) -> Promtail (3 jobs) -> Loki:3100 (luu loki_data) -> Grafana Explore (datasource Loki).

## 4. Giam sat va log (LogQL)

### 4.1. Giam sat Prometheus/Grafana

- Mo http://localhost:9090 -> Status -> Targets: ca 3 target phai UP — prometheus (localhost:9090), node-exporter (node-exporter:9100), cadvisor (cadvisor:8080). Cau hinh tai prometheus/prometheus.yml (scrape_interval: 15s).
- Mo Grafana http://localhost:3001 -> dang nhap admin (GF_ADMIN_USER/GF_ADMIN_PASSWORD) -> Connections -> Data sources da co san Prometheus (http://prometheus:9090, default) + Loki (http://loki:3100).
- Thu PromQL trong Explore -> Prometheus: up, rate(container_cpu_usage_seconds_total{name="portfolio-app"}[5m]), container_memory_usage_bytes{name="portfolio-db"}, node_memory_MemAvailable_bytes.
- Metrics app/nginx/mysql suy ra qua cAdvisor (container_*) + log Loki (job=docker), phu hop pham vi toi thieu de tai.

### 4.2. Tra cuu LogQL tren Grafana Explore (datasource Loki)

Luong: docker json-file logs + nginx_logs volume -> promtail (3 jobs) -> loki:3100 -> Grafana Explore datasource Loki. Sinh log truoc: mo http://localhost:81/, http://localhost:81/phpmyadmin/, http://localhost:81/khong-ton-tai.

```logql
{app="nginx"}
```

```logql
{app="nginx"} |= "error"
```

```logql
{container_name="portfolio-app"}
```

> Ghi chu cau hinh thuc te: promtail-config.yml gan nhan job (docker/nginx-access/nginx-error), service=nginx, method/status/path, stream, container_id — khong co san nhan app hay container_name. Khi query that, dung dung nhan thuc te: {job="nginx-access"}, {job="nginx-access"} |= "error", {job="docker"} |= "error". 3 cau tren la mau theo dan y de bai; tuong duong thuc te da kiem chung duoc liet ke ngay sau.

Tuong duong thuc te kiem chung duoc voi nhan that trong `promtail-config.yml`:

```logql
{job="nginx-access"}
```

```logql
{job="nginx-access"} |= "error"
```

```logql
{job="docker"} |= "error"
```

Mo rong: `{job="nginx-access", status=~"5.."}`, `{job="nginx-error"}`, `{job="docker"} |~ "(?i)error|exception|failed"`.

## 5. Bao mat va hardening

- **Network isolation — tach frontend-net va backend-net (MySQL khong publish 3306 ra ngoai):**
  - `backend-net: {driver: bridge, internal: true}` chua `db`. MySQL chi `expose: ["3306"]`, khong co `ports:` nen host/internet khong truy cap truc tiep; chi `app` + `phpmyadmin` (cung `backend-net`) moi ket noi `db:3306`.
  - `frontend-net` chi chua `nginx + app + phpmyadmin`; `nginx` la diem public duy nhat (`ports: "${NGINX_PORT:-80}:80"`).
  - `monitoring-net` tach rieng `prometheus/node-exporter/cadvisor/grafana/loki/promtail`, cach ly khoi DB.
- **Credential Protection — bao ve bi mat ngoai Git, `.gitignore` chan `.env`:**
  - `.gitignore` co `.env` + `!.env.example` nen mat khau that khong bao gio len Git, chi mau duoc commit. `.dockerignore` chan `node_modules, dist, .output, .git, *.log, logs, .env...`.
  - Moi secret qua `.env` (`env_file: [.env]`), compose dung `${MYSQL_ROOT_PASSWORD:?set-in-.env}` / `${MYSQL_PASSWORD:?set-in-.env}` / `${GF_ADMIN_PASSWORD:?set-in-.env}` nen thieu `.env` la fail-fast. `.env.example` chi placeholder `change-me-*-123`. `GF_USERS_ALLOW_SIGN_UP=false`.
- **Security Headers Nginx (`nginx/default.conf`, verify `curl.exe -I http://localhost:81/`):**
  - `X-Frame-Options: SAMEORIGIN`, `X-Content-Type-Options: nosniff`, `X-XSS-Protection: 1; mode=block`, `Referrer-Policy: strict-origin-when-cross-origin` — dung 4 header yeu cau.
  - Tang cuong them: `Permissions-Policy`, `Content-Security-Policy` (cho phep Turnstile + Google Fonts, `frame-ancestors 'self'`), `server_tokens off;`, `client_max_body_size 10m;`.
- **Execution Privilege — chay user khong co dac quyen (non-root):**
  - `Dockerfile` multi-stage: stage `runner` chay `chown -R node:node /app` + `USER node` (user co san cua `node:20-alpine`), runtime chi copy `.output + package.json + public`.
  - Bo tro: moi mount config `:ro`, `logging max-size:10m max-file:3`, `limits` (app `1CPU/512M`, db `1CPU/1G`, prometheus `1CPU/1G`), `restart: unless-stopped`, healthcheck `app/db/nginx`.


## 6. Kiem thu va van hanh

```powershell
docker compose exec nginx nginx -t
docker compose logs -f
docker compose logs -f app nginx
docker compose logs -f db phpmyadmin
docker compose logs -f prometheus grafana
docker compose logs -f loki promtail
docker compose exec db mysqladmin ping -h localhost -u root -p
docker compose exec db mysql -uroot -p -e "SHOW DATABASES; USE portfolio_db; SHOW TABLES; SELECT * FROM contacts LIMIT 5;"
curl.exe -I http://localhost:81/
curl.exe http://localhost:9090/api/v1/targets
curl.exe http://localhost:3100/ready
docker compose up -d --build --force-recreate
docker compose restart nginx app
docker compose down
docker compose down -v
```

Su co thuong gap: chua tao `.env` (`Copy-Item .env.example .env -Force`); port host bi chiem (doi `NGINX_PORT/GRAFANA_PORT/PROMETHEUS_PORT`); `nginx Restarting / duplicate log_format` (giu nguyen `default.conf` hien tai); Grafana login fail (lay dung `GF_ADMIN_PASSWORD`); Loki khong ra log (sinh traffic roi chon `Last 15 minutes`, thu `{job="docker"}` truoc).

## 7. Quan ly ma nguon GitHub

- **Repository:** https://github.com/memecoincall1/portfolio-de13-Dtc245200241 (nhanh `clean-main`).
- **Quy trinh duy tri lich su 3 commit chuan theo 3 giai doan:**
  1. Giai doan 1 — Web + Database + Reverse Proxy: `feat(core): Deploy web app, MySQL DB, phpMyAdmin and Nginx reverse proxy`.
  2. Giai doan 2 — Monitoring + Logging: `feat(monitoring): Integrate Prometheus and Grafana for container, web, and DB metrics` (+ commit logging Loki/Promtail).
  3. Giai doan 3 — Hardening + Docs: commit docs/finalize (README nay + `.gitignore`/`.dockerignore`, security headers, limits, healthcheck) — kiem tra `docker compose config --quiet`, `up -d --build`, `ps` xanh toan bo roi push.
- Moi commit deu giu he thong chay hoan chinh bang `docker compose up -d --build` du 10 services.

