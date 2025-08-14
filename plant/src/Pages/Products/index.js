import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Import category components
import Plants from './Plants';
import Seeds from './Seeds';
import Pots from './Pots';

const ProductRoutes = () => {
  return (
    <Routes>
      {/* Default redirect to plants */}
      <Route path="/" element={<Navigate to="plants" />} />
      <Route path="plants" element={<Plants />} />
      <Route path="seeds" element={<Seeds />} />
      <Route path="pots" element={<Pots />} />
    </Routes>
  );
};

export default ProductRoutes;
