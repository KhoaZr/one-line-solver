import { useState } from "react";

// --- Grid component ---
const Grid = ({ startCell, setStartCell, setGrid }) => {
    const size = 10; // kích thước của grid
    const createEmptyGrid = () => { 
        const newGrid = [];
        for (let i = 0; i < size; i++) {
            const row = [];
            for (let j = 0; j < size; j++) {
                row.push(null); // Mỗi ô ban đầu có giá trị null
            }
            newGrid.push(row);
        }
        return newGrid;
    };

    const [grid, setGridLocal] = useState(createEmptyGrid()); // state lưu toàn bộ grid

    const handleClick = (rowIndex, colIndex) => {
        const newGrid = grid.map(row => [...row]);
        const currentValue = newGrid[rowIndex][colIndex];

        if (currentValue === null) {
            newGrid[rowIndex][colIndex] = 1;
            if (!startCell) {
                setStartCell([rowIndex, colIndex]); // Set ô bắt đầu nếu chưa có
            }
        } else {
            newGrid[rowIndex][colIndex] = null;
            if (startCell && startCell[0] === rowIndex && startCell[1] === colIndex) {
                setStartCell(null); // Reset ô bắt đầu nếu ô được nhấn lại
            }
        }

        setGridLocal(newGrid);
        setGrid(newGrid); // Cập nhật lại grid trong Input
    };

    return (
        <div className="flex justify-center mt-10 p-5"> 
            <div className="grid grid-cols-10 gap-2">
                    {grid.map((row, i) => row.map((cell, j) => {
                        const isStartCell = startCell && startCell[0] === i && startCell[1] === j;
                        let cellColor = "bg-gray-700";
                        if (isStartCell) {
                            cellColor = "bg-green-500";
                        } else if (cell !== null) {
                            cellColor = "bg-orange-400";
                        }
                        return (
                            <div
                                key={`${i}-${j}`}
                                onClick={() => handleClick(i, j)}
                                className={`w-10 h-10 rounded-md cursor-pointer ${cellColor}`}
                            />
                        );
                    }))}
            </div>
        </div>
    );
}

// --- Button component ---
const Button = ({ setStartPoint, grid, startPoint, resetGrid }) => {
    const handleSubmit = () => {
        console.log("Gửi dữ liệu:", grid, "Với vị trí bắt đầu:", startPoint);
    }

    return (
        <div className="mt-5">
            <button 
                onClick={() => setStartPoint(null)} 
                className="bg-blue-500 text-white p-2 rounded mr-2">
                Đánh dấu bắt đầu
            </button>
            <button 
                onClick={handleSubmit} 
                className="bg-green-500 text-white p-2 rounded mr-2">
                Gửi kết quả
            </button>
            <button 
                onClick={resetGrid} 
                className="bg-red-500 text-white p-2 rounded">
                Reset
            </button>
        </div>
    );
}

// --- Input component ---
const Input = () => {
    const [startPoint, setStartPoint] = useState(null);
    const [grid, setGrid] = useState([]); // Lưu grid tại Input

    const resetGrid = () => {
        setStartPoint(null);
        setGrid([]); // Reset grid dữ liệu
    }

    return (
        <div className="bg-gray-800 rounded-4xl p-28">
            <Grid startCell={startPoint} setStartCell={setStartPoint} setGrid={setGrid} />
            <Button setStartPoint={setStartPoint} startPoint={startPoint} grid={grid} resetGrid={resetGrid} />
        </div>      
    );
}

export default Input;
