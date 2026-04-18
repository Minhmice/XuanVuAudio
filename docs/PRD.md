## Dự án: Rebuild tainghe.com.vn thành web app bán tai nghe multi-brand

## 1. Tổng quan sản phẩm

Xây dựng lại **tainghe.com.vn** thành một web app thương mại điện tử hiện đại, giữ nguyên tên thương hiệu hiện tại, tập trung vào bán lẻ **tai nghe và thiết bị âm thanh multi-brand** cho thị trường **Việt Nam**.

Phiên bản đầu tiên ưu tiên:

* trải nghiệm mua hàng rõ ràng, dễ dùng
* quản lý sản phẩm, tồn kho, đơn hàng
* CRM cơ bản cho lead, ticket, bảo hành
* CMS để quản lý bài viết và nội dung sản phẩm
* thanh toán bằng **QR banking động theo đơn**, **COD**, và **COD có cọc** cho đơn giá trị cao

Sản phẩm được xây theo hướng **desktop-first**.

---

## 2. Mục tiêu

### Mục tiêu kinh doanh

* Rebrand website cũ sang giao diện và hệ thống vận hành mới.
* Tăng khả năng chuyển đổi đơn hàng trên web.
* Chuẩn hóa quản lý sản phẩm, showroom, tồn kho và đơn hàng.
* Tạo nền tảng để mở rộng CRM và AI viết bài trong giai đoạn sau.

### Mục tiêu sản phẩm

* Cho khách hàng tìm, so sánh và mua tai nghe nhanh.
* Cho staff/admin quản lý sản phẩm, kho theo showroom, đơn hàng, bảo hành và bài viết.
* Cho hệ thống hỗ trợ quy trình xác minh đơn đơn giản qua gọi điện.
* Tạo nền móng kỹ thuật đủ sạch để scale sau này.

---

## 3. Phạm vi MVP

## Trong phạm vi

### A. Storefront bán hàng

* Trang chủ
* Trang danh mục sản phẩm
* Trang chi tiết sản phẩm
* Bộ lọc sản phẩm cơ bản
* Tìm kiếm sản phẩm
* So sánh tối đa **2 sản phẩm** theo thông số kỹ thuật
* Giỏ hàng
* Checkout cơ bản
* Mua nhanh bằng số điện thoại hoặc thông tin tối thiểu
* Các trang chính sách cơ bản: giao hàng, đổi trả, bảo hành, liên hệ

### B. Đơn hàng và thanh toán

* Tạo đơn hàng từ website
* Trạng thái đơn hàng cơ bản
* COD
* COD có cọc cho đơn giá trị cao
* QR banking động theo từng đơn
* Staff gọi điện xác minh đơn trước khi xử lý

### C. Quản lý sản phẩm và tồn kho

* Quản lý sản phẩm multi-brand
* Quản lý thương hiệu
* Quản lý category
* Quản lý thông số kỹ thuật
* Quản lý giá bán
* Quản lý tồn kho theo **showroom**
* Quản lý ảnh sản phẩm
* Gắn sản phẩm nổi bật / mới / khuyến nghị

### D. CRM cơ bản

* Lưu hồ sơ khách hàng cơ bản
* Ghi nhận **lead**
* Ghi nhận **ticket**
* Ghi nhận **bảo hành**
* Ghi nhận lịch sử xử lý cơ bản
* Lead source ban đầu từ **chat**
* Có serial cho case bảo hành/xử lý

### E. CMS

* Quản lý bài viết
* Quản lý danh mục bài viết
* Soạn, sửa, publish bài viết
* Staff và admin đều có thể duyệt bài ở giai đoạn đầu
* Chuẩn bị cấu trúc để sau này thêm AI-generated article workflow

### F. Admin

* Dashboard cơ bản
* Quản lý users
* Quản lý vai trò: admin, staff
* Admin có thể điều chỉnh quyền sau này
* Giai đoạn đầu staff có thể sửa gần như toàn bộ phần vận hành cần thiết

---

## Ngoài phạm vi MVP

* Tích hợp sâu với Facebook, Zalo, sàn thương mại điện tử
* Marketing automation nâng cao
* Loyalty / điểm thưởng / membership
* Chatbot AI tư vấn sản phẩm
* AI agent tự động viết bài hàng tuần
* Dashboard phân tích nâng cao
* Mobile-first optimization sâu
* App mobile

---

## 4. Người dùng chính

### Khách hàng B2C

Người mua tại Việt Nam có nhu cầu tìm hiểu, so sánh và đặt mua tai nghe hoặc thiết bị âm thanh.

### Staff

Nhân sự vận hành đơn hàng, nội dung, CRM và bảo hành.

### Admin

Người quản trị toàn hệ thống, có quyền quản lý cấu hình, người dùng và phân quyền.

---

## 5. User stories cốt lõi

### Khách hàng

