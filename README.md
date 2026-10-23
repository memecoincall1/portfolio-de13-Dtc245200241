# HỆ THỐNG PORTFOLIO TÍCH HỢP NGINX REVERSE PROXY, GIÁM SÁT PROMETHEUS/GRAFANA VÀ CENTRALIZED LOGGING LOKI/PROMTAIL (ĐỀ 13)

> **Tên đề tài:** ĐỀ 13 — Hệ thống Portfolio tích hợp Nginx Reverse Proxy, giám sát Prometheus/Grafana và Centralized Logging Loki/Promtail
> **Sinh viên thực hiện:** Dương Anh Hoan — **MSSV:** DTC245200241
> **Repository:** https://github.com/memecoincall1/portfolio-de13-Dtc245200241
> **Công nghệ:** TanStack Start / React 19 / Node.js 20 + MySQL 8.0 + Nginx 1.27 + Prometheus 2.53 + Grafana 11.2 + Loki 2.9 + Promtail 2.9
> **Điều phối:** Docker Compose (`name: portfolio-de13`) — 10 services, 3 networks, 5 volumes

Tài liệu này được biên soạn sau khi kiểm tra trực tiếp `docker-compose.yml`, `.env.example`, `Dockerfile`, `nginx/default.conf`, `prometheus/prometheus.yml`, `grafana/provisioning/*`, `loki/loki-config.yml`, `promtail/promtail-config.yml`, `mysql/init.sql` và mã nguồn `src/`, `public/`. Mọi cổng, URL và câu lệnh LogQL đều phản ánh đúng cấu hình thực tế trong mã nguồn.

## Mục lục

