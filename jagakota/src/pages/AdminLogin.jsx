import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Eye, EyeOff, LogIn, Info } from "lucide-react";
import { authService } from "../services/authService";

export default function AdminLogin() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setTimeout(() => {
      const res = authService.login(form.email, form.password);
      if (res.success) {
        navigate("/admin");
      } else {
        setError(res.error);
      }
      setLoading(false);
    }, 600);
  };

  const autoFill = () => {
    setForm({ email: "admin@jagakota.go.id", password: "admin123" });
    setError("");
  };

  const autoFillAndSubmit = () => {
    setLoading(true);
    setError("");
    setTimeout(() => {
      const res = authService.login("admin@jagakota.go.id", "admin123");
      if (res.success) navigate("/admin");
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-teal-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Shield size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Portal Instansi</h1>
          <p className="text-slate-500 text-sm mt-1">
            Masuk sebagai petugas dinas untuk mengelola laporan warga.
          </p>
        </div>

        {/* Demo Info Box */}
        <div className="bg-teal-50 border border-teal-200 rounded-xl p-4 mb-5">
          <div className="flex items-start gap-2 mb-3">
            <Info size={14} className="text-teal-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-teal-800 mb-1">
                🎓 Akun Demo Dewan Juri / Mentor
              </p>
              <p className="text-xs text-teal-700 font-mono bg-white/70 rounded px-2 py-1 mb-0.5">
                Email: admin@jagakota.go.id
              </p>
              <p className="text-xs text-teal-700 font-mono bg-white/70 rounded px-2 py-1">
                Password: admin123
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={autoFillAndSubmit}
            disabled={loading}
            className="w-full bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <LogIn size={13} />
            {loading ? "Memproses..." : "Isi Otomatis & Masuk (Demo Juri)"}
          </button>
        </div>

        {/* Divider */}
        <div className="relative mb-5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>
          <div className="relative text-center">
            <span className="bg-slate-50 px-3 text-xs text-slate-400">atau masuk manual</span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="card p-6 space-y-4">
          <div>
            <label className="label">Email Dinas</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
              placeholder="admin@jagakota.go.id"
              className="input-field"
              required
            />
          </div>
          <div>
            <label className="label">Password</label>
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                value={form.password}
                onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                placeholder="••••••••"
                className="input-field pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2.5">
              <p className="text-xs text-red-600 font-medium">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full justify-center py-2.5"
          >
            {loading ? "Memverifikasi..." : "Masuk"}
          </button>
        </form>

        <p className="text-center text-xs text-slate-400 mt-5">
          Hanya untuk petugas instansi yang berwenang.{" "}
          <button onClick={() => navigate("/")} className="text-teal-600 hover:underline">
            Kembali ke Beranda
          </button>
        </p>
      </div>
    </div>
  );
}
