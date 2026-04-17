/**
 * FILE: frontend/src/components/CytoscapeGraph.jsx
 *
 * Component này dùng Cytoscape.js để vẽ đồ thị từ grid backend trả về.
 */

// useEffect: chạy side-effect khi dữ liệu đổi.
// useRef: giữ reference DOM container + instance cytoscape qua nhiều lần render.
import { useEffect, useRef } from "react";
import cytoscape from "cytoscape";

const CytoscapeGraph = ({ result }) => {
  // ref trỏ đến div chứa graph.
  const containerRef = useRef(null);

  // ref giữ instance Cytoscape hiện tại.
  const cyRef = useRef(null);

  /**
   * EFFECT: Vẽ đồ thị khi result thay đổi
   */
  useEffect(() => {
    // Guard: nếu chưa có dữ liệu hợp lệ thì không vẽ gì.
    if (!result || !result.grid || !Array.isArray(result.grid) || result.grid.length === 0) {
      return;
    }

    // Nếu đã có graph cũ thì hủy trước khi vẽ mới.
    if (cyRef.current) {
      cyRef.current.destroy();
    }

    // Khởi tạo Cytoscape với container + style cho node/edge.
    const cy = cytoscape({
      container: containerRef.current,
      style: [
        {
          selector: "node",
          style: {
            "background-color": "#555",
            label: "data(label)",
            color: "#fff",
            "font-size": "12px",
            width: "30px",
            height: "30px",
            "text-valign": "center",
            "text-halign": "center",
          },
        },
        {
          selector: "node.start",
          style: {
            "background-color": "#10b981", // Xanh lá
          },
        },
        {
          selector: "node.path",
          style: {
            "background-color": "#fbbf24", // Vàng
            "border-width": "2px",
            "border-color": "#f59e0b",
          },
        },
        {
          selector: "edge",
          style: {
            "line-color": "#999",
            width: "1px",
          },
        },
        {
          selector: "edge.path",
          style: {
            "line-color": "#fbbf24",
            width: "3px",
          },
        },
      ],
    });

    // Lưu instance để lần sau có thể destroy.
    cyRef.current = cy;

    // Đổ dữ liệu node/edge vào graph.
    renderGraph(cy, result);

    // Tính số đỉnh để layout ổn định.
    // Ưu tiên số backend trả về, fallback bằng cách tự đếm từ grid.
    const vertexCountFromGrid = result.grid.flat().filter((cell) => cell !== 1).length;
    const vertexCount = result?.stats?.vertexCount ?? vertexCountFromGrid;

    // Chạy layout dạng grid để graph dễ nhìn.
    const layout = cy.layout({
      name: "grid",
      rows: Math.max(1, Math.ceil(Math.sqrt(vertexCount))),
    });
    layout.run();

    // Resize graph khi cửa sổ thay đổi kích thước.
    const handleResize = () => {
      cy.resize();
    };
    window.addEventListener("resize", handleResize);

    // Cleanup khi component unmount hoặc trước lần render effect mới.
    return () => {
      window.removeEventListener("resize", handleResize);
      if (cyRef.current) {
        cyRef.current.destroy();
      }
    };
  }, [result]);

  /**
   * renderGraph(cy, resultData)
   * - Sinh node từ grid
   * - Sinh edge từ quan hệ kề 4 hướng
   * - Highlight start/path
   */
  const renderGraph = (cy, resultData) => {
    // Guard an toàn.
    if (!resultData || !resultData.grid) {
      return;
    }

    const grid = resultData.grid;
    const rows = grid.length;
    const cols = grid[0].length;

    // Map tọa độ grid -> id node Cytoscape.
    const vertexMap = {};

    // Biến tăng dần làm id hiển thị cho node.
    let vertexId = 0;

    // BƯỚC 1: Thêm nodes từ mọi ô đi được (grid != 1).
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        if (grid[i][j] !== 1) {
          // Tạo id string cho Cytoscape.
          const nodeId = `node_${vertexId}`;
          vertexMap[`${i},${j}`] = nodeId;

          cy.add({
            data: {
              id: nodeId,
              label: vertexId,
            },
          });

          vertexId++;
        }
      }
    }

    // BƯỚC 2: Thêm edges giữa các ô kề nhau 4 hướng.
    const directions = [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ];

    // Set chống thêm cạnh trùng lặp.
    const addedEdges = new Set();

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        // Bỏ qua ô vật cản.
        if (grid[i][j] === 1) continue;

        const currentNodeId = vertexMap[`${i},${j}`];

        for (let [di, dj] of directions) {
          const ni = i + di;
          const nj = j + dj;

          if (ni >= 0 && ni < rows && nj >= 0 && nj < cols) {
            if (grid[ni][nj] !== 1) {
              const neighborNodeId = vertexMap[`${ni},${nj}`];

              // Chuẩn hóa key cạnh để không thêm trùng (A-B và B-A là một).
              const edgeKey = [currentNodeId, neighborNodeId]
                .sort()
                .join("-");
              if (!addedEdges.has(edgeKey)) {
                cy.add({
                  data: {
                    id: `edge_${edgeKey}`,
                    source: currentNodeId,
                    target: neighborNodeId,
                  },
                });
                addedEdges.add(edgeKey);
              }
            }
          }
        }
      }
    }

    // BƯỚC 3: highlight node start.
    if (resultData.start) {
      const startKey = `${resultData.start[0]},${resultData.start[1]}`;
      const startNodeId = vertexMap[startKey];
      if (startNodeId) {
        cy.getElementById(startNodeId).addClass("start");
      }
    }

    // BƯỚC 4: highlight toàn bộ node/edge nằm trên path.
    if (resultData.path && resultData.path.length > 0) {
      const pathNodeIds = resultData.path.map(([row, col]) => {
        return vertexMap[`${row},${col}`];
      });

      pathNodeIds.forEach((nodeId) => {
        cy.getElementById(nodeId).addClass("path");
      });

      // Tô cạnh giữa 2 node liên tiếp trong path.
      for (let i = 0; i < pathNodeIds.length - 1; i++) {
        const src = pathNodeIds[i];
        const tgt = pathNodeIds[i + 1];
        const edgeKey = [src, tgt].sort().join("-");
        const edgeElement = cy.getElementById(`edge_${edgeKey}`);
        if (edgeElement.length > 0) {
          edgeElement.addClass("path");
        }
      }
    }
  };

  return (
    <div className="flex flex-col">
      <h2 className="text-xl font-bold text-white mb-4 px-6 pt-6">
        Biểu Đồ Đồ Thị
      </h2>
      <div
        ref={containerRef}
        style={{
          width: "100%",
          height: "500px",
          backgroundColor: "#1f2937",
          borderRadius: "8px",
          margin: "0 6px 6px 6px",
        }}
      />
      <p className="text-gray-400 text-sm px-6 pb-4">
        Xanh = Start | Vàng = Đường đi | Xám = Không khai thác
      </p>
    </div>
  );
};

export default CytoscapeGraph;
