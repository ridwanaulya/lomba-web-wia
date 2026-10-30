import { Link } from "react-router-dom";
import { Shield, Heart, MapPin, Building2, ExternalLink } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 mt-auto border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="md:col-span-2 pr-0 md:pr-6">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center">
                <Shield size={16} className="text-white" />
              </div>
              <span className="text-white font-bold text-lg tracking-tight">JagaKota</span>
            </div>
            <p className="text-sm leading-relaxed text-slate-400 max-w-md">
              Platform independen transparansi dan akuntabilitas fasilitas publik berbasis
              partisipasi warga. Kawal integritas kota, cegah proyek fiktif, dan pantau
              realisasi fisik perbaikan bersama.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs text-teal-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-teal-400 inline-block"></span>
              Sistem Terverifikasi Publik • Web In Action 2026
            </div>
          </div>

          {/* Navigasi Utama */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4">Navigasi Utama</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="hover:text-white transition-colors">Beranda</Link>
              </li>
              <li>
                <Link to="/laporan" className="hover:text-white transition-colors">Jelajah Laporan</Link>
              </li>
              <li>
                <Link to="/lapor" className="hover:text-white transition-colors">Buat Laporan Baru</Link>
              </li>
              <li>
                <Link to="/statistik" className="hover:text-white transition-colors">Statistik &amp; Rapor Dinas</Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-teal-400 transition-colors font-medium">Portal Login Petugas</Link>
              </li>
            </ul>
          </div>

          {/* Instansi Terkait */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4">Instansi Terkait</h4>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors cursor-pointer">
                <Building2 size={13} className="text-teal-500" />
                Dinas Bina Marga
              </li>
              <li className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors cursor-pointer">
                <Building2 size={13} className="text-teal-500" />
                Dinas Perhubungan
              </li>
              <li className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors cursor-pointer">
                <Building2 size={13} className="text-teal-500" />
                Dinas Lingkungan Hidup
              </li>
              <li className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors cursor-pointer">
                <Building2 size={13} className="text-teal-500" />
                Dinas Pendidikan
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Sub-footer */}
        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-slate-500 text-center sm:text-left">
            © 2026 JagaKota. Platform Transparansi &amp; Akuntabilitas Pelayanan Publik Indonesia.
          </p>
          <p className="text-xs flex items-center gap-1.5 text-slate-500">
            Dibuat dengan <Heart size={12} className="text-red-400 fill-red-400" /> untuk transparansi masa depan kota
          </p>
        </div>
      </div>
    </footer>
  );
}
