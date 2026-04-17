/**
 * FILE: backend/server.js
 *
 * Đây là file "điểm vào" (entry point) của backend Node.js.
 *
 * Cách hiểu đơn giản cho người mới:
 * 1) app.js giống như "bản thiết kế" của ứng dụng Express
 * 2) server.js là nơi "bật công tắc điện" để ứng dụng chạy thật
 */

// Import đối tượng app đã cấu hình sẵn middleware + routes từ app.js.
const app = require('./app');

// Đọc cổng từ biến môi trường PORT (nếu có), nếu không có thì dùng mặc định 5001.
// Number(...) giúp ép kiểu string -> number để tránh lỗi kiểu dữ liệu.
const PORT = Number(process.env.PORT) || 5001;

// app.listen(PORT) trả về một HTTP server instance của Node.js.
// Ta lưu vào biến `server` để có thể lắng nghe event và đóng server graceful sau này.
const server = app.listen(PORT);

// Event `listening`: được bắn khi server đã bind port thành công.
server.on('listening', () => {
    console.log(`Server đang chạy tại http://localhost:${PORT}`);
});

// Event `error`: bắt lỗi mức server (ví dụ cổng đã bị chiếm EADDRINUSE).
server.on('error', (error) => {
    console.error('[server:error]', error.message);

    // Gán exit code để hệ điều hành biết process kết thúc có lỗi.
    // Không gọi process.exit ngay để vẫn cho Node xử lý cleanup hiện tại.
    process.exitCode = 1;
});

// Event `close`: bắn khi server đã đóng socket thành công.
server.on('close', () => {
    console.log('[server:close] HTTP server đã đóng');
});

// SIGINT thường đến từ Ctrl + C trong terminal.
// Ta đóng server có kiểm soát thay vì tắt gấp process.
process.on('SIGINT', () => {
    console.log('[process] Nhận SIGINT');
    server.close(() => process.exit(0));
});

// SIGTERM thường đến từ hệ thống/docker/process manager khi muốn dừng app.
process.on('SIGTERM', () => {
    console.log('[process] Nhận SIGTERM');
    server.close(() => process.exit(0));
});

// beforeExit: Node sắp kết thúc event-loop (không còn việc gì để chạy).
process.on('beforeExit', (code) => {
    console.log(`[process] beforeExit: ${code}`);
});

// exit: thời điểm process thực sự thoát.
process.on('exit', (code) => {
    console.log(`[process] exit: ${code}`);
});

// uncaughtException: lỗi đồng bộ không được try/catch bắt.
process.on('uncaughtException', (error) => {
    console.error('[process] uncaughtException:', error);
});

// unhandledRejection: Promise reject nhưng không có .catch().
process.on('unhandledRejection', (reason) => {
    console.error('[process] unhandledRejection:', reason);
});
