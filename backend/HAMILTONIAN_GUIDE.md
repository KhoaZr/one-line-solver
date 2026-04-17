# Hướng dẫn Hamiltonian Path Backend

Tài liệu này giải thích từng phần của backend theo cách dễ hiểu cho người mới học Node.js.

## 1. Hamiltonian Path là gì?

Hamiltonian Path là một đường đi trong đồ thị mà:

- đi qua mỗi đỉnh đúng 1 lần
- không cần quay về điểm xuất phát

Trong bài toán này, mỗi ô đi được trên grid sẽ được xem như một đỉnh của đồ thị.

## 2. Cấu trúc backend

```text
backend/
├── server.js
├── app.js
├── package.json
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

## 3. Luồng dữ liệu

### Bước 1: Frontend gửi dữ liệu

Frontend gửi một object như sau:

```json
{
  "grid": [[0, 0, 0], [0, 1, 0], [0, 0, 0]],
  "start": [0, 0]
}
```

### Bước 2: Backend nhận request

Request đi qua các tầng:

1. `server.js`
2. `app.js`
3. `routes/solverRoutes.js`
4. `controllers/solverController.js`
5. `services/solverService.js`
6. `algorithms/hamiltonianPath.js`
7. `utils/graphUtils.js`

### Bước 3: Backend trả kết quả

Backend trả lại một JSON có:

- `path`: đường đi tìm được
- `status`: trạng thái xử lý
- `message`: thông báo cho người dùng
- `stats`: số đỉnh, số cạnh, thời gian chạy...

## 4. Vai trò từng file

### `server.js`

- Khởi động server.
- Lắng nghe cổng 5001.
- Bắt các sự kiện như `SIGINT`, `SIGTERM`, `error`.

### `app.js`

- Tạo Express app.
- Gắn middleware CORS và JSON parser.
- Gắn router `/api`.

### `solverRoutes.js`

- Định nghĩa endpoint.
- Hiện tại endpoint chính là `POST /api/send-result`.

### `solverController.js`

- Nhận dữ liệu từ frontend.
- Kiểm tra input.
- Gọi service.
- Trả response JSON.

### `solverService.js`

- Xử lý logic chính.
- Chuyển grid thành đồ thị.
- Tìm start vertex.
- Gọi thuật toán Hamilton.
- Đổi kết quả từ vertex ID sang tọa độ grid.

### `hamiltonianPath.js`

- Chứa thuật toán DFS + backtracking.
- Có thêm heuristic để giảm số nhánh phải thử.

### `graphUtils.js`

- Chuyển grid 2D thành adjacency list.
- Kiểm tra đồ thị hợp lệ.
- Lấy thông tin thống kê đồ thị.

## 5. Quy ước dữ liệu

### Backend

- `0` = ô đi được
- `1` = vật cản

### Frontend

Frontend có thể dùng quy ước hiển thị riêng, nhưng khi gửi lên backend phải đổi về format trên.

## 6. Thuật toán đang dùng

### DFS

DFS đi sâu từng nhánh một.

### Backtracking

Nếu đi sai đường thì quay lui để thử nhánh khác.

### Heuristic

Ở đây dùng Degree Heuristic:

- ưu tiên đỉnh có ít neighbor chưa thăm nhất
- giúp tránh dead end
- thường nhanh hơn khi grid lớn

## 7. Cách chạy backend

### Chạy server

```bash
cd backend
npm install
npm start
```

Server chạy tại:

```text
http://localhost:5001
```

### Chạy ví dụ

```bash
npm run example
```

Lệnh này chạy file `utils/hamiltonianPathExample.js`.

## 8. API chính

### `POST /api/send-result`

#### Request

```json
{
  "grid": [[0, 0, 0], [0, 1, 0], [0, 0, 0]],
  "start": [0, 0]
}
```

#### Response

```json
{
  "status": "success",
  "data": {
    "status": "solved",
    "message": "Tìm được đường đi Hamilton!",
    "path": [[0, 0], [0, 1], [0, 2]],
    "stats": {
      "vertexCount": 8,
      "numEdges": 11,
      "avgDegree": 2.75,
      "dfsCallCount": 24,
      "executionTime": "1ms"
    }
  }
}
```

## 9. Ý nghĩa các trạng thái

- `solved`: tìm được lời giải.
- `no_solution`: không tồn tại đường đi Hamilton.
- `invalid_start`: start nằm trên ô vật cản.

## 10. Lỗi thường gặp

### Start không hợp lệ

Nguyên nhân:

- Start đang trỏ vào ô vật cản.

Cách xử lý:

- Chọn lại start trên ô đi được.

### Không có đường đi Hamilton

Nguyên nhân:

- Đồ thị bị chia cắt.
- Có ô bị cô lập.

Đây là kết quả đúng của thuật toán.

### Chạy chậm

Nguyên nhân:

- Bài toán Hamilton rất nặng.
- Grid càng lớn càng chậm.

Cách xử lý:

- Giảm kích thước grid.
- Dùng heuristic.
- Giới hạn timeout.

## 11. Ghi chú nhanh cho người mới học

- `controller` chỉ nên xử lý request/response.
- `service` chứa logic chính.
- `algorithm` chứa thuật toán.
- `utils` chứa hàm hỗ trợ.
- Tách file như vậy giúp code dễ đọc và dễ bảo trì hơn.
