/**
 * FILE: backend/algorithms/hamiltonianPath.js
 *
 * Thuật toán chính: DFS + Backtracking + Degree Heuristic
 *
 * Mục tiêu:
 * - Tìm một đường đi ghé qua mọi đỉnh đúng 1 lần (Hamiltonian Path)
 */

const graphUtils = require('../utils/graphUtils');

/**
 * findHamiltonianPath(...)
 *
 * Đây là API đơn giản: trả về path hoặc null.
 */
exports.findHamiltonianPath = (
    adjacencyList,
    startVertex,
    numVertices,
    useHeuristic = true
) => {
    // Validate input để chặn dữ liệu sai ngay từ đầu.
    if (!adjacencyList || numVertices <= 0 || startVertex < 0 || startVertex >= numVertices) {
        throw new Error('Input không hợp lệ');
    }

    // visited[i] = true nghĩa là đỉnh i đã đi qua.
    const visited = new Array(numVertices).fill(false);

    // Khởi tạo đường đi với đỉnh xuất phát.
    const path = [startVertex];

    // Đánh dấu start đã thăm.
    visited[startVertex] = true;

    // Gọi DFS quay lui để thử các nhánh.
    if (dfs(adjacencyList, startVertex, visited, path, numVertices, useHeuristic)) {
        return path;
    }

    // Nếu duyệt hết nhánh mà không thành công.
    return null;
};

/**
 * Hàm DFS đệ quy để tìm path.
 */
const dfs = (adjacencyList, currentVertex, visited, path, numVertices, useHeuristic) => {
    // Base case: nếu chiều dài path bằng tổng số đỉnh thì đã thành công.
    if (path.length === numVertices) {
        return true;
    }

    // Lấy danh sách neighbor hiện tại, fallback [] nếu undefined.
    let neighbors = adjacencyList[currentVertex] || [];

    // Heuristic: ưu tiên neighbor có ít lựa chọn tiếp theo nhất.
    if (useHeuristic) {
        neighbors = neighbors.sort((a, b) => {
            const degreeA = graphUtils.countUnvisitedNeighbors(adjacencyList[a], visited);
            const degreeB = graphUtils.countUnvisitedNeighbors(adjacencyList[b], visited);
            return degreeA - degreeB;
        });
    }

    // Duyệt thử từng neighbor theo thứ tự đã sắp xếp.
    for (let neighbor of neighbors) {
        // Chỉ đi vào đỉnh chưa thăm.
        if (!visited[neighbor]) {
            // Bước tiến: đánh dấu và thêm vào path.
            visited[neighbor] = true;
            path.push(neighbor);

            // Gọi đệ quy từ đỉnh vừa đi tới.
            if (dfs(adjacencyList, neighbor, visited, path, numVertices, useHeuristic)) {
                return true;
            }

            // Nếu nhánh thất bại thì quay lui (undo state).
            path.pop();
            visited[neighbor] = false;
        }
    }

    return false;
};

/**
 * findHamiltonianPathWithStats(...)
 *
 * Phiên bản có thống kê để debug/benchmark.
 */
exports.findHamiltonianPathWithStats = (
    adjacencyList,
    startVertex,
    numVertices,
    useHeuristic = true
) => {
    // Mốc thời gian bắt đầu.
    const startTime = Date.now();

    // Đếm số lần DFS được gọi.
    let callCount = 0;

    // Khởi tạo trạng thái thăm đỉnh.
    const visited = new Array(numVertices).fill(false);

    // Path bắt đầu từ startVertex.
    const path = [startVertex];

    // Đánh dấu start đã thăm.
    visited[startVertex] = true;

    // DFS có thêm đếm callCount.
    const dfsWithCounter = (currentVertex) => {
        // Mỗi lần vào hàm, tăng bộ đếm.
        callCount++;

        // Base case thành công.
        if (path.length === numVertices) {
            return true;
        }

        // Lấy neighbor của currentVertex.
        let neighbors = adjacencyList[currentVertex] || [];

        // Nếu bật heuristic thì sắp xếp như hàm DFS thường.
        if (useHeuristic) {
            neighbors = neighbors.sort((a, b) => {
                const degreeA = graphUtils.countUnvisitedNeighbors(adjacencyList[a], visited);
                const degreeB = graphUtils.countUnvisitedNeighbors(adjacencyList[b], visited);
                return degreeA - degreeB;
            });
        }

        // Duyệt thử từng nhánh.
        for (let neighbor of neighbors) {
            if (!visited[neighbor]) {
                // Bước tiến.
                visited[neighbor] = true;
                path.push(neighbor);

                // Nếu nhánh con thành công thì kết thúc sớm.
                if (dfsWithCounter(neighbor)) {
                    return true;
                }

                // Quay lui nếu nhánh con thất bại.
                path.pop();
                visited[neighbor] = false;
            }
        }

        return false;
    };

    // Chạy DFS bắt đầu từ đỉnh start.
    const found = dfsWithCounter(startVertex);

    // Mốc thời gian kết thúc.
    const endTime = Date.now();

    // Trả đầy đủ dữ liệu cho service/controller/frontend.
    return {
        path: found ? path : null,
        found,
        callCount,
        executionTime: endTime - startTime,
        heuristicUsed: useHeuristic
    };
};
