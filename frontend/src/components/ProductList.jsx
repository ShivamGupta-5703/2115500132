import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import SortOptions from './SortOptions';
import Dropdown from './Dropdown';

const VALID_COMPANIES = ["AMZ", "FLP", "SNP", "MYN", "AZO"];
const VALID_CATEGORIES = ["Phone", "Computer", "TV", "Earphone", "Tablet", "Charger", "Mouse", "Keypad", "Bluetooth", "Pendrive", "Remote", "Speaker", "Headset", "Laptop", "PC"];


const ProductList = () => {
  const [company, setCompany] = useState('');
  const [category, setCategory] = useState('');
  const [top, setTop] = useState(10);
  const [minPrice, setMinPrice] = useState(1);
  const [maxPrice, setMaxPrice] = useState(10000);
  const [sortBy, setSortBy] = useState('rating');
  const [order, setOrder] = useState('desc');
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/companies/${company}/categories/${category}/products`,
          {
            params: { top, minPrice, maxPrice, sortBy, order },
          }
        );
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error.message);
      }
    };

    fetchProducts();
  }, [company, category, top, minPrice, maxPrice, sortBy, order]);

  const handleSortChange = (e) => {
    const { value } = e.target;
    setSortBy(value);
  };

  const handleOrderChange = (e) => {
    const { value } = e.target;
    setOrder(value);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-2xl font-bold mb-4">Product List</h2>
      <Dropdown label="Company" options={VALID_COMPANIES} value={company} onChange={(e) => setCompany(e.target.value)} />
      <Dropdown label="Category" options={VALID_CATEGORIES} value={category} onChange={(e) => setCategory(e.target.value)} />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <Link key={product.id} to={`/products/${product.id}`}>
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-bold text-gray-900">{product.name}</h3>
                <p className="mt-1 text-sm text-gray-500">{product.description}</p>
                <p className="mt-2 text-sm font-semibold text-gray-900">${product.price}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
      <SortOptions
        options={[
          { label: 'Rating', value: 'rating' },
          { label: 'Price', value: 'price' },
          { label: 'Company', value: 'company' },
          { label: 'Discount', value: 'discount' },
        ]}
        value={sortBy}
        onChange={handleSortChange}
      />
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700">Sort Order</label>
        <div className="mt-1">
          <div className="flex items-center">
            <input
              type="radio"
              id="desc"
              name="order"
              value="desc"
              checked={order === 'desc'}
              onChange={handleOrderChange}
              className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
            />
            <label htmlFor="desc" className="ml-3 block text-sm font-medium text-gray-700">
              Descending
            </label>
          </div>
          <div className="flex items-center mt-2">
            <input
              type="radio"
              id="asc"
              name="order"
              value="asc"
              checked={order === 'asc'}
              onChange={handleOrderChange}
              className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
            />
            <label htmlFor="asc" className="ml-3 block text-sm font-medium text-gray-700">
              Ascending
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
