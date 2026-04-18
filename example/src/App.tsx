import { Routes, Route } from 'react-router-dom';
import { Home } from './pages/storefront/Home';
import { CategoryListing } from './pages/storefront/CategoryListing';
import { ProductDetail } from './pages/storefront/PDP';
import { Cart } from './pages/storefront/Cart';
import { Checkout } from './pages/storefront/Checkout';
import { Dashboard } from './pages/admin/Dashboard';
import { ProductList } from './pages/admin/ProductList';

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export default function App() {
  return (
    <Routes>
      {/* Storefront */}
      <Route path="/" element={<Home />} />
      <Route path="/categories" element={<CategoryListing />} />
      <Route path="/categories/:slug" element={<CategoryListing />} />
      <Route path="/products/:slug" element={<ProductDetail />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<Checkout />} />
      
      {/* Admin */}
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/admin/products" element={<ProductList />} />
      <Route path="/admin/orders" element={<Dashboard />} /> {/* Placeholder */}
      <Route path="/admin/inventory" element={<Dashboard />} /> {/* Placeholder */}
      <Route path="/admin/customers" element={<Dashboard />} /> {/* Placeholder */}

      {/* Fallback */}
      <Route path="*" element={<Home />} />
    </Routes>
  );
}

