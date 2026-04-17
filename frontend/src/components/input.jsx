/**
 * ============================================
 * FILE: components/Input.jsx (cập nhật từ input.jsx)
 * ============================================
 * 
 * CÔNG DỤNG:
 * - Hiển thị grid để người dùng đánh dấu ô đi được
 * - Chế độ "set start": Click để chọn điểm bắt đầu
 * - Chế độ "set obstacle": Click để bật/tắt ô đi được
 * - Nút "Start" cố định để bất tắt chế độ set start
 * - Nút "Gửi" để gửi dữ liệu lên backend
 * ============================================
 */

// useState là hook để lưu state trong function component.
import { useState } from "react";

// Kích thước cố định lưới hiển thị.
const GRID_SIZE = 10;

/**
 * Tạo grid ban đầu.
 *
 * Quy ước ở UI hiện tại:
 * - 1    => ô đi được (màu cam)
 * - null => vật cản (màu xám)
 */
const createEmptyGrid = () => {
  // Tạo mảng ngoài (danh sách hàng).
  const newGrid = [];

  // Lặp theo từng hàng.
  for (let i = 0; i < GRID_SIZE; i++) {
    // Tạo một hàng mới.
    const row = [];

    // Lặp theo từng cột.
    for (let j = 0; j < GRID_SIZE; j++) {
      // Mặc định để null (xám).
      row.push(null);
    }

    // Đưa hàng vào grid.
    newGrid.push(row);
  }

  // Trả về grid hoàn chỉnh.
  return newGrid;
};

/**
 * COMPONENT: Grid
 * Hiển thị lưới và xử lý click
 *
 * Props:
 * - grid: dữ liệu lưới
 * - setGrid: hàm cập nhật grid
 * - start: vị trí start
 * - setStart: hàm cập nhật start
 * - mode: 'setStart' hoặc 'setObstacle'
 * - setMode: hàm cập nhật mode
 */
const Grid = ({ grid, setGrid, start, setStart, mode, setMode }) => {
  /**
   * HÀM: handleClick
   * Xử lý click trên ô grid
   */
  const handleClick = (rowIndex, colIndex) => {
    // Clone nông 2 chiều để không mutate state cũ trực tiếp.
    const newGrid = grid.map((row) => [...row]);

    if (mode === "setStart") {
      // Chế độ chọn start: click đâu thì đặt start ở đó.
      // Đồng thời ép ô start thành ô đi được để tránh trạng thái mâu thuẫn.
      newGrid[rowIndex][colIndex] = 1;

      // Cập nhật grid trước.
      setGrid(newGrid);

      // Lưu tọa độ start.
      setStart([rowIndex, colIndex]);

      // Tự chuyển về mode chỉnh sửa ô sau khi chọn xong start.
      setMode("setObstacle");
    } else {
      // Chế độ chỉnh sửa: click để đổi qua lại giữa cam <-> xám.
      newGrid[rowIndex][colIndex] =
        newGrid[rowIndex][colIndex] === null ? 1 : null;
      setGrid(newGrid);
    }
  };

  /**
   * HÀM: getColorClass
   * Xác định màu của mỗi ô dựa trên trạng thái
   */
  const getColorClass = (rowIdx, colIdx) => {
    // Ưu tiên vẽ start trước để nổi bật vị trí bắt đầu.
    if (start && start[0] === rowIdx && start[1] === colIdx) {
      return "bg-green-500 ring-2 ring-white";
    }

    // Ô đi được: cam.
    if (grid[rowIdx][colIdx] === 1) {
      return "bg-orange-500";
    }

    // Vật cản: xám, có hover để người dùng nhận biết ô có thể click.
    return "bg-gray-700 hover:bg-gray-600";
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Hướng dẫn */}
      <div className="text-sm text-gray-400 text-center">
        {mode === "setStart" ? (
          <p>Click để chọn vị trí bắt đầu</p>
        ) : (
          <p>Click để bật/tắt ô đi được</p>
        )}
      </div>

      {/* Khối lưới có CSS grid 10 cột */}
      <div
        className="grid gap-1 p-4 bg-gray-900 rounded-lg border-2 border-gray-700"
        style={{
          gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
        }}
      >
        {grid.map((row, i) =>
          row.map((cell, j) => (
            <div
              // key giúp React tối ưu render danh sách.
              key={`${i}-${j}`}
              onClick={() => handleClick(i, j)}
              className={`w-10 h-10 rounded cursor-pointer transition-all duration-200 ${getColorClass(
                i,
                j
              )}`}
              title={`[${i}, ${j}]`}
            />
          ))
        )}
      </div>

      {/* Thông tin */}
      {start && (
        <p className="text-sm text-green-400">
          Start: [{start[0]}, {start[1]}]
        </p>
      )}
    </div>
  );
};

/**
 * COMPONENT: Controls
 * Các nút điều khiển: Start, Gửi, Reset
 */
