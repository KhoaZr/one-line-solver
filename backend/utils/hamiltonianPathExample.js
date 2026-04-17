/**
 * ============================================
 * FILE: utils/hamiltonianPathExample.js
 * ============================================
 *
 * Ví dụ sử dụng thuật toán Hamiltonian Path.
 * Chạy file này để test nhanh thuật toán mà không cần qua HTTP API.
 * ============================================
 */

const hamiltonianPath = require('../algorithms/hamiltonianPath');
const graphUtils = require('./graphUtils');

const vertexPathToGridPath = (path, vertexMap) => {
    if (!path) {
        return null;
    }

    const reverseMap = {};
    for (const [key, id] of Object.entries(vertexMap)) {
        reverseMap[id] = key;
    }

    return path.map((vertexId) => {
        const [row, col] = reverseMap[vertexId].split(',').map(Number);
        return [row, col];
    });
};

const example1_DirectAdjacencyList = () => {
    console.log('\n=== VÍ DỤ 1: Hamiltonian Path từ Adjacency List ===');

    const graph = {
        0: [1, 3],
        1: [0, 2],
        2: [1, 3],
        3: [0, 2]
    };

    const path = hamiltonianPath.findHamiltonianPath(graph, 0, 4, true);

    console.log('Đồ thị:', graph);
    console.log('Path từ đỉnh 0:', path);
};

const example2_GridToHamiltonianPath = () => {
    console.log('\n=== VÍ DỤ 2: Chuyển Grid sang Hamiltonian Path ===');

    // 0 = ô trống, 1 = vật cản
    const grid = [
        [0, 0, 0],
        [0, 1, 0],
        [0, 0, 0]
    ];

    const { adjacencyList, vertexCount, vertexMap } = graphUtils.gridToAdjacencyList(grid);
    const stats = hamiltonianPath.findHamiltonianPathWithStats(adjacencyList, 0, vertexCount, true);

    console.log('Grid:', grid);
    console.log('Số đỉnh:', vertexCount);
    console.log('Adjacency List:', adjacencyList);
    console.log('Found:', stats.found);
    console.log('Path (vertex IDs):', stats.path);
    console.log('Path (grid coords):', vertexPathToGridPath(stats.path, vertexMap));
    console.log('DFS Calls:', stats.callCount);
    console.log('Execution Time:', `${stats.executionTime}ms`);
};

const example3_HeuristicComparison = () => {
    console.log('\n=== VÍ DỤ 3: So sánh Heuristic vs Non-Heuristic ===');

    const grid = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];

    const { adjacencyList, vertexCount } = graphUtils.gridToAdjacencyList(grid);

    const withHeuristic = hamiltonianPath.findHamiltonianPathWithStats(adjacencyList, 0, vertexCount, true);
    const withoutHeuristic = hamiltonianPath.findHamiltonianPathWithStats(adjacencyList, 0, vertexCount, false);

    console.log('With heuristic:', {
        found: withHeuristic.found,
        callCount: withHeuristic.callCount,
        executionTime: `${withHeuristic.executionTime}ms`
    });

    console.log('Without heuristic:', {
        found: withoutHeuristic.found,
        callCount: withoutHeuristic.callCount,
        executionTime: `${withoutHeuristic.executionTime}ms`
    });

    const diff = withoutHeuristic.callCount - withHeuristic.callCount;
    console.log('Giảm số lần gọi DFS:', diff);
};

const example4_ComplexGrid = () => {
    console.log('\n=== VÍ DỤ 4: Grid có vật cản ===');

    const grid = [
        [0, 1, 0],
        [0, 1, 0],
        [0, 0, 0]
    ];

    const { adjacencyList, vertexCount, vertexMap } = graphUtils.gridToAdjacencyList(grid);
    const stats = hamiltonianPath.findHamiltonianPathWithStats(adjacencyList, 0, vertexCount, true);

    console.log('Grid:', grid);
    console.log('Found:', stats.found);
    console.log('Path (grid coords):', vertexPathToGridPath(stats.path, vertexMap));
};

const example5_ValidateGraph = () => {
    console.log('\n=== VÍ DỤ 5: Kiểm tra tính hợp lệ đồ thị ===');

    const validGraph = {
        0: [1, 2],
        1: [0, 2],
        2: [0, 1]
    };

    const invalidGraph = {
        0: [0, 1],
        1: [0]
    };

    console.log('Valid graph =>', graphUtils.isValidGraph(validGraph, 3));
    console.log('Invalid graph =>', graphUtils.isValidGraph(invalidGraph, 2));
};

if (require.main === module) {
    console.log('=============================================');
    console.log(' HAMILTONIAN PATH - EXAMPLES ');
    console.log('=============================================');

    example1_DirectAdjacencyList();
    example2_GridToHamiltonianPath();
    example3_HeuristicComparison();
    example4_ComplexGrid();
    example5_ValidateGraph();

    console.log('\nDone.');
}

module.exports = {
    example1_DirectAdjacencyList,
    example2_GridToHamiltonianPath,
    example3_HeuristicComparison,
    example4_ComplexGrid,
    example5_ValidateGraph
};