* Là khách mua hàng, tôi muốn duyệt theo brand/category để tìm sản phẩm nhanh.
* Là khách mua hàng, tôi muốn xem chi tiết thông số kỹ thuật để đánh giá sản phẩm.
* Là khách mua hàng, tôi muốn so sánh 2 sản phẩm để chọn dễ hơn.
* Là khách mua hàng, tôi muốn đặt hàng nhanh chỉ với số điện thoại hoặc thông tin ngắn gọn.
* Là khách mua hàng, tôi muốn chọn COD hoặc quét QR để thanh toán.
* Là khách mua hàng, tôi muốn biết sản phẩm còn hàng ở showroom nào.
* Là khách mua hàng, tôi muốn xem bài viết/tin tức để tham khảo trước khi mua.

### Staff/Admin

* Là staff, tôi muốn tạo/sửa sản phẩm, giá, tồn kho theo showroom.
* Là staff, tôi muốn kiểm tra và xác minh đơn hàng qua điện thoại.
* Là staff, tôi muốn theo dõi ticket và bảo hành theo serial.
* Là staff, tôi muốn cập nhật trạng thái xử lý đơn và case bảo hành.
* Là staff, tôi muốn tạo và publish bài viết.
* Là admin, tôi muốn quản lý quyền của staff.

---

## 6. Luồng nghiệp vụ chính

## 6.1 Luồng mua hàng

1. Khách vào web.
2. Duyệt danh mục, tìm kiếm hoặc lọc sản phẩm.
3. Vào trang chi tiết sản phẩm.
4. Có thể thêm sản phẩm vào compare.
5. Thêm vào giỏ hàng.
6. Đi checkout.
7. Nhập thông tin tối thiểu, trong đó số điện thoại là bắt buộc.
8. Chọn phương thức thanh toán:

   * COD
   * COD có cọc nếu đơn giá trị cao
   * QR banking động
9. Đơn được tạo.
10. Staff gọi điện xác minh.
11. Sau xác minh, staff xử lý đơn tiếp theo trạng thái nội bộ.

## 6.2 Luồng COD có cọc

1. Hệ thống xác định đơn thuộc nhóm giá trị cao.
2. Checkout hiển thị yêu cầu đặt cọc.
3. Khách thanh toán cọc bằng QR banking động.
4. Staff xác minh cuộc gọi.
5. Sau khi xác minh thành công, đơn chuyển sang xử lý.

## 6.3 Luồng bảo hành

1. Staff tạo hoặc mở case bảo hành.
2. Gắn thông tin khách hàng.
3. Gắn sản phẩm và **serial**.
4. Ghi nhận tình trạng, ngày tiếp nhận, showroom xử lý.
5. Cập nhật trạng thái trong quá trình xử lý.
6. Lưu lịch sử thao tác/cập nhật.

## 6.4 Luồng quản lý bài viết

1. Staff/Admin tạo bài viết trong CMS.
2. Soạn nội dung, ảnh, metadata.
3. Publish trực tiếp trong giai đoạn đầu.
4. Sau này có thể chèn bước AI draft và review.

---

## 7. Yêu cầu chức năng

## 7.1 Storefront

### Trang chủ

* Banner chính
* Khu vực brand nổi bật
* Sản phẩm nổi bật / mới / bán chạy
* Khối bài viết/tin tức
* Liên kết nhanh tới danh mục và showroom
* CTA liên hệ nhanh

### Danh mục sản phẩm

* Lọc theo brand
* Lọc theo mức giá
* Lọc theo loại kết nối
* Lọc theo form factor
* Lọc theo tính năng cơ bản
* Sắp xếp theo giá / mới / nổi bật

### Chi tiết sản phẩm

* Tên sản phẩm
* Giá
* Tình trạng hàng
* Showroom còn hàng
* Hình ảnh
* Mô tả
* Thông số kỹ thuật
* Sản phẩm liên quan
* Nút thêm giỏ hàng
* Nút mua nhanh
* Nút thêm so sánh

### So sánh sản phẩm

* So sánh tối đa 2 sản phẩm
* So sánh theo spec
* Hiển thị điểm giống/khác rõ ràng

## 7.2 Checkout

* Cho phép tạo đơn với thông tin ngắn gọn
* Bắt buộc số điện thoại
* Hỗ trợ COD
* Hỗ trợ QR banking động theo đơn
* Hỗ trợ COD có cọc cho đơn giá trị cao
* Trạng thái thanh toán gắn với đơn

## 7.3 CRM cơ bản

* Hồ sơ khách hàng
* Lead từ chat
* Ticket hỗ trợ
* Case bảo hành có serial
* Lịch sử tương tác cơ bản
* Gắn case với showroom hoặc staff phụ trách

## 7.4 Inventory theo showroom

* Mỗi sản phẩm có tồn kho theo showroom
* Staff có thể cập nhật số lượng
* Hiển thị trạng thái tồn kho trên storefront theo rule phù hợp
* Có thể dùng tồn kho để hỗ trợ staff khi xác nhận đơn

