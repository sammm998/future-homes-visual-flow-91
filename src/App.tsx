import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MersinPropertySearch from "./pages/MersinPropertySearch";
import './index.css';

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/mersin" element={<MersinPropertySearch />} />
      <Route path="*" element={<div className="p-8">Page not found</div>} />
    </Routes>
  </BrowserRouter>
);

export default App;