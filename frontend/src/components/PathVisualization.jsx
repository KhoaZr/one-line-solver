/**
 * FILE: frontend/src/components/PathVisualization.jsx
 *
 * Component này hiển thị kết quả đường đi ở dạng grid trực quan.
 */

import { useState, useEffect, useRef, useCallback } from "react";

// Thời gian giữa 2 bước animation: 1000ms = 1 giây/bước.
const ANIMATION_STEP_MS = 1000;

// Khoảng nghỉ ngắn trước khi lặp lại cả animation.
const LOOP_PAUSE_MS = 800;

const PathVisualization = ({ grid, start, result }) => {
  // Danh sách ô đang được tô vàng theo animation.
  const [animatedPath, setAnimatedPath] = useState([]);

  // Cờ đang chạy animation để disable nút chạy lại.
  const [isAnimating, setIsAnimating] = useState(false);

  // Lưu danh sách timeout IDs để dọn dẹp khi component unmount / dữ liệu đổi.
  const animationTimeoutsRef = useRef([]);

  // Lưu interval ID cho chế độ tự lặp animation.
  const animationLoopRef = useRef(null);

  // Xóa toàn bộ timeout đang treo để tránh chồng animation.
  const clearAnimationTimeouts = useCallback(() => {
    animationTimeoutsRef.current.forEach((timeoutId) => clearTimeout(timeoutId));
    animationTimeoutsRef.current = [];
  }, []);

  // Hàm chạy animation theo từng bước.
  const startAnimation = useCallback((path) => {
    clearAnimationTimeouts();
    setIsAnimating(true);
    setAnimatedPath([]);

    // Mỗi ANIMATION_STEP_MS, tô thêm 1 ô trong path.
    path.forEach((cell, index) => {
      const timeoutId = setTimeout(() => {
        setAnimatedPath((prev) => [...prev, `${cell[0]},${cell[1]}`]);
      }, index * ANIMATION_STEP_MS);

      animationTimeoutsRef.current.push(timeoutId);
    });

    // Khi chạy hết path thì tắt cờ animation.
    const endTimeoutId = setTimeout(() => {
      setIsAnimating(false);
    }, path.length * ANIMATION_STEP_MS);

    animationTimeoutsRef.current.push(endTimeoutId);
  }, [clearAnimationTimeouts]);

  useEffect(() => {
    // Lấy path từ kết quả backend (nếu có).
    const pathData = result?.path;

    // Dọn các timer cũ trước khi thiết lập vòng mới.
    clearAnimationTimeouts();
    if (animationLoopRef.current) {
      clearInterval(animationLoopRef.current);
      animationLoopRef.current = null;
    }

    // Chỉ chạy animation khi có path hợp lệ.
    if (pathData && pathData.length > 0) {
      // Chạy ngay vòng đầu tiên.
      const initialTimeoutId = setTimeout(() => {
        startAnimation(pathData);
      }, 0);
      animationTimeoutsRef.current.push(initialTimeoutId);

      // Sau đó tự lặp lại animation theo chu kỳ.
      const cycleDuration = pathData.length * ANIMATION_STEP_MS + LOOP_PAUSE_MS;
      animationLoopRef.current = setInterval(() => {
        startAnimation(pathData);
      }, cycleDuration);

      return () => {
        clearAnimationTimeouts();
        if (animationLoopRef.current) {
          clearInterval(animationLoopRef.current);
          animationLoopRef.current = null;
        }
      };
    }

    return undefined;
  }, [result, clearAnimationTimeouts, startAnimation]);

  // Trả về class màu theo trạng thái của từng ô.
  const getColorClass = (rowIdx, colIdx) => {
    const cellKey = `${rowIdx},${colIdx}`;

    // Ưu tiên màu start.
    if (start && start[0] === rowIdx && start[1] === colIdx) {
      return "bg-green-500";
    }

    // Sau đó là màu path animation.
    if (animatedPath.includes(cellKey)) {
      return "bg-yellow-400 animate-pulse";
    }

    // Theo quy ước UI: cell === 1 là ô đi được (cam)
    if (grid[rowIdx][colIdx] === 1) {
      return "bg-orange-500";
    }

    // Còn lại là vật cản (xám)
    if (grid[rowIdx][colIdx] !== 1) {
      return "bg-gray-700";
    }

    return "bg-gray-700";
  };

  // Chưa có dữ liệu để vẽ.
  if (!result || !grid) {
    return (
      <div className="flex flex-col items-center">
        <h2 className="text-xl font-bold text-white mb-4">Kết Quả Đường Đi</h2>
        <div className="text-gray-400 text-center py-20">
          <p>Chưa có kết quả</p>
          <p className="text-sm">Hãy gửi grid từ bên trái để xem đường đi</p>
        </div>
      </div>
    );
  }

  // Backend xác nhận không có nghiệm.
  if (result.status === "no_solution") {
    return (
      <div className="flex flex-col items-center">
        <h2 className="text-xl font-bold text-white mb-4">Kết Quả Đường Đi</h2>
        <div className="text-red-400 text-center py-20">
          <p>Không có đường đi Hamilton</p>
          <p className="text-sm">Thử điều chỉnh grid hoặc vị trí start</p>
        </div>
      </div>
    );
  }

  // Backend xác nhận start không hợp lệ.
  if (result.status === "invalid_start") {
    return (
      <div className="flex flex-col items-center">
        <h2 className="text-xl font-bold text-white mb-4">Kết Quả Đường Đi</h2>
        <div className="text-red-400 text-center py-20">
          <p>Vị trí start không hợp lệ</p>
          <p className="text-sm">{result.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-xl font-bold text-white mb-4">Kết Quả Đường Đi</h2>

      {/* Khối grid hiển thị kết quả */}
      <div className="grid gap-1 p-4 bg-gray-900 rounded-lg" style={{
        gridTemplateColumns: `repeat(${grid[0].length}, 1fr)`
      }}>
        {grid.map((row, i) =>
          row.map((cell, j) => (
            <div
              key={`${i}-${j}`}
              className={`w-10 h-10 rounded transition-all duration-300 ${getColorClass(i, j)}`}
              title={`[${i}, ${j}]`}
            />
          ))
        )}
      </div>

      {/* Nhóm thông tin text summary */}
      <div className="mt-6 text-white text-sm">
        <p>{result.message}</p>
        {result.path && <p>Số bước: {result.path.length}</p>}
        {result.stats && (
          <>
            <p>Thời gian: {result.stats.executionTime}</p>
            <p>DFS Calls: {result.stats.dfsCallCount}</p>
          </>
        )}
      </div>

      {/* Nút cho phép chạy lại animation thủ công */}
      {result.path && (
        <button
          onClick={() => startAnimation(result.path)}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-500"
        >
          {isAnimating ? "Animation đang chạy (tự lặp)" : "Chạy lại animation"}
        </button>
      )}
    </div>
  );
};

export default PathVisualization;
