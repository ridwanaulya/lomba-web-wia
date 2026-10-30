import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Shield,
  LogOut,
  ThumbsUp,
  Clock,
  CheckCircle2,
  Loader2,
  HelpCircle,
  ChevronDown,
  Save,
  X,
  AlertTriangle,
  Building2,
  MapPin,
  User,
  FileText,
  Image,
  SortAsc,
} from "lucide-react";
import { authService } from "../services/authService";
import { reportService } from "../services/reportService";

const STATUS_FLOW = ["Menunggu Verifikasi", "Sedang Dikerjakan", "Selesai"];

const STATUS_BADGE = {
  "Menunggu Verifikasi": "badge-waiting",
  "Sedang Dikerjakan": "badge-progress",
  Selesai: "badge-done",
};

const STATUS_ICON = {
  "Menunggu Verifikasi": HelpCircle,
  "Sedang Dikerjakan": Loader2,
  Selesai: CheckCircle2,
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const user = authService.getSession();
  const [reports, setReports] = useState(() =>
    reportService.getAll().sort((a, b) => b.upvotes - a.upvotes)
  );
  const [selectedId, setSelectedId] = useState(null);
  const [actionForm, setActionForm] = useState({
    status: "",
    note: "",
    photoAfter: "",
  });
  const [saved, setSaved] = useState(false);

  const selectedReport = useMemo(
    () => reports.find((r) => r.id === selectedId) || null,
    [reports, selectedId]
  );

  const stats = useMemo(() => {
    const total = reports.length;
    const menunggu = reports.filter((r) => r.status === "Menunggu Verifikasi").length;
    const dikerjakan = reports.filter((r) => r.status === "Sedang Dikerjakan").length;
    const selesai = reports.filter((r) => r.status === "Selesai").length;
    return { total, menunggu, dikerjakan, selesai };
  }, [reports]);

  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  const openAction = (report) => {
    setSelectedId(report.id);
    setActionForm({ status: report.status, note: "", photoAfter: report.photoAfter || "" });
    setSaved(false);
  };

  const handleSave = () => {
    if (!actionForm.note.trim()) {
      alert("Catatan tindak lanjut wajib diisi.");
      return;
    }
    const updated = reportService.updateStatus(
      selectedId,
      actionForm.status,
      actionForm.note.trim(),
      actionForm.photoAfter || null
    );
    setReports((prev) =>
      prev
        .map((r) => (r.id === updated.id ? updated : r))
        .sort((a, b) => b.upvotes - a.upvotes)
    );
    setSaved(true);
    setTimeout(() => {
      setSelectedId(null);
      setSaved(false);
    }, 1500);
  };

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Admin Header */}
      <div className="bg-teal-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-teal-600 rounded-lg flex items-center justify-center border border-teal-500">
                <Shield size={18} />
              </div>
              <div>
                <p className="font-bold text-sm leading-none">JagaKota · Portal Admin</p>
                <p className="text-teal-200 text-xs mt-0.5">
                  {user.name} · {user.dinas}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-xs text-teal-200 hover:text-white px-3 py-1.5 rounded-lg hover:bg-teal-600 transition-colors border border-teal-600"
            >
              <LogOut size={13} />
              Keluar
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Info */}
        <div className="mb-6">
          <h1 className="text-xl font-bold text-slate-900">Dashboard Pengelolaan Laporan</h1>
          <p className="text-slate-500 text-sm mt-1">
            Laporan diurutkan dari upvote tertinggi (prioritas paling mendesak di atas).
          </p>
        </div>

        {/* Admin Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Total Laporan", value: stats.total, color: "text-slate-700", bg: "bg-slate-100", icon: FileText },
            { label: "Menunggu Verifikasi", value: stats.menunggu, color: "text-amber-700", bg: "bg-amber-100", icon: HelpCircle },
            { label: "Sedang Dikerjakan", value: stats.dikerjakan, color: "text-sky-700", bg: "bg-sky-100", icon: Loader2 },
            { label: "Selesai", value: stats.selesai, color: "text-emerald-700", bg: "bg-emerald-100", icon: CheckCircle2 },
          ].map(({ label, value, color, bg, icon: Icon }) => (
            <div key={label} className="card p-4">
              <div className={`w-9 h-9 ${bg} rounded-lg flex items-center justify-center mb-2`}>
                <Icon size={16} className={color} />
              </div>
              <p className="text-xl font-bold text-slate-900">{value}</p>
              <p className="text-xs text-slate-500">{label}</p>
            </div>
          ))}
        </div>

        {/* Sort info */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-3 font-medium">
          <SortAsc size={13} />
          Diurutkan: Upvote Tertinggi → Prioritas Penanganan Paling Mendesak
        </div>

        {/* Reports Table */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Laporan</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden md:table-cell">Kategori & Lokasi</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden sm:table-cell">
                    <ThumbsUp size={12} className="inline mr-1" />
                    Upvote
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden lg:table-cell">Tanggal</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {reports.map((r) => {
                  const StatusIcon = STATUS_ICON[r.status];
                  return (
                    <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3">
                        <p className="font-mono text-xs text-slate-400 mb-0.5">#{r.id}</p>
                        <p className="font-semibold text-slate-800 text-xs leading-snug line-clamp-2 max-w-xs">
                          {r.title}
                        </p>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <p className="text-xs text-slate-600 font-medium">{r.category}</p>
                        <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                          <MapPin size={10} />
                          {r.location}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`${STATUS_BADGE[r.status]} whitespace-nowrap`}>
                          <StatusIcon size={10} />
                          {r.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <div className="flex items-center gap-1">
                          <ThumbsUp size={12} className="text-slate-400" />
                          <span className="font-semibold text-slate-700">{r.upvotes}</span>
                          {r.upvotes >= 20 && (
                            <AlertTriangle size={12} className="text-red-500 ml-1" />
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <span className="text-xs text-slate-500">{formatDate(r.reportDate)}</span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => openAction(r)}
                          className="text-xs font-medium text-teal-700 hover:text-teal-900 bg-teal-50 hover:bg-teal-100 border border-teal-200 px-3 py-1.5 rounded-lg transition-colors"
                        >
                          Tindak Lanjut
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Action Modal */}
      {selectedReport && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
          onClick={() => setSelectedId(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-slate-200 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between p-5 border-b border-slate-100">
              <div>
                <p className="text-xs font-mono text-slate-400 mb-0.5">#{selectedReport.id}</p>
                <h3 className="text-base font-bold text-slate-900 leading-snug line-clamp-2">
                  {selectedReport.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedId(null)}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors ml-3 shrink-0"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-5 space-y-4">
              {/* Info */}
              <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
                <div className="flex items-center gap-1.5"><MapPin size={12} className="text-slate-400" />{selectedReport.location}</div>
                <div className="flex items-center gap-1.5"><Building2 size={12} className="text-slate-400" />{selectedReport.dinas}</div>
                <div className="flex items-center gap-1.5"><User size={12} className="text-slate-400" />{selectedReport.reporter}</div>
                <div className="flex items-center gap-1.5"><ThumbsUp size={12} className="text-slate-400" />{selectedReport.upvotes} dukungan</div>
              </div>

              {/* Status */}
              <div>
                <label className="label flex items-center gap-1.5">
                  <Clock size={13} />
                  Ubah Status
                </label>
                <div className="space-y-2">
                  {STATUS_FLOW.map((s) => {
                    const Icon = STATUS_ICON[s];
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setActionForm((prev) => ({ ...prev, status: s }))}
                        className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                          actionForm.status === s
                            ? "bg-teal-50 border-teal-400 text-teal-800"
                            : "bg-white border-slate-200 text-slate-600 hover:border-teal-200"
                        }`}
                      >
                        <Icon size={15} className={actionForm.status === s ? "text-teal-600" : "text-slate-400"} />
                        {s}
                        {actionForm.status === s && (
                          <span className="ml-auto text-xs font-semibold text-teal-600">✓ Dipilih</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Note */}
              <div>
                <label className="label flex items-center gap-1.5">
                  <FileText size={13} />
                  Catatan Tindak Lanjut <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={actionForm.note}
                  onChange={(e) => setActionForm((prev) => ({ ...prev, note: e.target.value }))}
                  placeholder="Tuliskan catatan resmi tindak lanjut petugas..."
                  rows={3}
                  className="input-field resize-none"
                />
              </div>

              {/* Photo After */}
              {actionForm.status === "Selesai" && (
                <div>
                  <label className="label flex items-center gap-1.5">
                    <Image size={13} />
                    URL Foto Sesudah Perbaikan
                  </label>
                  <input
                    type="url"
                    value={actionForm.photoAfter}
                    onChange={(e) => setActionForm((prev) => ({ ...prev, photoAfter: e.target.value }))}
                    placeholder="https://... (foto bukti setelah diperbaiki)"
                    className="input-field"
                  />
                  {!actionForm.photoAfter && (
                    <button
                      type="button"
                      className="mt-1.5 text-xs text-teal-600 hover:underline"
                      onClick={() => setActionForm((prev) => ({
                        ...prev,
                        photoAfter: "/reports/jalan-aspal-selesai.svg"
                      }))}
                    >
                      + Gunakan foto contoh (demo)
                    </button>
                  )}
                </div>
              )}

              {/* Actions */}
              {saved ? (
                <div className="flex items-center justify-center gap-2 py-3 text-emerald-600 font-semibold text-sm bg-emerald-50 rounded-xl">
                  <CheckCircle2 size={16} />
                  Berhasil disimpan! Halaman publik sudah diperbarui.
                </div>
              ) : (
                <div className="flex gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => setSelectedId(null)}
                    className="btn-secondary flex-1 justify-center"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    onClick={handleSave}
                    className="btn-primary flex-1 justify-center"
                  >
                    <Save size={14} />
                    Simpan Perubahan
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
