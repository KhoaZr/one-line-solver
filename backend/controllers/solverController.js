// Nạp service chứa business logic giải bài toán.
// Controller chỉ nên điều phối request/response, không nên chứa thuật toán nặng.
const solverService = require('../services/solverService');

/**
 * Controller: solvePuzzle
 *
 * Luồng chạy cho người mới:
 * 1) Nhận request từ frontend
 * 2) Kiểm tra dữ liệu đầu vào hợp lệ
 * 3) Gọi service để xử lý chính
 * 4) Trả JSON response cho client
 */
exports.solvePuzzle = (req, res) => {
    try {
        // Tách dữ liệu frontend gửi lên từ request body.
        const { grid, start } = req.body;

        // Validate `grid`: phải tồn tại và phải là mảng.
        if (!grid || !Array.isArray(grid)) {
            return res.status(400).json({
                status: 'error',
                message: 'Grid không hợp lệ hoặc không tồn tại'
            });
        }

        // Validate `start`: phải là mảng có đúng 2 phần tử [row, col].
        if (!start || !Array.isArray(start) || start.length !== 2) {
            return res.status(400).json({
                status: 'error',
                message: 'Start position không hợp lệ [row, col]'
            });
        }

        // Gọi service để giải bài toán Hamilton.
        const result = solverService.solvePuzzle(grid, start);

        // Trả response thành công theo cấu trúc ổn định cho frontend.
        return res.status(200).json({
            status: 'success',
            data: result
        });
    } catch (error) {
        // Nếu có lỗi không mong muốn, trả về 500.
        return res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};
