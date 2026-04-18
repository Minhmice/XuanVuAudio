import React from 'react';
import { StorefrontShell } from '../../components/layout/Shells';
import { PRODUCTS } from '../../mockData';
import { AppButton } from '../../components/ui/AppButton';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Cart() {
  const [items, setItems] = React.useState([
    { ...PRODUCTS[0], quantity: 1 },
    { ...PRODUCTS[1], quantity: 2 },
  ]);

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <StorefrontShell>
      <div className="max-w-7xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold uppercase tracking-tighter mb-16 border-b-2 border-black pb-4">[SCREEN: SHOPPING_CART_VIEW]</h1>
        
        {items.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            {/* Items List */}
            <div className="lg:col-span-2 space-y-10">
              <div className="space-y-6">
                {items.map((item) => (
                  <div key={item.id} className="wire-box p-6 flex items-center gap-8 group relative overflow-hidden">
                    <div className="w-24 h-24 img-placeholder shrink-0">
                      <div className="text-[10px] font-bold">IMG</div>
                      <img src={item.image} className="absolute inset-0 w-full h-full object-cover opacity-5 grayscale" referrerPolicy="no-referrer" />
                    </div>
                    <div className="flex-grow space-y-2">
                      <div className="text-[9px] font-bold uppercase text-secondary tracking-widest">{item.brand}</div>
                      <Link to={`/products/${item.slug}`} className="font-bold text-sm uppercase underline decoration-black/20 hover:decoration-black">{item.name}</Link>
                      <div className="flex items-center gap-4 mt-2">
                         <div className="flex items-center border border-black p-0.5 bg-ghost">
                           <button className="px-2 font-bold cursor-pointer"> - </button>
                           <span className="px-3 text-[10px] font-bold border-x border-black">{item.quantity}</span>
                           <button className="px-2 font-bold cursor-pointer"> + </button>
                         </div>
                         <button className="text-[9px] font-bold uppercase underline">Remove_Item</button>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg">${item.price}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="space-y-8">
               <div className="wire-box p-8 space-y-8 bg-ghost/20">
                 <h3 className="font-bold text-sm uppercase underline decoration-black underline-offset-4">[WIDGET: ORDER_SUMMARY]</h3>
                 <div className="space-y-4 text-[10px] font-bold uppercase">
                   <div className="flex justify-between">
                     <span>Metric: Subtotal</span>
                     <span>${subtotal}</span>
                   </div>
                   <div className="flex justify-between">
                     <span>Metric: Shipping</span>
                     <span className="text-green-600 underline">FREE_SHIPPING</span>
                   </div>
                   <div className="pt-6 border-t-2 border-black flex justify-between items-baseline text-sm">
                      <span>Grand_Total</span>
                      <span className="text-2xl font-bold">${subtotal}</span>
                   </div>
                 </div>
                 <Link to="/checkout" className="block">
                   <AppButton size="xl" className="w-full">Action: Proceed_To_Payment</AppButton>
                 </Link>
               </div>
               
               <p className="text-[8px] uppercase font-bold text-secondary text-center tracking-widest px-4">
                 REF: SECURE_CHECKOUT_PROTOCOL_VERSION_1.0
               </p>
            </div>
          </div>
        ) : (
          <div className="h-[50vh] flex flex-col items-center justify-center space-y-6">
            <div className="w-20 h-20 border-2 border-dashed border-secondary flex items-center justify-center">
              <ShoppingBag className="w-8 h-8 text-secondary" />
            </div>
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold uppercase underline">Cart_Status: EMPTY</h2>
              <p className="text-secondary text-xs uppercase font-bold">No items detected in local storage.</p>
            </div>
            <Link to="/">
              <AppButton>Action: Return_To_Storefront</AppButton>
            </Link>
          </div>
        )}
      </div>
    </StorefrontShell>
  );
}
