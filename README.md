# NUTRISYNC – Website đồ ăn healthy cho sinh viên

Website tĩnh 3 trang, dựng hoàn toàn bằng **HTML5, CSS3 và JavaScript thuần** (không framework, không thư viện bên thứ ba). Có thể deploy ngay lên Vercel, GitHub Pages hoặc Netlify.

- Trang Cửa hàng: `index.html`
- Trang Về chúng tôi: `about.html`
- Trang Get App: `get-app.html`

---

## 1. Chạy thử ở máy local

Vì website dùng đường dẫn tương đối và `fetch` không cần thiết, bạn có thể mở trực tiếp `index.html`. Tuy nhiên nên chạy qua một HTTP server nhỏ để hành vi giống môi trường deploy:

```bash
# Cách 1 – Python (có sẵn trên macOS/Linux)
cd nutrisync
python3 -m http.server 5500

# Sau đó mở http://localhost:5500
```

```bash
# Cách 2 – Node.js
npx serve .
```

```text
Cách 3 – VS Code: cài extension Live Server → chuột phải index.html → Open with Live Server.
```

> **Lưu ý:** Google Fonts (Oswald, Be Vietnam Pro, Playfair Display) được nạp từ internet. Khi mất mạng, trang vẫn hoạt động nhưng sẽ dùng font dự phòng của hệ điều hành.

---

## 2. Cấu trúc thư mục

```text
nutrisync/
├── index.html              # Trang Cửa hàng (catalog + tìm kiếm)
├── about.html              # Trang Về chúng tôi (accordion)
├── get-app.html            # Trang giới thiệu ứng dụng
├── css/
│   ├── style.css           # Toàn bộ giao diện, biến màu, component
│   └── responsive.css      # Media queries: 1180 / 1024 / 960 / 760 / 640 / 440px
├── js/
│   ├── data.js             # NGUỒN DỮ LIỆU DUY NHẤT: sản phẩm, liên hệ, mã giảm giá
│   ├── app.js              # Header, menu mobile, dialog, accordion, toast, tìm kiếm
│   ├── catalog.js          # Render danh mục, lọc sản phẩm, modal chi tiết
│   └── cart.js             # Giỏ hàng, mã giảm giá, kiểm tra form, đặt hàng demo
├── assets/
│   └── img/
│       ├── products/       # 12 ảnh sản phẩm .webp
│       ├── blog/           # Ảnh đời sống thay cho placeholder (bạn tự thêm)
│       ├── hero-fern.webp
│       ├── logo-lockup.webp
│       ├── logo-mark.webp
│       ├── app-health-phone.webp
│       ├── app-reminder-phone.webp
│       ├── badge-app-store.png
│       ├── badge-google-play.png
│       ├── favicon.png
│       └── og-cover.jpg
├── robots.txt
├── sitemap.xml
└── README.md
```

---

## 3. Chỉnh sửa nội dung

### 3.1. Sản phẩm, giá, danh mục, thông tin liên hệ

Mở **`js/data.js`** – mọi dữ liệu động đều nằm ở đây:

| Vị trí | Nội dung |
| --- | --- |
| `NS.config.contact` | Tên, người đại diện, email, hotline, địa chỉ, website |
| `NS.config.coupons` | Mã giảm giá demo (`SINHVIEN10`, `NUTRI20`) |
| `NS.categories` | 3 nhóm: Bữa chính / Bữa phụ & snack / Đồ uống |
| `NS.products` | 12 sản phẩm: tên, giá, ảnh, mô tả, macros, thông số, thành phần |

Thêm sản phẩm mới: sao chép một object trong `NS.products`, đổi `id` (không trùng), `category` phải khớp `id` trong `NS.categories`, và thêm ảnh vào `assets/img/products/`.

Đổi hotline nhớ cập nhật cả `phone` và `phoneHref` (dạng `tel:19001234`).

### 3.2. Ảnh

