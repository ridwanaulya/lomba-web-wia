import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  User,
  MapPin,
  AlignLeft,
  ImagePlus,
  CheckCircle2,
  ArrowRight,
  Info,
  X,
  UploadCloud,
} from "lucide-react";
import { reportService } from "../services/reportService";

const CATEGORIES = [
  "Jalan & Jembatan",
  "Lampu PJU",
  "Trotoar & Halte",
  "Taman & Drainase",
  "Fasilitas Sekolah",
];

const KECAMATANS = [
  "Kecamatan Gambir",
  "Kecamatan Sawah Besar",
  "Kecamatan Kemayoran",
  "Kecamatan Senen",
  "Kecamatan Cempaka Putih",
  "Kecamatan Johar Baru",
  "Kecamatan Menteng",
  "Kecamatan Tanah Abang",
  "Kecamatan Matraman",
  "Kecamatan Penjaringan",
  "Kecamatan Pademangan",
  "Kecamatan Tanjung Priok",
  "Kecamatan Koja",
  "Kecamatan Cilincing",
  "Kecamatan Kelapa Gading",
  "Kecamatan Mampang Prapatan",
  "Kecamatan Setiabudi",
  "Kecamatan Kebayoran Lama",
  "Kecamatan Kalideres",
  "Kecamatan Cakung",
];

const DINAS_BY_CATEGORY = {
  "Jalan & Jembatan": "Dinas Bina Marga",
  "Lampu PJU": "Dinas Perhubungan",
  "Trotoar & Halte": "Dinas Bina Marga",
  "Taman & Drainase": "Dinas Lingkungan Hidup",
  "Fasilitas Sekolah": "Dinas Pendidikan",
};

const PHOTO_FALLBACK = "/reports/fallback-laporan.svg";

