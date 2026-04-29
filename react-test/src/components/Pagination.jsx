import React from 'react';

export default function Pagination({ pagination, onPageChange }) {
  const { page, totalPages } = pagination;

  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (page <= 4) {
        pages.push(1, 2, 3, 4, 5, '...', totalPages);
      } else if (page >= totalPages - 3) {
        pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', page - 1, page, page + 1, '...', totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="pagination">
      <button 
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
      >
        Trước
      </button>

      {getPageNumbers().map((item, index) => (
        <button
          key={index}
          className={`${page === item ? 'active' : ''} ${item === '...' ? 'dots' : ''}`}
          onClick={() => item !== '...' && onPageChange(item)}
          disabled={item === '...'}
        >
          {item}
        </button>
      ))}

      <button 
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        Sau
      </button>
    </div>
  );
}
