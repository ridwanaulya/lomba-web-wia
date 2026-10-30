import { initialReports } from "../data/initialReports";

const STORAGE_KEY = "jagakota_reports";
const DATA_VERSION_KEY = "jagakota_data_version";
const CURRENT_VERSION = "v5_clean_local_verified_assets_2026";

export const reportService = {
  getAll() {
    try {
      const version = localStorage.getItem(DATA_VERSION_KEY);
      if (version !== CURRENT_VERSION) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initialReports));
        localStorage.setItem(DATA_VERSION_KEY, CURRENT_VERSION);
        return initialReports;
      }
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
      // Initialize with seed data
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialReports));
      localStorage.setItem(DATA_VERSION_KEY, CURRENT_VERSION);
      return initialReports;
    } catch {
      return initialReports;
    }
  },

  getById(id) {
    const reports = this.getAll();
    return reports.find((r) => r.id === id) || null;
  },

  save(reports) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
  },

  add(reportData) {
    const reports = this.getAll();
    const existingIds = reports.map((r) => {
      const num = parseInt(r.id.split("-")[2]);
      return isNaN(num) ? 0 : num;
    });
    const nextNum = existingIds.length > 0 ? Math.max(...existingIds) + 1 : 101;
    const newId = `JGK-2026-${nextNum}`;

    const newReport = {
      id: newId,
      ...reportData,
      status: "Menunggu Verifikasi",
      upvotes: 0,
      priority: "Normal",
      photoAfter: null,
      reportDate: new Date().toISOString(),
      timeline: [
        {
          status: "Laporan Diterima Sistem",
          date: new Date().toISOString(),
          note: "Laporan berhasil diterima dan masuk ke sistem transparansi publik. Menunggu verifikasi petugas.",
          officer: "Sistem Otomatis",
        },
      ],
    };

    const updated = [newReport, ...reports];
    this.save(updated);
    return newReport;
  },

  upvote(id) {
    const reports = this.getAll();
    const updated = reports.map((r) => {
      if (r.id === id) {
        const newUpvotes = r.upvotes + 1;
        return {
          ...r,
          upvotes: newUpvotes,
          priority: newUpvotes >= 30 ? "Mendesak" : newUpvotes >= 20 ? "Prioritas" : "Normal",
        };
      }
      return r;
    });
    this.save(updated);
    return updated.find((r) => r.id === id);
  },

  updateStatus(id, newStatus, note, photoAfter = null) {
    const reports = this.getAll();
    const updated = reports.map((r) => {
      if (r.id === id) {
        const timelineEntry = {
          status: newStatus === "Sedang Dikerjakan" ? "Sedang Dikerjakan" : newStatus === "Selesai" ? "Selesai" : "Verifikasi & Disposisi",
          date: new Date().toISOString(),
          note: note,
          officer: "Petugas Admin Dinas",
        };
        return {
          ...r,
          status: newStatus,
          photoAfter: photoAfter || r.photoAfter,
          timeline: [...r.timeline, timelineEntry],
        };
      }
      return r;
    });
    this.save(updated);
    return updated.find((r) => r.id === id);
  },

  reset() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialReports));
    return initialReports;
  },

  getStats() {
    const reports = this.getAll();
    const total = reports.length;
    const selesai = reports.filter((r) => r.status === "Selesai").length;
    const dikerjakan = reports.filter((r) => r.status === "Sedang Dikerjakan").length;
    const menunggu = reports.filter((r) => r.status === "Menunggu Verifikasi").length;
    const tingkatPenyelesaian = total > 0 ? Math.round((selesai / total) * 100) : 0;

    const byCategory = {};
    const byLocation = {};
    const byDinas = {};

    reports.forEach((r) => {
      byCategory[r.category] = (byCategory[r.category] || 0) + 1;
      byLocation[r.location] = (byLocation[r.location] || 0) + 1;

      if (!byDinas[r.dinas]) {
        byDinas[r.dinas] = { total: 0, selesai: 0 };
      }
      byDinas[r.dinas].total += 1;
      if (r.status === "Selesai") byDinas[r.dinas].selesai += 1;
    });

    return {
      total,
      selesai,
      dikerjakan,
      menunggu,
      tingkatPenyelesaian,
      byCategory,
      byLocation,
      byDinas,
    };
  },
};
