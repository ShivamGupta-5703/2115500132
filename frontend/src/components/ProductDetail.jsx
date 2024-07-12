import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProductDetail = ({ match }) => {
  const [product, setProduct] = useState(null);
  const productId = match.params.productid;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/products/${productId}`);
        setProduct(response.data);
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };
    fetchProduct();
  }, [productId]);

  const handleReloadProduct = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/products/${productId}`);
      setProduct(response.data);
    } catch (error) {
      console.error('Error reloading product:', error);
    }
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 px-4">
      <h2 className="text-3xl font-semibold mb-4">{product.name}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="mb-4">
          <img src={product.image} alt={product.name} className="rounded-lg shadow-lg" />
        </div>
        <div>
          <p className="text-lg mb-2"><strong>Price:</strong> ${product.price}</p>
          <p className="text-lg mb-2"><strong>Rating:</strong> {product.rating}</p>
          <p className="text-lg mb-2"><strong>Company:</strong> {product.company}</p>
          <p className="text-lg mb-2"><strong>Category:</strong> {product.category}</p>
          <p className="text-lg mb-2"><strong>Discount:</strong> {product.discount}%</p>
          <p className="text-lg mb-2"><strong>Description:</strong> {product.description}</p>
          <button
            onClick={handleReloadProduct}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
          >
            Reload Product
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
