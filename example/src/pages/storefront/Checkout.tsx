import React from 'react';
import { StorefrontShell } from '../../components/layout/Shells';
import { AppButton } from '../../components/ui/AppButton';
import { CreditCard, Truck, ShieldCheck, MapPin, Phone, Mail, User } from 'lucide-react';

export function Checkout() {
  return (
    <StorefrontShell>
      <div className="max-w-7xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold uppercase tracking-tighter mb-16 border-b-2 border-black pb-4">[SCREEN: CHECKOUT_PROCESS]</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Form */}
          <div className="lg:col-span-2 space-y-12">
            {[
              { id: '01', title: 'STEP: CONTACT_INFORMATION', fields: ['INPUT: EMAIL_ADDRESS', 'INPUT: PHONE_NUMBER'] },
              { id: '02', title: 'STEP: SHIPPING_INFORMATION', fields: ['INPUT: FULL_NAME', 'INPUT: STREET_ADDRESS', 'INPUT: CITY_CITY'] },
              { id: '03', title: 'STEP: PAYMENT_GATEWAY', fields: ['SELECTOR: CREDIT_CARD', 'SELECTOR: BANK_TRANSFER'] }
            ].map(step => (
              <div key={step.id} className="wire-box p-10 space-y-8 relative">
                <div className="absolute -top-4 -left-4 w-12 h-12 border-2 border-black bg-white flex items-center justify-center font-bold text-xl">{step.id}</div>
                <div className="flex items-center gap-4 border-b border-black pb-4 ml-6">
                  <h2 className="font-bold text-sm uppercase tracking-widest">{step.title}</h2>
                </div>
                <div className="space-y-6">
                  {step.fields.map(field => (
                    <div key={field} className="space-y-2">
                      <div className="text-[10px] font-bold uppercase text-secondary">{field}</div>
                      <div className="h-12 border border-black w-full bg-ghost/10 flex items-center px-4 text-[10px] text-secondary font-bold">VAL_ENTRY_FIELD_#_{field}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            
            <AppButton size="xl" className="w-full">ACTION: FINALIZE_ORDER_AND_PAY</AppButton>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <div className="wire-box p-8 space-y-8">
              <h3 className="font-bold text-sm uppercase underline decoration-black underline-offset-4">[WIDGET: ORDER_REVIEW]</h3>
              <div className="space-y-4">
                {[1, 2].map(i => (
                  <div key={i} className="flex items-center gap-4 border-b border-black/5 pb-4">
                    <div className="w-12 h-12 img-placeholder shrink-0">IMG</div>
                    <div className="flex-grow">
                      <p className="font-bold text-[10px] uppercase underline italic">Item_Ref_#00{i}</p>
                      <p className="text-[8px] uppercase font-bold text-secondary">Qty: 01 | Sub: $199.00</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-8 border-t-2 border-black space-y-4 text-[10px] font-bold uppercase">
                <div className="flex justify-between">
                  <span>Subtotal_Metric</span>
                  <span>$398.00</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping_Metric</span>
                  <span className="text-green-600 underline">FREE_EST</span>
                </div>
                <div className="pt-4 border-t border-black flex justify-between items-baseline text-lg">
                   <span>Order_Total</span>
                   <span className="underline">$398.00</span>
                </div>
              </div>

              <div className="pt-4 flex justify-center">
                <div className="flex items-center gap-3 text-[8px] font-bold uppercase tracking-widest text-secondary border border-dashed border-secondary p-2">
                   REF: SECURE_PROTOCOL_ENCRYPTED
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </StorefrontShell>
  );
}
