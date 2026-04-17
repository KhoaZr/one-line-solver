/**
 * FILE: backend/services/solverService.js
 *
 * Đây là tầng "service" (business logic) của ứng dụng.
 *
 * Cách hiểu nhanh:
 * - Controller chỉ nhận/trả HTTP.
 * - Service mới là nơi giải bài toán thật.
 *
 * Lợi ích của việc tách tầng này:
 * - Dễ test unit (không phụ thuộc Express)
 * - Dễ tái sử dụng thuật toán
 * - Dễ đọc luồng xử lý tổng thể
 */

const hamiltonianPath = require('../algorithms/hamiltonianPath');
const graphUtils = require('../utils/graphUtils');

/**
 * Hàm chính solvePuzzle(grid, start)
 *
 * Input:
 * - grid: ma trận 2D, trong backend quy ước 0 = đi được, 1 = vật cản
 * - start: tọa độ bắt đầu [row, col]
 *
 * Output:
 * - object chứa status, message, path và stats
 */
exports.solvePuzzle = (grid, start) => {
    try {
        // BƯỚC 1: Validate input cơ bản trước khi tính toán.
        if (!grid || !start || start.length !== 2) {
            throw new Error('Grid hoặc start không hợp lệ');
        }

        // BƯỚC 2: Chuyển grid -> đồ thị adjacency list.
        // - Mỗi ô đi được trở thành 1 đỉnh.
        // - Hai ô kề nhau (4 hướng) trở thành 1 cạnh.
        const { adjacencyList, vertexCount, vertexMap } = graphUtils.gridToAdjacencyList(grid);

        // BƯỚC 3: Đổi start [row,col] thành vertex id trong đồ thị.
        const startKey = `${start[0]},${start[1]}`;
        const startVertexId = vertexMap[startKey];

        // Nếu không tìm thấy vertex id nghĩa là start đang nằm trên vật cản.
        if (startVertexId === undefined) {
            return {
                grid,
                start,
                gridSize: `${grid.length}x${grid[0].length}`,
                obstacleCount: countObstacles(grid),
                path: null,
                status: 'invalid_start',
                message: 'Vị trí bắt đầu không hợp lệ (là vật cản)'
            };
        }

        // BƯỚC 4: Validate đồ thị để tránh thuật toán chạy trên dữ liệu sai.
        if (!graphUtils.isValidGraph(adjacencyList, vertexCount)) {
            throw new Error('Đồ thị không hợp lệ');
        }

        // BƯỚC 5: Chạy thuật toán DFS + backtracking có heuristic.
        const stats = hamiltonianPath.findHamiltonianPathWithStats(
            adjacencyList,
            startVertexId,
            vertexCount,
            true // Dùng heuristic
        );

        // BƯỚC 6: Đổi path dạng vertex id -> path dạng [row,col] cho frontend.
        const pathInGridCoords = stats.path ? stats.path.map(vertexId => {
            // Duyệt reverse map thủ công: id -> "row,col".
            for (let [key, id] of Object.entries(vertexMap)) {
                if (id === vertexId) {
                    const [row, col] = key.split(',').map(Number);
                    return [row, col];
                }
            }
        }) : null;

        // BƯỚC 7: Lấy thêm thông tin phụ để hiển thị stats.
        const graphInfo = graphUtils.getGraphInfo(adjacencyList, vertexCount);

        // BƯỚC 8: Gói response object trả về controller/frontend.
        return {
            grid,
            start,
            gridSize: `${grid.length}x${grid[0].length}`,
            obstacleCount: countObstacles(grid),
            path: pathInGridCoords,  // Đường đi (nếu tìm được)
            status: stats.found ? 'solved' : 'no_solution',
            message: stats.found ? 'Tìm được đường đi Hamilton!' : 'Không có đường đi Hamilton',
            // Thông tin chi tiết cho debug/phân tích
            stats: {
                vertexCount,          // Số ô trống (đỉnh)
                numEdges: graphInfo.numEdges,
                avgDegree: graphInfo.avgDegree,
                dfsCallCount: stats.callCount,   // Số lần DFS gọi
                executionTime: `${stats.executionTime}ms`,
                heuristicUsed: stats.heuristicUsed
            }
        };
    } catch (error) {
        // Ném lỗi có ngữ cảnh để controller trả lỗi rõ nghĩa hơn.
        throw new Error(`Lỗi khi giải quyết bài toán: ${error.message}`);
    }
};

/**
 * Hàm phụ countObstacles(grid)
 *
 * Vì backend quy ước 1 = vật cản, nên ta đếm số ô có giá trị 1.
 */
const countObstacles = (grid) => {
    // Khởi tạo bộ đếm.
    let count = 0;
    
    // Duyệt từng hàng.
    for (let row of grid) {
        // Duyệt từng ô trong hàng.
        for (let cell of row) {
            // Nếu là vật cản thì tăng bộ đếm.
            if (cell === 1) {
                count++;
            }
        }
    }
    
    // Trả tổng số vật cản.
    return count;
};
