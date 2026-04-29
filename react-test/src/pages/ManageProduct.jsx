import { useState, useEffect } from 'react';
import ProductList from '../components/ProductList';
import ProductForm from '../components/productForm';
import useProducts from '../hooks/useProducts';
import axios from 'axios';

export default function ManageProduct() {
  const { products, setProducts, isLoading, error, fetchProducts, pagination } = useProducts();
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchProducts(1, searchTerm);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, fetchProducts]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchProducts(newPage, searchTerm);
    }
  };

  const handleAddProduct = async (productData) => {
    try {
      const formData = new FormData();
      const token = localStorage.getItem('token');
      formData.append('name', productData.name);
      formData.append('price', Number(productData.price));

      if (productData.image) {
        formData.append('image', productData.image);
      }

      const response = await axios.post('http://localhost:1337/api/products', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      fetchProducts(pagination.page, searchTerm);
      alert("Thêm sản phẩm thành công!");
    } catch (err) {
      console.error("Lỗi khi thêm sản phẩm:", err);
      alert("Lỗi: " + (err.response?.data?.message || err.message));
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa sản phẩm này?")) return;
    const token = localStorage.getItem('token');

    try {
      await axios.delete(`http://localhost:1337/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (products.length === 1 && pagination.page > 1) {
        fetchProducts(pagination.page - 1, searchTerm);
      } else {
        fetchProducts(pagination.page, searchTerm);
      }

      alert("Xóa sản phẩm thành công!");
    } catch (err) {
      console.error("Lỗi khi xóa sản phẩm:", err);
      alert("Lỗi: " + (err.response?.data?.message || err.message));
    }
  };

  const handleUpdateProduct = async (productData) => {
    try {
      const formData = new FormData();
      const id = editingProduct.id;
      const token = localStorage.getItem('token');

      formData.append('name', productData.name);
      formData.append('price', Number(productData.price));

      if (productData.image instanceof File) {
        formData.append('image', productData.image);
      }

      const response = await axios.put(`http://localhost:1337/api/products/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setProducts(products.map(p => p.id === id ? response.data : p));
      setEditingProduct(null);
      alert("Cập nhật sản phẩm thành công!");
    } catch (err) {
      console.error("Lỗi 404 hoặc lỗi khác:", err.response);
      alert("Cập nhật thất bại, hãy kiểm tra ID sản phẩm!");
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>CMS Quản lý Sản phẩm</h1>
      {error && <p style={{ color: 'red' }}>Lỗi: {error}</p>}

      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="Tìm kiếm sản phẩm..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {isLoading && <span className="search-loading">Đang tải...</span>}
      </div>

      <ProductForm
        key={editingProduct ? editingProduct.id : 'new-form'}
        onAddProduct={handleAddProduct}
        onUpdateProduct={handleUpdateProduct}
        editProduct={editingProduct}
        onCancelEdit={handleCancelEdit}
      />
      <ProductList
        products={products}
        onDelete={handleDeleteProduct}
        onEdit={handleEditProduct}
        showActions={true}
      />
      <div className="pagination">
        <button
          disabled={pagination.page === 1}
          onClick={() => handlePageChange(pagination.page - 1)}
        >
          Trước
        </button>

        {[...Array(pagination.totalPages)].map((_, index) => (
          <button
            key={index}
            className={pagination.page === index + 1 ? 'active' : ''}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </button>
        ))}

        <button
          disabled={pagination.page === pagination.totalPages || pagination.totalPages === 0}
          onClick={() => handlePageChange(pagination.page + 1)}
        >
          Sau
        </button>
      </div>
    </div>
  );
}