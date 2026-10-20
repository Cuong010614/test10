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

Trình phát MP3 trong `src/music-player.js` dùng hai bản nhạc người gửi đã cung cấp: `public/Thích Em Hơi Nhiều.mp3` (Wren Evans) và `public/Tại Vì Sao.mp3` (MCK). Thả tim bắt đầu bài Wren Evans; chọn nghệ sĩ trong ô nhạc để đổi bài và phát ngay. Nút trên đầu trang đồng bộ với điều khiển phát/tạm dừng, tua và âm lượng của trình phát. Nếu trình duyệt chặn phát, người nhận có thể bấm Play. Nhạc phát trong trang, không dùng Spotify hay nhạc tổng hợp. Đường dẫn tôn trọng base `/test10/` của GitHub Pages.

Ảnh được thêm trong giao diện chỉ tồn tại trong phiên mở trang, không tải lên máy chủ. Ảnh gốc đã được lưu trong `public/` và gắn trong `src/media.js`; khi đổi ảnh, cập nhật đường dẫn tại đây rồi chạy `npm run build:pages`. Font Playfair Display và Be Vietnam Pro được đóng gói cùng website, không cần kết nối Google Fonts.

## Kiểm tra thủ công

Kiểm tra màn hình 1440px, 390px và 320px: trang bìa che nội dung quà, chuyển thẳng sau một lần thả tim, mở/đóng thư bằng nút và Escape, trò lật thẻ (trúng/sai/chơi lại), chọn nhân vật, bật/tắt nhạc MP3, tua bài và đồng bộ điều khiển, thêm ảnh, hoa bung, mở hộp và sao chép chỉ dẫn. Thử lại với `prefers-reduced-motion: reduce`. Không có backend hoặc thông báo tự động gửi cho người nhận.

## Bản trải nghiệm 3D

- Hoa ly dựng bằng hình học 3D: cánh hoa cong, nhụy, lá, cành, giấy gói và nơ. Mô-đun Three.js chỉ tải sau khi thả tim. Nếu WebGL không hoạt động hoặc mất context, bó hoa SVG vẫn hiện.
- Bó hoa theo chuyển động chuột, có nút xoay và trở về góc ban đầu; tự dừng khi nằm ngoài màn hình hoặc tab bị ẩn. Giới hạn render 30 fps, mật độ pixel tối đa 1.35 trên mobile và 1.7 trên desktop.
- Hạt sáng, dấu chuột, nghiêng khung ảnh, xuất hiện theo cuộn, đĩa nhạc quay, vòng sáng cuối và chuyển cảnh không lời.
- Nút “Hiệu ứng” tắt các chuyển động. Tôn trọng `prefers-reduced-motion`; toàn bộ thư, ảnh, nhạc và chỉ dẫn vẫn sử dụng được khi tắt hiệu ứng.
- `src/bouquet-3d.js`: cảnh Three.js. `src/experience.js`: quản lý chuyển động, vùng nhìn và tương tác. `src/cinematic.css`: thiết kế mới. `src/fonts.js`: font nội bộ.

Tham khảo kỹ thuật (không sao chép thiết kế): [Three.js Responsive Design](https://github.com/mrdoob/three.js/blob/r180/manual/en/responsive.html), [MDN Intersection Observer](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API).

## Ảnh và hiệu ứng toàn trang

`src/media.js` khai báo ảnh Cô Hai, ba ảnh Mỹ Tú và năm ảnh nhân vật do người gửi chọn, theo đường dẫn tương đối trong `public/`. `src/character-art.js` dùng chung ảnh nhân vật cho trò ghép thẻ và phần hội bạn. Ảnh kỷ niệm hiển thị trọn khung bằng `object-fit: contain`; mỗi ảnh chỉ giữ nhãn OUR LITTLE MOMENT. Các ảnh nhân vật tách nền nằm trong `public/characters/`, bản gốc vẫn được giữ lại trong `public/`.

`src/memory-game.js` quản lý xáo bài, lật thẻ, ghép cặp, lượt chơi và đặt lại ván. Trò chơi dùng số cặp từ danh sách nhân vật, hiện là 5 cặp; không chặn việc xem quà. `src/atmosphere.js` dùng một canvas cố định toàn màn hình cho cánh hoa, sao, vệt chuột và hiệu ứng khi chạm; các hạt có giới hạn số lượng và dừng khi tắt hiệu ứng hoặc ẩn tab.
