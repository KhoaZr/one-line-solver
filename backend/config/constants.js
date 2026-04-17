/**
 * ============================================
 * FILE: config/constants.js
 * ============================================
 * ĐÂY LÀ NƠI CHỨA CÁC HẰNG SỐ (CONSTANTS)
 * 
 * Công dụng:
 * - Lưu các giá trị không đổi của ứng dụng
 * - Dễ quản lý: chỉ cần sửa ở một chỗ
 * - Nếu không có file này:
 *   → Những số "magic" (5000, 10, v.v...)
 *   → Sẽ nằm rải rác khắp code
 *   → Khó thay đổi và bảo trì
 * 
 * Cách dùng:
 * const { GRID_SIZE, PORT } = require('./config/constants');
 * ============================================
 */

/**
 * GRID_SIZE: Kích thước của grid
 * - Hiện tại là 10x10
 * - Nếu muốn thay đổi thành 20x20, chỉ cần sửa ở đây
 */
const GRID_SIZE = 10;

/**
 * PORT: Cổng server chạy trên
 * - 5000: Cổng mặc định
 * - Có thể thay đổi thành port khác nếu port này đã được dùng
 */
const PORT = 5000;

/**
 * CELL_VALUES: Các giá trị có thể có trong grid
 * - null: Ô trống (chưa chọn)
 * - 1: Vật cản (bức tường)
 * - 2: Đường đi (path)
 * - 3: Vị trí bắt đầu (start)
 * - 4: Vị trí kết thúc (end)
 */
const CELL_VALUES = {
    EMPTY: null,      // Ô trống
    OBSTACLE: 1,      // Vật cản
    PATH: 2,          // Đường đi
    START: 3,         // Điểm bắt đầu
    END: 4            // Điểm kết thúc
};

/**
 * API_ENDPOINTS: Các đường dẫn API chính
 * - SOLVE: endpoint để gửi grid và bắt đầu giải
 * - ROOT: endpoint gốc (homepage)
 */
const API_ENDPOINTS = {
    SOLVE: '/api/send-result',
    ROOT: '/'
};

// Export tất cả constants
module.exports = {
    GRID_SIZE,
    PORT,
    CELL_VALUES,
    API_ENDPOINTS
};
