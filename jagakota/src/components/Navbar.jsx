import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Shield,
  Menu,
  X,
  MapPin,
  BarChart2,
  FileText,
  Home,
  LogIn,
  Plus,
} from "lucide-react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const navLinks = [
    { to: "/", label: "Beranda", icon: Home },
    { to: "/laporan", label: "Jelajah Laporan", icon: MapPin },
    { to: "/lapor", label: "Buat Laporan", icon: FileText },
    { to: "/statistik", label: "Statistik & Rapor", icon: BarChart2 },
  ];

  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname === path || location.pathname.startsWith(path + "/");
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="w-9 h-9 bg-teal-700 rounded-xl flex items-center justify-center shadow-xs group-hover:bg-teal-800 transition-colors">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-base font-extrabold text-slate-900 tracking-tight leading-tight group-hover:text-teal-800 transition-colors">
                JagaKota
              </span>
              <span className="hidden sm:block text-[11px] font-medium text-slate-500 leading-tight">
                Transparansi Fasilitas Publik
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`px-3.5 py-2 text-sm font-semibold rounded-lg transition-colors duration-150 ${
                  isActive(to)
                    ? "bg-teal-50 text-teal-800"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* CTA & Admin Portal Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => navigate("/lapor")}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              <Plus size={14} />
              Buat Laporan
            </button>
            <Link
              to="/login"
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 hover:text-teal-700 hover:bg-slate-50 rounded-lg border border-slate-200 transition-colors"
            >
              <LogIn size={13} />
              Portal Instansi
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle Navigation Menu"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pb-4 pt-3 shadow-lg">
          <div className="space-y-1">
            {navLinks.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                  isActive(to)
                    ? "bg-teal-50 text-teal-800 font-bold"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                <Icon size={16} className={isActive(to) ? "text-teal-700" : "text-slate-400"} />
                {label}
              </Link>
            ))}
          </div>
          <div className="border-t border-slate-200 mt-3 pt-3 flex flex-col gap-2">
            <button
              onClick={() => {
                navigate("/lapor");
                setMenuOpen(false);
              }}
              className="w-full py-2.5 bg-teal-700 hover:bg-teal-800 text-white text-sm font-bold rounded-lg shadow-xs flex items-center justify-center gap-1.5"
            >
              <Plus size={15} />
              Buat Laporan Baru
            </button>
            <Link
              to="/login"
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-center gap-2 py-2 text-xs font-semibold text-slate-600 hover:text-teal-800 rounded-lg border border-slate-200"
            >
              <LogIn size={14} />
              Portal Login Instansi
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