export default function CreateReport() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [form, setForm] = useState({
    reporter: "",
    title: "",
    category: "",
    location: "",
    address: "",
    description: "",
    photoBefore: "",
  });
  const [preview, setPreview] = useState("");
  const [photoFileName, setPhotoFileName] = useState("");
  const [photoError, setPhotoError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [newReport, setNewReport] = useState(null);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
    if (field === "category" && DINAS_BY_CATEGORY[value]) {
      setForm((prev) => ({
        ...prev,
        category: value,
        dinas: DINAS_BY_CATEGORY[value],
      }));
    }
  };

  const processImageFile = (file) => {
    setPhotoError("");
    if (!file.type.startsWith("image/")) {
      setPhotoError("File harus berupa gambar (JPG, PNG, WEBP, dll).");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setPhotoError("Ukuran file maksimal 5MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target.result;
      setPreview(base64);
      setPhotoFileName(file.name);
      setForm((prev) => ({ ...prev, photoBefore: base64 }));
    };
    reader.readAsDataURL(file);
  };

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    if (file) processImageFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processImageFile(file);
  };

  const handleRemovePhoto = () => {
    setPreview("");
    setPhotoFileName("");
    setPhotoError("");
    setForm((prev) => ({ ...prev, photoBefore: "" }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = "Judul laporan wajib diisi.";
    if (!form.category) e.category = "Pilih kategori fasilitas.";
    if (!form.location) e.location = "Pilih kecamatan.";
    if (!form.address.trim()) e.address = "Patokan lokasi wajib diisi.";
    if (!form.description.trim() || form.description.length < 30)
      e.description = "Deskripsi minimal 30 karakter.";
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    const reportData = {
      reporter: form.reporter.trim() || "Anonim",
      title: form.title.trim(),
      category: form.category,
      location: form.location,
      address: form.address.trim(),
      description: form.description.trim(),
      photoBefore: form.photoBefore || PHOTO_FALLBACK,
      dinas: DINAS_BY_CATEGORY[form.category] || "Dinas Bina Marga",
    };

    const created = reportService.add(reportData);
    setNewReport(created);
    setSubmitted(true);
  };

  if (submitted && newReport) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-start justify-center pt-16 px-4">
        <div className="card p-8 max-w-lg w-full text-center">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 size={32} className="text-emerald-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">
            Laporan Berhasil Dikirim!
          </h2>
          <p className="text-slate-500 text-sm mb-6">
            Terima kasih atas partisipasi Anda. Laporan Anda telah berhasil dicatat dan diteruskan ke dinas terkait untuk ditindaklanjuti secara terbuka.
          </p>

          {/* Report Summary */}
          <div className="text-left bg-white border border-slate-100 rounded-xl p-4 mb-6 space-y-2">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Ringkasan Laporan</p>
            <p className="text-sm font-medium text-slate-800">{newReport.title}</p>
            <p className="text-xs text-slate-500">{newReport.category} · {newReport.location}</p>
            <p className="text-xs text-slate-500">Diteruskan ke: <span className="font-medium text-slate-700">{newReport.dinas}</span></p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => navigate("/laporan")}
              className="btn-secondary flex-1 justify-center"
            >
              Jelajah Semua Laporan
            </button>
            <button
              onClick={() => { setSubmitted(false); setForm({ reporter: "", title: "", category: "", location: "", address: "", description: "", photoBefore: "" }); setPreview(""); setPhotoFileName(""); setPhotoError(""); }}
              className="btn-primary flex-1 justify-center"
            >
              Buat Laporan Lagi
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-1">
            Buat Laporan Baru
          </h1>
          <p className="text-slate-500 text-sm">
            Lengkapi form di bawah untuk melaporkan kerusakan fasilitas publik. Tidak perlu login.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Info box */}
        <div className="flex items-start gap-3 bg-teal-50 border border-teal-200 rounded-xl p-4 mb-6">
          <Info size={16} className="text-teal-600 shrink-0 mt-0.5" />
          <p className="text-sm text-teal-700">
            Laporan Anda akan dipublikasikan secara terbuka dan transparan agar warga sekitar dapat memberikan dukungan upvote serta mempercepat respon dari dinas terkait.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Reporter */}
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <User size={15} className="text-teal-600" />
              Identitas Pelapor (Opsional)
            </h3>
            <div>
              <label className="label">Nama Pelapor</label>
              <input
                type="text"
                value={form.reporter}
                onChange={(e) => handleChange("reporter", e.target.value)}
                placeholder="Nama Anda atau kosongkan untuk anonim"
                className="input-field"
              />
              <p className="text-xs text-slate-400 mt-1.5">Jika dikosongkan, laporan akan dikirim sebagai "Anonim".</p>
            </div>
          </div>

          {/* Report Info */}
          <div className="card p-5 space-y-4">
            <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
              <FileText size={15} className="text-teal-600" />
              Informasi Laporan
            </h3>

            <div>
              <label className="label">Judul Laporan <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => handleChange("title", e.target.value)}
                placeholder="Contoh: Jalan Berlubang Besar di Depan SDN 01"
                className={`input-field ${errors.title ? "border-red-300 focus:ring-red-400" : ""}`}
              />
              {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
            </div>

            <div>
              <label className="label">Kategori Fasilitas <span className="text-red-500">*</span></label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => handleChange("category", cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-150 ${
                      form.category === cat
                        ? "bg-teal-700 text-white border-teal-700"
                        : "bg-white text-slate-600 border-slate-200 hover:border-teal-300"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              {errors.category && <p className="text-xs text-red-500 mt-1">{errors.category}</p>}
              {form.category && (
                <p className="text-xs text-teal-600 mt-2 font-medium">
                  📋 Akan diteruskan ke: <span className="font-semibold">{DINAS_BY_CATEGORY[form.category]}</span>
                </p>
              )}
            </div>
          </div>

          {/* Location */}
          <div className="card p-5 space-y-4">
            <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
              <MapPin size={15} className="text-teal-600" />
              Lokasi Kejadian
            </h3>
            <div>
              <label className="label">Kecamatan <span className="text-red-500">*</span></label>
              <select
                value={form.location}
                onChange={(e) => handleChange("location", e.target.value)}
                className={`input-field ${errors.location ? "border-red-300" : ""}`}
              >
                <option value="">-- Pilih Kecamatan --</option>
                {KECAMATANS.map((k) => (
                  <option key={k}>{k}</option>
                ))}
              </select>
              {errors.location && <p className="text-xs text-red-500 mt-1">{errors.location}</p>}
            </div>
            <div>
              <label className="label">Patokan / Alamat Detail <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={form.address}
                onChange={(e) => handleChange("address", e.target.value)}
                placeholder="Contoh: Jl. Merdeka No. 10, depan Alfamart"
                className={`input-field ${errors.address ? "border-red-300" : ""}`}
              />
              {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address}</p>}
            </div>
          </div>

          {/* Description */}
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <AlignLeft size={15} className="text-teal-600" />
              Deskripsi Kerusakan
            </h3>
            <textarea
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Jelaskan kondisi kerusakan secara detail: seberapa parah, dampaknya, sudah berapa lama, dsb. (minimal 30 karakter)"
              rows={5}
              className={`input-field resize-none ${errors.description ? "border-red-300" : ""}`}
            />
            <div className="flex justify-between mt-1.5">
              {errors.description ? (
                <p className="text-xs text-red-500">{errors.description}</p>
              ) : (
                <span />
              )}
              <p className="text-xs text-slate-400 ml-auto">{form.description.length} karakter</p>
            </div>
          </div>

          {/* Photo */}
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <ImagePlus size={15} className="text-teal-600" />
              Foto Kerusakan (Opsional)
            </h3>

            {!preview ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`relative flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded-xl p-8 cursor-pointer transition-all duration-200 ${
                  isDragging
                    ? "border-teal-500 bg-teal-50"
                    : "border-slate-200 bg-slate-50 hover:border-teal-400 hover:bg-teal-50/50"
                }`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                  isDragging ? "bg-teal-100" : "bg-slate-100"
                }`}>
                  <UploadCloud size={22} className={isDragging ? "text-teal-600" : "text-slate-400"} />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-slate-700">
                    {isDragging ? "Lepaskan untuk upload" : "Klik atau seret foto ke sini"}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">JPG, PNG, WEBP · Maks. 5MB</p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileInput}
                  className="hidden"
                />
              </div>
            ) : (
              <div className="relative rounded-xl overflow-hidden border border-slate-200">
                <img
                  src={preview}
                  alt="Preview foto kerusakan"
                  className="w-full h-52 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 px-3 py-2 flex items-center justify-between">
                  <p className="text-xs text-white/90 font-medium truncate max-w-[80%]">
                    📎 {photoFileName || "Foto dipilih"}
                  </p>
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className="w-7 h-7 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full flex items-center justify-center transition-colors"
                  >
                    <X size={14} className="text-white" />
                  </button>
                </div>
              </div>
            )}

            {photoError && (
              <p className="text-xs text-red-500 mt-2 flex items-center gap-1">
                ⚠️ {photoError}
              </p>
            )}
            <p className="text-xs text-slate-400 mt-2">
              Jika tidak ada foto, laporan akan menggunakan foto contoh secara otomatis.
            </p>
          </div>

          <button type="submit" className="btn-primary w-full justify-center py-3 text-base">
            <FileText size={16} />
            Kirim Laporan
            <ArrowRight size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}
