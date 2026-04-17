/**
 * FILE: backend/app.js
 *
 * Vai trò của file này:
 * - Tạo đối tượng Express app
 * - Gắn middleware xử lý request/response
 * - Gắn routes API
 * - Export app để server.js khởi động
 */

// Nạp thư viện Express để tạo web server.
const express = require('express');

// Nạp middleware CORS để frontend khác origin (localhost:5173) gọi được backend.
const cors = require('cors');

// Nạp nhóm route xử lý bài toán solver.
const solverRoutes = require('./routes/solverRoutes');

// Khởi tạo app Express.
const app = express();

// Bật CORS cho toàn bộ endpoint.
app.use(cors());

// Cho phép Express tự parse JSON body từ request.
// Sau middleware này, dữ liệu JSON sẽ nằm ở req.body.
app.use(express.json());

// Mount route: mọi endpoint bắt đầu bằng /api sẽ đi vào solverRoutes.
// Ví dụ: /api/send-result
app.use('/api', solverRoutes);

// Middleware bắt lỗi cuối pipeline.
// Lưu ý: Express nhận diện middleware lỗi khi có 4 tham số (err, req, res, next).
app.use((err, req, res, next) => {
    console.error('Error:', err.message);

    // Trả lỗi chuẩn JSON để frontend dễ xử lý.
    res.status(500).json({
        status: 'error',
        message: err.message
    });
});

// Export app để server.js gọi app.listen(...)
module.exports = app;