const Controls = ({
  start,
  mode,
  onModeChange,
  onSolve,
  onReset,
  isLoading,
}) => {
  /**
   * HÀM: handleStartClick
   * Toggle chế độ "set start"
   */
  const handleStartClick = () => {
    const newMode = mode === "setStart" ? "setObstacle" : "setStart";
    onModeChange(newMode);
  };

  /**
   * HÀM: handleSendClick
   * Gửi dữ liệu lên backend
   */
  const handleSendClick = async () => {
    // Kiểm tra input
    if (!start) {
      alert("Hãy chọn vị trí bắt đầu trước!");
      return;
    }

    onSolve();
  };

  return (
    <div className="flex flex-col gap-3 mt-6">
      {/* Nút Start cố định */}
      <button
        onClick={handleStartClick}
        className={`px-4 py-2 rounded font-semibold transition-all ${
          mode === "setStart"
            ? "bg-green-500 hover:bg-green-600 text-white ring-2 ring-green-400"
            : "bg-gray-600 hover:bg-gray-700 text-white"
        }`}
      >
        {mode === "setStart" ? "Chọn Start (Bật)" : "Chọn Start (Tắt)"}
      </button>

      {/* Nút Gửi */}
      <button
        onClick={handleSendClick}
        disabled={isLoading || !start}
        className={`px-4 py-2 rounded font-semibold transition-all ${
          isLoading || !start
            ? "bg-gray-500 text-gray-300 cursor-not-allowed"
            : "bg-blue-500 hover:bg-blue-600 text-white"
        }`}
      >
        {isLoading ? "Đang xử lý..." : "Gửi & Giải Quyết"}
      </button>

      {/* Nút Reset */}
      <button
        onClick={onReset}
        disabled={isLoading}
        className="px-4 py-2 rounded font-semibold bg-red-500 hover:bg-red-600 text-white transition-all disabled:bg-gray-500"
      >
        Reset
      </button>
    </div>
  );
};

/**
 * Component cha: quản lý state chung và gọi API backend.
 */
const Input = ({ onSolve, onGridUpdate }) => {
  // grid đang hiển thị ở UI.
  const [grid, setGrid] = useState(createEmptyGrid());

  // start hiện tại [row,col].
  const [start, setStart] = useState(null);

  // mode hiện tại của thao tác click.
  const [mode, setMode] = useState("setStart");

  // cờ loading để disable nút khi đang gọi API.
  const [isLoading, setIsLoading] = useState(false);

  /**
   * HÀM: handleGridChange
   */
  const handleGridChange = (newGrid) => {
    setGrid(newGrid);
    if (onGridUpdate) {
      onGridUpdate(newGrid, start);
    }
  };

  /**
   * HÀM: handleStartChange
   */
  const handleStartChange = (newStart) => {
    setStart(newStart);
    if (onGridUpdate) {
      onGridUpdate(grid, newStart);
    }
  };

  /**
   * HÀM: handleModeChange
   */
  const handleModeChange = (newMode) => {
    setMode(newMode);
  };

  /**
   * HÀM: handleSendClick
   */
  const handleSendClick = async () => {
    if (!start) {
      alert("Hãy chọn vị trí bắt đầu trước!");
      return;
    }

    // QUAN TRỌNG: Chuyển đổi quy ước UI -> quy ước backend.
    // UI:      1 = đi được, null = vật cản
    // Backend: 0 = đi được, 1 = vật cản
    const backendGrid = grid.map((row) =>
      row.map((cell) => (cell === 1 ? 0 : 1))
    );

    // Chặn trường hợp start nằm trên ô xám do người dùng vừa toggle.
    if (grid[start[0]][start[1]] !== 1) {
      alert("Start phải nằm trên ô màu cam (ô đi được)");
      return;
    }

    setIsLoading(true);

    try {
      // Gọi API backend bằng phương thức POST.
      const response = await fetch("http://localhost:5001/api/send-result", {
        method: "POST",
        headers: {
          // Báo cho server biết body là JSON.
          "Content-Type": "application/json",
        },
        // Gửi đúng dữ liệu server cần: grid (format backend) và start.
        body: JSON.stringify({ grid: backendGrid, start }),
      });

      if (!response.ok) {
        throw new Error("Gửi dữ liệu thất bại!");
      }

      // Parse response JSON thành object JS.
      const responseData = await response.json();
      setIsLoading(false);
            
      if (onSolve) {
        // Đẩy data lên App để render output + graph.
        onSolve(responseData.data);
      }
    } catch (error) {
      setIsLoading(false);
      alert(`Lỗi: ${error.message}`);
    }
  };

  /**
   * HÀM: handleReset
   */
  const handleReset = () => {
    const emptyGrid = createEmptyGrid();
    handleGridChange(emptyGrid);
    handleStartChange(null);
    setMode("setStart");
  };

  return (
    <div className="flex flex-col">
      <h2 className="text-xl font-bold mb-4">Input</h2>

      <Grid
        grid={grid}
        setGrid={handleGridChange}
        start={start}
        setStart={handleStartChange}
        mode={mode}
        setMode={handleModeChange}
      />

      <Controls
        start={start}
        mode={mode}
        onModeChange={handleModeChange}
        onSolve={handleSendClick}
        onReset={handleReset}
        isLoading={isLoading}
      />
    </div>
  );
};

export default Input;