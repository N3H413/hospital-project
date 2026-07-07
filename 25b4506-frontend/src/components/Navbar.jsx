import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Heart } from 'lucide-react';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Brand Anchor Logo - Now wrapped in a proper Link component */}
          <Link to="/" className="flex items-center gap-2 cursor-pointer hover:opacity-90 transition-all select-none">
            <Heart className="w-5 h-5 text-emerald-600 fill-emerald-600" />
            <span className="font-bold text-xl text-slate-800 tracking-tight">HopeCare</span>
          </Link>

          {/* DESKTOP NAVIGATION: Completely hidden on mobile viewports */}
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
            <Link to="/" className="hover:text-emerald-600 transition-colors">Home</Link>
            <Link to="/doctors" className="hover:text-emerald-600 transition-colors">Our Doctors</Link>
            <Link to="/booking" className="hover:text-emerald-600 transition-colors">Book Appointment</Link>
            <Link to="/dashboard" className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 px-4 py-2 rounded-xl transition-all font-semibold">
              My Bookings
            </Link>
          </div>

          {/* MOBILE TOGGLE TRIGGER: Visible ONLY on small displays */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setMenuOpen(!menuOpen)}
              type="button"
              className="text-gray-500 hover:text-gray-800 p-1 focus:outline-none cursor-pointer"
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* MOBILE DRAWER: Vertically stacked options drop downward safely */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-3 space-y-1.5 shadow-md absolute left-0 right-0 z-50">
          <Link to="/" onClick={() => setMenuOpen(false)} className="block py-2.5 px-3 text-sm font-medium text-gray-700 hover:bg-slate-50 rounded-lg">Home</Link>
          <Link to="/doctors" onClick={() => setMenuOpen(false)} className="block py-2.5 px-3 text-sm font-medium text-gray-700 hover:bg-slate-50 rounded-lg">Our Doctors</Link>
          <Link to="/booking" onClick={() => setMenuOpen(false)} className="block py-2.5 px-3 text-sm font-medium text-gray-700 hover:bg-slate-50 rounded-lg">Book Appointment</Link>
          <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="block text-center text-sm font-bold bg-emerald-600 text-white py-2.5 rounded-xl mt-2 shadow-xs">
            My Bookings
          </Link>
        </div>
      )}
    </nav>
  );
}