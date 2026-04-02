import {useState} from "react"
const Grid = () =>{
    const size = 10; //kích thước của grid
    const createEmptyGrid = () =>{ // tạo grid trống ban đầu
        const newGrid = [];
        for (let i = 0; i < size; i++){
            const row = []
            for (let j = 0; j<size;j++){
                row.push(null) // Mỗi ô ban đầu có giá trị null
            }
            newGrid.push(row);
        }
        return newGrid;
    }
    const [grid,setGrid] = useState(createEmptyGrid()); // state lưu toàn bộ grid
    const handleClick = (rowIndex,colIndex)=>{
        //1: copy grid cũ, không sử dụng trực tiếp state
        const newGrid = []
        for (let i = 0; i< size ; i++){
            newGrid.push([...grid[i]])
        }
        // 2: lấy giá trị hiện tại của ô
        const currentValue = newGrid[rowIndex][colIndex];

        //3: toggle
        // null -> 1 (on)
        // 1-> null (off)
        if (currentValue === null){
            newGrid[rowIndex][colIndex] = 1
        } else {
            newGrid[rowIndex][colIndex] = null
        }
        // Cập nhật lại state
        setGrid(newGrid)
    }
    return(
        <div className="flex justify-center mt-10 p-5"> 
            {/* {containerGrid} */}
            <div className="grid grid-cols-10 gap-2">
                {/* {Duyệt từng hàng} */}
                {grid.map((row, i) => {
                    // Duyệt từng ô trong hàng
                    return row.map((cell, j) => {
                        return (
                            <div key={`${i}-${j}`}
                                onClick={() => handleClick(i, j)}
                                className={`w-10 h-10 rounded-md cursor-pointer ${cell === null ? "bg-gray-700" : "bg-orange-400"}`}
                            />
                        );
                    });
                })}
            </div>
        </div>
    )
}
export default Grid