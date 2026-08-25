"use client";

import { useEffect, useRef, useState } from "react";

const DESKTOP_WIDTH = 1024;

/**
 * Banner saran mode desktop (hanya HP, tampil setiap refresh).
 * - "Buka Mode Desktop"  → ubah meta viewport ke 1024px dengan skala
 *   auto-fit sehingga layout dirender versi desktop tanpa zoom manual.
 * - "Lanjut di Mode Mobile" / ✕ → tutup banner, tetap mode mobile;
 *   tombol mengambang "Desktop" tersedia untuk berpindah kapan saja.
 * - Saat mode desktop aktif, tombol mengambang "Mobile" untuk kembali.
 */
export default function DesktopHint() {
  const [mounted, setMounted] = useState(false);
  const [show, setShow] = useState(false); // animasi masuk banner
  const [render, setRender] = useState(false); // render DOM banner
  const [dismissed, setDismissed] = useState(false); // sesi ini saja
  const [desktopMode, setDesktopMode] = useState(false);
  const observerRef = useRef(null); // akses sinkron utk disconnect

  // Selalu MUTASI atribut node meta yang ada — JANGAN remove/create node,
  // karena node itu dikelola Next.js (menghapusnya menyebabkan crash
  // "Cannot read properties of null (reading 'removeChild')" saat navigasi).
  const getDesktopViewportContent = () => {
    // Skala agar lebar 1024px langsung pas di layar HP (auto zoom-out)
    const vw = window.screen?.width || window.innerWidth || 360;
    const scale = (vw / DESKTOP_WIDTH).toFixed(4);
    return `width=${DESKTOP_WIDTH}, initial-scale=${scale}, minimum-scale=${scale}, maximum-scale=5.0`;
  };

  const setViewportContent = (content) => {
    let meta = document.querySelector('meta[name="viewport"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "viewport");
      document.head.appendChild(meta);
    }
    if (meta.getAttribute("content") !== content) {
      meta.setAttribute("content", content);
    }
  };

  const applyViewport = (mode) => {
    setViewportContent(
      mode === "desktop"
        ? getDesktopViewportContent()
        : "width=device-width, initial-scale=1"
    );
  };

  // Matikan observer secara SINKRON sebelum viewport diubah ke mobile.
  // Tanpa ini, observer masih aktif dan langsung mengembalikan desktop
  // (bug: "kembali ke mobile tapi tampilan tetap desktop").
  const stopGuarding = () => {
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }
  };

  useEffect(() => {
    setMounted(true);

    const mq = window.matchMedia("(max-width: 767px)");
    const evaluate = () => {
      if (dismissed || desktopMode) return;
      if (mq.matches) {
        setRender(true);
        requestAnimationFrame(() => requestAnimationFrame(() => setShow(true)));
      } else {
        setShow(false);
        setRender(false);
      }
    };

    evaluate();
    mq.addEventListener("change", evaluate);

    // Saat navigasi Next.js, meta viewport bisa ditimpa nilai default.
    // Observer ini memastikan mode desktop tetap terpasang.
    let observer;
    if (desktopMode) {
      const desired = getDesktopViewportContent();
      setViewportContent(desired);
      observer = new MutationObserver(() => {
        const meta = document.querySelector('meta[name="viewport"]');
        if (meta && meta.getAttribute("content") !== desired) {
          setViewportContent(desired);
        }
      });
      observer.observe(document.head, {
        subtree: true,
        childList: true,
        attributes: true,
        attributeFilter: ["content"],
      });
      observerRef.current = observer;
    }

    return () => {
      mq.removeEventListener("change", evaluate);
      if (observer) observer.disconnect();
      observerRef.current = null;
    };
  }, [dismissed, desktopMode]);

  const handleGoDesktop = () => {
    stopGuarding(); // bersihkan observer lama (jika ada)
    applyViewport("desktop");
    setDesktopMode(true);
    setDismissed(true); // banner tidak muncul lagi sesi ini
    setShow(false);
    setTimeout(() => setRender(false), 350);
  };

  const handleStayMobile = () => {
    setDismissed(true);
    setShow(false);
    setTimeout(() => setRender(false), 350);
  };

  const handleBackToMobile = () => {
    stopGuarding(); // PENTING: matikan observer SEBELUM ubah viewport,
    // agar tidak langsung di-balikkan ke desktop lagi.
    applyViewport("mobile");
    setDesktopMode(false);
    setDismissed(true);
  };

  if (!mounted) return null;

  return (
    <>
      {/* ── Banner saran (mode mobile saja) ── */}
      {render && (
        <div
          role="dialog"
          aria-label="Saran tampilan desktop"
          className={`fixed inset-x-3 bottom-3 z-[90] transition-all duration-300 ease-out ${
            show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <div className="relative max-w-md mx-auto">
            {/* Aksen gold di atas kartu */}
            <div
              className="absolute -top-0.5 left-6 right-6 h-1 rounded-full"
              style={{ backgroundColor: "#F2A65A" }}
            />
            <div className="bg-white/95 backdrop-blur-md border border-border rounded-2xl shadow-large p-4 pr-10">
              <div className="flex items-start gap-3">
                {/* Ikon */}
                <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-primary flex items-center justify-center shadow-soft">
                  <span className="material-symbols-outlined text-on-primary text-[24px]">
                    devices
                  </span>
                </div>

                {/* Teks */}
                <div className="flex-1 min-w-0">
                  <p className="font-heading font-bold text-text-primary text-sm leading-snug">
                    Tampilan Terbaik di Mode Desktop
                  </p>
                  <p className="text-text-secondary text-xs leading-relaxed mt-1">
                    Beralih ke tampilan desktop untuk pengalaman terbaik,
                    atau lanjutkan dalam mode mobile.
                  </p>

                  <div className="mt-3 flex items-center gap-2 flex-wrap">
                    <button
                      type="button"
                      onClick={handleGoDesktop}
                      className="inline-flex items-center gap-1.5 gradient-primary-button text-on-primary font-semibold text-xs px-4 py-2 rounded-xl active:scale-[0.98] transition-transform"
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        desktop_windows
                      </span>
                      Buka Mode Desktop
                    </button>
                    <button
                      type="button"
                      onClick={handleStayMobile}
                      className="inline-flex items-center gap-1.5 font-semibold text-xs px-3 py-2 rounded-xl text-text-secondary hover:text-text-primary hover:bg-surface-container-low transition-colors"
                    >
                      Lanjut di Mode Mobile
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Tombol tutup */}
            <button
              type="button"
              onClick={handleStayMobile}
              aria-label="Tutup saran"
              className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-surface-container-low transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        </div>
      )}

      {/* ── Tombol mengambang: kembali ke MOBILE (saat mode desktop aktif) ── */}
      {desktopMode && (
        <button
          type="button"
          onClick={handleBackToMobile}
          aria-label="Kembali ke mode mobile"
          className="fixed bottom-4 right-4 z-[95] inline-flex items-center gap-2 px-4 py-3 rounded-2xl shadow-large text-white text-sm font-semibold active:scale-[0.97] transition-transform"
          style={{ backgroundColor: "#004643" }}
        >
          <span className="material-symbols-outlined text-[18px]">
            smartphone
          </span>
          Mode Mobile
        </button>
      )}

      {/* ── Tombol mengambang: beralih ke DESKTOP (saat di mode mobile,
          setelah user pernah memilih/telah melihat banner) ── */}
      {dismissed && !desktopMode && !render && (
        <button
          type="button"
          onClick={handleGoDesktop}
          aria-label="Buka mode desktop"
          className="fixed bottom-4 right-4 z-[95] inline-flex items-center gap-2 px-4 py-3 rounded-2xl shadow-large text-white text-sm font-semibold active:scale-[0.97] transition-transform"
          style={{ backgroundColor: "#F2A65A" }}
        >
          <span className="material-symbols-outlined text-[18px]">
            desktop_windows
          </span>
          Mode Desktop
        </button>
      )}
    </>
  );
}
