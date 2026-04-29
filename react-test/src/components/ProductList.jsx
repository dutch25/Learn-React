import React from 'react';
import './product.css';
import Button from './Button'; 


function ProductList({ products, onDelete, onEdit, showActions = false }) {
  const Server_URL = "http://localhost:1337";

  return (
    <div>
      <h2>Danh sách sản phẩm</h2>

      <div className="product-list">
        {products.map(product => {
          let imageSrc = "";
          if (product.image) {
            if (typeof product.image === 'string') {
              imageSrc = product.image.startsWith('http') 
                ? product.image 
                : `${Server_URL}${product.image}`;
            } else {
              imageSrc = URL.createObjectURL(product.image);
            }
          }

          return (
            <div className="product-card" key={product.id}>
              {product.image && (
                <img 
                  className="product-card__image"  
                  src={imageSrc} 
                  alt={product.name} 
                  onError={(e) => { e.target.src = 'https://placehold.co/200x200?text=No+Image'; }}
                />
              )}
              
              <div className="product-card__content">
                <h3 className="product-card__name">{product.name}</h3>
                <p className="product-card__price">{product.price}K</p>
                
                {showActions && onDelete && (
                  <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                    <Button variant="edit" onClick={() => onEdit(product)}>Edit</Button>
                    <Button variant="danger" onClick={() => onDelete(product.id)}>Delete</Button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ProductList;