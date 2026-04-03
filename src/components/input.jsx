import { useState } from "react"
const size = 10 //Kich thuoc cua grid
const createEmptyGrid = () =>{
        const newGrid = []
        for (let i = 0 ; i < size ;i++){
            const row = []
            for (let j = 0 ; j < size ; j++){
                row.push(null)
            }
            newGrid.push(row)
        }
        return newGrid; 
    }
const Grid = ({grid,setGrid,start,setStart}) =>{
    const handleClick = (rowIndex,colIndex) =>{
        const newGrid = grid.map(row => [...row])
        // Nếu chưa có start => set lại start
        if (!start){
            setStart([rowIndex,colIndex])
            return;
        }
        //nút bình thường
       newGrid[rowIndex][colIndex] = newGrid[rowIndex][colIndex] === null ? 1 : null;
        setGrid(newGrid)

        
    }
    return(
        <div className="flex justify-b mt-10 p-5">
            <div className="grid grid-cols-10 gap-2 bg-gray-800 p-6 rounded-3xl">
                {grid.map((row, i) =>
                    row.map((cell, j) => {
                    const isStart = start && start[0] === i && start[1] === j;

                    return (
                <div
                    key={`${i}-${j}`}
                    onClick={() => handleClick(i, j)}
                    className={`w-12 h-12 rounded-md cursor-pointer
                        ${isStart ? "bg-green-500" : ""}
                        ${cell === null ? "bg-gray-700" : "bg-orange-500"}
                    `}
            />
          );
        })
      )}
    </div>
        </div>
    )
}
const Button = ({ grid, setGrid, start, setStart }) => {

  const handleSend = async () => {
    console.log("Grid:", grid);
    console.log("Start:", start);
  };

  const handleReset = () => {
    setGrid(createEmptyGrid());
    setStart(null);
  };

  return (
    <div className="ml-4">
      <button onClick={handleSend}
        className="bg-blue-500 text-white rounded m-2 p-2 cursor-pointer w-25">
        Gửi kết quả
      </button>

      <button onClick={handleReset}
        className="bg-red-500 text-white rounded m-2 p-2 cursor-pointer w-25">
        Reset
      </button>
    </div>
  );
};
const Input = () =>{
    
    const [grid,setGrid] = useState(createEmptyGrid())
    const [start,setStart] = useState(null)
    return(
        <div className="flex flex-col justify-center">
            <Grid grid={grid} setGrid={setGrid} start={start} setStart={setStart}/>
            <Button grid={grid} setGrid={setGrid} start={start} setStart={setStart}/>
        </div>
        
    )
}
export default Input