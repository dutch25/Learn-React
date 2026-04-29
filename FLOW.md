# Luồng Hoạt Động - JITS Application

## 1. Đăng Ký Tài Khoản

```
React (Register.jsx)          Sails Backend
       |                            |
       |--- POST /auth/register --->|
       |    {fullName, email,       |
       |     password}              |
       |                            |
       |<-- 201 + user info --------|
```

**Flow:**
1. User nhập thông tin đăng ký (fullName, email, password, confirmPassword)
2. React gửi request POST đến `http://localhost:1337/auth/register`
3. Sails AuthController.register nhận request
4. Kiểm tra email đã tồn tại chưa
5. User model `beforeCreate` tự động hash password với bcrypt
6. Lưu user vào database
7. Trả về response thành công
8. Chuyển hướng sang trang Login

---

## 2. Đăng Nhập

```
React (Login.jsx)              Sails Backend
       |                            |
       |--- POST /auth/login ------>|
       |    {email, password}       |
       |                            |
       |<-- {token, user} ----------|
       |                            |
       |--- Lưu token & user       |
       |    vào localStorage        |
```

**Flow:**
1. User nhập email và password
2. React gửi POST đến `/auth/login`
3. AuthController.login:
   - Tìm user theo email
   - So sánh password với bcrypt.compare
   - Tạo JWT token với jsonwebtoken
   - Trả về {token, user}
3. React lưu token và user vào localStorage
4. Chuyển hướng sang trang Products

---

## 3. Hiển Thị User Đã Đăng Nhập (Layout)

```
React (layout.jsx)
       |
       |--- Đọc localStorage -----> {token, user}
       |
       |--- Nếu có token: --------> Hiển thị "Xin chào, {fullName}!"
       |   Nếu không: -------------> Hiển thị Login/Register
```

**Flow:**
1. Layout đọc `localStorage.getItem('token')` và `localStorage.getItem('user')`
2. Nếu có token → Hiển thị "Xin chào, {user.fullName}!" + nút Đăng Xuất
3. Nếu không có → Hiển thị link Login/Register

---

## 4. Đăng Xuất

```
React (layout.jsx)
       |
       |--- handleLogout() --------> 
       |    localStorage.removeItem('token')
       |    localStorage.removeItem('user')
       |    navigate('/login')
```

---

## 5. Quản Lý Sản Phẩm (Products)

### Xem danh sách sản phẩm
```
React (ProductsPage.jsx)       Sails Backend
       |                            |
       |--- GET /api/products ----->|
       |                            |
       |<-- [products] -------------|
```

### Thêm sản phẩm
```
React (ManageProduct.jsx)      Sails Backend
       |                            |
       |--- POST /api/products ---->|
       |    + file(image)           |
       |                            |
       |<-- {newProduct} -----------|
```

**Flow:**
1. User điền name, price và chọn image
2. React gửi FormData đến `/api/products`
3. ProductController.create:
   - Upload image vào `assets/images/products/`
   - Tạo product record trong database
   - Trả về product với image path

### Cập nhật sản phẩm
```
React (ProductList.jsx)        Sails Backend
       |                            |
       |--- PUT /api/products/:id ->|
       |    + FormData              |
       |                            |
       |<-- {updatedProduct} -------|
```

### Xóa sản phẩm
```
React (ProductList.jsx)        Sails Backend
       |                            |
       |--- DELETE /api/products    |
       |         /:id              ->|
       |                            |
       |<-- {message} --------------|
```

---

## Cấu Trúc Project

```
D:\JITS
├── sail/                      # Sails Backend
│   ├── api/
│   │   ├── controllers/
│   │   │   ├── AuthController.js    # Login, Register
│   │   │   └── ProductController.js # CRUD Products
│   │   ├── models/
│   │   │   ├── User.js              # User model (có bcrypt)
│   │   │   └── Product.js           # Product model
│   │   └── policies/
│   │       └── isAuthorized.js      # Policy kiểm tra auth
│   └── config/
│       ├── routes.js                # Định nghĩa routes
│       └── ...
│
└── react-test/                 # React Frontend
    ├── src/
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── ProductsPage.jsx
    │   │   └── ManageProduct.jsx
    │   ├── components/
    │   │   ├── layout.jsx           # Layout chính + hiển thị user
    │   │   ├── ProductList.jsx
    │   │   └── productForm.jsx
    │   └── App.jsx
    └── ...
```

---

