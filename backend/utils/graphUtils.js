/**
 * FILE: backend/utils/graphUtils.js
 *
 * Nơi tập trung các hàm tiện ích chuyển đổi và kiểm tra đồ thị.
 */

/**
 * gridToAdjacencyList(grid)
 *
 * Mục tiêu:
 * - Biến ma trận 2D thành đồ thị adjacency list để thuật toán DFS xử lý dễ hơn.
 *
 * Quy ước backend:
 * - 0 = ô đi được
 * - 1 = vật cản
 */
exports.gridToAdjacencyList = (grid) => {
    // Số hàng của lưới.
    const rows = grid.length;

    // Số cột của lưới.
    const cols = grid[0].length;
    
    // adjacencyList lưu danh sách kề theo vertex id.
    const adjacencyList = {};

    // vertexMap ánh xạ từ "row,col" -> vertex id.
    const vertexMap = {};

    // Đếm tổng số đỉnh đi được.
    let vertexCount = 0;

    // BƯỚC 1: Gán ID cho mọi ô đi được.
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            // Chỉ ô có giá trị 0 mới là ô đi được.
            if (grid[row][col] === 0) {
                vertexMap[`${row},${col}`] = vertexCount;
                adjacencyList[vertexCount] = [];
                vertexCount++;
            }
        }
    }

    // BƯỚC 2: Tạo cạnh theo 4 hướng cơ bản (không đi chéo).
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            // Chỉ xử lý cạnh từ ô đi được.
            if (grid[row][col] === 0) {
                const currentId = vertexMap[`${row},${col}`];

                // Duyệt 4 hướng quanh ô hiện tại.
                for (let [dr, dc] of directions) {
                    const newRow = row + dr;
                    const newCol = col + dc;

                    // Kiểm tra neighbor còn nằm trong lưới.
                    if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
                        // Chỉ nối cạnh nếu neighbor cũng đi được.
                        if (grid[newRow][newCol] === 0) {
                            const neighborId = vertexMap[`${newRow},${newCol}`];
                            // Tránh thêm trùng cạnh.
                            if (!adjacencyList[currentId].includes(neighborId)) {
                                adjacencyList[currentId].push(neighborId);
                            }
                        }
                    }
                }
            }
        }
    }

    // Trả về toàn bộ dữ liệu cần thiết cho tầng service.
    return {
        adjacencyList,
        vertexCount,
        vertexMap
    };
};

/**
 * countUnvisitedNeighbors(neighbors, visited)
 *
 * Đếm số hàng xóm chưa thăm của một đỉnh.
 * Hàm này phục vụ heuristic trong DFS.
 */
exports.countUnvisitedNeighbors = (neighbors, visited) => {
    if (!neighbors) return 0;
    return neighbors.filter(n => !visited[n]).length;
};

/**
 * isValidGraph(adjacencyList, vertexCount)
 *
 * Validate nhanh cấu trúc đồ thị trước khi chạy thuật toán:
 * - Đủ số đỉnh
 * - Mỗi đỉnh có danh sách kề dạng mảng
 * - Không có self-loop
 * - Mỗi cạnh là hai chiều (u có v thì v phải có u)
 */
exports.isValidGraph = (adjacencyList, vertexCount) => {
    // Duyệt tuần tự theo id đỉnh.
    for (let i = 0; i < vertexCount; i++) {
        // Thiếu khóa đỉnh -> đồ thị lỗi.
        if (adjacencyList[i] === undefined) {
            return false;
        }

        // Danh sách kề phải là mảng.
        if (!Array.isArray(adjacencyList[i])) {
            return false;
        }

        // Duyệt từng neighbor để kiểm tra tính hợp lệ cạnh.
        for (const neighbor of adjacencyList[i]) {
            // Self-loop không hợp lệ trong ngữ cảnh bài toán này.
            if (neighbor === i) {
                return false;
            }

            // Neighbor phải nằm trong miền id đỉnh hợp lệ.
            if (neighbor < 0 || neighbor >= vertexCount) {
                return false;
            }

            // Danh sách kề của neighbor cũng phải là mảng.
            if (!Array.isArray(adjacencyList[neighbor])) {
                return false;
            }

            // Kiểm tra cạnh đối xứng (đồ thị vô hướng).
            if (!adjacencyList[neighbor].includes(i)) {
                return false;
            }
        }
    }
    return true;
};

/**
 * getGraphInfo(adjacencyList, vertexCount)
 *
 * Trả về số cạnh và bậc trung bình để hiển thị thống kê.
 */
exports.getGraphInfo = (adjacencyList, vertexCount) => {
    // Tổng bậc của toàn bộ đỉnh.
    let totalDegree = 0;

    // Tổng số cạnh đếm theo adjacency list.
    let numEdges = 0;

    // Duyệt mỗi đỉnh để cộng degree.
    for (let vertexId in adjacencyList) {
        const degree = adjacencyList[vertexId].length;
        totalDegree += degree;
        numEdges += degree;
    }

    // Với đồ thị vô hướng, mỗi cạnh bị đếm 2 lần (u->v và v->u).
    numEdges = numEdges / 2;

    // Tính bậc trung bình, làm tròn 2 chữ số.
    const avgDegree = vertexCount > 0 ? (totalDegree / vertexCount).toFixed(2) : 0;

    // Trả object thống kê.
    return {
        numEdges,
        avgDegree
    };
};
