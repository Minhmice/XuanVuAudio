# Frontend — Danh sách trang & brief thiết kế

Tài liệu phục vụ **thiết kế UI/UX** và **đặt hàng frontend** cho dự án XuanVuAudio (rebuild tainghe.com.vn). Nguồn nghiệp vụ: `.planning/ROADMAP.md`, `.planning/REQUIREMENTS.md`; route hiện có trong `app/`.

---

## 1. Mục đích & giả định

- **Desktop-first**, thị trường Việt Nam (COD, QR ngân hàng, SĐT bắt buộc khi đặt hàng).
- Hai bề mặt tách biệt:
  - **Storefront**: khách không đăng nhập (v1 không có tài khoản khách).
  - **Internal**: nhân viên/ quản trị sau khi đăng nhập (`/dashboard`, `/admin/*`).
- Middleware hiện **chỉ kiểm tra session** cho đường dẫn nội bộ; **phân quyền chi tiết** (admin-only) nằm ở server actions / guard từng trang — thiết kế cần trạng thái **403 / không có quyền** rõ ràng.

---

## 2. Pattern UI chung (gợi ý thiết kế)

| Khu vực | Gợi ý |
|--------|--------|
| **Storefront** | Header: logo, nav danh mục, ô tìm kiếm, icon giỏ; footer: showroom, liên hệ, link chính sách; breadcrumb trên listing/PDP/bài viết. |
| **Form / lỗi** | Banner lỗi form (`role="alert"`), trường bắt buộc có dấu hiệu; nút submit trạng thái loading/disabled. |
| **Admin** | Layout có sidebar hoặc top nav cố định; danh sách dạng bảng + nút “Tạo mới”; form trong card; empty state khi chưa có dữ liệu. |
| **Trạng thái** | Loading skeleton hoặc spinner; empty (không có kết quả lọc); lỗi mạng/server; pagination nếu danh sách dài. |

---

## 3. Khối mô tả chuẩn (áp dụng cho từng trang dưới)

Mỗi trang dùng các tiêu đề con:

- **Route**: đường dẫn (thực tế hoặc gợi ý).
- **Vai trò**: ai dùng.
- **Thành phần UI**: module/layout cần vẽ.
- **Dữ liệu**: thông tin hiển thị hoặc nhập.
- **Hành động**: click, submit, điều hướng.
- **Trạng thái**: loading, empty, lỗi, quyền.
- **Ghi chú**: phase / requirement roadmap (nếu có).

---

## 4. Storefront (khách hàng)

### 4.1 Trang chủ

- **Route**: `/` (hiện placeholder; mục tiêu theo Phase 12).
- **Vai trò**: khách.
- **Thành phần UI**: vùng hero hoặc banner; lưới/carousel **thương hiệu nổi bật**; section **sản phẩm** (featured / mới / bán chạy); section **bài viết** nổi bật; block **showroom + CTA liên hệ**; footer với link chính sách.
- **Dữ liệu**: brands, products (theo cờ merchandising khi có), articles, showrooms — lấy từ catalog/CMS, không hardcode copy cố định.
- **Hành động**: vào danh mục, PDP, bài viết, policy, liên hệ.
- **Trạng thái**: loading section; fallback khi một slot trống.
- **Ghi chú**: SHOP-01, Phase 12.

### 4.2 Listing danh mục (có lọc nhiều mặt)

- **Route**: gợi ý `/danh-muc/[slug]` hoặc `/c/[slug]` — cần align khi implement.
- **Vai trò**: khách.
- **Thành phần UI**: **sidebar filter** (desktop): thương hiệu, khoảng giá, loại kết nối, form factor, tính năng; vùng **sort**; lưới thẻ sản phẩm; breadcrumb; có thể kết hợp **thanh tìm kiếm** trong header.
- **Dữ liệu**: danh sách SP theo category + facet counts; giá hiển thị; badge (featured/new) khi có.
- **Hành động**: đổi filter/sort; mở PDP; xóa/reset filter.
- **Trạng thái**: không có kết quả sau lọc; loading khi đổi query.
- **Ghi chú**: SHOP-02, Phase 13; sort thêm ở Phase 14 (SHOP-03).

### 4.3 Tìm kiếm sản phẩm theo từ khóa