## Các API Endpoints

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| POST | /auth/register | Đăng ký tài khoản |
| POST | /auth/login | Đăng nhập, trả về JWT |
| GET | /api/products | Lấy danh sách sản phẩm |
| GET | /api/products/:id | Lấy 1 sản phẩm |
| POST | /api/products | Tạo sản phẩm mới |
| PUT | /api/products/:id | Cập nhật sản phẩm |
| DELETE | /api/products/:id | Xóa sản phẩm |

---

## Công Nghệ Sử Dụng

**Backend (Sails):**
- Sails.js framework
- MongoDB (sails-mongo)
- JWT (jsonwebtoken)
- Bcryptjs (hash password)

**Frontend (React):**
- React 18
- React Router DOM
- Axios (HTTP requests)
- Vite (build tool)

---

## React Hooks - Luồng Hoạt Động

### 1. useState

```javascript
const [state, setState] = useState(initialValue);
```

**Cách hoạt động:**
- `useState` tạo một "state" - dữ liệu thay đổi được trong component
- Khi gọi `setState(value)` → React re-render lại component với giá trị mới
- State được bảo preserved giữa các lần render

**Trong code:**

| File | State | Mục đích |
|------|-------|----------|
| `Login.jsx` | `[formData, setFormData]` | Lưu email/password khi nhập |
| `Register.jsx` | `[formData, setFormData]` | Lưu thông tin đăng ký |
| `layout.jsx` | `[theme, setTheme]` | Lưu theme light/dark |
| `productForm.jsx` | `[name, setName]`, `[price, setPrice]`, `[image, setImage]` | Lưu dữ liệu form sản phẩm |
| `ManageProduct.jsx` | `[editingProduct, setEditingProduct]` | Lưu sản phẩm đang chỉnh sửa |
| `ManageProduct.jsx` | `[currentPage, setCurrentPage]` | Lưu trang hiện tại (phân trang) |
| `useProducts.jsx` | `[products, setProducts]` | Lưu danh sách sản phẩm từ API |
| `useProducts.jsx` | `[isLoading, setIsLoading]` | Trạng thái đang tải |
| `useProducts.jsx` | `[error, setError]` | Lưu lỗi API (nếu có) |

---

### 2. useEffect

```javascript
useEffect(() => {
  // code chạy khi dependency thay đổi
  return () => {
    // cleanup function (chạy trước khi effect chạy lại hoặc unmount)
  };
}, [dependency]); // mảng dependency
```

**Cách hoạt động:**
- Chạy sau mỗi lần render
- Nếu có `[]` (empty dependency) → chỉ chạy 1 lần sau mount (tương lifecycle `componentDidMount`)
- Nếu có dependency → chạy mỗi khi dependency thay đổi
- Cleanup function chạy trước khi unmount hoặc trước khi effect chạy lại

**Trong code:**

```javascript
// useProducts.jsx
useEffect(() => { fetchProducts(); }, []);
// → Chạy 1 lần khi component mount → gọi API lấy danh sách sản phẩm
```

```javascript
// layout.jsx
useEffect(() => {
  localStorage.setItem("theme", theme);
  document.body.className = theme;
}, [theme]);
// → Mỗi khi theme thay đổi → cập nhật localStorage và body class
```

```javascript
// App.jsx
useEffect(() => {
  const handleStorage = () => setIsAuth(!!localStorage.getItem('token'));
  window.addEventListener('storage', handleStorage);
  window.addEventListener('login', handleStorage);
  return () => {
    window.removeEventListener('storage', handleStorage);
    window.removeEventListener('login', handleStorage);
  };
}, []);
// → Lắng nghe event login từ Login.jsx dispatch để cập nhật auth state
```

---

### 3. useMemo

```javascript
const memoizedValue = useMemo(() => {
  return computedValue;
}, [dependency]);
```

**Cách hoạt động:**
- Tính toán giá trị và cache lại
- Chỉ tính lại khi dependency thay đổi
- Dùng để tránh tính toán tốn kém mỗi lần render

**Trong code:**

```javascript
// ManageProduct.jsx & ProductsPage.jsx
const { currentItems, totalPages } = useMemo(() => {
  const itemsPerPage = 6;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const items = products.slice(startIndex, endIndex);
  const pages = Math.ceil(products.length / itemsPerPage);
  return { currentItems: items, totalPages: pages };
}, [products, currentPage]);
// → Chỉ tính toán lại khi products hoặc currentPage thay đổi
```

---

### 4. useRef

```javascript
const ref = useRef(initialValue);
```

**Cách hoạt động:**
- Tạo một reference có thể thay đổi nhưng KHÔNG trigger re-render khi thay đổi
- Dùng để access DOM elements hoặc lưu giá trị bền vững

