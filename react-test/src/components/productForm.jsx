import { useState, useRef } from "react";
import './product.css';
import Button from './Button';

function ProductForm({ onAddProduct, editProduct, onUpdateProduct, onCancelEdit, categories = [] }) {
  const [name, setName] = useState(editProduct ? editProduct.name : "");
  const [price, setPrice] = useState(editProduct ? editProduct.price : "");
  const [category, setCategory] = useState(editProduct && editProduct.category ? editProduct.category : "");
  const [isNewCategory, setIsNewCategory] = useState(false);
  const [image, setImage] = useState(editProduct ? editProduct.image : null);
  const [error, setError] = useState("");
  const fileRef = useRef(null);


  function handleImage(e) {
    setImage(e.target.files[0]);
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (price <= 0) {
      setError("Price must be greater than 0");
      return;
    }
    setError("");

    const productData = {
      name,
      price: Number(price),
      category,
      image,
    };

    if (editProduct) {
      onUpdateProduct(productData);
    } else {
      onAddProduct(productData);
    }

    setName("");
    setPrice("");
    setCategory("");
    setImage(null);
    fileRef.current.value = "";
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }} className="product-form">
      <input
        type="text"
        placeholder="Tên sản phẩm..."
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        className="input-field"
      />

      <input
        type="number"
        placeholder="Giá sản phẩm..."
        value={price}
        onChange={(e) => { setError(""); setPrice(e.target.value) }}
        required
        className="input-field"
      />

      {!isNewCategory ? (
        <select
          value={category}
          onChange={(e) => {
            if (e.target.value === "NEW_CATEGORY_OPTION") {
              setIsNewCategory(true);
              setCategory("");
            } else {
              setCategory(e.target.value);
            }
          }}
          className="input-field"
          style={{ width: "180px", padding: "10px" }}
        >
          <option value="" disabled>-- Chọn danh mục --</option>
          {categories.map((cat, idx) => (
            <option key={idx} value={cat}>{cat}</option>
          ))}
          <option value="NEW_CATEGORY_OPTION">+ Thêm danh mục mới...</option>
        </select>
      ) : (
        <div style={{ display: 'flex', gap: '10px' }}>
          <input
            type="text"
            placeholder="Tên danh mục mới..."
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="input-field"
            style={{ width: "180px", margin: 0 }}
          />
          <button
            type="button"
            onClick={() => { setIsNewCategory(false); setCategory(categories[0] || ""); }}
            className="cancel-btn"
            style={{ padding: '0 15px', margin: 0, whiteSpace: 'nowrap' }}
          >
            Hủy
          </button>
        </div>
      )}

      <input type="file" className="input-field" onChange={handleImage}
        accept="image/*" ref={fileRef} />

      {error && (
        <p style={{ color: "red", marginTop: "10px" }}>{error}</p>
      )}

      <div style={{ display: 'flex', gap: '10px' }}>
        <Button type="submit" variant="primary">
          {editProduct ? "Cập nhật sản phẩm" : "Thêm sản phẩm"}
        </Button>
        {editProduct && (
          <Button type="button" variant="cancel" onClick={onCancelEdit}>
            Hủy
          </Button>
        )}
      </div>
    </form>
  );
}

export default ProductForm;