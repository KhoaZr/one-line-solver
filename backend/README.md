# One Line Solver Backend

Backend của dự án **One Line Solver** dùng Node.js, Express và thuật toán DFS + backtracking để tìm **Hamiltonian Path** trên một lưới 2D.

## Mục tiêu

- Nhận grid và vị trí start từ frontend.
- Chuyển grid thành đồ thị.
- Tìm đường đi Hamilton nếu tồn tại.
- Trả kết quả chi tiết cho frontend để hiển thị.

## Công nghệ

- Node.js
- Express
- CORS
- JavaScript (CommonJS)

## Cấu trúc thư mục

```text
backend/
├── server.js
├── app.js
├── package.json
├── config/
│   └── constants.js
├── routes/
│   └── solverRoutes.js
├── controllers/
│   └── solverController.js
├── services/
│   └── solverService.js
├── algorithms/
│   └── hamiltonianPath.js
└── utils/
    ├── graphUtils.js
    └── hamiltonianPathExample.js
```

## Cách chạy

### 1. Cài đặt dependencies

```bash
cd backend
npm install
```

### 2. Chạy server

```bash
npm start
```

Backend mặc định chạy tại:

```text
http://localhost:5001
```

### 3. Chạy ví dụ thuật toán

```bash
npm run example
```

Lệnh này chạy file ví dụ trong `utils/hamiltonianPathExample.js` để test thuật toán trực tiếp mà không cần frontend.

## API chính

### POST `/api/send-result`

Endpoint nhận dữ liệu từ frontend.

#### Request body

```json
{
  "grid": [[0, 0, 0], [0, 1, 0], [0, 0, 0]],
  "start": [0, 0]
}
```

#### Ý nghĩa dữ liệu

- `grid`: ma trận 2D.
- `0`: ô đi được.
- `1`: vật cản.
- `start`: vị trí bắt đầu theo dạng `[row, col]`.

#### Response

```json
{
  "status": "success",
  "data": {
    "grid": [[0, 0, 0], [0, 1, 0], [0, 0, 0]],
    "start": [0, 0],
    "gridSize": "3x3",
    "obstacleCount": 1,
    "path": [[0, 0], [0, 1], [0, 2]],
    "status": "solved",
    "message": "Tìm được đường đi Hamilton!",
    "stats": {
      "vertexCount": 8,
      "numEdges": 11,
      "avgDegree": 2.75,
      "dfsCallCount": 24,
      "executionTime": "1ms",
      "heuristicUsed": true
    }
  }
}
```

## Luồng xử lý

1. Frontend gửi `grid` và `start`.
2. `solverController` kiểm tra dữ liệu đầu vào.
3. `solverService` chuyển grid thành đồ thị.
4. `hamiltonianPath.js` chạy DFS + backtracking.
5. Kết quả được đổi từ vertex ID sang tọa độ grid.
6. Backend trả JSON cho frontend.

## Quy ước dữ liệu

### Backend

- `0` = ô đi được
- `1` = vật cản

### Frontend

Frontend phải đổi dữ liệu về đúng format backend trước khi gửi.

## Các trạng thái trả về

- `solved`: tìm được đường đi.
- `no_solution`: không có đường đi Hamilton.
- `invalid_start`: vị trí start không hợp lệ.

## Heuristic

Backend dùng **Degree Heuristic**:

- Ưu tiên đỉnh có ít lựa chọn tiếp theo nhất.
- Mục đích là tránh đi vào ngõ cụt quá sớm.
- Thường giúp thuật toán chạy nhanh hơn.

## Xử lý lỗi thường gặp

### 1. `Vị trí bắt đầu không hợp lệ`

Nguyên nhân:

- Start nằm trên ô vật cản.

Cách xử lý:

- Chọn lại start trên ô đi được.

### 2. `Không có đường đi Hamilton`

Nguyên nhân:

- Grid quá chia cắt.
- Có ô bị cô lập.

Đây là kết quả hợp lệ, không phải lỗi hệ thống.

### 3. Chạy chậm

Nguyên nhân:

- Hamiltonian Path là bài toán NP-hard.
- Grid càng lớn thì càng chậm.

Cách xử lý:

- Giảm kích thước grid.
- Dùng heuristic.
- Thêm timeout nếu cần.

## Ghi chú cho người mới học

- `server.js` chỉ dùng để khởi động server.
- `app.js` dùng để cấu hình middleware và route.
- `controller` xử lý request/response.
- `service` chứa logic chính.
- `algorithm` chứa thuật toán tìm đường.
- `utils` chứa các hàm hỗ trợ.
