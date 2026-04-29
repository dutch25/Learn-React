import { useState, useCallback } from 'react';
import axios from 'axios';

export default function useProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 6,
    total: 0,
    totalPages: 0
  });

  const fetchProducts = useCallback(async (page = 1, search = '') => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const searchParam = search ? `&search=${encodeURIComponent(search)}` : '';
      const url = token 
        ? `http://localhost:1337/api/products?limit=6&page=${page}&token=${token}${searchParam}`
        : `http://localhost:1337/api/products?limit=6&page=${page}${searchParam}`;
      
      const response = await axios.get(url);
      setProducts(response.data.data);
      setPagination({
        page: response.data.page,
        limit: response.data.limit,
        total: response.data.total,
        totalPages: response.data.totalPages
      });
    }
    catch (err) {
      setError(err.message);
    }
    finally {
      setIsLoading(false);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:1337/api/categories');
      setCategories(response.data);
    } catch (err) {
      console.error('Error fetching categories', err);
    }
  }, []);

  return { products, setProducts, isLoading, error, fetchProducts, pagination, categories, fetchCategories };
}