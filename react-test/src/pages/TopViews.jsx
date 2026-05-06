import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../components/TopViews.css';

export default function TopViews() {
  const [topProducts, setTopProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTop = async () => {
      try {
        const response = await axios.get('http://localhost:1337/api/dashboard/top-views');
        setTopProducts(response.data);
      } catch (err) {
        console.error("Lỗi lấy top views", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTop();
  }, []);

  if (isLoading) return <div className="top-views-container">Đang tải bảng xếp hạng...</div>;

  return (
    <div className="top-views-container">
      <h1 className="top-views-title">
        Top 10 Sản phẩm xem nhiều nhất
      </h1>

      {topProducts.length === 0 ? (
        <p>Chưa có dữ liệu xếp hạng. Hãy vào xem một vài sản phẩm trước!</p>
      ) : (
        <div className="top-views-list">
          {topProducts.map((p, index) => (
            <Link
              key={p.id}
              to={`/products/${p.id}`}
              className={`top-views-item ${index < 3 ? `rank-${index + 1}` : ''}`}
            >
              <span className="rank-number">
                #{index + 1}
              </span>

              <img
                src={`http://localhost:1337${p.image}`}
                alt={p.name}
                className="top-product-img"
              />

              <div className="product-info">
                <h4 className="product-name">{p.name}</h4>
                <div className="product-meta">
                  <span className="category-tag">
                    {p.category}
                  </span>
                  <span className="product-price">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p.price)}
                  </span>
                </div>
              </div>

              <div className="view-count-box">
                <div className="view-number">
                  {p.views.toLocaleString()}
                </div>
                <div className="view-label">
                  Lượt xem
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
