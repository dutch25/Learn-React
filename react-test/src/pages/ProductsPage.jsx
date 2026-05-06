import { useState, useEffect } from 'react';
import useProducts from '../hooks/useProducts';
import ProductList from "../components/ProductList";
import Pagination from '../components/Pagination';

function ProductsPage() {
    const { products, isLoading, error, fetchProducts, pagination, categories, fetchCategories } = useProducts();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');

    useEffect(() => {
      fetchCategories();
    }, [fetchCategories]);

    useEffect(() => {
      const delayDebounceFn = setTimeout(() => {
        fetchProducts(1, searchTerm, selectedCategory);
      }, 500);

      return () => clearTimeout(delayDebounceFn);
    }, [searchTerm, selectedCategory, fetchProducts]);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.totalPages) {
            fetchProducts(newPage, searchTerm, selectedCategory);
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
              
              <select 
                className="category-filter"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd', marginLeft: '10px' }}
              >
                <option value="">Tất cả danh mục</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>

              {isLoading && <span className="search-loading">Đang tải...</span>}
            </div>

            <ProductList products={products} />
            <Pagination 
              pagination={pagination} 
              onPageChange={handlePageChange} 
            />
        </div>
    );
}

export default ProductsPage;