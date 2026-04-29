import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../components/product.css';
import Button from '../components/Button';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:1337/api/products/${id}`);
        setProduct(response.data);
      } catch (err) {
        setError('Không tìm thấy sản phẩm hoặc có lỗi xảy ra');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Đang tải dữ liệu...</div>;
  if (error || !product) return <div style={{ padding: '40px', color: 'red', textAlign: 'center' }}>{error}</div>;

  return (
    <div className="product-detail-container">
      <div style={{ marginBottom: '20px' }}>
        <Button variant="secondary" onClick={() => navigate(-1)}>
          Quay lại
        </Button>
      </div>

      <div className="product-detail-card">
        <div className="product-detail-image-box">
          {product.image ? (
            <img
              src={`http://localhost:1337${product.image}`}
              alt={product.name}
              className="product-detail-image"
            />
          ) : (
            <div className="product-detail-no-image">
              No Image
            </div>
          )}
        </div>

        <div className="product-detail-info">
          <span className="product-detail-category">
            {product.category}
          </span>
          <h1 className="product-detail-title">{product.name}</h1>
          <p className="product-detail-price">
            {product.price}K
          </p>

          <div className="product-detail-desc-box">
            <h3>Mô tả sản phẩm</h3>
            <p className="product-detail-desc-text">
              Sản phẩm {product.name} chính hãng phân phối tại ABC.
              Được bảo hành 24 tháng theo tiêu chuẩn của nhà sản xuất.
              Tích hợp công nghệ hiện đại, thiết kế tinh tế và độ bền vượt trội,
              mang lại trải nghiệm tuyệt vời nhất cho người sử dụng.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
