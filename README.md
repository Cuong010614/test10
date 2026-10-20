# Một thế giới nhỏ dành cho Mỹ Tú

Trang quà tặng 20/10, dùng HTML, CSS, JavaScript, Three.js và Vite.

## Chạy và build

Node.js 22 trở lên:

```sh
npm ci --cache /tmp/npm-cache
npm run dev -- --port 5173
npm run build
```

Bản tĩnh thông thường nằm trong `dist/`. Bản dành cho GitHub Pages nằm trong `docs/`, với đường dẫn tài nguyên `/test10/`.

## GitHub Pages

1. Mở Settings → Pages của repository `Cuong010614/test10`.
2. Chọn **Deploy from a branch** → **main** → **/docs** → **Save**.
3. Đợi GitHub báo triển khai thành công. Địa chỉ dự kiến: https://cuong010614.github.io/test10/

Sau khi sửa nội dung, chạy `npm run build:pages` và commit cả mã nguồn lẫn `docs/` để cập nhật website. Trạng thái hoạt động của link cần được kiểm tra sau khi bật Pages.

## Hành trình

1. Trang Cô Hai Báo phong cách poster đường phố đen–vàng, sticker và caption meme. Có liên kết tới TikTok do người gửi cung cấp; không mạo nhận là trang chính thức.
2. Nút “Thả tim cho Cô Hai” chuyển thẳng sang trang quà bằng hiệu ứng ngắn, không lời thoại, âm báo, màn gọi tên hoặc nút xác nhận trung gian. Tim chỉ là tương tác tại trang, không gửi lượt thích lên TikTok. Tiêu đề và mô tả ban đầu không tiết lộ quà.
3. Trang quà mở đầu bằng lời chúc 20/10, thư ngắn, bó hoa ly 3D, trò lật thẻ năm cặp Miffy/Bibble/Snoopy/Bechichi/Hirono, khung ảnh và góc nhạc.
4. Nút cuối bung 64–100 bông hoa ly, rồi hiện hộp bánh. Mở nắp mới hiện chỉ dẫn nhận tại quầy bảo vệ cổng 2, ngày 20/10.
5. Có nút sao chép chỉ dẫn và xem lại hoa nở. Chế độ giảm chuyển động bỏ hiệu ứng nhưng giữ toàn bộ nội dung.

## Cá nhân hóa

- `src/gift-config.js`: người nhận, ngày, vị trí và lời nhắn nhận bánh. Đây là nội dung người gửi cung cấp, không phải trạng thái giao hàng được theo dõi tự động.
- `index.html`: thư, nội dung và tiêu đề.
- `src/illustrations.js`: hoa ly và các nhân vật minh họa SVG.
- `src/main.js`: tương tác, nhạc nền tổng hợp và các liên kết tìm nhạc.
- `src/style.css`: giao diện và hoạt ảnh.

Nhạc nền nhẹ dùng Web Audio và chỉ bật khi bấm nút. Nhạc của MCK/Wren Evans/Mr. Siro mở qua tìm kiếm Spotify ở tab riêng; chưa có file nhạc hoặc trình phát bài hát nhúng. Không tự phát hoặc khẳng định đang phát bản thu của các nghệ sĩ.

Ảnh được thêm trong giao diện chỉ tồn tại trong phiên mở trang, không tải lên máy chủ. Muốn gửi kèm ảnh thật, đặt ảnh trong `public/` rồi thay nội dung các khung bằng thẻ `img` trước khi build. Font Playfair Display và Be Vietnam Pro được đóng gói cùng website, không cần kết nối Google Fonts.

## Kiểm tra thủ công

Kiểm tra màn hình 1440px, 390px và 320px: trang bìa che nội dung quà, chuyển thẳng sau một lần thả tim, mở/đóng thư bằng nút và Escape, trò lật thẻ (trúng/sai/chơi lại), chọn nhân vật, bật/tắt nhạc nền, liên kết Spotify, thêm ảnh, hoa bung, mở hộp và sao chép chỉ dẫn. Thử lại với `prefers-reduced-motion: reduce`. Không có backend hoặc thông báo tự động gửi cho người nhận.

## Bản trải nghiệm 3D

- Hoa ly dựng bằng hình học 3D: cánh hoa cong, nhụy, lá, cành, giấy gói và nơ. Mô-đun Three.js chỉ tải sau khi thả tim. Nếu WebGL không hoạt động hoặc mất context, bó hoa SVG vẫn hiện.
- Bó hoa theo chuyển động chuột, có nút xoay và trở về góc ban đầu; tự dừng khi nằm ngoài màn hình hoặc tab bị ẩn. Giới hạn render 30 fps, mật độ pixel tối đa 1.35 trên mobile và 1.7 trên desktop.
- Hạt sáng, dấu chuột, nghiêng khung ảnh, xuất hiện theo cuộn, đĩa nhạc quay, vòng sáng cuối và chuyển cảnh không lời.
- Nút “Hiệu ứng” tắt các chuyển động. Tôn trọng `prefers-reduced-motion`; toàn bộ thư, ảnh, nhạc và chỉ dẫn vẫn sử dụng được khi tắt hiệu ứng.
- `src/bouquet-3d.js`: cảnh Three.js. `src/experience.js`: quản lý chuyển động, vùng nhìn và tương tác. `src/cinematic.css`: thiết kế mới. `src/fonts.js`: font nội bộ.

Tham khảo kỹ thuật (không sao chép thiết kế): [Three.js Responsive Design](https://github.com/mrdoob/three.js/blob/r180/manual/en/responsive.html), [MDN Intersection Observer](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API).

## Ảnh và hiệu ứng toàn trang

`src/media.js` khai báo ảnh Cô Hai và ba ảnh Mỹ Tú theo đường dẫn tương đối trong `public/`. Khi chưa có ảnh được cung cấp, poster dùng chữ đồ họa và các khung ảnh vẫn cho phép chọn ảnh trong phiên hiện tại; không dùng ảnh người khác thay thế.

`src/memory-game.js` quản lý xáo bài, lật thẻ, ghép cặp, lượt chơi và đặt lại ván. Trò chơi dùng số cặp từ danh sách nhân vật, hiện là 5 cặp; không chặn việc xem quà. `src/atmosphere.js` dùng một canvas cố định toàn màn hình cho cánh hoa, sao, vệt chuột và hiệu ứng khi chạm; các hạt có giới hạn số lượng và dừng khi tắt hiệu ứng hoặc ẩn tab.
