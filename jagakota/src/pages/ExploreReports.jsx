import { useState, useMemo } from "react";
import { Search, Filter, SlidersHorizontal, X } from "lucide-react";
import { reportService } from "../services/reportService";
import ReportCard from "../components/ReportCard";
import ReportDetailModal from "../components/ReportDetailModal";

const CATEGORIES = [
  "Semua",
  "Jalan & Jembatan",
  "Lampu PJU",
  "Trotoar & Halte",
  "Taman & Drainase",
  "Fasilitas Sekolah",
];
const STATUSES = [
  "Semua",
  "Menunggu Verifikasi",
  "Sedang Dikerjakan",
  "Selesai",
];
const SORTS = ["Upvote Tertinggi", "Terbaru"];

export default function ExploreReports() {
  const [reports, setReports] = useState(() => reportService.getAll());
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Semua");
  const [status, setStatus] = useState("Semua");
  const [sort, setSort] = useState("Upvote Tertinggi");
  const [selectedReport, setSelectedReport] = useState(null);

  const filtered = useMemo(() => {
    let res = [...reports];

    if (search.trim()) {
      const q = search.toLowerCase();
      res = res.filter(
        (r) =>
          r.id.toLowerCase().includes(q) ||
          r.title.toLowerCase().includes(q) ||
          r.location.toLowerCase().includes(q) ||
          r.address?.toLowerCase().includes(q)
      );
    }

    if (category !== "Semua") res = res.filter((r) => r.category === category);
    if (status !== "Semua") res = res.filter((r) => r.status === status);

    if (sort === "Upvote Tertinggi") {
      res.sort((a, b) => b.upvotes - a.upvotes);
    } else {
      res.sort((a, b) => new Date(b.reportDate) - new Date(a.reportDate));
    }

    return res;
  }, [reports, search, category, status, sort]);

  const handleUpdate = (updated) => {
    setReports((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
    if (selectedReport?.id === updated.id) setSelectedReport(updated);
  };

  const clearFilters = () => {
    setSearch("");
    setCategory("Semua");
    setStatus("Semua");
    setSort("Upvote Tertinggi");
  };

  const hasFilters =
    search || category !== "Semua" || status !== "Semua" || sort !== "Upvote Tertinggi";

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Page Header */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-1">
            Jelajah Laporan
          </h1>
          <p className="text-slate-500 text-sm">
            {filtered.length} laporan ditemukan · Gunakan filter untuk mempersempit pencarian.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* FILTERS */}
        <div className="card p-4 mb-6 space-y-4">
          {/* Search */}
          <div className="relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari judul laporan, kategori, atau nama kecamatan..."
              className="input-field pl-10"
            />
          </div>

          {/* Filter Row */}
          <div className="flex flex-wrap gap-2 items-center">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium shrink-0">
              <SlidersHorizontal size={13} />
              Filter:
            </div>

            {/* Category */}
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="text-xs border border-slate-200 rounded-lg px-3 py-1.5 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer"
            >
              {CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>

            {/* Status */}
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="text-xs border border-slate-200 rounded-lg px-3 py-1.5 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer"
            >
              {STATUSES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="text-xs border border-slate-200 rounded-lg px-3 py-1.5 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer"
            >
              {SORTS.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>

            {hasFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 text-xs text-slate-500 hover:text-red-600 px-2 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
              >
                <X size={12} />
                Reset Filter
              </button>
            )}
          </div>

          {/* Active Filter Chips */}
          {(category !== "Semua" || status !== "Semua") && (
            <div className="flex flex-wrap gap-2 pt-1">
              {category !== "Semua" && (
                <span className="inline-flex items-center gap-1 text-xs bg-teal-50 text-teal-700 border border-teal-200 px-2.5 py-1 rounded-full">
                  {category}
                  <button onClick={() => setCategory("Semua")} className="ml-1 hover:text-teal-900">
                    <X size={11} />
                  </button>
                </span>
              )}
              {status !== "Semua" && (
                <span className="inline-flex items-center gap-1 text-xs bg-teal-50 text-teal-700 border border-teal-200 px-2.5 py-1 rounded-full">
                  {status}
                  <button onClick={() => setStatus("Semua")} className="ml-1 hover:text-teal-900">
                    <X size={11} />
                  </button>
                </span>
              )}
            </div>
          )}
        </div>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((r) => (
              <ReportCard
                key={r.id}
                report={r}
                onClick={() => setSelectedReport(r)}
                onUpvote={handleUpdate}
              />
            ))}
          </div>
        ) : (
          <div className="card p-16 text-center">
            <Filter size={32} className="text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">Tidak ada laporan yang cocok</p>
            <p className="text-slate-400 text-sm mt-1">Coba ubah kata kunci atau reset filter.</p>
            <button onClick={clearFilters} className="btn-primary mt-4 mx-auto">
              Reset Filter
            </button>
          </div>
        )}
      </div>

      {selectedReport && (
        <ReportDetailModal
          report={selectedReport}
          onClose={() => setSelectedReport(null)}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
}