1. [Mở và chạy trên VS Code](#1-mở-và-chạy-trên-vs-code)
2. [Chức năng website & quản trị](#2-chức-năng-website--quản-trị)
3. [Cấu trúc dự án & luồng dữ liệu](#3-cấu-trúc-dự-án--luồng-dữ-liệu)
4. [Giám sát và log (LogQL)](#4-giám-sát-và-log-logql)
5. [Bảo mật và hardening](#5-bảo-mật-và-hardening)
6. [Kiểm thử và vận hành](#6-kiểm-thử-và-vận-hành)
7. [Quản lý mã nguồn GitHub](#7-quản-lý-mã-nguồn-github)

---

## 1. Mở và chạy trên VS Code

### 1.1. Yêu cầu môi trường

- Docker Desktop (chế độ Linux containers / WSL2), Docker Compose v2+, VS Code, Git.
- Các cổng còn trống trên máy host: `81` (Nginx), `3001` (Grafana), `9090` (Prometheus), `3100` (Loki), `8080` (cAdvisor), `9100` (Node Exporter).
- File `.env` là bắt buộc vì `docker-compose.yml` dùng cú pháp `${VAR:?set-in-.env}` — thiếu file sẽ báo lỗi ngay khi kiểm tra cấu hình.

### 1.2. Sao chép mã nguồn và mở trong VS Code

```powershell
git clone https://github.com/memecoincall1/portfolio-de13-Dtc245200241.git
cd portfolio-de13-Dtc245200241
code .
```

### 1.3. Khởi tạo tập tin `.env` và khởi chạy hệ thống

```powershell
# Windows PowerShell — tạo file .env từ mẫu
Copy-Item .env.example .env -Force

# Kiểm tra cú pháp cấu hình
docker compose config --quiet

# Dựng và chạy nền toàn bộ 10 services
docker compose up -d --build

# Kiểm tra trạng thái container
docker compose ps
```

```bash
# Bash trên Linux/macOS
cp .env.example .env
docker compose config --quiet
docker compose up -d --build
docker compose ps
```

> Nên mở file `.env` và đổi mật khẩu mạnh trước khi chạy (`MYSQL_ROOT_PASSWORD`, `MYSQL_PASSWORD`, `GF_ADMIN_PASSWORD` từ 16 ký tự trở lên, gồm chữ hoa, chữ thường, số và ký tự đặc biệt). Giữ nguyên `NGINX_PORT=81`, `GRAFANA_PORT=3001`, `PROMETHEUS_PORT=9090` để khớp với bảng địa chỉ bên dưới.

### 1.4. Bảng thành phần và cổng kết nối thực tế (Host:Container)

Bảng dưới đây được đối chiếu trực tiếp từ `docker-compose.yml` và `.env.example` (`NGINX_PORT=81`, `GRAFANA_PORT=3001`, `PROMETHEUS_PORT=9090`):

| # | Thành phần (`container_name`) | Image | Cổng Host:Container | Địa chỉ truy cập |
|---|---|---|---|---|
| 1 | Portfolio Web qua Nginx Proxy (`portfolio-nginx`) | `nginx:1.27-alpine` | `81:80` (`${NGINX_PORT:-80}:80`) | http://localhost:81/ |
| 2 | Portfolio App nội bộ (`portfolio-app`) | dựng từ `Dockerfile` (Node 20-alpine) | chỉ `expose: 3000`, qua Nginx | qua http://localhost:81/ |
| 3 | phpMyAdmin (`portfolio-phpmyadmin`) | `phpmyadmin/phpmyadmin:5.2` | chỉ `expose: 80`, qua Nginx tại `/phpmyadmin/` | http://localhost:81/phpmyadmin/ |
| 4 | Cơ sở dữ liệu MySQL (`portfolio-db`) | `mysql:8.0` | chỉ `expose: 3306`, bị cô lập | `db:3306` nội bộ trong Compose |
| 5 | Grafana Dashboard (`portfolio-grafana`) | `grafana/grafana:11.2.0` | `3001:3000` (`${GRAFANA_PORT:-3001}:3000`) | http://localhost:3001 |
| 6 | Prometheus (`portfolio-prometheus`) | `prom/prometheus:v2.53.0` | `9090:9090` | http://localhost:9090 |
| 7 | Loki Engine (`portfolio-loki`) | `grafana/loki:2.9.8` | `3100:3100` (gRPC `9096` nội bộ) | http://localhost:3100 |
| 8 | Promtail (`portfolio-promtail`) | `grafana/promtail:2.9.8` | không mở cổng (nội bộ `:9080`) | xem bằng `docker compose logs promtail` |
| 9 | cAdvisor (`portfolio-cadvisor`) | `gcr.io/cadvisor/cadvisor:v0.49.1` | `8080:8080` | http://localhost:8080 |
| 10 | Node Exporter (`portfolio-node-exporter`) | `prom/node-exporter:v1.8.2` | `9100:9100` | http://localhost:9100 |

Tài khoản đăng nhập: Grafana dùng `GF_ADMIN_USER` (mặc định `admin`) và `GF_ADMIN_PASSWORD` trong file `.env` (biến thực tế là `GF_ADMIN_PASSWORD`). phpMyAdmin đăng nhập bằng `MYSQL_USER`/`MYSQL_PASSWORD` hoặc `root`/`MYSQL_ROOT_PASSWORD` trong file `.env`.

> Ghi chú đối chiếu: trong mã nguồn thực tế, Nginx lắng nghe `:80` trong container và ánh xạ ra `81` trên host (`81:80`); phpMyAdmin không mở cổng riêng mà đi qua Nginx tại `http://localhost:81/phpmyadmin/`; cAdvisor thực tế là `8080:8080`. Bảng trên phản ánh đúng `docker-compose.yml` hiện hành.
## 2. Chức năng website & quản trị

Ứng dụng Portfolio được xây dựng bằng TanStack Start, TanStack Router, React 19 và Vite, kết xuất phía máy chủ thông qua Nitro `node-server`. Nội dung hiển thị được lấy từ mô-đun dữ liệu an toàn trên trình duyệt (`src/lib/hoan-content.ts`), không phụ thuộc vào môi trường chạy phía máy chủ:

- **Trang chủ (`/`):** giới thiệu Dương Anh Hoan (sinh viên ICTU — Đại học Thái Nguyên), châm ngôn cá nhân cùng liên kết LinkedIn, X và thư điện tử (`src/components/home-page.tsx`).
- **Giới thiệu (`/about`):** ghi chú dạng xếp lớp về nền tảng học tập, trải nghiệm và hành trình phát triển (`about-page.tsx`).
- **Dự án (`/projects`):** danh sách `ProjectItem` gồm vai trò, công nghệ sử dụng và bài học rút ra (`projects-page.tsx`).
- **Bài viết (`/blogs` và trang tổng hợp):** danh sách `ArticleItem` kèm nội dung chi tiết (`blogs-page.tsx`, `digest-page.tsx`).
- **Tủ sách (`/reading-list`):** danh sách `BookItem` với ảnh bìa trong `src/assets/books/` và `public/covers/` (`reading-page.tsx`).
- **Liên hệ (`/contact`, `/reach-out`):** biểu mẫu gửi lời nhắn qua Web3Forms (`VITE_WEB3FORMS_ACCESS_KEY`) kết hợp xác minh Cloudflare Turnstile (`VITE_TURNSTILE_SITE_KEY`) và bẫy `botcheck`; đồng thời giữ nguyên hai điểm cuối Google Apps Script gốc (`gasEndpoints.message` và `notify` trong `contact-page.tsx`) dưới dạng kênh dự phòng. Tài liệu không khẳng định đã xác minh việc gửi thư thành công từ phản hồi không tường minh, mà giữ nguyên địa chỉ Apps Script gốc.
- **Quản trị nội dung:** biên tập nội dung tĩnh qua `src/lib/hoan-content.ts`; quản trị dữ liệu liên hệ qua phpMyAdmin tại `http://localhost:81/phpmyadmin/` với bảng `contacts` được tạo từ `mysql/init.sql`.
- **Tiện ích dùng chung:** đầu trang và chân trang `SiteHeader`/`SiteFooter` trong bố cục gốc (`src/routes/__root.tsx`), các tuyến lá TanStack cho từng trang (`src/routes/*.tsx`), thẻ meta và SEO (`src/lib/page-meta.ts`), kiểm thử định tuyến (`src/test/app-routing.test.tsx` với `npm run test`).

## 3. Cấu trúc dự án & luồng dữ liệu

### 3.1. Cây thư mục chính

```text
.
├── docker-compose.yml                  # 10 services, name: portfolio-de13
├── .env.example                        # mẫu: MYSQL_*, GF_ADMIN_*, NGINX_PORT=81, GRAFANA_PORT=3001, PROMETHEUS_PORT=9090
├── .gitignore                          # chặn .env, giữ !.env.example
├── .dockerignore                       # chặn node_modules, .git, *.log, .env...
├── Dockerfile                          # multi-stage Node 20-alpine, USER node (non-root)
├── nginx/default.conf                  # reverse proxy / và /phpmyadmin/ + security headers + /healthz
├── prometheus/prometheus.yml           # scrape_interval 15s, 3 jobs
├── grafana/provisioning/datasources/datasources.yml   # Prometheus (mặc định) + Loki
├── grafana/provisioning/dashboards/dashboards.yml     # nhà cung cấp De13
├── loki/loki-config.yml                # cổng 3100, boltdb-shipper, lưu trữ filesystem /loki
├── promtail/promtail-config.yml        # 3 jobs: docker, nginx-access, nginx-error gửi về loki:3100
├── mysql/init.sql                      # CREATE TABLE IF NOT EXISTS contacts
├── src/
│   ├── routes/                         # tuyến lá TanStack: index, about, projects, blogs,
│   │                                   # reading-list, contact, reach-out, sfnewsletter, __root
│   ├── components/                     # các trang *-page.tsx, ui/*, site-header/footer
│   ├── lib/                            # hoan-content.ts, page-meta.ts, utils.ts, xử lý lỗi
│   ├── assets/books/                   # ảnh bìa đóng gói qua import
│   ├── router.tsx / start.ts / server.ts / styles.css
│   └── test/app-routing.test.tsx
└── public/                             # favicon.ico, robots.txt, covers/*, preview.gif.mp4
```

Nội dung then chốt của từng tập tin cấu hình:

- `.env.example`: `VITE_WEB3FORMS_ACCESS_KEY`, `VITE_TURNSTILE_SITE_KEY`, `MYSQL_ROOT_PASSWORD=change-me-root-123`, `MYSQL_DATABASE=portfolio_db`, `MYSQL_USER=portfolio`, `MYSQL_PASSWORD=change-me-user-123`, `GF_ADMIN_USER=admin`, `GF_ADMIN_PASSWORD=change-me-grafana-123`, `NGINX_PORT=81`, `GRAFANA_PORT=3001`, `PROMETHEUS_PORT=9090`.
- `prometheus/prometheus.yml`: `scrape_interval` và `evaluation_interval` 15 giây; ba nhãn công việc `prometheus` trỏ `localhost:9090`, `node-exporter` trỏ `node-exporter:9100`, `cadvisor` trỏ `cadvisor:8080`.
- `loki/loki-config.yml`: `auth_enabled: false`, cổng HTTP `3100`, gRPC `9096`, lưu trữ filesystem tại `/loki`, lược đồ `v11` với `boltdb-shipper`.
- `promtail/promtail-config.yml`: máy khách `http://loki:3100/loki/api/v1/push`; nhãn công việc `docker-containers` (`job=docker`, đường dẫn `/var/lib/docker/containers/*/*.log`, phân tích JSON `stream/log/time`, nhãn `container_id`); nhãn `nginx-access` (`job=nginx-access`, `/var/log/nginx/access.log`, phân tích `method/status/path`); nhãn `nginx-error` (`job=nginx-error`, `/var/log/nginx/error.log`).
- `grafana/.../datasources.yml`: nguồn `Prometheus` (`http://prometheus:9090`, mặc định) và nguồn `Loki` (`http://loki:3100`) đã được cấp phát sẵn.
- `mysql/init.sql`: bảng `contacts(id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(100), email VARCHAR(190), message TEXT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP) ENGINE=InnoDB CHARSET=utf8mb4`.
- `Dockerfile`: giai đoạn `builder` chạy `npm ci` và `npm run build` với `NITRO_PRESET=node-server`; giai đoạn `runner` chỉ sao chép `.output`, `package.json` và `public`, đổi chủ sở hữu `node:node`, chuyển sang `USER node`, mở cổng `3000`.

### 3.2. Luồng dữ liệu

- **Luồng Web:** trình duyệt gửi yêu cầu tới `Nginx:81` (`portfolio-nginx`, cấu hình `nginx/default.conf`) — tuyến `/` được chuyển tiếp tới `app:3000` (`portfolio-app` với `DATABASE_URL=mysql://...@db:3306/...`, phụ thuộc `db` ở trạng thái khỏe mạnh), tuyến `/phpmyadmin/` được chuyển tiếp tới `phpmyadmin:80` (`PMA_HOST=db:3306`); ứng dụng kết nối tới `db:3306` (`portfolio-db`, dữ liệu lưu tại `mysql_data`, khởi tạo bằng `mysql/init.sql`).
- **Luồng Metrics:** `node-exporter:9100` (chỉ số máy chủ) cùng `cadvisor:8080` (chỉ số container Docker) và chính Prometheus được thu thập về `Prometheus:9090` (`prometheus/prometheus.yml`, lưu trữ `prometheus_data:/prometheus`), sau đó hiển thị trên `Grafana:3001` qua nguồn dữ liệu Prometheus (`http://prometheus:9090`) đã cấp phát tại `grafana/provisioning/datasources/datasources.yml`.
- **Luồng Log:** nhật ký Docker (`/var/lib/docker/containers/*/*.log`) và ổ đĩa dùng chung `nginx_logs` (`/var/log/nginx/access.log`, `error.log`) được `Promtail` thu thập theo ba nhãn công việc trong `promtail/promtail-config.yml`, đẩy về `Loki:3100` (`loki/loki-config.yml`, lưu trữ `loki_data:/loki`), rồi tra cứu trong Grafana Explore qua nguồn dữ liệu Loki (`http://loki:3100`).

## 4. Giám sát và log (LogQL)

### 4.1. Giám sát Prometheus và Grafana

- Mở địa chỉ `http://localhost:9090`, vào `Status → Targets`: cả ba đầu thu phải ở trạng thái `UP` gồm `prometheus` (`localhost:9090`), `node-exporter` (`node-exporter:9100`) và `cadvisor` (`cadvisor:8080`). Cấu hình nằm tại `prometheus/prometheus.yml` với chu kỳ thu thập `scrape_interval: 15s`.
- Mở Grafana tại `http://localhost:3001`, đăng nhập bằng tài khoản quản trị (`GF_ADMIN_USER` và `GF_ADMIN_PASSWORD` trong file `.env`), vào `Connections → Data sources`: hai nguồn `Prometheus` (`http://prometheus:9090`, đặt mặc định) và `Loki` (`http://loki:3100`) đã được cấp phát sẵn từ `grafana/provisioning/datasources/datasources.yml`, không cần thêm thủ công.
- Thử truy vấn PromQL trong `Explore → Prometheus`: `up` (trạng thái đầu thu), `rate(container_cpu_usage_seconds_total{name="portfolio-app"}[5m])` (CPU của container ứng dụng qua cAdvisor), `container_memory_usage_bytes{name="portfolio-db"}` (bộ nhớ MySQL qua cAdvisor), `node_memory_MemAvailable_bytes` (bộ nhớ máy chủ qua Node Exporter).
- Chỉ số của ứng dụng, Nginx và MySQL được suy ra qua cAdvisor (họ `container_*`) và nhật ký Loki (`job=docker`), phù hợp với phạm vi tối thiểu của đề tài.

### 4.2. Tra cứu LogQL trên Grafana Explore với nguồn Loki

Luồng nhật ký: file `json-file` của Docker cùng ổ đĩa `nginx_logs` được `Promtail` thu thập theo ba nhãn công việc rồi đẩy về `loki:3100`; người dùng tra cứu trong Grafana Explore với nguồn dữ liệu **Loki**.

Cách tra cứu: mở Grafana `http://localhost:3001`, vào menu **Explore**, chọn nguồn dữ liệu **Loki**, chọn khoảng thời gian `Last 15 minutes`, dán một trong ba câu truy vấn dưới đây rồi nhấn **Run query**. Nên tạo nhật ký trước bằng cách mở `http://localhost:81/`, `http://localhost:81/phpmyadmin/` và `http://localhost:81/khong-ton-tai` (tạo lỗi 404).

```logql
{app="nginx"}
```

```logql
{app="nginx"} |= "error"
```

```logql
{container_name="portfolio-app"}
```

> Ghi chú trung thực theo cấu hình thực tế: `promtail-config.yml` gắn các nhãn `job` (`docker`, `nginx-access`, `nginx-error`), `service=nginx`, `method`, `status`, `path`, `stream` và `container_id` — chưa có sẵn nhãn `app` hay `container_name`. Khi truy vấn vận hành hằng ngày, hãy dùng nhãn thực tế tương đương: `{job="nginx-access"}`, `{job="nginx-access"} |= "error"`, `{job="docker"} |= "error"`. Ba câu trên là mẫu theo dàn ý của đề bài; các biến thể mở rộng gồm `{job="nginx-access", status=~"5.."}`, `{job="nginx-error"}` và `{job="docker"} |~ "(?i)error|exception|failed"`.

Kiểm tra nhanh khi chưa thấy nhật ký:

```powershell
docker compose ps loki promtail
docker compose logs --tail=50 loki promtail
curl.exe http://localhost:3100/ready
curl.exe "http://localhost:3100/loki/api/v1/labels"
docker compose exec promtail sh -c "ls -l /var/log/nginx/ && tail -n 20 /var/log/nginx/access.log"
```

## 5. Bảo mật và hardening

Các biện pháp đã áp dụng thực tế trong dự án, đối chiếu trực tiếp từng tập tin:

- **Cách ly mạng — tách `frontend-net` và `backend-net` (MySQL không mở cổng 3306 ra ngoài):**
  - Mạng `backend-net` dùng `driver: bridge` với `internal: true` và chứa `db`. MySQL chỉ `expose: ["3306"]` mà không có `ports:` nên máy host và Internet không thể truy cập trực tiếp; chỉ `app` và `phpmyadmin` (cùng `backend-net`) mới kết nối được tới `db:3306`.
  - Mạng `frontend-net` chỉ chứa `nginx`, `app` và `phpmyadmin`; `nginx` là điểm công cộng duy nhất (`ports: "${NGINX_PORT:-80}:80"`).
  - Mạng `monitoring-net` tách riêng `prometheus`, `node-exporter`, `cadvisor`, `grafana`, `loki` và `promtail`, cách ly khỏi cơ sở dữ liệu. Cả `app` và `phpmyadmin` đều chỉ `expose:` nội bộ nên mọi truy cập Web và quản trị cơ sở dữ liệu bắt buộc phải đi qua Nginx.
- **Bảo vệ thông tin đăng nhập — giữ bí mật ngoài Git, `.gitignore` chặn `.env`:**
  - File `.gitignore` chứa `.env` và `!.env.example` (kèm chú thích không đưa thông tin thật lên Git) nên mật khẩu thật không bao giờ được đưa lên kho mã nguồn, chỉ tập tin mẫu được lưu trữ. File `.dockerignore` loại trừ `node_modules`, `dist`, `.output`, `.git`, `*.log`, `logs`, `.env` để ảnh Docker gọn nhẹ và không lộ nhật ký hay biến môi trường.
  - Mọi bí mật được truyền qua `.env` (`env_file: [.env]`); Compose dùng `${MYSQL_ROOT_PASSWORD:?set-in-.env}`, `${MYSQL_PASSWORD:?set-in-.env}` và `${GF_ADMIN_PASSWORD:?set-in-.env}` nên thiếu `.env` sẽ dừng ngay, không chạy với mật khẩu rỗng. File `.env.example` chỉ chứa giá trị giữ chỗ `change-me-*-123`, bắt buộc phải thay khi triển khai thật. Grafana tắt đăng ký công cộng bằng `GF_USERS_ALLOW_SIGN_UP=false`.
- **Tiêu đề bảo mật Nginx (`nginx/default.conf`, kiểm tra bằng `curl.exe -I http://localhost:81/`):**
  - Bốn tiêu đề theo yêu cầu: `X-Frame-Options: SAMEORIGIN`, `X-Content-Type-Options: nosniff`, `X-XSS-Protection: 1; mode=block`, `Referrer-Policy: strict-origin-when-cross-origin`.
  - Tăng cường thêm: `Permissions-Policy: camera=(), microphone=(), geolocation=()`, `Content-Security-Policy` (cho phép Cloudflare Turnstile và Google Fonts, `frame-ancestors 'self'`), `server_tokens off;` và `client_max_body_size 10m;`.
- **Quyền thực thi — chạy người dùng không đặc quyền (non-root) trong container:**
  - `Dockerfile` nhiều giai đoạn: giai đoạn `runner` chạy `chown -R node:node /app` rồi chuyển sang `USER node` (tài khoản có sẵn của `node:20-alpine`); môi trường chạy chỉ sao chép `.output`, `package.json` và `public`, không mang mã nguồn hay gói phát triển.
  - Bổ trợ: mọi điểm gắn cấu hình dùng `:ro` (chỉ đọc), nhật ký giới hạn `max-size:10m` và `max-file:3`, giới hạn tài nguyên (`app` `1CPU/512M`, `db` `1CPU/1G`, `prometheus` `1CPU/1G`, các dịch vụ giám sát `0.3–0.5CPU/128–512M`), khởi động lại `unless-stopped`, kiểm tra sức khỏe cho `app`, `db`, `nginx` và phụ thuộc `service_healthy`.

## 6. Kiểm thử và vận hành

```powershell
# Kiểm tra cú pháp cấu hình Nginx trước khi nạp lại
docker compose exec nginx nginx -t

# Xem nhật ký toàn hệ thống và từng nhóm dịch vụ
docker compose logs -f
docker compose logs -f app nginx
docker compose logs -f db phpmyadmin
docker compose logs -f prometheus grafana
docker compose logs -f loki promtail

# Kiểm tra cơ sở dữ liệu và phpMyAdmin qua Nginx
docker compose exec db mysqladmin ping -h localhost -u root -p
docker compose exec db mysql -uroot -p -e "SHOW DATABASES; USE portfolio_db; SHOW TABLES; SELECT * FROM contacts LIMIT 5;"
curl.exe -I http://localhost:81/
curl.exe -I http://localhost:81/phpmyadmin/

# Kiểm tra giám sát và nhật ký tập trung
curl.exe http://localhost:9090/api/v1/targets
curl.exe http://localhost:3100/ready
docker compose exec promtail sh -c "tail -n 20 /var/log/nginx/access.log"

# Khởi động lại và tắt hệ thống
docker compose up -d --build --force-recreate
docker compose restart nginx app
docker compose down
docker compose down -v
```

Sự cố thường gặp: chưa tạo `.env` (chạy `Copy-Item .env.example .env -Force`); cổng trên host bị chiếm (đổi `NGINX_PORT`, `GRAFANA_PORT`, `PROMETHEUS_PORT` trong `.env`); `nginx` khởi động lại liên tục do trùng `log_format` (giữ nguyên `default.conf` hiện hành, không khai báo lại `log_format main`); đăng nhập Grafana thất bại (lấy đúng `GF_ADMIN_PASSWORD` trong `.env`); Loki chưa có nhật ký (tạo lưu lượng truy cập rồi chọn `Last 15 minutes`, thử `{job="docker"}` trước).

## 7. Quản lý mã nguồn GitHub

- **Kho mã nguồn:** https://github.com/memecoincall1/portfolio-de13-Dtc245200241 (nhánh `clean-main`).
- **Quy trình duy trì lịch sử ba bản ghi chuẩn theo ba giai đoạn triển khai:**
  1. Giai đoạn 1 — Web, cơ sở dữ liệu và Reverse Proxy: `feat(core): Deploy web app, MySQL DB, phpMyAdmin and Nginx reverse proxy` gồm `Dockerfile`, `docker-compose.yml` (app, db, phpmyadmin, nginx), `nginx/default.conf`, `mysql/init.sql`, `.env.example` cùng mã nguồn `src/` và `public/`.
  2. Giai đoạn 2 — Giám sát và nhật ký: `feat(monitoring): Integrate Prometheus and Grafana for container, web, and DB metrics` (kèm bản ghi nhật ký Loki và Promtail) gồm `prometheus/prometheus.yml`, `grafana/provisioning/*`, `loki/loki-config.yml`, `promtail/promtail-config.yml`, mở rộng `docker-compose.yml` lên đủ 10 dịch vụ.
  3. Giai đoạn 3 — Củng cố và tài liệu: bản ghi tài liệu và hoàn thiện (README này cùng `.gitignore` và `.dockerignore` chặn `.env`, tiêu đề bảo mật, giới hạn tài nguyên, kiểm tra sức khỏe) — kiểm tra `docker compose config --quiet`, `up -d --build`, `ps` xanh toàn bộ rồi đẩy lên kho chung.
- Mỗi bản ghi đều giữ hệ thống chạy hoàn chỉnh bằng một lệnh `docker compose up -d --build` cho đủ 10 dịch vụ, tài liệu README được cập nhật đúng theo cấu hình tại bản ghi đó.


