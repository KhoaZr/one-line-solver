/**
 * FILE: frontend/src/App.jsx
 *
 * Đây là component "gốc" của frontend.
 *
 * Nhiệm vụ chính:
 * - Quản lý state dùng chung giữa các component con
 * - Ghép giao diện Input / Output / Graph
 * - Truyền dữ liệu qua props
 */

import { useState } from "react";
import Input from "./components/input";
import PathVisualization from "./components/PathVisualization";
import CytoscapeGraph from "./components/CytoscapeGraph";

const App = () => {
  // result: dữ liệu kết quả mà backend trả về sau khi bấm nút Gửi.
  const [result, setResult] = useState(null);

  // start: tọa độ điểm bắt đầu hiện tại mà người dùng đã chọn.
  const [start, setStart] = useState(null);

  // grid: lưới hiện tại trên UI (dùng để vẽ và hiển thị output).
  const [grid, setGrid] = useState(null);

  // Callback nhận kết quả từ component Input sau khi gọi API thành công.
  const handleSolve = (backendResult) => {
    setResult(backendResult);
  };

  // Callback nhận cập nhật grid/start từ component Input.
  const handleGridUpdate = (newGrid, newStart) => {
    setGrid(newGrid);
    setStart(newStart);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      {/* Header tiêu đề ứng dụng */}
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold mb-2">One Line Solver</h1>
        <p className="text-gray-400">Tìm đường đi Hamilton trên lưới</p>
      </div>

      {/* Khối chính: desktop là 2 cột, mobile tự xuống 1 cột */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Cột trái: khu vực nhập lưới và gửi request */}
        <div className="bg-gray-800 rounded-lg p-4 shadow-lg">
          <Input onSolve={handleSolve} onGridUpdate={handleGridUpdate} />
        </div>

        {/* Cột phải: hiển thị đường đi theo kết quả mới nhất */}
        <div className="bg-gray-800 rounded-lg p-4 shadow-lg">
          <PathVisualization
            grid={grid}
            start={start}
            result={result}
          />
        </div>
      </div>

      {/* Chỉ render đồ thị khi đã có kết quả trả về */}
      {result && (
        <div className="bg-gray-800 rounded-lg shadow-lg">
          <CytoscapeGraph result={result} />
        </div>
      )}
    </div>
  );
};

export default App;