- Ảnh sản phẩm: tỉ lệ **1200 × 896** (khoảng 4:3), định dạng `.webp`.
- Giữ đúng tên file đang dùng trong `data.js`, hoặc sửa lại đường dẫn `image` tương ứng.
- Ảnh biểu tượng/điện thoại: `.webp` nền trong suốt.
- Ảnh chia sẻ mạng xã hội `og-cover.jpg`: khuyến nghị **1200 × 630**.
- Có thể nén ảnh bằng [Squoosh](https://squoosh.app/) trước khi thay.

### 3.3. Thay ảnh placeholder ở trang Về chúng tôi / Get App

Các khung màu xanh có biểu tượng và chữ “Ảnh minh họa” là placeholder. Để thay bằng ảnh thật:

1. Chép ảnh vào `assets/img/blog/` (tạo file mới, **không dấu, không khoảng trắng**, ví dụ `thu-vien-sinh-vien.webp`). Khuyến nghị **1200 × 900px**, `.webp`, dưới ~250KB.
2. Mở `about.html` hoặc `get-app.html`, tìm `<figure class="media-ph ...">` tương ứng.
3. Thêm class `media-ph--has-image` vào figure và chèn thẻ `<img>` ngay sau thẻ mở figure:

```html
<figure class="media-ph media-ph--library media-ph--has-image">
  <img class="media-ph__img" src="assets/img/blog/thu-vien-sinh-vien.webp"
       alt="Sinh viên học nhóm tại thư viện" width="1200" height="900" loading="lazy">
  <!-- Giữ nguyên phần còn lại: biểu tượng sẽ tự ẩn, caption vẫn hiển thị -->
</figure>
```

4. Đổi `alt` thành mô tả đúng nội dung ảnh, và sửa chữ “Ảnh minh họa” trong `<figcaption>` (hoặc xoá thẻ `<span>` đó).

CSS đã hỗ trợ sẵn: ảnh phủ kín khung, tự cắt theo tỉ lệ (`object-fit: cover`), caption có nền tối để vẫn đọc được.

**Danh sách placeholder và tên file gợi ý:**

| Trang | Vị trí | File gợi ý |
| --- | --- | --- |
| About | Thư viện & sinh viên | `thu-vien-sinh-vien.webp` |
| About | Áp lực học tập | `ap-luc-hoc-tap.webp` |
| About | Vận động mỗi ngày | `van-dong-moi-ngay.webp` |
| About | Bữa ăn cùng bạn bè | `bua-an-ban-be.webp` |
| About | Bữa sáng gia đình | `bua-sang-gia-dinh.webp` |
| About | Theo dõi sức khỏe | `theo-doi-suc-khoe.webp` |
| About | Chạy bộ mỗi ngày | `chay-bo-moi-ngay.webp` |
| About | Ý tưởng & tăng trưởng | `y-tuong-tang-truong.webp` |
| About | Cộng đồng NUTRISYNC | `cong-dong-nutrisync.webp` |
| Get App | Bác sĩ & sinh viên | `bac-si-sinh-vien.webp` |
| Get App | Meal plan & lịch trình | `meal-plan-lich-trinh.webp` |
| Get App | Cộng đồng chạy bộ | `cong-dong-chay-bo.webp` |

### 3.4. Đổi tên miền khi deploy

Tên miền mẫu đang là `https://nutrisync.vn`. Khi có domain thật, tìm–thay đồng loạt ở:

- `index.html`, `about.html`, `get-app.html`: thẻ `canonical`, `og:url`, JSON-LD.
- `js/data.js`: `NS.config.siteUrl` và `contact.websiteHref`.
- `sitemap.xml`, `robots.txt`.

### 3.5. Màu sắc & font

Các biến thiết kế nằm ở đầu `css/style.css`:

```css
:root {
  --green-950: #052f18;
  --green-700: #006c33;
  --cream: #f8f8e8;
  --gold: #d9a441;
  --font-display: "Oswald", ...;   /* tiêu đề */
  --font-body: "Be Vietnam Pro", ...;
  --font-quote: "Playfair Display", ...;
}
```

Đổi màu chủ đạo chỉ cần sửa các biến này. Font được khai báo trong thẻ `<link>` Google Fonts ở `<head>` của cả 3 trang.

---

## 4. Tính năng & hành vi

- Header dính (sticky), đổi trạng thái khi cuộn; menu hamburger ở màn hình ≤ 960px.
- Tìm kiếm trực tiếp theo tên/mô tả/thành phần, **không phân biệt dấu** (“com” khớp “cơm”). Trang khác gửi từ khoá sang `index.html?q=...`.
- Card sản phẩm: hover, nút thêm nhanh, modal chi tiết với số lượng và thông tin dinh dưỡng.
- Hộp xác nhận trước khi thêm vào giỏ.
- Giỏ hàng dạng modal, dùng chung cho cả 3 trang; tăng/giảm số lượng, xoá món.
- Mã giảm giá demo: `SINHVIEN10` (giảm 10%), `NUTRI20` (giảm 20%).
- Kiểm tra số điện thoại Việt Nam (10 số, bắt đầu bằng 0 hoặc +84) và địa chỉ tối thiểu 8 ký tự.
- Nút đặt hàng **mô phỏng** (không gọi API), hiện mã đơn và tổng tiền.
- Accordion trang Về chúng tôi: mỗi lần chỉ mở một mục.
- Nút App Store / Google Play / Meal plan hiện toast “sắp ra mắt”.
- Tôn trọng `prefers-reduced-motion`, có skip link, focus ring và nhãn ARIA.

### Giỏ hàng được lưu ở đâu?

Giỏ hàng dùng **`sessionStorage`** (khoá `nutrisync-cart-v1`) thay vì chỉ nằm trong biến JavaScript. Nhờ vậy giỏ **không mất khi tải lại trang hoặc chuyển giữa 3 trang**, nhưng **tự xoá khi đóng tab/trình duyệt**. Đây là lựa chọn có chủ đích cho website nhiều trang; nếu muốn giỏ mất ngay khi tải lại, sửa `loadCart()` trong `js/cart.js` để luôn trả về `[]` và bỏ các lệnh `sessionStorage`.

### Giới hạn của bản demo

- Không có backend: đơn hàng, mã giảm giá và tồn kho chỉ là mô phỏng phía client.
- Thông tin liên hệ, địa chỉ, hotline, người đại diện là **dữ liệu mẫu** – thay trước khi dùng thật.
- 3 sản phẩm chỉ có ảnh, không có thông tin chi tiết trong mockup (Cơm lứt bò lúc lắc, Cơm lứt tôm nướng, Combo trà & hạt) được bổ sung dữ liệu hợp lý; thông số dinh dưỡng của toàn bộ 12 món là số liệu minh hoạ, giá lấy theo mockup khi có.
- Ảnh phong cách sống được thay bằng khối trang trí nội bộ (gradient + SVG), không dùng ảnh stock bên ngoài.
- Form liên hệ chưa gửi email thật; nút “Gửi tin nhắn” trong modal chỉ mở liên kết `mailto:`/`tel:` do `app.js` gắn từ `data.js`.

---

## 5. Deploy

### Vercel

1. Đăng nhập [vercel.com](https://vercel.com) → **Add New Project**.
2. Kéo thả thư mục `nutrisync/` (hoặc import repo GitHub).
3. Framework Preset: **Other**; Build Command để trống; Output Directory: `.`.
4. Deploy.

### Netlify

1. [app.netlify.com](https://app.netlify.com) → **Add new site → Deploy manually**.
2. Kéo thả thư mục `nutrisync/` vào vùng deploy.
3. Hoặc kết nối Git với cấu hình: Build command trống, Publish directory `.`.

### GitHub Pages

```bash
git init
git add .
git commit -m "NUTRISYNC static website"
git branch -M main
git remote add origin https://github.com/<tài-khoản>/<repo>.git
git push -u origin main
```

Vào **Settings → Pages** → Source: `Deploy from a branch` → Branch: `main` / `root`. Website sẽ có dạng `https://<tài-khoản>.github.io/<repo>/`.

> Khi deploy ở thư mục con (GitHub Pages dạng `/<repo>/`), nhớ đổi `canonical`, `og:url`, `sitemap.xml` sang đúng đường dẫn thực tế.

---

## 6. Kiểm thử đã thực hiện

- Không lỗi JavaScript trên console ở cả 3 trang.
- Không tràn ngang ở 1440px, 1024px, 768px và 390px.
- Luồng đã kiểm tra: mở chi tiết → chọn số lượng → xác nhận → giỏ hàng → áp mã → validate form → đặt hàng thành công.
- Tìm kiếm có dấu/không dấu, trạng thái rỗng, nút xoá từ khoá.
- Accordion, menu mobile, toast, các modal và phím Esc.
- Breakpoints: 1180 / 1024 / 960 / 760 / 640 / 440px.

Trình duyệt mục tiêu: Chrome, Edge, Firefox, Safari (bản hiện đại). `sessionStorage`, `<dialog>` và `inert` yêu cầu trình duyệt tương đối mới.

---

## 7. Giấy phép & ghi chú

- Mã nguồn viết cho mục đích học tập/demo.
- Font Google Fonts phát hành theo SIL Open Font License.
- Hình ảnh sản phẩm và bộ nhận diện trong `assets/` được tạo riêng cho dự án này; thay bằng ảnh thật trước khi kinh doanh.
