import { useState, useEffect } from 'react';
import useProducts from '../hooks/useProducts';
import ProductList from "../components/ProductList";

function ProductsPage() {
    const { products, isLoading, error, fetchProducts, pagination } = useProducts();
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

    return (
        <div style={{ padding: "20px" }}>
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

            <ProductList products={products} />
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

export default ProductsPage;