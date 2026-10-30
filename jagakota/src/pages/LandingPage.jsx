import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  CheckCircle2,
  Loader2,
  HelpCircle,
  TrendingUp,
  ArrowRight,
  Shield,
  Users,
  Clock,
  Building2,
  MapPin,
  Camera,
  Check,
} from "lucide-react";
import { reportService } from "../services/reportService";
import ReportCard from "../components/ReportCard";
import ReportDetailModal from "../components/ReportDetailModal";
import BeforeAfterSlider from "../components/BeforeAfterSlider";

export default function LandingPage() {
  const [reports, setReports] = useState(() => reportService.getAll());
  const [selectedReport, setSelectedReport] = useState(null);
  const navigate = useNavigate();

  const stats = useMemo(() => reportService.getStats(), [reports]);

  const topReports = useMemo(
    () => [...reports].sort((a, b) => b.upvotes - a.upvotes).slice(0, 3),
    [reports]
  );

  const completedReports = useMemo(
    () => reports.filter((r) => r.status === "Selesai" && r.photoBefore && r.photoAfter),
    [reports]
  );

  const handleReportUpdate = (updated) => {
    setReports((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ── HERO SECTION ── */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <div className="max-w-3xl mx-auto text-center">
            {/* Tagline Pill */}
            <div className="inline-flex items-center gap-2 bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold px-4 py-1.5 rounded-full mb-6 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-600"></span>
              </span>
              <span>PORTAL TRANSPARANSI &amp; AKUNTABILITAS FASILITAS KOTA</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4">
              Transparansi Warga,<br />
              <span className="text-teal-700">Wujudkan Kota Terjaga</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto mb-8">
              Kawal dan pantau perbaikan fasilitas publik kota secara terbuka. Setiap aduan
              diverifikasi, direspon dengan standar SLA terukur, dan dibuktikan lewat dokumentasi
              Before &amp; After yang dapat diaudit publik.
            </p>

            {/* Call to Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-8">
              <button
                onClick={() => navigate("/lapor")}
                className="w-full sm:w-auto px-6 py-3.5 bg-teal-700 hover:bg-teal-800 text-white text-sm font-bold rounded-xl shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Camera size={18} />
                Laporkan Fasilitas Rusak
              </button>
              <button
                onClick={() => navigate("/laporan")}
                className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-sm font-semibold rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                Jelajah Semua Laporan
                <ArrowRight size={18} />
              </button>
            </div>

            {/* Value Highlights */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-6 border-t border-slate-100 text-xs text-slate-500">
              <div className="flex items-center gap-1.5 font-medium text-slate-600">
                <Check size={14} className="text-teal-600" />
                <span>100% Transparan &amp; Terbuka</span>
              </div>
              <span className="text-slate-300">•</span>
              <div className="flex items-center gap-1.5 font-medium text-slate-600">
                <Check size={14} className="text-teal-600" />
                <span>Tanpa Perlu Login</span>
              </div>
              <span className="text-slate-300">•</span>
              <div className="flex items-center gap-1.5 font-medium text-slate-600">
                <Check size={14} className="text-teal-600" />
                <span>Dokumentasi Before &amp; After</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS METRICS ROW ── */}
      <section className="bg-white border-b border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {[
              {
                label: "Total Laporan Masuk",
                value: stats.total,
                sub: "Semua aduan terdaftar",
                icon: FileText,
                color: "text-slate-800",
                bg: "bg-slate-100",
              },
              {
                label: "Menunggu Verifikasi",
                value: stats.menunggu,
                sub: "Dalam antrean tinjau dinas",
                icon: HelpCircle,
                color: "text-amber-700",
                bg: "bg-amber-100",
              },
              {
                label: "Sedang Dikerjakan",
                value: stats.dikerjakan,
                sub: "Pekerjaan fisik lapangan",
                icon: Loader2,
                color: "text-sky-700",
                bg: "bg-sky-100",
              },
              {
                label: "Tingkat Penyelesaian",
                value: `${stats.tingkatPenyelesaian}%`,
                sub: `${stats.selesai} fasilitas selesai tuntas`,
                icon: TrendingUp,
                color: "text-emerald-700",
                bg: "bg-emerald-100",
              },
            ].map(({ label, value, sub, icon: Icon, color, bg }) => (
              <div
                key={label}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:border-slate-300 transition-colors flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    {label}
                  </span>
                  <div className={`w-9 h-9 rounded-lg ${bg} flex items-center justify-center`}>
                    <Icon size={18} className={color} />
                  </div>
                </div>
                <div>
                  <p className="text-3xl font-extrabold text-slate-900 tracking-tight">{value}</p>
                  <p className="text-xs text-slate-500 mt-1">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BENTO GRID: 3 LANGKAH TRANSPARANSI ── */}
      <section className="py-16 md:py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-12">
            <span className="text-xs font-bold text-teal-700 uppercase tracking-wider mb-2 block">
              Protokol Akuntabilitas Warga
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              3 Langkah Mewujudkan Kota Terjaga
            </h2>
            <p className="text-slate-600 text-sm mt-2">
              Mudah, transparan, tanpa registrasi berbelit, dan dapat diaudit oleh seluruh masyarakat.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step: "01",
                badge: "Tanpa Perlu Login",
                badgeColor: "bg-teal-50 text-teal-700 border-teal-200",
                icon: Camera,
                title: "Lapor & Unggah Foto",
                desc: "Warga memotret kerusakan fasilitas umum, menentukan patokan lokasi kecamatan, dan mengisi deskripsi laporan secara terbuka.",
                point: "Diteruskan ke dinas berwenang",
              },
              {
                step: "02",
                badge: "Kekuatan Komunitas",
                badgeColor: "bg-sky-50 text-sky-700 border-sky-200",
                icon: Users,
                title: "Dukungan Upvote Warga",
                desc: "Warga sekitar memberikan dukungan suara (upvote). Laporan dengan upvote tinggi secara otomatis naik prioritas menjadi status Mendesak.",
                point: "Algoritma prioritas berbasis suara publik",
              },
              {
                step: "03",
                badge: "Akuntabilitas Penuh",
                badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
                icon: CheckCircle2,
                title: "Pantau Timeline & Bukti Nyata",
                desc: "Pantau setiap tahapan perbaikan dengan tanggal, waktu, dan catatan resmi petugas dinas. Bukti foto Before & After diunggah transparan.",
                point: "Verifikasi visual anti-laporan fiktif",
              },
            ].map(({ step, badge, badgeColor, icon: Icon, title, desc, point }) => (
              <div
                key={step}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between relative overflow-hidden group hover:border-teal-300 transition-all duration-200"
              >
                <div className="absolute top-4 right-4 text-5xl font-black text-slate-100 select-none group-hover:text-teal-50 transition-colors">
                  {step}
                </div>
                <div>
                  <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-700 mb-4 shadow-xs">
                    <Icon size={24} />
                  </div>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${badgeColor} mb-3`}
                  >
                    {badge}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 mb-2 leading-snug">{title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-4">{desc}</p>
                </div>
                <div className="pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-medium text-slate-500">
                  <Check size={14} className="text-teal-600 shrink-0" />
                  <span>{point}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SEKSI BUKTI AKUNTABILITAS (BEFORE VS AFTER) ── */}
      <section className="py-16 md:py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <div className="flex items-center gap-2 text-teal-700 text-xs font-bold uppercase tracking-wider mb-2">
                <CheckCircle2 size={16} />
                <span>Dokumentasi Pembuktian Lapangan</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Bukti Akuntabilitas (Before vs After)
              </h2>
            </div>
            <p className="text-slate-600 text-sm max-w-md">
              Bukan sekadar klaim tertutup—berikut adalah bukti fisik perbaikan fasilitas yang
              berhasil dituntaskan oleh dinas terkait berkat aduan warga.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {completedReports.slice(0, 2).map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-teal-700">#{item.id}</span>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Selesai Diperbaiki
                      </span>
                    </div>
                    <span className="text-xs text-slate-400 font-medium">{item.location}</span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mb-3 leading-snug">
                    {item.title}
                  </h3>

                  {/* Interactive Before/After Comparison Slider */}
                  <div className="mb-4">
                    <BeforeAfterSlider
                      beforeSrc={item.photoBefore}
                      afterSrc={item.photoAfter}
                      beforeLabel="Sebelum"
                      afterLabel="Sesudah"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <Building2 size={14} className="text-teal-600" />
                    <span className="font-medium text-slate-800">{item.dinas}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock size={14} className="text-teal-600" />
                    <span>Diselesaikan dalam waktu terverifikasi</span>
                  </div>
                  <button
                    onClick={() => setSelectedReport(item)}
                    className="text-xs font-bold text-teal-700 hover:text-teal-900 transition-colors ml-auto flex items-center gap-1"
                  >
                    Lihat Timeline
                    <ArrowRight size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DAFTAR 3 LAPORAN PRIORITAS TERTINGGI ── */}
      <section className="py-16 md:py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-bold text-teal-700 uppercase tracking-wider mb-2 block">
                Suara Terbanyak Warga
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Laporan Prioritas Tertinggi
              </h2>
              <p className="text-slate-600 text-sm mt-1">
                Laporan fasilitas publik dengan dukungan upvote komunitas tertinggi yang butuh perhatian segera.
              </p>
            </div>
            <button
              onClick={() => navigate("/laporan")}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-lg text-sm font-semibold shadow-xs transition-colors shrink-0 cursor-pointer"
            >
              Lihat Semua Laporan
              <ArrowRight size={15} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {topReports.map((report) => (
              <ReportCard
                key={report.id}
                report={report}
                onClick={() => setSelectedReport(report)}
                onUpvote={handleReportUpdate}
              />
            ))}
          </div>

          <div className="mt-8 text-center sm:hidden">
            <button
              onClick={() => navigate("/laporan")}
              className="w-full py-3 bg-white border border-slate-300 rounded-xl text-slate-800 text-sm font-semibold shadow-xs flex items-center justify-center gap-2"
            >
              Lihat Semua Laporan ({reports.length})
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="py-16 bg-teal-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="w-12 h-12 rounded-2xl bg-teal-700 flex items-center justify-center mx-auto mb-4 border border-teal-600">
            <Shield size={24} className="text-teal-200" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-3">
            Temukan Fasilitas Rusak di Lingkunganmu?
          </h2>
          <p className="text-teal-100 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto mb-8">
            Jangan biarkan jalan berlubang, lampu padam, atau fasilitas sekolah rusak tanpa
            kepastian perbaikan. Ambil foto dan laporkan sekarang untuk dikawal bersama.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => navigate("/lapor")}
              className="w-full sm:w-auto px-6 py-3 bg-white hover:bg-teal-50 text-teal-900 text-sm font-bold rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Camera size={16} />
              Buat Laporan Baru Sekarang
            </button>
            <button
              onClick={() => navigate("/laporan")}
              className="w-full sm:w-auto px-6 py-3 bg-teal-900/60 hover:bg-teal-900 text-white border border-teal-600 text-sm font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              Jelajah Peta Aduan
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* ── DETAIL MODAL POPUP ── */}
      {selectedReport && (
        <ReportDetailModal
          report={selectedReport}
          onClose={() => setSelectedReport(null)}
          onUpdate={handleReportUpdate}
        />
      )}
    </div>
  );
}
