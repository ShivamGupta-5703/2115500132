import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ProductList from './components/ProductList';
import ProductDetail from './components/ProductDetail';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<ProductList />}/>
          <Route path="/products/:productid" element={<ProductDetail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
