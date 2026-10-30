import { useState } from "react";
import {
  MapPin,
  ThumbsUp,
  Clock,
  Building2,
  AlertTriangle,
  ChevronRight,
  CheckCircle2,
  Loader2,
  HelpCircle,
} from "lucide-react";
import { reportService } from "../services/reportService";

const STATUS_CONFIG = {
  "Menunggu Verifikasi": {
    badge: "badge-waiting",
    icon: HelpCircle,
    dot: "bg-amber-400",
  },
  "Sedang Dikerjakan": {
    badge: "badge-progress",
    icon: Loader2,
    dot: "bg-sky-400",
  },
  Selesai: {
    badge: "badge-done",
    icon: CheckCircle2,
    dot: "bg-emerald-400",
  },
};

const CATEGORY_COLORS = {
  "Jalan & Jembatan": "bg-orange-50 text-orange-700 border-orange-200",
  "Lampu PJU": "bg-yellow-50 text-yellow-700 border-yellow-200",
  "Trotoar & Halte": "bg-purple-50 text-purple-700 border-purple-200",
  "Taman & Drainase": "bg-green-50 text-green-700 border-green-200",
  "Fasilitas Sekolah": "bg-blue-50 text-blue-700 border-blue-200",
};

export default function ReportCard({ report, onClick, onUpvote }) {
  const [upvoted, setUpvoted] = useState(false);
  const [localUpvotes, setLocalUpvotes] = useState(report.upvotes);

  const statusCfg = STATUS_CONFIG[report.status] || STATUS_CONFIG["Menunggu Verifikasi"];
  const catColor = CATEGORY_COLORS[report.category] || "bg-slate-50 text-slate-600 border-slate-200";

  const handleUpvote = (e) => {
    e.stopPropagation();
    if (upvoted) return;
    const updated = reportService.upvote(report.id);
    setLocalUpvotes(updated.upvotes);
    setUpvoted(true);
    if (onUpvote) onUpvote(updated);
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div
      className="card overflow-hidden hover:border-teal-200 hover:shadow-md transition-all duration-200 cursor-pointer group flex flex-col"
      onClick={onClick}
    >
      {/* Image */}
      <div className="relative h-44 overflow-hidden bg-slate-100">
        {report.photoBefore ? (
          <img
            src={report.photoBefore}
            alt={report.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/reports/fallback-laporan.svg";
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-slate-100">
            <AlertTriangle size={32} className="text-slate-300" />
          </div>
        )}

        {/* Status badge on image */}
        <div className="absolute top-3 left-3">
          <span className={`${statusCfg.badge} shadow-sm`}>{report.status}</span>
        </div>

        {/* Urgent badge */}
        {localUpvotes >= 20 && (
          <div className="absolute top-3 right-3">
            <span className="badge-urgent shadow-sm">
              <AlertTriangle size={10} />
              Prioritas Mendesak
            </span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col flex-1">
        {/* Category & ID */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${catColor}`}
          >
            {report.category}
          </span>
          <span className="text-xs font-mono text-slate-400">
            #{report.id}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-sm font-semibold text-slate-900 mb-2 leading-snug line-clamp-2 flex-1">
          {report.title}
        </h3>

        {/* Location & Dinas */}
        <div className="space-y-1 mb-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <MapPin size={12} className="shrink-0 text-slate-400" />
            <span className="truncate">{report.location}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Building2 size={12} className="shrink-0 text-slate-400" />
            <span className="truncate">{report.dinas}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Clock size={12} className="shrink-0 text-slate-400" />
            <span>{formatDate(report.reportDate)}</span>
          </div>
        </div>

        {/* Footer: Upvote & Detail */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <button
            onClick={handleUpvote}
            className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border transition-all duration-150 ${
              upvoted
                ? "bg-teal-50 text-teal-700 border-teal-200"
                : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-teal-50 hover:text-teal-700 hover:border-teal-200"
            }`}
          >
            <ThumbsUp
              size={13}
              className={upvoted ? "fill-teal-600" : ""}
            />
            <span>{localUpvotes} Dukung</span>
          </button>
          <button className="flex items-center gap-1 text-xs text-teal-700 font-medium hover:text-teal-900 transition-colors">
            Lihat Detail
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