- **Route**: gợi ý `/tim-kiem?q=` hoặc `/search?q=` — xem mục [10. Mở / cần quyết định](#10-mở--cần-quyết-định).
- **Vai trò**: khách.
- **Thành phần UI**: ô query (header hoặc trang kết quả); danh sách kết quả (có thể reuse layout listing); highlight từ khóa (tuỳ chọn).
- **Dữ liệu**: danh sách SP khớp từ khóa.
- **Hành động**: gửi tìm kiếm; vào PDP.
- **Trạng thái**: empty “không tìm thấy”; gợi ý bỏ bớt từ khóa.
- **Ghi chú**: SHOP-04, Phase 14.

### 4.4 Chi tiết sản phẩm (PDP)

- **Route**: gợi ý `/san-pham/[slug]` hoặc `/[productSlug]` — align với routing Next.
- **Vai trò**: khách.
- **Thành phần UI**: gallery ảnh; tên; giá; giá so sánh (compare-at) khi có; mô tả; **bảng thông số** (structured specs — Phase 7+); **trạng thái tồn / availability** (wording an toàn cho khách); **sản phẩm liên quan**; CTA **Thêm giỏ**; luồng **Mua nhanh** (modal/step ngắn); khi có Phase 20: block **có hàng theo showroom** (cách diễn đạt thống nhất toàn site).
- **Dữ liệu**: core product, media, specs, giá, cờ merchandising, availability derived.
- **Hành động**: thêm giỏ; mua nhanh; so sánh (thêm vào compare — tối đa 2).
- **Trạng thái**: hết hàng / chờ hàng; lỗi tải.
- **Ghi chú**: SHOP-05, SHOP-06, Phase 19–20; Quick buy ORD-03, Phase 24.

### 4.5 So sánh sản phẩm

- **Route**: gợi ý `/so-sanh?a=&b=` hoặc session/local state + trang cố định.
- **Vai trò**: khách.
- **Thành phần UI**: hai cột (tối đa **2** SP); hàng = spec keys; ô trống khi thiếu dữ liệu; CTA về PDP / thêm vào giỏ.
- **Dữ liệu**: hai bản ghi SP + spec map.
- **Hành động**: đổi SP trong compare; xóa khỏi compare.
- **Trạng thái**: chưa đủ 2 SP — hướng dẫn chọn thêm.
- **Ghi chú**: SHOP-07, Phase 21.

### 4.6 Giỏ hàng

- **Route**: `/cart` (gợi ý).
- **Vai trò**: khách.
- **Thành phần UI**: danh sách dòng (ảnh thumb, tên, đơn giá, số lượng stepper, xóa); tổng phụ; nút **Thanh toán**.
- **Dữ liệu**: line items, qty, prices.
- **Hành động**: cập nhật SL, xóa; tới checkout.
- **Trạng thái**: giỏ trống; loading.
- **Ghi chú**: ORD-01, Phase 22.

### 4.7 Checkout (form ngắn + thanh toán)

- **Route**: `/checkout` (gợi ý).
- **Vai trò**: khách.
- **Thành phần UI**: form liên hệ ngắn (ưu tiên **SĐT bắt buộc**); địa chỉ/ghi chú tùy thiết kế tối thiểu; chọn **COD** hoặc **QR ngân hàng**; khi QR: vùng **QR động** + hướng dẫn chuyển khoản theo đơn; khi COD giá trị cao: **cảnh báo cọc** và số tiền cọc trước submit; bước xác nhận đặt hàng.
- **Dữ liệu**: payload đơn hàng, phương thức thanh toán, trạng thái tách biệt sau tạo đơn (order/payment/verification — hiển thị cho khách ở mức tối thiểu nếu có trang “cảm ơn”).
- **Hành động**: submit đơn; copy nội dung CK (nếu có).
- **Trạng thái**: lỗi validation (nhất là SĐT); lỗi tạo đơn.
- **Ghi chú**: ORD-02 – ORD-07, Phase 23–28 (tùy phần hiển thị khách vs nội bộ).

### 4.8 Bài viết — danh sách

- **Route**: gợi ý `/tin-tuc` + `/tin-tuc/[slug]` hoặc `/bai-viet/...`.
- **Vai trò**: khách.
- **Thành phần UI**: filter/tab theo **danh mục bài viết**; lưới card (cover, tiêu đề, excerpt, ngày).
- **Dữ liệu**: articles published, category.
- **Hành động**: mở bài.
- **Trạng thái**: không có bài; loading.
- **Ghi chú**: CMS-01, CMS-03, Phase 10.

### 4.9 Bài viết — chi tiết

- **Route**: cùng prefix + `[slug]`.
- **Vai trò**: khách.
- **Thành phần UI**: tiêu đề; meta (tác giả, ngày xuất bản); cover; nội dung body; có thể sidebar bài liên quan.
- **Dữ liệu**: title, slug, excerpt, cover, author, published_at, body.
- **Hành động**: chia sẻ (tuỳ chọn); về danh sách.
- **Trạng thái**: 404 bài không tồn tại hoặc chưa publish.
- **Ghi chú**: Phase 10.

### 4.10 Chính sách (policy)

- **Route**: `/policy/[slug]` — đã có `app/policy/[slug]/page.tsx`.
- **Vai trò**: khách.
- **Thành phần UI**: layout đọc lâu (typography thoáng); TOC nếu nội dung dài; header/brand nhất quán storefront.
- **Dữ liệu**: title, slug/key, body từ CMS/DB.
- **Hành động**: điều hướng từ footer/trang chủ.
- **Trạng thái**: 404 slug.
- **Ghi chú**: CMS-04, Phase 11.

---

## 5. Auth

### 5.1 Đăng nhập nội bộ

- **Route**: `/login` — `app/(auth)/login/page.tsx`.
- **Vai trò**: staff/admin.
- **Thành phần UI**: identifier (email hoặc tên đăng nhập); mật khẩu; tuỳ chọn ghi nhớ phiên; nút đăng nhập; vùng thông báo lỗi (sai thông tin, tài khoản khóa/vô hiệu hóa — copy theo spec Phase 1).
- **Dữ liệu**: credentials.
- **Hành động**: submit → redirect `/dashboard` hoặc return URL.
- **Trạng thái**: loading; lỗi xác thực; session hết hạn (khi redirect lại).
- **Ghi chú**: PLAT-01, Phase 1.

---

## 6. Internal shell (khung trang nội bộ)

- **Route**: mọi đường dẫn dưới `/dashboard`, `/admin` (matcher trong `middleware.ts`).
- **Vai trò**: staff/admin đã đăng nhập.
- **Thành phần UI**: **sidebar** (nhóm: Người dùng, Catalog, Nội dung, v.v.) + **top bar** (user, logout); vùng nội dung; trên mobile cần **drawer** cho nav (dù ưu tiên desktop).
- **Dữ liệu**: tuỳ trang con.
- **Hành động**: điều hướng giữa các module admin.
- **Trạng thái**: **403** khi staff vào màn admin-only (ví dụ quản user).
- **Ghi chú**: PLAT-02, Phase 2–3.

---

## 7. Admin — đã có route (`app/(internal)/admin/...`)

Pattern chung mỗi module: **`/admin/{resource}`** (danh sách), **`/admin/{resource}/new`** (tạo), **`/admin/{resource}/[id]`** (sửa chi tiết). Thiết kế bảng: cột chính, trạng thái publish/active, liên kết sửa.

### 7.1 Dashboard nội bộ

- **Route**: `/dashboard`.
- **Vai trò**: staff/admin.
- **Thành phần UI**: hiện tại: card chào mừng + badge vai trò; **mở rộng Phase 36**: widget tóm tắt (đơn chờ xử lý, ticket, v.v.) + shortcut tới queue.
- **Dữ liệu**: tuỳ phase OPS.
- **Hành động**: vào admin modules.
- **Trạng thái**: placeholder cho tới khi có metrics.
- **Ghi chú**: OPS-01, OPS-02, Phase 36.

### 7.2 Người dùng nội bộ

- **Route**: `/admin/users`, `/admin/users/new`, `/admin/users/[id]`.
- **Vai trò**: **chỉ admin** (guard `requireAdminRole`).
- **Thành phần UI**: danh sách user; form tạo: email, tên đăng nhập, mật khẩu, vai trò (staff/admin); form chi tiết: cập nhật, vô hiệu hóa (theo implement).
- **Dữ liệu**: profiles nội bộ, role.
- **Hành động**: tạo, sửa, deactivate.
- **Trạng thái**: 403 cho staff; lỗi trùng email/username.
- **Ghi chú**: PLAT-03, Phase 3.

### 7.3 Thương hiệu (brands)

- **Route**: `/admin/brands`, `/admin/brands/new`, `/admin/brands/[id]`.
- **Vai trò**: staff/admin (theo policy hiện tại).
- **Thành phần UI**: bảng; form: tên, slug, logo URL (tuỳ chọn); publish/unpublish trên màn chi tiết (nếu có).
- **Dữ liệu**: name, slug, logo_url, published.
- **Hành động**: CRUD, publish.
- **Ghi chú**: CAT-01, Phase 4.

### 7.4 Danh mục sản phẩm (categories)

- **Route**: `/admin/categories`, `.../new`, `.../[id]`.
- **Vai trò**: staff/admin.
- **Thành phần UI**: form: tên, slug, mô tả (tuỳ chọn), điều khiển publish.
- **Dữ liệu**: name, slug, description, published.
- **Ghi chú**: CAT-02, Phase 4.

### 7.5 Showroom

- **Route**: `/admin/showrooms`, `.../new`, `.../[id]`.
- **Vai trò**: staff/admin.
- **Thành phần UI**: form: tên showroom, địa chỉ, SĐT.
- **Dữ liệu**: name, address, phone.
- **Ghi chú**: CAT-03, Phase 5.

### 7.6 Sản phẩm (core)

- **Route**: `/admin/products`, `.../new`, `.../[id]`.
- **Vai trò**: staff/admin.
- **Thành phần UI**: form: tên, slug, thương hiệu (select), danh mục (select), trạng thái (đang bán / tạm ngừng / ngừng KD), mô tả, **ảnh (tối đa 12 URL, mỗi dòng một URL)**; sau này bổ sung: **spec**, **giá**, **cờ merchandising** (Phase 7–8).
- **Dữ liệu**: core catalog fields + gallery URLs.
- **Ghi chú**: CAT-04, Phase 6; mở rộng CAT-05–CAT-07.

### 7.7 Danh mục bài viết

- **Route**: `/admin/article-categories`, `.../new`, `.../[id]`.
- **Vai trò**: staff/admin.
- **Thành phần UI**: form: tên, slug, mô tả ngắn (nếu có trong form chi tiết).
- **Dữ liệu**: editorial taxonomy.
- **Ghi chú**: CMS-02, Phase 9.

### 7.8 Bài viết

- **Route**: `/admin/articles`, `.../new`, `.../[id]`.
- **Vai trò**: staff/admin.
- **Thành phần UI**: form: tiêu đề, slug, excerpt, cover URL, tác giả, danh mục (tuỳ chọn), **trạng thái draft/published**, nội dung (body); danh sách có lọc theo trạng thái.
- **Dữ liệu**: CMS article fields + publish timestamp khi publish.
- **Ghi chú**: CMS-01, CMS-03, Phase 10.

### 7.9 Trang chính sách (policy) — quản trị

- **Route**: `/admin/policy-pages`, `.../new`, `.../[id]`.
- **Vai trò**: staff/admin.
- **Thành phần UI**: form: tiêu đề, **key** nội bộ (vd: delivery, returns, warranty, contact), slug, excerpt, nội dung, publish.
- **Dữ liệu**: key, slug, storefront `/policy/[slug]`.
- **Ghi chú**: CMS-04, Phase 11.

---

## 8. Nội bộ — chưa có route (theo roadmap, route gợi ý)

### 8.1 Tồn kho theo showroom

- **Route (gợi ý)**: `/admin/inventory`, `/admin/inventory/[showroomId]`, hoặc matrix **showroom × product**.
- **Vai trò**: staff/admin.
- **Thành phần UI**: bảng nhập/sửa số lượng; chọn showroom; tìm SP; **lịch sử điều chỉnh** (timeline hoặc bảng) với lý do, người thao tác, thời gian.
- **Dữ liệu**: qty per (product, showroom); adjustment events.
- **Trạng thái**: conflict; không đủ quyền ghi.
- **Ghi chú**: INV-01, INV-02, Phase 15–16.

### 8.2 Đơn hàng & xác minh

- **Route (gợi ý)**: `/admin/orders`, `/admin/orders/verification`, `/admin/orders/[id]`.
- **Vai trò**: staff/admin.
- **Thành phần UI**: **queue** đơn mới cần verify; chi tiết đơn: line items, khách, PTTT, **trạng thái đơn / thanh toán / xác minh** tách biệt; gán người xử lý; nút chuyển trạng thái; panel **tồn kho showroom** khi xử lý (INV-04).
- **Dữ liệu**: order, payment, verification states; assignment.
- **Ghi chú**: ORD-08, ORD-09, Phase 28–30; INV-04, Phase 18.

### 8.3 Khách hàng (CRM master)

- **Route (gợi ý)**: `/admin/customers`, `/admin/customers/[id]`.
- **Vai trò**: staff/admin.
- **Thành phần UI**: tìm theo SĐT/email; form: tên, SĐT, email, địa chỉ, ghi chú; tab liên kết đơn / lead / ticket / bảo hành (khi có).
- **Ghi chú**: CRM-01, Phase 31.

### 8.4 Lead

- **Route (gợi ý)**: `/admin/leads`, `/admin/leads/new`, `/admin/leads/[id]`.
- **Thành phần UI**: nguồn lead gồm **`chat`**; liên kết customer; trạng thái; ghi chú.
- **Ghi chú**: CRM-02, Phase 32.

### 8.5 Ticket hỗ trợ

- **Route (gợi ý)**: `/admin/tickets`, `/admin/tickets/[id]`.
- **Thành phần UI**: ticket gắn customer; trạng thái; chủ sở hữu (staff); nội dung / cập nhật.
- **Ghi chú**: CRM-03, Phase 33.

### 8.6 Bảo hành

- **Route (gợi ý)**: `/admin/warranty`, `/admin/warranty/[caseId]`.
- **Thành phần UI**: tạo case: customer, product, showroom, **serial**; **timeline** xử lý; trạng thái & owner (Phase 35).
- **Ghi chú**: CRM-04, CRM-05, CRM-06, Phase 34–35.

### 8.7 Dashboard vận hành (mở rộng)

- **Route**: `/dashboard` (nâng cấp).
- **Thành phần UI**: cards số liệu (đơn chờ verify, lead mở, ticket mở, case BH); link thẳng vào **queue** đã lọc.
- **Ghi chú**: OPS-01, OPS-02, Phase 36.

---

## 9. Ma trận ánh xạ (phase → nhóm trang) — ưu tiên thiết kế

| Phase (ví dụ) | Nhóm trang storefront / internal |
|---------------|----------------------------------|
| 12 | Trang chủ `/` |
| 13–14 | Listing, sort, search |
| 19–21 | PDP, availability, compare |
| 22–27 | Cart, checkout, COD/QR/deposit |
| 11, 10 | Policy, articles (storefront + admin đã có) |
| 15–18 | Admin inventory + stock trong xử lý đơn |
| 28–30 | Admin orders & verification |
| 31–35 | CRM, leads, tickets, warranty |
| 36 | Dashboard + queues |

---

## 10. Mở / cần quyết định

1. **URL storefront**: dùng prefix tiếng Việt (`/danh-muc/`, `/san-pham/`) hay slug phẳng tại root — ảnh hưởng breadcrumb, SEO, và `sitemap`.
2. **Trang kết quả tìm kiếm**: route riêng (`/tim-kiem` / `/search`) với layout giống listing hay nhúng trong category — thống nhất filter/sort nếu reuse.
3. **Giỏ hàng**: cookie vs localStorage vs server session — ảnh hưởng UI “giỏ trên nhiều thiết bị” (v1 desktop-first có thể đơn giản hóa).
4. **QR thanh toán**: màn hình xác nhận sau đặt hàng (thank-you) có cần in lại QR / hướng dẫn — thiết kế một luồng rõ ràng cho khách.

---

*Tài liệu này phản ánh roadmap/requirements tại thời điểm tạo; khi phase hoàn thành, cập nhật route thực tế trong `app/` cho khớp.*
