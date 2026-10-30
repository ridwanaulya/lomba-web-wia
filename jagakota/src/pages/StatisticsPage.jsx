import { useState } from "react";
import { useMemo } from "react";
import { BarChart2, Building2, MapPin, Tag, RotateCcw, TrendingUp, CheckCircle2, Clock, AlertTriangle } from "lucide-react";
import { reportService } from "../services/reportService";

function ProgressBar({ value, max, color = "bg-teal-600" }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
        <div
          className={`${color} h-2 rounded-full transition-all duration-700`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs font-semibold text-slate-600 w-8 text-right">{value}</span>
    </div>
  );
}

export default function StatisticsPage() {
  const [reports, setReports] = useState(() => reportService.getAll());
  const stats = useMemo(() => reportService.getStats(), [reports]);

  const handleReset = () => {
    if (window.confirm("Reset semua data ke kondisi awal? Data laporan baru yang dibuat akan hilang.")) {
      reportService.reset();
      setReports(reportService.getAll());
    }
  };

  const sortedCategories = Object.entries(stats.byCategory).sort((a, b) => b[1] - a[1]);
  const sortedLocations = Object.entries(stats.byLocation).sort((a, b) => b[1] - a[1]);
  const sortedDinas = Object.entries(stats.byDinas).sort((a, b) => b[1].total - a[1].total);

  const CATEGORY_COLORS = {
    "Jalan & Jembatan": "bg-orange-500",
    "Lampu PJU": "bg-yellow-500",
    "Trotoar & Halte": "bg-purple-500",
    "Taman & Drainase": "bg-green-500",
    "Fasilitas Sekolah": "bg-blue-500",
  };

  const DINAS_COLORS = {
    "Dinas Bina Marga": "bg-teal-600",
    "Dinas Perhubungan": "bg-sky-600",
    "Dinas Lingkungan Hidup": "bg-emerald-600",
    "Dinas Pendidikan": "bg-indigo-600",
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 mb-1">
                Statistik & Rapor Dinas
              </h1>
              <p className="text-slate-500 text-sm">
                Data terbuka kinerja penanganan fasilitas publik oleh instansi daerah.
              </p>
            </div>
            <span className="badge-done shrink-0">Data Real-Time</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

        {/* Top KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Laporan Masuk", value: stats.total, icon: BarChart2, color: "text-slate-700", bg: "bg-slate-100" },
            { label: "Menunggu Verifikasi", value: stats.menunggu, icon: AlertTriangle, color: "text-amber-700", bg: "bg-amber-100" },
            { label: "Berhasil Diselesaikan", value: stats.selesai, icon: CheckCircle2, color: "text-emerald-700", bg: "bg-emerald-100" },
            { label: "Tingkat Penyelesaian", value: `${stats.tingkatPenyelesaian}%`, icon: TrendingUp, color: "text-teal-700", bg: "bg-teal-100" },
          ].map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} className="card p-5">
              <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center mb-3`}>
                <Icon size={20} className={color} />
              </div>
              <p className="text-2xl font-bold text-slate-900">{value}</p>
              <p className="text-xs text-slate-500 mt-0.5 leading-tight">{label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Rapor Dinas */}
          <div className="card p-6">
            <h3 className="text-sm font-bold text-slate-800 mb-1 flex items-center gap-2">
              <Building2 size={15} className="text-teal-600" />
              Rapor Kinerja Instansi
            </h3>
            <p className="text-xs text-slate-500 mb-5">Persentase laporan yang berhasil diselesaikan oleh tiap dinas.</p>
            <div className="space-y-5">
              {sortedDinas.map(([dinas, data]) => {
                const pct = data.total > 0 ? Math.round((data.selesai / data.total) * 100) : 0;
                const color = DINAS_COLORS[dinas] || "bg-slate-600";
                return (
                  <div key={dinas}>
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-xs font-semibold text-slate-700">{dinas}</span>
                      <span className={`text-xs font-bold ${pct >= 70 ? "text-emerald-600" : pct >= 40 ? "text-amber-600" : "text-red-600"}`}>
                        {pct}%
                      </span>
                    </div>
                    <div className="flex-1 bg-slate-100 rounded-full h-2.5 overflow-hidden">
                      <div
                        className={`${color} h-2.5 rounded-full transition-all duration-700`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-xs text-slate-400">{data.selesai} selesai dari {data.total} laporan</span>
                      <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${pct >= 70 ? "text-emerald-700 bg-emerald-50" : pct >= 40 ? "text-amber-700 bg-amber-50" : "text-red-700 bg-red-50"}`}>
                        {pct >= 70 ? "✓ Baik" : pct >= 40 ? "! Sedang" : "✕ Perlu Peningkatan"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Distribusi Kategori */}
          <div className="card p-6">
            <h3 className="text-sm font-bold text-slate-800 mb-1 flex items-center gap-2">
              <Tag size={15} className="text-teal-600" />
              Distribusi per Kategori Fasilitas
            </h3>
            <p className="text-xs text-slate-500 mb-5">Kategori fasilitas yang paling sering dilaporkan.</p>
            <div className="space-y-4">
              {sortedCategories.map(([cat, count]) => (
                <div key={cat}>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-xs font-semibold text-slate-700">{cat}</span>
                  </div>
                  <ProgressBar
                    value={count}
                    max={stats.total}
                    color={CATEGORY_COLORS[cat] || "bg-slate-500"}
                  />
                </div>
              ))}
            </div>
            {/* Pie-like visual */}
            <div className="mt-5 flex flex-wrap gap-2">
              {sortedCategories.map(([cat, count]) => {
                const pct = Math.round((count / stats.total) * 100);
                return (
                  <div key={cat} className="flex items-center gap-1.5">
                    <div className={`w-2.5 h-2.5 rounded-full ${CATEGORY_COLORS[cat] || "bg-slate-400"}`} />
                    <span className="text-xs text-slate-600">{cat} ({pct}%)</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Distribusi Kecamatan */}
          <div className="card p-6">
            <h3 className="text-sm font-bold text-slate-800 mb-1 flex items-center gap-2">
              <MapPin size={15} className="text-teal-600" />
              Distribusi per Kecamatan
            </h3>
            <p className="text-xs text-slate-500 mb-5">Kecamatan dengan laporan terbanyak.</p>
            <div className="space-y-3">
              {sortedLocations.map(([loc, count], i) => (
                <div key={loc}>
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-400 w-5">#{i + 1}</span>
                      <span className="text-xs font-semibold text-slate-700">{loc.replace("Kecamatan ", "")}</span>
                    </div>
                  </div>
                  <ProgressBar value={count} max={Math.max(...Object.values(stats.byLocation))} />
                </div>
              ))}
            </div>
          </div>

          {/* Status Overview */}
          <div className="card p-6">
            <h3 className="text-sm font-bold text-slate-800 mb-1 flex items-center gap-2">
              <Clock size={15} className="text-teal-600" />
              Ringkasan Status Penanganan
            </h3>
            <p className="text-xs text-slate-500 mb-5">Gambaran keseluruhan progress penanganan laporan.</p>

            {/* Visual donut-like bars */}
            <div className="space-y-4">
              {[
                { label: "Menunggu Verifikasi", value: stats.menunggu, color: "bg-amber-400", textColor: "text-amber-700" },
                { label: "Sedang Dikerjakan", value: stats.dikerjakan, color: "bg-sky-500", textColor: "text-sky-700" },
                { label: "Selesai Diperbaiki", value: stats.selesai, color: "bg-emerald-500", textColor: "text-emerald-700" },
              ].map(({ label, value, color, textColor }) => {
                const pct = stats.total > 0 ? Math.round((value / stats.total) * 100) : 0;
                return (
                  <div key={label}>
                    <div className="flex justify-between mb-1.5">
                      <span className="text-xs font-semibold text-slate-700">{label}</span>
                      <span className={`text-xs font-bold ${textColor}`}>{pct}% ({value})</span>
                    </div>
                    <div className="bg-slate-100 rounded-full h-3 overflow-hidden">
                      <div
                        className={`${color} h-3 rounded-full transition-all duration-700`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 p-4 bg-teal-50 border border-teal-100 rounded-xl">
              <p className="text-xs text-teal-700 font-semibold">Indeks Akuntabilitas Publik</p>
              <p className="text-2xl font-black text-teal-700 mt-1">{stats.tingkatPenyelesaian}%</p>
              <p className="text-xs text-teal-600 mt-0.5">
                {stats.tingkatPenyelesaian >= 70
                  ? "Kinerja Baik – Dinas menunjukkan responsivitas tinggi"
                  : stats.tingkatPenyelesaian >= 40
                  ? "Kinerja Sedang – Masih diperlukan peningkatan"
                  : "Kinerja Rendah – Diperlukan evaluasi menyeluruh"}
              </p>
            </div>
          </div>
        </div>

        {/* Reset Button */}
        <div className="card p-5 border-red-100 bg-red-50/50">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-slate-800">Reset Data Demo</p>
              <p className="text-xs text-slate-500 mt-0.5">
                Kembalikan semua data laporan ke kondisi default awal (untuk keperluan demo/pengujian).
              </p>
            </div>
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-200 rounded-lg hover:bg-red-50 transition-colors shrink-0"
            >
              <RotateCcw size={14} />
              Reset Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
