"use client";

import Image from "next/image";
import { useState, useEffect, useCallback, useRef } from "react";
import { X, ChevronLeft, ChevronRight, ZoomIn, Loader2 } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getMedia } from "@/lib/api/media";
import { useTranslation } from "react-i18next";

const PAGE_SIZE = 20;
const GRID_MAX = 10;
const PREFETCH_THRESHOLD = 5;

// ─── Lightbox ─────────────────────────────────────────────────────────────────
function Lightbox({
  startIndex,
  initialImages,
  totalCount,
  onClose,
  onLoadMore,
}: {
  startIndex: number;
  initialImages: { src: string }[];
  totalCount: number;
  onClose: () => void;
  onLoadMore: (page: number) => Promise<{ src: string }[]>;
}) {
  const [current, setCurrent] = useState(startIndex);
  const [images, setImages] = useState(initialImages);
  const [loadingMore, setLoadingMore] = useState(false);
  const loadedPagesRef = useRef(new Set([1]));
  const autoRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const thumbsRef = useRef<HTMLDivElement>(null);
  const imagesLengthRef = useRef(initialImages.length);

  useEffect(() => {
    imagesLengthRef.current = images.length;
  }, [images.length]);

  const maybeLoadMore = useCallback(
    async (idx: number) => {
      const currentLength = imagesLengthRef.current;
      const remaining = currentLength - idx;
      if (remaining > PREFETCH_THRESHOLD) return;
      if (currentLength >= totalCount) return;

      const nextPage = Math.floor(currentLength / PAGE_SIZE) + 1;
      if (loadedPagesRef.current.has(nextPage)) return;

      loadedPagesRef.current.add(nextPage);
      setLoadingMore(true);
      try {
        const newImgs = await onLoadMore(nextPage);
        setImages((prev) => {
          imagesLengthRef.current = prev.length + newImgs.length;
          return [...prev, ...newImgs];
        });
      } finally {
        setLoadingMore(false);
      }
    },
    [totalCount, onLoadMore]
  );

  const goTo = useCallback(
    (next: number) => {
      const total = Math.max(images.length, totalCount);
      const clamped = (next + total) % total;
      const safeIdx = Math.min(clamped, images.length - 1);
      setCurrent(safeIdx);
      maybeLoadMore(safeIdx);
    },
    [images.length, totalCount, maybeLoadMore]
  );

  const resetAuto = useCallback(() => {
    if (autoRef.current) clearInterval(autoRef.current);
    autoRef.current = setInterval(() => {
      setCurrent((c) => {
        const next = (c + 1) % images.length;
        maybeLoadMore(next);
        return next;
      });
    }, 4000);
  }, [images.length, maybeLoadMore]);

  useEffect(() => {
    resetAuto();
    return () => {
      if (autoRef.current) clearInterval(autoRef.current);
    };
  }, [resetAuto]);

  const manualGoTo = useCallback(
    (next: number) => {
      resetAuto();
      goTo(next);
    },
    [resetAuto, goTo]
  );

  // Scroll thumbnail strip to keep active centered
  useEffect(() => {
    if (!thumbsRef.current) return;
    const THUMB_W = 56;
    const GAP = 8;
    const itemWidth = THUMB_W + GAP;
    const containerWidth = thumbsRef.current.clientWidth;
    const scrollTo = current * itemWidth - containerWidth / 2 + THUMB_W / 2;
    thumbsRef.current.scrollTo({
      left: Math.max(0, scrollTo),
      behavior: "smooth",
    });
  }, [current]);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") manualGoTo(current + 1);
      if (e.key === "ArrowLeft") manualGoTo(current - 1);
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [current, manualGoTo, onClose]);

  const isVisible = (i: number) => Math.abs(i - current) <= 2;

  return (
    <div className="fixed inset-0 z-50 bg-black/92" onClick={onClose}>
      {/* Content */}
      <div
        className="relative z-10 flex flex-col h-full"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top bar */}
        <div className="relative flex items-center justify-center h-14 flex-none">
          <p className="text-white/50 text-sm font-medium tracking-widest">
            <span className="text-white font-semibold">{current + 1}</span>
            {" / "}
            <span>{totalCount}</span>

            {loadingMore && (
              <Loader2
                size={12}
                className="inline ml-2 animate-spin text-white/40"
              />
            )}
          </p>

          <button
            onClick={onClose}
            className="absolute right-5 w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center hover:bg-white/25 transition"
          >
            <X size={18} className="text-white" />
          </button>
        </div>

        {/* Main image area */}
        <div
          className="flex-1 relative flex items-center justify-center px-16 min-h-0"
          onClick={(e) => {
            const target = e.target as HTMLElement;

            console.log(target);

            if (target.closest("button")) {
              return;
            }

            onClose();
          }}
        >
          {/* Prev button */}
          <button
            onClick={() => manualGoTo(current - 1)}
            className="absolute left-4 z-20 w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center hover:bg-white/25 transition"
          >
            <ChevronLeft size={24} className="text-white" />
          </button>

          {/* Image stack */}
          <div className="relative w-full h-full">
            {images.map((img, i) => {
              if (!isVisible(i)) return null;

              return (
                <div
                  key={i}
                  className="absolute inset-0 flex items-center justify-center transition-opacity duration-200"
                  style={{
                    opacity: i === current ? 1 : 0,
                    pointerEvents: i === current ? "auto" : "none",
                  }}
                >
                  <div
                    className="relative max-w-[85vw] max-h-[75vh] mx-auto"
                    style={{
                      width: "85vw",
                      height: "75vh",
                    }}
                  >
                    <Image
                      src={img.src}
                      alt={`gallery ${i + 1}`}
                      fill
                      className="object-contain rounded-xl"
                      priority={i === current}
                      sizes="85vw"
                    />
                  </div>
                </div>
              );
            })}

            {loadingMore && current >= images.length - 1 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 size={40} className="animate-spin text-white/40" />
              </div>
            )}
          </div>

          {/* Next button */}
          <button
            onClick={() => manualGoTo(current + 1)}
            className="absolute right-4 z-20 w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center hover:bg-white/25 transition"
          >
            <ChevronRight size={24} className="text-white" />
          </button>
        </div>

        {/* Thumbnail strip */}
        <div className="flex-none h-24 flex items-center justify-center">
          <div
            ref={thumbsRef}
            style={{
              width: "40vw",
              overflowX: "scroll",
              overflowY: "visible",
              scrollbarWidth: "none",
              maskImage:
                "linear-gradient(to right, transparent 0%, black 18%, black 82%, transparent 100%)",
              WebkitMaskImage:
                "linear-gradient(to right, transparent 0%, black 18%, black 82%, transparent 100%)",
            }}
          >
            <div className="flex gap-2 px-8 py-2">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => manualGoTo(i)}
                  className={`relative flex-none w-14 h-14 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                    i === current
                      ? "border-white opacity-100 scale-110"
                      : "border-transparent opacity-40 hover:opacity-70"
                  }`}
                >
                  <Image
                    src={img.src}
                    alt={`thumb ${i + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}

              {Array.from({
                length: Math.max(0, totalCount - images.length),
              }).map((_, i) => (
                <div
                  key={`ghost-${images.length + i}`}
                  className="flex-none w-14 h-14 rounded-lg bg-white/10 animate-pulse"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Slot ─────────────────────────────────────────────────────────────────────
function Slot({
  img,
  index,
  style,
  onClick,
  overlayText,
}: {
  img: { src: string };
  index: number;
  style?: React.CSSProperties;
  onClick: () => void;
  overlayText?: string;
}) {
  return (
    <div
      className="relative rounded-[16px] overflow-hidden cursor-pointer group"
      style={style}
      onClick={onClick}
    >
      <Image
        src={img.src}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        alt={`gallery ${index + 1}`}
        priority={index < 6}
        sizes="(max-width: 768px) 50vw, 25vw"
      />

      {/* Normal hover overlay */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-all duration-300 flex items-center justify-center">
        {!overlayText && (
          <div className="w-10 h-10 rounded-full bg-black/50 border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <ZoomIn size={16} className="text-white" />
          </div>
        )}
      </div>

      {/* Remaining count overlay */}
      {overlayText && (
        <div className="absolute inset-0 bg-black/55 flex items-center justify-center">
          <div className="text-white text-1xl font-bold tracking-wide">
            {overlayText}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Gallery ──────────────────────────────────────────────────────────────────
export default function Gallery() {
  const { t } = useTranslation();

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const queryClient = useQueryClient();

  const { data: page1 } = useQuery({
    queryKey: ["media", 1],
    queryFn: () => getMedia(1, PAGE_SIZE),
  });

  const gridImages = (page1?.results ?? [])
    .slice(0, GRID_MAX)
    .map((item) => ({ src: item.media }));

  const totalCount = page1?.count ?? 0;

  const initialLightboxImages = (page1?.results ?? []).map((item) => ({
    src: item.media,
  }));

  const remainingCount = totalCount - gridImages.length;

  const loadMore = useCallback(
    async (page: number): Promise<{ src: string }[]> => {
      const data = await queryClient.fetchQuery({
        queryKey: ["media", page],
        queryFn: () => getMedia(page, PAGE_SIZE),
        staleTime: 5 * 60 * 1000,
      });
      return (data?.results ?? []).map((item: { media: string }) => ({
        src: item.media,
      }));
    },
    [queryClient]
  );

  const count = gridImages.length;

  return (
    <>
      <div className="max-w-[1280px] mx-auto mt-16 mb-16 px-4 sm:px-6 lg:px-8">
        <div>
          <h1 className="text-[36px] font-bold max-md:text-[26px]">
            {t("home.gallery.title")}
          </h1>
          <p className="font-medium text-[#6A7282] mt-2 text-[14px] max-md:text-[13px]">
            {/* Discover moments from every journey */}
            {t("home.gallery.description")}
          </p>
        </div>

        {count > 0 && (
          <div
            className="mt-10 grid gap-4"
            style={{
              gridTemplateColumns: "1fr 1fr 1.4fr 1fr",
              gridTemplateRows: "200px 220px 200px",
            }}
          >
            {count > 0 && (
              <Slot
                img={gridImages[0]}
                index={0}
                style={{ gridColumn: "1", gridRow: "1" }}
                onClick={() => setLightboxIndex(0)}
              />
            )}
            {count > 1 && (
              <Slot
                img={gridImages[1]}
                index={1}
                style={{ gridColumn: "2", gridRow: "1" }}
                onClick={() => setLightboxIndex(1)}
              />
            )}
            {count > 2 && (
              <Slot
                img={gridImages[2]}
                index={2}
                style={{ gridColumn: "3", gridRow: "1 / 3" }}
                onClick={() => setLightboxIndex(2)}
              />
            )}
            {count > 3 && (
              <Slot
                img={gridImages[3]}
                index={3}
                style={{ gridColumn: "4", gridRow: "1" }}
                onClick={() => setLightboxIndex(3)}
              />
            )}
            {count > 4 && (
              <Slot
                img={gridImages[4]}
                index={4}
                style={{ gridColumn: "1 / 3", gridRow: "2" }}
                onClick={() => setLightboxIndex(4)}
              />
            )}
            {count > 5 && (
              <Slot
                img={gridImages[5]}
                index={5}
                style={{ gridColumn: "4", gridRow: "2" }}
                onClick={() => setLightboxIndex(5)}
              />
            )}
            {count > 6 && (
              <Slot
                img={gridImages[6]}
                index={6}
                style={{ gridColumn: "1", gridRow: "3" }}
                onClick={() => setLightboxIndex(6)}
              />
            )}
            {count > 7 && (
              <Slot
                img={gridImages[7]}
                index={7}
                style={{ gridColumn: "2 / 4", gridRow: "3" }}
                onClick={() => setLightboxIndex(7)}
              />
            )}
            {count > 8 && (
              <Slot
                img={gridImages[8]}
                index={8}
                style={{ gridColumn: "4", gridRow: "3" }}
                onClick={() => setLightboxIndex(8)}
                overlayText={
                  remainingCount > 0 ? `+${remainingCount} images` : undefined
                }
              />
            )}
          </div>
        )}
      </div>

      {lightboxIndex !== null && initialLightboxImages.length > 0 && (
        <Lightbox
          startIndex={lightboxIndex}
          initialImages={initialLightboxImages}
          totalCount={totalCount}
          onClose={() => {
            console.log(1111);
            setLightboxIndex(null);
          }}
          onLoadMore={loadMore}
        />
      )}
    </>
  );
}
