FILE HUONG DAN BACKEND HAMILTONIAN PATH

CAU TRUC THU MUC

backend/
  server.js                         Entry point khoi tao server
  app.js                            Express config
  package.json

  config/
    constants.js                    Hang so PORT GRID_SIZE

  routes/
    solverRoutes.js                 Dinh nghia API endpoints

  controllers/
    solverController.js             Xu ly HTTP request response

  services/
    solverService.js                Logic business chinh

  algorithms/
    hamiltonianPath.js              Thuat toan Hamiltonian Path

  utils/
    graphUtils.js                   Ham tien ich do thi
    hamiltonianPathExample.js       Vi du su dung


LUONG DU LIEU

1 Frontend gui
{
  grid [[null null ...] [null 1 ...]]
  start [0 0]
}

POST http localhost 5000 api send result

2 Backend xu ly

server.js
  app.js middleware
  routes solverRoutes.js
  controllers solverController.js validate input
  services solverService.js logic chinh
  algorithms hamiltonianPath.js DFS backtracking
  utils graphUtils.js helper

3 Frontend nhan

{
  success true
  message Tim duoc duong di Hamilton
  data
    grid [...]
    start [0 0]
    path [[0 0] [0 1] ...]
    status solved
    stats
      vertexCount 9
      numEdges 12
      dfsCallCount 45
      executionTime 2ms
}


CAC FILE CHINH VA CONG DUNG

1 algorithms hamiltonianPath.js

Cong dung Thuat toan tim duong di Hamilton

Ham chinh
findHamiltonianPath adjacencyList startVertex numVertices useHeuristic
Tra ve path hoac null

findHamiltonianPathWithStats
Tra ve path found callCount executionTime heuristicUsed

Nguyen ly
DFS tim kiem theo chieu sau
Backtracking hoan tac
Heuristic uu tien dinh co it lua chon

Do phuc tap
Time O n factorial worst case
Space O n


2 utils graphUtils.js

Cong dung Ham tien ich do thi

Ham chinh
gridToAdjacencyList grid
Chuyen grid 2D thanh adjacency list

countUnvisitedNeighbors neighbors visited
Dem so neighbor chua visit

isValidGraph adjacencyList numVertices
Kiem tra hop le

getGraphInfo adjacencyList numVertices
Lay thong tin do thi


3 services solverService.js

Cong dung Logic business chinh

Ham
solvePuzzle grid start

Buoc xu ly
Validate input
Chuyen grid sang adjacency list
Tim vertex ID cua start
Goi thuat toan Hamilton
Chuyen ket qua sang toa do grid
Tra ve object


CACH CHAY VA TEST

1 Chay server

cd backend
npm install
node server.js

Server chay tai http localhost 5000


2 Test truc tiep

node utils hamiltonianPathExample.js


3 Test HTTP

POST http localhost 5000 api send result

Body
{
  grid [
    [null null null]
    [null 1 null]
    [null null null]
  ]
  start [0 0]
}


HEURISTIC DEGREE HEURISTIC

Dinh nghia
Tai moi buoc uu tien dinh co it neighbor chua visit

Vi du
Dinh A co 5 neighbor
Dinh B co 1 neighbor
Chon B truoc

Hieu qua
Giam so lan DFS
Tim nhanh hon
Khong thay doi ket qua


GRID TO ADJACENCY LIST

Vi du

Grid 2x2
[null null]
[null 1]

Danh so
[0 1]
[2 X]

Ket noi
0 1
0 2

Adjacency List
0 [1 2]
1 [0]
2 [0]


VI DU INPUT OUTPUT

Input
{
  grid [
    [null null null]
    [null 1 null]
    [null null null]
  ]
  start [0 0]
}

Output
{
  success true
  message Du lieu nhan thanh cong
  data
    grid [...]
    start [0 0]
    gridSize 3x3
    obstacleCount 1
    path [[0 0] [0 1] ...]
    status solved
    message Tim duoc duong di Hamilton
    stats
      vertexCount 8
      numEdges 11
      avgDegree 2.75
      dfsCallCount 24
      executionTime 1ms
      heuristicUsed true
}


DEBUG TROUBLESHOOTING

Vi tri bat dau khong hop le
Start nam o vat can
Chuyen sang o trong

Khong co duong di Hamilton
Do thi bi phan tach
Day la ket qua dung

Do thi khong hop le
Loi khi chuyen grid
Kiem tra format

Chay cham
Grid qua lon
Nen gioi han kich thuoc hoac them timeout