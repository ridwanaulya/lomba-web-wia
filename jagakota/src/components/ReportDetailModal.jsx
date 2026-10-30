import { useState } from "react";
import { X, MapPin, Building2, User, Calendar, CheckCircle2, Loader2, HelpCircle, Clock, ChevronRight, ThumbsUp, ImageOff } from "lucide-react";
import { reportService } from "../services/reportService";

const STATUS_CONFIG = {
  "Menunggu Verifikasi": { badge: "badge-waiting", icon: HelpCircle, color: "text-amber-600" },
  "Sedang Dikerjakan": { badge: "badge-progress", icon: Loader2, color: "text-sky-600" },
  Selesai: { badge: "badge-done", icon: CheckCircle2, color: "text-emerald-600" },
};

export default function ReportDetailModal({ report, onClose, onUpdate }) {
  const [upvoted, setUpvoted] = useState(false);
  const [localReport, setLocalReport] = useState(report);

  const statusCfg = STATUS_CONFIG[localReport.status] || STATUS_CONFIG["Menunggu Verifikasi"];
  const StatusIcon = statusCfg.icon;

  const handleUpvote = () => {
    if (upvoted) return;
    const updated = reportService.upvote(localReport.id);
    setLocalReport(updated);
    setUpvoted(true);
    if (onUpdate) onUpdate(updated);
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getDuration = () => {
    if (localReport.status !== "Selesai" || localReport.timeline.length < 2) return null;
    const start = new Date(localReport.timeline[0].date);
    const end = new Date(localReport.timeline[localReport.timeline.length - 1].date);
    const diffDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const duration = getDuration();

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-10 bg-slate-900/50 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl border border-slate-200 overflow-hidden my-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-5 border-b border-slate-100">
          <div className="flex-1 pr-4">
            <div className="flex items-center gap-2 mb-2">
              <span className={`${statusCfg.badge}`}>{localReport.status}</span>
              <span className="text-xs font-mono text-slate-400">#{localReport.id}</span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 leading-snug">
              {localReport.title}
            </h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors shrink-0">
            <X size={18} />
          </button>
        </div>

        <div className="p-5 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Meta info */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <MapPin size={14} className="text-slate-400" />
              <span>{localReport.location}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Building2 size={14} className="text-slate-400" />
              <span>{localReport.dinas}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <User size={14} className="text-slate-400" />
              <span>{localReport.reporter}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Calendar size={14} className="text-slate-400" />
              <span>{formatDate(localReport.reportDate)}</span>
            </div>
          </div>

          {/* Description */}
          <div className="bg-slate-50 rounded-xl p-4">
            <p className="text-sm text-slate-700 leading-relaxed">{localReport.description}</p>
          </div>

          {/* Before-After Photos */}
          {localReport.status === "Selesai" && localReport.photoBefore && localReport.photoAfter ? (
            <div>
              <h3 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2">
                <CheckCircle2 size={15} className="text-emerald-600" />
                Bukti Penanganan (Before vs After)
                {duration && (
                  <span className="ml-auto text-xs text-slate-500 font-normal flex items-center gap-1">
                    <Clock size={11} />
                    Diselesaikan dalam {duration} hari
                  </span>
                )}
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl overflow-hidden border border-slate-200">
                  <div className="bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 border-b border-slate-200">
                    ❌ SEBELUM
                  </div>
                  <img
                    src={localReport.photoBefore}
                    alt="Before"
                    className="w-full h-40 object-cover"
                    onError={(e) => { e.target.onerror = null; e.target.src = "/reports/fallback-laporan.svg"; }}
                  />
                </div>
                <div className="rounded-xl overflow-hidden border border-emerald-200">
                  <div className="bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-600 border-b border-emerald-200">
                    ✅ SESUDAH
                  </div>
                  <img
                    src={localReport.photoAfter}
                    alt="After"
                    className="w-full h-40 object-cover"
                    onError={(e) => { e.target.onerror = null; e.target.src = "/reports/fallback-laporan.svg"; }}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div>
              <h3 className="text-sm font-semibold text-slate-800 mb-3">Foto Laporan</h3>
              <div className="rounded-xl overflow-hidden border border-slate-200">
                {localReport.photoBefore ? (
                  <img
                    src={localReport.photoBefore}
                    alt="Foto Laporan"
                    className="w-full h-52 object-cover"
                    onError={(e) => { e.target.onerror = null; e.target.src = "/reports/fallback-laporan.svg"; }}
                  />
                ) : (
                  <div className="w-full h-52 flex items-center justify-center bg-slate-100">
                    <ImageOff size={32} className="text-slate-300" />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Timeline */}
          <div>
            <h3 className="text-sm font-semibold text-slate-800 mb-4">
              Timeline Penanganan
            </h3>
            <div className="space-y-0">
              {localReport.timeline.map((entry, index) => {
                const isLast = index === localReport.timeline.length - 1;
                return (
                  <div key={index} className="flex gap-3">
                    {/* Dot & Line */}
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-3 h-3 rounded-full border-2 shrink-0 mt-1 ${
                          isLast
                            ? "bg-teal-600 border-teal-600"
                            : "bg-white border-slate-300"
                        }`}
                      />
                      {!isLast && (
                        <div className="w-px flex-1 bg-slate-200 my-1" />
                      )}
                    </div>
                    {/* Content */}
                    <div className={`pb-4 flex-1 ${isLast ? "pb-0" : ""}`}>
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-xs font-semibold text-slate-800">
                          {entry.status}
                        </span>
                        <span className="text-xs text-slate-400 shrink-0">
                          {formatDate(entry.date)}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">{entry.note}</p>
                      <p className="text-xs text-teal-600 font-medium mt-1">— {entry.officer}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Upvote */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            <p className="text-xs text-slate-500">Dukung laporan ini agar diprioritaskan:</p>
            <button
              onClick={handleUpvote}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-all duration-150 ${
                upvoted
                  ? "bg-teal-50 text-teal-700 border-teal-200 cursor-default"
                  : "bg-white text-slate-600 border-slate-200 hover:bg-teal-50 hover:text-teal-700 hover:border-teal-200 cursor-pointer"
              }`}
            >
              <ThumbsUp size={14} className={upvoted ? "fill-teal-600" : ""} />
              <span>{localReport.upvotes} Dukung</span>
              {!upvoted && <ChevronRight size={13} className="text-slate-400" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
