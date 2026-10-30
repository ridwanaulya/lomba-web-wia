import { useState, useRef, useEffect } from "react";

export default function BeforeAfterSlider({ beforeSrc, afterSrc, beforeLabel = "Sebelum", afterLabel = "Sesudah" }) {
  const [sliderPos, setSliderPos] = useState(50);
  const [dragging, setDragging] = useState(false);
  const containerRef = useRef(null);

  const updateSlider = (clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setSliderPos((x / rect.width) * 100);
  };

  useEffect(() => {
    const handleMouseMove = (e) => { if (dragging) updateSlider(e.clientX); };
    const handleMouseUp = () => setDragging(false);
    const handleTouchMove = (e) => { if (dragging && e.touches[0]) updateSlider(e.touches[0].clientX); };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("touchend", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleMouseUp);
    };
  }, [dragging]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-64 rounded-xl overflow-hidden cursor-col-resize select-none border border-slate-200"
      onMouseDown={() => setDragging(true)}
      onTouchStart={() => setDragging(true)}
    >
      {/* After (full) */}
      <img
        src={afterSrc}
        alt={afterLabel}
        className="absolute inset-0 w-full h-full object-cover"
        onError={(e) => { e.target.onerror = null; e.target.src = "/reports/fallback-laporan.svg"; }}
      />
      <div className="absolute top-2 right-3 bg-emerald-600 text-white text-xs font-semibold px-2.5 py-1 rounded-full z-10">
        ✅ {afterLabel}
      </div>

      {/* Before (clipped) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${sliderPos}%` }}
      >
        <img
          src={beforeSrc}
          alt={beforeLabel}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ width: `${100 / (sliderPos / 100)}%`, maxWidth: "none" }}
          onError={(e) => { e.target.onerror = null; e.target.src = "/reports/fallback-laporan.svg"; }}
        />
        <div className="absolute top-2 left-3 bg-red-600 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
          ❌ {beforeLabel}
        </div>
      </div>

      {/* Divider */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg"
        style={{ left: `${sliderPos}%` }}
      >
        <div
          className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full border-2 border-slate-300 shadow-lg flex items-center justify-center cursor-col-resize"
          onMouseDown={(e) => { e.stopPropagation(); setDragging(true); }}
        >
          <span className="text-slate-500 text-xs font-bold select-none">⇔</span>
        </div>
      </div>
    </div>
  );
}
