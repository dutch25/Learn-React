import { useState, useRef } from "react";
import './product.css';
import Button from './Button';

function ProductForm({ onAddProduct, editProduct, onUpdateProduct, onCancelEdit }) {
  const [name, setName] = useState(editProduct ? editProduct.name : "");
  const [price, setPrice] = useState(editProduct ? editProduct.price : "");
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
      image,
    };

    if (editProduct) {
      onUpdateProduct(productData);
    } else {
      onAddProduct(productData);
    }

    setName("");
    setPrice("");
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