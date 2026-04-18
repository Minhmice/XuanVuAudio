import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Search, Menu, Headphones, Info, FileText, ChevronRight, Speaker } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';

export function StorefrontShell({ children }: { children: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-surface-base text-text-primary font-body">
      {/* Glow Effect */}
      <div className="hero-glow" />

      {/* Header */}
      <header className="fixed top-0 z-50 w-full bg-surface-base/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-8 h-20 flex items-center justify-between">
          <Link to="/" className="text-2xl font-black tracking-tighter text-text-primary font-headline hover:text-primary transition-colors duration-200">
            OBSIDIAN AUDIO
          </Link>

          <nav className="hidden md:flex items-center space-x-8 font-headline uppercase tracking-wider text-[11px]">
            <Link to="/categories/open-back" className="text-primary border-b-2 border-primary pb-1 px-2 pt-1 rounded-t-sm hover:bg-surface-high transition-all duration-200">Open-Back</Link>
            <Link to="/categories/closed-back" className="text-text-secondary hover:text-text-primary px-2 py-1 rounded-sm hover:bg-surface-high transition-all duration-200">Closed-Back</Link>
            <Link to="/categories/dac-amp" className="text-text-secondary hover:text-text-primary px-2 py-1 rounded-sm hover:bg-surface-high transition-all duration-200">DAC/AMP</Link>
          </nav>

          <div className="flex items-center space-x-6">
            <div className="hidden lg:block text-primary font-headline uppercase tracking-wider text-[11px] hover:text-primary-hover transition-colors cursor-pointer">
              Expert Consultation
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/cart" className="text-text-secondary hover:text-text-primary transition-colors relative">
                <ShoppingCart className="w-5 h-5" />
                <span className="sr-only">Cart</span>
              </Link>
              <button 
                className="md:hidden text-text-secondary"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="md:hidden fixed inset-0 z-40 bg-surface-base p-8 pt-24 space-y-6"
          >
            <Link to="/categories/open-back" onClick={() => setIsMenuOpen(false)} className="block text-2xl font-headline font-bold">Open-Back</Link>
            <Link to="/categories/closed-back" onClick={() => setIsMenuOpen(false)} className="block text-2xl font-headline font-bold">Closed-Back</Link>
            <Link to="/categories/dac-amp" onClick={() => setIsMenuOpen(false)} className="block text-2xl font-headline font-bold">DAC/AMP</Link>
            <button className="absolute top-8 right-8" onClick={() => setIsMenuOpen(false)}>×</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-grow pt-20 z-10 relative">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-surface-low mt-24">
        <div className="max-w-7xl mx-auto px-8 py-24 grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="space-y-4">
            <div className="text-xl font-bold tracking-tighter text-text-primary font-headline">OBSIDIAN AUDIO</div>
            <p className="text-sm text-text-secondary max-w-[300px]">
              Engineering uncompromising audio experiences through precision materials and psychoacoustic research.
            </p>
            <div className="pt-4 text-[11px] text-text-secondary uppercase tracking-wider">
              © 2024 OBSIDIAN AUDIO. PRECISION ENGINEERED SOUND.
            </div>
          </div>
          
          <div className="flex flex-col space-y-3">
            <h4 className="font-headline text-[14px] font-bold text-text-primary uppercase tracking-wider mb-2">Systems</h4>
            <Link to="/engine" className="text-sm text-text-secondary hover:text-primary transition-colors">The Engine</Link>
            <Link to="/guides" className="text-sm text-text-secondary hover:text-primary transition-colors">Buying Guides</Link>
          </div>

          <div className="flex flex-col space-y-3">
            <h4 className="font-headline text-[14px] font-bold text-text-primary uppercase tracking-wider mb-2">Support</h4>
            <Link to="/returns" className="text-sm text-text-secondary hover:text-primary transition-colors">Returns</Link>
            <Link to="/warranty" className="text-sm text-text-secondary hover:text-primary transition-colors">Warranty</Link>
            <Link to="/contact" className="text-sm text-text-secondary hover:text-primary transition-colors">Contact Experts</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

const ADMIN_NAV = [
  { name: 'Dashboard', icon: Headphones, path: '/dashboard' },
  { name: 'Products', icon: Headphones, path: '/admin/products' },
  { name: 'Orders', icon: FileText, path: '/admin/orders' },
  { name: 'Inventory', icon: Speaker, path: '/admin/inventory' },
  { name: 'Customers', icon: Headphones, path: '/admin/customers' },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  return (
    <div className="min-h-screen flex bg-surface-base text-text-primary font-body">
      {/* Sidebar */}
      <aside className="w-64 bg-surface-low hidden lg:flex flex-col p-8 justify-between">
        <div className="space-y-12">
          <div className="text-2xl font-black tracking-tighter text-text-primary font-headline">OBSIDIAN ADM</div>
          
          <nav className="space-y-2">
            {ADMIN_NAV.map((item) => (
              <Link 
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 h-10 px-3 font-headline font-bold uppercase tracking-widest text-[11px] rounded-sm transition-all duration-200",
                  location.pathname === item.path ? "bg-primary text-[#1000a9]" : "text-text-secondary hover:bg-surface-high hover:text-text-primary"
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="bg-surface-high p-4 rounded-sm space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-surface-highest rounded-sm" />
            <div>
              <div className="text-[10px] font-bold uppercase text-text-primary">Admin_User</div>
              <div className="text-[8px] font-bold uppercase text-text-secondary">Level: Expert</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Area */}
      <main className="flex-grow flex flex-col">
        <header className="h-20 bg-surface-base flex items-center justify-between px-8">
          <h2 className="font-headline text-[18px] font-bold uppercase tracking-widest text-text-primary">
            {ADMIN_NAV.find(n => n.path === location.pathname)?.name || 'Admin Control'}
          </h2>
          <div className="text-[11px] font-headline font-bold uppercase tracking-widest text-primary">Status: Obsidian_Live</div>
        </header>
        <div className="p-8 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