**Trong code:**

```javascript
// productForm.jsx
const fileRef = useRef(null);

// ... sau khi submit
fileRef.current.value = "";
// → Reset input file → KHÔNG trigger re-render
```

---

### 5. useNavigate (React Router)

```javascript
const navigate = useNavigate();
navigate('/path');        // chuyển trang
navigate('/path', { replace: true }); // thay thế history
```

**Cách hoạt động:**
- Hook từ `react-router-dom`
- Dùng để điều hướng giữa các trang

**Trong code:**

```javascript
// Login.jsx
navigate('/products'); 
// → Chuyển sang trang products sau khi đăng nhập thành công
```

```javascript
// layout.jsx (handleLogout)
navigate("/login");
// → Chuyển sang login sau khi đăng xuất
```

---

### Custom Hook: useProducts

```javascript
// useProducts.jsx
export default function useProducts() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('http://localhost:1337/api/products');
      setProducts(response.data);
    }
    catch (err) {
      setError(err.message);
    }
    finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => { fetchProducts(); }, []);

  return { products, setProducts, isLoading, error, fetchProducts };
}
```

**Luồng hoạt động:**

```
1. Component gọi useProducts()
   ↓
2. useState khởi tạo:
   - products = []
   - isLoading = true
   - error = null
   ↓
3. useEffect chạy (vì [] rỗng)
   ↓
4. fetchProducts() được gọi
   ↓
5. Gọi API GET /api/products
   ↓
6. Response về:
   - Thành công → setProducts(data), setIsLoading(false)
   - Lỗi → setError(err), setIsLoading(false)
   ↓
7. Component re-render với data mới
   ↓
8. Return { products, setProducts, isLoading, error, fetchProducts }
```

**Sử dụng trong component:**

```javascript
// ManageProduct.jsx
const { products, setProducts, isLoading, error, fetchProducts } = useProducts();
```

---

### Luồng Dữ Liệu Toàn Bộ

```
┌─────────────────────────────────────────────────────────────────┐
│                         App.jsx                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  useState: isAuth                                        │   │
│  │  ↓ Check localStorage.getItem('token')                  │   │
│  │  ↓ Quyết định render ManageProduct hoặc Navigate       │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  Layout.jsx                                                      │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │ useState    │  │ useEffect   │  │ localStorage           │  │
│  │ theme       │  │ → setTheme  │  │ getItem('user')        │  │
│  │             │  │ → body.class│  │ getItem('token')       │  │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
           │                                      │
           ▼                                      ▼
┌─────────────────────┐            ┌─────────────────────────────────┐
│ Login.jsx           │            │ ManageProduct.jsx               │
│ ┌─────────────────┐ │            │ ┌─────────────────────────────┐ │
│ │ useState        │ │            │ │ useProducts() (custom hook) │ │
│ │ formData        │ │            │ │ ├── products               │ │
│ │ useNavigate     │ │            │ │ ├── isLoading              │ │
│ └─────────────────┘ │            │ │ ├── error                  │ │
│         │           │            │ │ └── fetchProducts          │ │
│         │           │            │ ├─────────────────────────────┤ │
│         │ API call  │            │ │ useState editingProduct    │ │
│         ▼           │            │ │ useMemo (pagination)       │ │
│  AuthController    │            │ └─────────────────────────────┘ │
│  (Sails Backend)   │            │               │                 │
└─────────────────────┘            └───────────────┼─────────────────┘
                                                  │
                                                  ▼
                                    ┌─────────────────────────────┐
                                    │ productForm.jsx             │
                                    │ ┌─────────────────────────┐ │
                                    │ │ useState: name, price,  │ │
                                    │ │          image, error   │ │
                                    │ │ useRef: fileRef         │ │
                                    │ └─────────────────────────┘ │
                                    └─────────────────────────────┘
```

---

### Tóm Tắt Lifecycle Render

```
┌────────────────────────────────────────────────────────────────┐
│                    Component Mount                             │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ 1. Khởi tạo useState với initial value                  │  │
│  │ 2. Chạy useEffect (nếu có dependency rỗng [])          │  │
│  │ 3. Render UI lần đầu                                    │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌────────────────────────────────────────────────────────────────┐
│                    User tương tác                              │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Click/Input → setState → Re-render → useEffect chạy     │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌────────────────────────────────────────────────────────────────┐
│                    Component Unmount                           │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Cleanup trong useEffect chạy trước khi component bị     │  │
│  │ xóa khỏi DOM                                             │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────┘
```