## 7.5 CMS bằng Payload

* Collection cho sản phẩm
* Collection cho brand
* Collection cho category
* Collection cho bài viết
* Collection cho ticket/bảo hành/lead
* Collection cho showroom
* Media management
* Draft/publish cơ bản

## 7.6 Role và quyền

### Staff

* Quản lý sản phẩm
* Quản lý bài viết
* Xử lý đơn
* Tạo/sửa ticket
* Tạo/sửa bảo hành

### Admin

* Có toàn quyền
* Có thể chỉnh permission cho staff sau này

---

## 8. Dữ liệu chính

## Product

* id
* name
* slug
* brand_id
* category_id
* description
* specs
* price
* compare_price
* status
* images
* featured_flag

## Brand

* id
* name
* slug
* logo

## Showroom

* id
* name
* address
* phone

## Inventory

* id
* product_id
* showroom_id
* quantity

## Customer

* id
* name
* phone
* email
* address
* notes

## Order

* id
* customer_id
* items
* subtotal
* deposit_amount
* total
* payment_method
* payment_status
* verification_status
* order_status
* assigned_staff_id

## Lead

* id
* customer_id
* source = chat
* note
* owner_id
* status

## Ticket

* id
* customer_id
* type
* content
* status
* assigned_staff_id

## WarrantyCase

* id
* customer_id
* product_id
* serial_number
* showroom_id
* issue_description
* status
* timeline_logs

## Article

* id
* title
* slug
* excerpt
* content
* cover_image
* status
* author_id
* published_at

---

## 9. Yêu cầu phi chức năng

* Desktop-first
* Giao diện hiện đại, dễ đọc, rõ trust signal
* Hiệu năng tốt cho catalog sản phẩm
* CMS dễ vận hành cho staff
* Chuẩn SEO cơ bản cho trang sản phẩm và bài viết
* Bảo mật dữ liệu người dùng ở mức phù hợp
* Dễ mở rộng cho AI content workflow về sau
* Dễ mở rộng cho tích hợp ngoài trong giai đoạn tiếp theo

---

## 10. Stack kỹ thuật dự kiến

* **Frontend**: Next.js, TypeScript, Tailwind
* **Backend / DB / Auth**: Supabase
* **CMS**: Payload CMS
* **Storage**: media storage cho ảnh sản phẩm/bài viết
* **Payment**: QR banking integration động theo đơn, COD workflow nội bộ

---

## 11. KPI MVP

* Số đơn hàng tạo thành công
* Tỷ lệ checkout hoàn tất
* Tỷ lệ đơn xác minh thành công
* Tỷ lệ đơn COD có cọc hoàn tất
* Số lead/ticket/bảo hành được ghi nhận đầy đủ
* Số bài viết được publish qua CMS
* Thời gian staff xử lý đơn và case cơ bản

---

## 12. Giả định hiện tại

* Tên thương hiệu giữ nguyên.
* Thị trường chỉ là Việt Nam.
* Giai đoạn đầu chưa cần integration phức tạp ngoài banking.
* Quy trình xác minh đơn qua gọi điện là đủ cho MVP.
* Staff có quyền rộng, admin sẽ siết quyền sau.
* AI content chưa triển khai ở MVP nhưng cấu trúc CMS phải sẵn để gắn sau.

---

## 13. Rủi ro chính

* Taxonomy sản phẩm lớn, dễ rối nếu không chuẩn hóa spec và category.
* Tồn kho theo showroom cần rule rõ để không sai đơn.
* QR banking động cần flow đối soát rõ với order status.
* COD có cọc cần logic rõ để tránh nhầm giữa cọc và thanh toán toàn phần.
* CRM cơ bản dễ bị “nửa vời” nếu không thống nhất ticket/lead/warranty ngay từ đầu.

---

## 14. Giai đoạn sau

* AI agent viết bài hàng tuần
* Gợi ý nội dung theo brand/category
* Phân quyền sâu hơn
* Marketing automation
* Chat integration
* Báo cáo nâng cao
* Gợi ý sản phẩm thông minh
* Customer account đầy đủ hơn

---

## 15. Kết luận

MVP này là một **nền tảng ecommerce bán tai nghe multi-brand, desktop-first, có CMS và CRM cơ bản**, tập trung vào:

* bán hàng ổn
* quản lý tồn kho theo showroom
* xử lý đơn rõ ràng
* hỗ trợ bảo hành có serial
* đủ nền tảng để mở rộng AI content và CRM sâu hơn sau này

Mình có thể làm tiếp ngay bản **PRD chi tiết hơn theo format chuyên nghiệp**, gồm:

* sitemap
* user flow
* admin flow
* role matrix
* entity relationship level cao
* MVP / post-MVP / non-goals rõ hơn.
