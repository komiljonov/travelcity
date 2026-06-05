"use client";

import { getTourMedia } from "@/lib/api/media";
import api from "@/lib/axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ITour } from "@type/tour";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Images, Loader2, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { FaChevronDown } from "react-icons/fa";

import { usePathname, useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { getField } from "@/lib/utils/i18n";
import { useTranslation } from "react-i18next";

const PAGE_SIZE = 20;
const PREFETCH_THRESHOLD = 5;

type FormValues = {
  date: Date | null;
  adult: number;
  child: number;
  infant: number;
  language: string;
};

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
  const thumbsRef = useRef<HTMLDivElement>(null);
  const imagesLengthRef = useRef(initialImages.length);

  useEffect(() => {
    imagesLengthRef.current = images.length;
  }, [images.length]);

  const maybeLoadMore = useCallback(
    async (idx: number) => {
      const currentLength = imagesLengthRef.current;
      if (currentLength - idx > PREFETCH_THRESHOLD) return;
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
      const clamped = ((next % total) + total) % total;
      const safeIdx = Math.min(clamped, images.length - 1);
      setCurrent(safeIdx);
      maybeLoadMore(safeIdx);
    },
    [images.length, totalCount, maybeLoadMore]
  );

  // Scroll thumbnail strip to keep active centered
  useEffect(() => {
    if (!thumbsRef.current) return;
    const THUMB_W = 56 + 8;
    const containerWidth = thumbsRef.current.clientWidth;
    thumbsRef.current.scrollTo({
      left: Math.max(0, current * THUMB_W - containerWidth / 2 + 28),
      behavior: "smooth",
    });
  }, [current]);

  // Keyboard navigation + body scroll lock
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goTo(current + 1);
      if (e.key === "ArrowLeft") goTo(current - 1);
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [current, goTo, onClose]);

  return (
    <div className="fixed inset-0 z-[200] bg-black/92" onClick={onClose}>
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
          <button
            onClick={() => goTo(current - 1)}
            className="absolute left-4 z-20 w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center hover:bg-white/25 transition"
          >
            <ChevronLeft size={24} className="text-white" />
          </button>

          <div className="relative w-full h-full">
            {images.map((img, i) => {
              if (Math.abs(i - current) > 2) return null;
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
                    className="relative"
                    style={{ width: "85vw", height: "75vh" }}
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

          <button
            onClick={() => goTo(current + 1)}
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
                  onClick={() => goTo(i)}
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
                  key={`ghost-${i}`}
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

// ─── CityDetailWidget ─────────────────────────────────────────────────────────
export default function CityDetailWidget({ tour }: { tour: ITour }) {
  const { t } = useTranslation();
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: images, isLoading } = useQuery({
    queryKey: ["images", tour.id],
    queryFn: () => getTourMedia(tour.id),
    enabled: !!tour,
  });

  const [mainIndex, setMainIndex] = useState(0);
  const [openPanel, setOpenPanel] = useState<"guests" | "date" | "lang" | null>(
    "guests"
  );

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const [errors, setErrors] = useState<{ date?: string; language?: string }>(
    {}
  );

  const { setValue, handleSubmit, control } = useForm<FormValues>({
    defaultValues: {
      date: null,
      adult: 1,
      child: 0,
      infant: 0,
      language: "",
    },
  });

  const currentImage = images?.results?.[mainIndex]?.media;

  const date = useWatch({ control, name: "date" });
  const adult = useWatch({ control, name: "adult" });
  const child = useWatch({ control, name: "child" });
  const infant = useWatch({ control, name: "infant" });
  const language = useWatch({ control, name: "language" });

  useEffect(() => {
    const params = new URLSearchParams();
    // if (date) params.set("date", date.toISOString().split("T")[0]);
    if (date) {
      const yyyy = date.getFullYear();
      const mm = String(date.getMonth() + 1).padStart(2, "0");
      const dd = String(date.getDate()).padStart(2, "0");
      params.set("date", `${yyyy}-${mm}-${dd}`);
    }
    params.set("adult", String(adult));
    params.set("child", String(child));
    params.set("infant", String(infant));
    params.set("language", language);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [router, pathname, date, adult, child, infant, language]);

  const initialLightboxImages = (images?.results ?? []).map((item) => ({
    src: item.media,
  }));
  const totalCount = images?.count ?? 0;

  const loadMore = useCallback(
    async (page: number): Promise<{ src: string }[]> => {
      const data = await queryClient.fetchQuery({
        queryKey: ["tourMedia", tour.id, page],
        queryFn: async () => {
          const { data } = await api.get(
            `/v1/media/?tour=${tour.id}&page=${page}`
          );
          return data;
        },
        staleTime: 5 * 60 * 1000,
      });
      return (data?.results ?? []).map((item: { media: string }) => ({
        src: item.media,
      }));
    },
    [queryClient, tour.id]
  );

  function togglePanel(key: "guests" | "date" | "lang" | null) {
    setOpenPanel((prev) => (prev === key ? null : key));
  }

  // function onSubmit(data: FormValues) {
  //   const params = new URLSearchParams({
  //     date: data.date ? data.date.toISOString().split("T")[0] : "",
  //     adult: String(data.adult),
  //     child: String(data.child),
  //     infant: String(data.infant),
  //     language: data.language,
  //   });
  //   router.push(`/check/${tour.id}?${params.toString()}`);
  // }

  function onSubmit(data: FormValues) {
    const newErrors: { date?: string; language?: string } = {};

    if (!data.date) newErrors.date = t("errors.date_required");
    if (!data.language) newErrors.language = t("errors.language_required");

    // if (Object.keys(newErrors).length > 0) {
    //   setErrors(newErrors);
    //   // open the first panel that has an error
    //   if (newErrors.date) togglePanel("date");
    //   else if (newErrors.language) togglePanel("lang");
    //   return;
    // }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      if (newErrors.date) setOpenPanel("date");
      else if (newErrors.language) setOpenPanel("lang");
      return;
    }

    setErrors({});
    const params = new URLSearchParams({
      date: (() => {
        const d = data.date!;
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, "0");
        const dd = String(d.getDate()).padStart(2, "0");
        return `${yyyy}-${mm}-${dd}`;
      })(),
      adult: String(data.adult),
      child: String(data.child),
      infant: String(data.infant),
      language: data.language,
    });
    router.push(`/check/${tour.id}?${params.toString()}`);
  }

  return (
    <div className="w-full min-w-0 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold max-md:text-xl">
        {getField(tour, "name")}
      </h1>
      <p className="text-gray-500 text-sm mt-1 max-md:text-xs">
        {t("tour.reviews", { count: tour.feedback_count })} •{" "}
        {getField(tour, "duration_title")}
      </p>

      <div className="grid min-w-0 grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 mt-6 items-start">
        {/* LEFT: Image gallery */}
        <div className="min-w-0 lg:col-span-2 flex flex-col lg:h-[628px]">
          <motion.div
            key={mainIndex}
            initial={{ opacity: 0, scale: 0.99 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25 }}
            onClick={() => setLightboxIndex(mainIndex)}
            className="relative flex-1 rounded-xl overflow-hidden cursor-pointer max-md:h-[280px] max-md:flex-none"
            role="button"
            tabIndex={0}
          >
            {isLoading || !currentImage ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-gray-300 border-t-[#EA004A] rounded-full animate-spin" />
              </div>
            ) : (
              <>
                <Image
                  src={currentImage}
                  alt=""
                  fill
                  sizes="(max-width: 1024px) 100vw, 66vw"
                  className="object-contain"
                  priority
                />
                <div className="absolute inset-0  hover:bg-black/0 transition-colors -z-10" />
              </>
            )}
          </motion.div>

          {/* Thumbnails */}
          <div className="grid grid-cols-5 max-md:flex gap-3 mt-4 flex-none overflow-x-auto overflow-y-hidden pb-1 [-webkit-overflow-scrolling:touch] min-w-0 max-w-full">
            {images?.results.slice(0, 5).map((img, i) => (
              <button
                key={`${img.id}-${i}`}
                type="button"
                onClick={() => setMainIndex(i)}
                className={[
                  "relative rounded-lg overflow-hidden cursor-pointer border-2 transition-all flex-none",
                  i === mainIndex ? "border-[#EA004A]" : "border-transparent",
                ].join(" ")}
                aria-label={`Thumbnail ${i + 1}`}
              >
                <div className="relative md:w-[100%] md:h-[120px] w-[110px] h-[85px]">
                  <Image
                    src={img.media_preview}
                    alt=""
                    fill
                    className="object-cover"
                  />

                  {i === 4 && (
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        setLightboxIndex(4);
                      }}
                      className="absolute inset-0 flex items-center justify-center gap-1"
                      style={{ background: "#0000008F" }}
                    >
                      <Images className="text-white" />
                      <span
                        style={{
                          color: "#F9FAFB",
                          fontWeight: 600,
                          fontSize: "18px",
                          lineHeight: "28px",
                          letterSpacing: "0%",
                        }}
                      >
                        {images?.count ?? 0}+
                      </span>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT: Booking controls */}
        <div
          className="min-w-0 rounded-2xl p-5 shadow-sm w-full flex flex-col gap-4 border border-[#E5E7EB]"
          style={{ background: "#FFFFFF" }}
        >
          {/* Price */}
          <div className="flex-none">
            <p className="text-neutral-800 font-medium text-base leading-6 tracking-normal uppercase">
              {t("price.starts_from")}
            </p>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <h2 className="text-2xl font-bold text-[#EA004A]">
                ${tour.price_starting}
              </h2>
              <span className="text-neutral-800 font-medium text-xs leading-[18px] tracking-normal">
                {t("price.per_person")}
              </span>
            </div>
          </div>

          {/* Accordions */}
          <div className="flex flex-col gap-3 flex-none">
            {/* Guests */}
            <div className="rounded-2xl bg-[#F3F4F6]">
              <button
                type="button"
                onClick={() => togglePanel("guests")}
                className="flex justify-between items-center w-full bg-[#F3F4F6] rounded-2xl px-4 py-3"
              >
                <div className="flex items-center gap-2 text-gray-700">
                  <svg
                    width="24"
                    height="18"
                    viewBox="0 0 24 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M15.0362 12.8147C15.7282 12.1371 16.2028 11.2687 16.3992 10.3202C16.5957 9.37182 16.5052 8.38637 16.1393 7.48959C15.7733 6.59282 15.1486 5.82538 14.3446 5.28515C13.5407 4.74493 12.5941 4.45642 11.6256 4.45642C10.657 4.45642 9.7104 4.74493 8.90649 5.28515C8.10259 5.82538 7.47782 6.59282 7.11189 7.48959C6.74596 8.38637 6.65545 9.37182 6.85191 10.3202C7.04837 11.2687 7.52289 12.1371 8.21494 12.8147C7.04321 13.4376 6.06902 14.3757 5.40244 15.5231C5.25969 15.7811 5.2239 16.0848 5.30277 16.3688C5.38164 16.6529 5.56887 16.8947 5.82417 17.0421C6.07948 17.1895 6.38245 17.2308 6.66791 17.1572C6.95337 17.0835 7.19851 16.9007 7.35057 16.6481C7.79017 15.9054 8.41566 15.29 9.16544 14.8625C9.91522 14.435 10.7634 14.2102 11.6265 14.2102C12.4896 14.2102 13.3378 14.435 14.0876 14.8625C14.8373 15.29 15.4628 15.9054 15.9024 16.6481C15.9748 16.7789 16.0725 16.894 16.1898 16.9865C16.3072 17.0791 16.4418 17.1474 16.5858 17.1874C16.7298 17.2274 16.8804 17.2383 17.0286 17.2194C17.1769 17.2006 17.3199 17.1524 17.4494 17.0776C17.5788 17.0029 17.692 16.9031 17.7825 16.7841C17.8729 16.6651 17.9387 16.5293 17.9761 16.3846C18.0134 16.2398 18.0216 16.0891 18 15.9412C17.9785 15.7933 17.9277 15.6512 17.8506 15.5231C17.1835 14.3754 16.2086 13.4373 15.0362 12.8147ZM9.00057 9.33657C9.00057 8.8174 9.15452 8.30988 9.44296 7.8782C9.7314 7.44652 10.1414 7.11007 10.621 6.91139C11.1007 6.71271 11.6285 6.66073 12.1377 6.76201C12.6469 6.8633 13.1146 7.11331 13.4817 7.48042C13.8488 7.84753 14.0988 8.31526 14.2001 8.82446C14.3014 9.33366 14.2494 9.86146 14.0508 10.3411C13.8521 10.8208 13.5156 11.2307 13.0839 11.5192C12.6523 11.8076 12.1447 11.9616 11.6256 11.9616C10.9294 11.9616 10.2617 11.685 9.76941 11.1927C9.27713 10.7004 9.00057 10.0328 9.00057 9.33657ZM22.8015 10.2356C22.6833 10.3245 22.5488 10.3892 22.4057 10.426C22.2625 10.4628 22.1135 10.471 21.9671 10.4502C21.8207 10.4294 21.6799 10.38 21.5527 10.3047C21.4254 10.2294 21.3143 10.1298 21.2256 10.0116C20.4446 8.97189 19.3646 8.17501 18.4759 7.98282C18.2396 7.93171 18.026 7.80583 17.8668 7.62382C17.7077 7.44181 17.6114 7.21336 17.5922 6.97234C17.5731 6.73131 17.6321 6.49053 17.7605 6.28568C17.889 6.08082 18.08 5.9228 18.3053 5.83501C18.5857 5.72552 18.8357 5.55009 19.0341 5.32356C19.2325 5.09703 19.3733 4.82605 19.4448 4.53356C19.5163 4.24107 19.5163 3.93567 19.4448 3.64318C19.3733 3.35068 19.2325 3.07971 19.0341 2.85318C18.8357 2.62665 18.5857 2.45122 18.3053 2.34173C18.0248 2.23224 17.722 2.19191 17.4227 2.22415C17.1233 2.25639 16.8361 2.36026 16.5854 2.52697C16.3346 2.69367 16.1277 2.91831 15.9821 3.18189C15.9131 3.31546 15.818 3.43383 15.7024 3.53002C15.5869 3.62621 15.4532 3.69826 15.3093 3.7419C15.1654 3.78555 15.0143 3.79992 14.8647 3.78415C14.7152 3.76839 14.5704 3.72281 14.4388 3.65011C14.3072 3.57741 14.1915 3.47906 14.0985 3.36089C14.0055 3.24271 13.9372 3.1071 13.8976 2.96207C13.8579 2.81704 13.8477 2.66554 13.8676 2.5165C13.8875 2.36747 13.9371 2.22394 14.0134 2.09439C14.2918 1.60215 14.6684 1.17241 15.1198 0.83186C15.5713 0.491309 16.088 0.247222 16.6377 0.11476C17.1875 -0.0177015 17.7586 -0.0357082 18.3156 0.0618584C18.8727 0.159425 19.4037 0.370481 19.8757 0.681917C20.3477 0.993352 20.7507 1.39851 21.0595 1.87224C21.3683 2.34596 21.5765 2.87812 21.671 3.43567C21.7655 3.99322 21.7443 4.56425 21.6088 5.11328C21.4733 5.66231 21.2264 6.17762 20.8834 6.6272C21.7088 7.17706 22.4335 7.86492 23.0256 8.66064C23.2047 8.89922 23.2817 9.19917 23.2397 9.49454C23.1977 9.7899 23.0401 10.0565 22.8015 10.2356ZM4.77526 7.98564C3.88651 8.17782 2.80651 8.9747 2.02557 10.0153C1.84593 10.2539 1.57887 10.4113 1.28315 10.453C0.987427 10.4947 0.687265 10.4172 0.448694 10.2375C0.210124 10.0579 0.0526871 9.79081 0.0110189 9.49509C-0.0306494 9.19937 0.0468639 8.89921 0.226507 8.66064C0.818855 7.86515 1.54345 7.17734 2.36869 6.6272C2.02566 6.17762 1.77874 5.66231 1.64325 5.11328C1.50777 4.56425 1.48662 3.99322 1.58112 3.43567C1.67562 2.87812 1.88375 2.34596 2.19259 1.87224C2.50142 1.39851 2.90436 0.993352 3.37638 0.681917C3.84839 0.370481 4.37941 0.159425 4.93643 0.0618584C5.49345 -0.0357082 6.06458 -0.0177015 6.61435 0.11476C7.16412 0.247222 7.68078 0.491309 8.13224 0.83186C8.5837 1.17241 8.96032 1.60215 9.23869 2.09439C9.315 2.22394 9.36457 2.36747 9.38446 2.5165C9.40436 2.66554 9.39417 2.81704 9.35452 2.96207C9.31486 3.1071 9.24654 3.24271 9.15358 3.36089C9.06062 3.47906 8.94492 3.57741 8.81331 3.65011C8.6817 3.72281 8.53685 3.76839 8.38733 3.78415C8.2378 3.79992 8.08663 3.78555 7.94276 3.7419C7.79888 3.69826 7.66521 3.62621 7.54965 3.53002C7.43409 3.43383 7.33898 3.31546 7.26994 3.18189C7.12437 2.91831 6.91747 2.69367 6.66673 2.52697C6.41599 2.36026 6.12878 2.25639 5.82941 2.22415C5.53004 2.19191 5.22731 2.23224 4.94682 2.34173C4.66633 2.45122 4.41634 2.62665 4.21798 2.85318C4.01962 3.07971 3.87874 3.35068 3.80725 3.64318C3.73576 3.93567 3.73576 4.24107 3.80725 4.53356C3.87874 4.82605 4.01962 5.09703 4.21798 5.32356C4.41634 5.55009 4.66633 5.72552 4.94682 5.83501C5.17211 5.9228 5.36312 6.08082 5.49155 6.28568C5.61998 6.49053 5.67899 6.73131 5.65984 6.97234C5.6407 7.21336 5.54441 7.44181 5.38524 7.62382C5.22608 7.80583 5.01251 7.93171 4.77619 7.98282L4.77526 7.98564Z"
                      fill="#1E2939"
                    />
                  </svg>
                  <span className="font-medium text-sm text-gray-900">
                    {t("guests")} x{adult}
                    {child + infant > 0 && `, +${child + infant}`}
                  </span>
                </div>
                <motion.span
                  animate={{ rotate: openPanel === "guests" ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <FaChevronDown size={11} className="text-gray-500" />
                </motion.span>
              </button>

              <motion.div
                initial={false}
                animate={{
                  height: openPanel === "guests" ? "auto" : 0,
                  opacity: openPanel === "guests" ? 1 : 0,
                }}
                transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
                style={{ overflow: "hidden" }}
              >
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden mx-4 mb-3 mt-1">
                  {[
                    {
                      key: "adult",
                      title: t("adult"),
                      value: adult,
                      age: t("adult_age_range"),
                      onMinus: () => setValue("adult", Math.max(0, adult - 1)),
                      onPlus: () => setValue("adult", adult + 1),
                    },
                    {
                      key: "child",
                      title: t("child"),
                      value: child,
                      age: t("child_age_range"),
                      onMinus: () => setValue("child", Math.max(0, child - 1)),
                      onPlus: () => setValue("child", child + 1),
                    },
                    {
                      key: "infant",
                      title: t("infant"),
                      value: infant,
                      age: t("infant_age_range"),
                      onMinus: () =>
                        setValue("infant", Math.max(0, infant - 1)),
                      onPlus: () => setValue("infant", infant + 1),
                    },
                  ].map((row, idx, arr) => {
                    if (!tour.kids_allowed && row.key === "child") return null;
                    if (!tour.infants_allowed && row.key === "infant")
                      return null;
                    return (
                      <div
                        key={row.key}
                        className={`flex justify-between items-center px-4 py-3 ${
                          idx < arr.length - 1 ? "border-b border-gray-100" : ""
                        }`}
                      >
                        <div>
                          <p className="font-semibold text-gray-800 text-sm">
                            {row.title}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {row.age}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={row.onMinus}
                            disabled={row.value <= 0}
                            className="w-7 h-7 flex items-center justify-center border border-gray-300 rounded-full text-gray-600 disabled:opacity-30 hover:border-[#EA004A] hover:text-[#EA004A] transition-colors"
                          >
                            −
                          </button>
                          <span className="text-gray-800 font-semibold text-sm w-4 text-center">
                            {row.value}
                          </span>
                          <button
                            type="button"
                            onClick={row.onPlus}
                            className="w-7 h-7 flex items-center justify-center border border-gray-300 rounded-full text-gray-600 hover:border-[#EA004A] hover:text-[#EA004A] transition-colors"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    );
                  })}
                  {tour.infants_allowed && (
                    <div className="px-4 py-2.5 bg-gray-50 border-t border-gray-100">
                      <p className="text-xs text-gray-400">
                        {t("price.ticket_not_required_under_3")}
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Date */}
            <div className="rounded-2xl bg-[#F3F4F6]">
              <button
                type="button"
                onClick={() => togglePanel("date")}
                className="flex items-center justify-between w-full bg-[#F3F4F6] rounded-2xl px-4 py-3"
              >
                <div className="flex items-center gap-2 text-gray-700">
                  <svg
                    width="19"
                    height="21"
                    viewBox="0 0 19 21"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M16.875 1.5H15V1.125C15 0.826631 14.8815 0.540483 14.6705 0.329505C14.4595 0.118526 14.1734 0 13.875 0C13.5766 0 13.2905 0.118526 13.0795 0.329505C12.8685 0.540483 12.75 0.826631 12.75 1.125V1.5H6V1.125C6 0.826631 5.88147 0.540483 5.6705 0.329505C5.45952 0.118526 5.17337 0 4.875 0C4.57663 0 4.29048 0.118526 4.0795 0.329505C3.86853 0.540483 3.75 0.826631 3.75 1.125V1.5H1.875C1.37772 1.5 0.900805 1.69754 0.549175 2.04917C0.197544 2.40081 0 2.87772 0 3.375V18.375C0 18.8723 0.197544 19.3492 0.549175 19.7008C0.900805 20.0525 1.37772 20.25 1.875 20.25H16.875C17.3723 20.25 17.8492 20.0525 18.2008 19.7008C18.5525 19.3492 18.75 18.8723 18.75 18.375V3.375C18.75 2.87772 18.5525 2.40081 18.2008 2.04917C17.8492 1.69754 17.3723 1.5 16.875 1.5ZM3.75 3.75C3.75 4.04837 3.86853 4.33452 4.0795 4.5455C4.29048 4.75647 4.57663 4.875 4.875 4.875C5.17337 4.875 5.45952 4.75647 5.6705 4.5455C5.88147 4.33452 6 4.04837 6 3.75H12.75C12.75 4.04837 12.8685 4.33452 13.0795 4.5455C13.2905 4.75647 13.5766 4.875 13.875 4.875C14.1734 4.875 14.4595 4.75647 14.6705 4.5455C14.8815 4.33452 15 4.04837 15 3.75H16.5V6H2.25V3.75H3.75ZM2.25 18V8.25H16.5V18H2.25ZM7.875 10.5V15.75C7.875 16.0484 7.75647 16.3345 7.5455 16.5455C7.33452 16.7565 7.04837 16.875 6.75 16.875C6.45163 16.875 6.16548 16.7565 5.9545 16.5455C5.74353 16.3345 5.625 16.0484 5.625 15.75V12.3113C5.35732 12.3991 5.06641 12.3833 4.8098 12.267C4.55319 12.1507 4.34956 11.9424 4.23916 11.6832C4.12877 11.424 4.11964 11.1328 4.2136 10.8672C4.30755 10.6016 4.49774 10.3809 4.74656 10.2487L6.24656 9.49875C6.41772 9.4131 6.60789 9.37254 6.7991 9.38089C6.9903 9.38924 7.17622 9.44623 7.33925 9.54647C7.50229 9.64671 7.63705 9.78689 7.7308 9.95375C7.82455 10.1206 7.87418 10.3086 7.875 10.5ZM13.6397 13.6763L12.7406 14.625H13.125C13.4234 14.625 13.7095 14.7435 13.9205 14.9545C14.1315 15.1655 14.25 15.4516 14.25 15.75C14.25 16.0484 14.1315 16.3345 13.9205 16.5455C13.7095 16.7565 13.4234 16.875 13.125 16.875H10.125C9.90515 16.8749 9.69014 16.8104 9.50654 16.6895C9.32294 16.5686 9.17881 16.3965 9.09194 16.1945C9.00507 15.9926 8.97928 15.7696 9.01776 15.5531C9.05624 15.3367 9.15729 15.1362 9.30844 14.9766L11.9484 12.1875C11.9818 12.1306 11.9996 12.0659 12 12C12.0002 11.9173 11.9731 11.8368 11.9228 11.7711C11.8725 11.7054 11.8019 11.6582 11.722 11.6368C11.6421 11.6154 11.5573 11.621 11.4809 11.6528C11.4046 11.6846 11.3408 11.7407 11.2997 11.8125C11.1476 12.0651 10.9025 12.2479 10.617 12.3215C10.3316 12.3952 10.0286 12.3539 9.77329 12.2065C9.51799 12.059 9.33076 11.8173 9.25189 11.5332C9.17302 11.2491 9.20881 10.9454 9.35156 10.6875C9.64046 10.187 10.0864 9.79583 10.6203 9.57466C11.1542 9.35348 11.7462 9.31466 12.3044 9.46423C12.8626 9.6138 13.3558 9.94338 13.7076 10.4019C14.0594 10.8604 14.25 11.4221 14.25 12C14.2517 12.5706 14.0659 13.1259 13.7213 13.5806C13.6961 13.6142 13.6689 13.6461 13.6397 13.6763Z"
                      fill="#1E2939"
                    />
                  </svg>
                  <span className="font-medium text-sm text-gray-900">
                    {date
                      ? `${String(date.getDate()).padStart(2, "0")}.${String(
                          date.getMonth() + 1
                        ).padStart(2, "0")}.${date.getFullYear()}`
                      : t("select_date")}
                  </span>
                </div>
                <motion.span
                  animate={{ rotate: openPanel === "date" ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <FaChevronDown size={11} className="text-gray-500" />
                </motion.span>
              </button>

              <motion.div
                initial={false}
                animate={{
                  height: openPanel === "date" ? "auto" : 0,
                  opacity: openPanel === "date" ? 1 : 0,
                }}
                transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
                style={{ overflow: "hidden" }}
              >
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden mx-4 mb-3 mt-1">
                  <div className="p-4">
                    <DayPicker
                      mode="single"
                      selected={date ?? undefined}
                      // onSelect={(d) => setValue("date", d ?? null)}
                      onSelect={(d) => {
                        setValue("date", d ?? null);
                        if (d)
                          setErrors((prev) => ({ ...prev, date: undefined }));
                      }}
                      disabled={{ before: new Date() }}
                      classNames={{
                        months: "flex flex-col",
                        month: "w-full",
                        caption: "hidden",
                        caption_label: "hidden",
                        nav: "hidden",
                        nav_button: "hidden",
                        nav_button_previous: "hidden",
                        nav_button_next: "hidden",
                        table: "w-full",
                        head_row: "flex justify-between mb-2",
                        head_cell:
                          "text-gray-400 text-xs font-normal w-10 text-center",
                        row: "flex justify-between mb-1",
                        cell: "w-10 h-9 text-center p-0",
                        day: "w-10 h-9 rounded-full text-sm hover:bg-pink-100 font-normal text-gray-700 transition-colors outline-none focus:outline-none",
                        day_selected:
                          "!bg-[#EA004A] !text-white rounded-full outline-none border-0",
                        day_today: "font-normal text-[#EA004A] !bg-transparent",
                        day_outside: "text-gray-300",
                        day_disabled: "text-gray-200 cursor-not-allowed",
                      }}
                    />
                  </div>
                </div>
                {/* MOVED OUTSIDE motion.div */}
                {errors.date && (
                  <p className="text-[#EA004A] text-xs pb-3 px-4 flex items-center gap-1">
                    <span className="inline-block w-1 h-1 rounded-full bg-[#EA004A]" />
                    {errors.date}
                  </p>
                )}
              </motion.div>
            </div>

            {/* Language */}
            <div className="rounded-2xl bg-[#F3F4F6]">
              <button
                type="button"
                onClick={() => togglePanel("lang")}
                className="flex items-center justify-between w-full bg-[#F3F4F6] rounded-2xl px-4 py-3"
              >
                <div className="flex items-center gap-2 text-gray-700">
                  <svg
                    width="21"
                    height="21"
                    viewBox="0 0 21 21"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10.125 0C8.12247 0 6.1649 0.593821 4.49986 1.70637C2.83481 2.81892 1.53706 4.40023 0.770724 6.25033C0.00438702 8.10043 -0.196122 10.1362 0.194554 12.1003C0.585229 14.0643 1.54954 15.8685 2.96555 17.2845C4.38156 18.7005 6.18566 19.6648 8.14971 20.0555C10.1138 20.4461 12.1496 20.2456 13.9997 19.4793C15.8498 18.7129 17.4311 17.4152 18.5436 15.7501C19.6562 14.0851 20.25 12.1275 20.25 10.125C20.247 7.4406 19.1793 4.86699 17.2812 2.96883C15.383 1.07067 12.8094 0.00297771 10.125 0ZM17.9184 9H14.9588C14.81 6.79384 14.1228 4.65776 12.9572 2.77875C14.2609 3.28364 15.4072 4.12564 16.2788 5.21869C17.1505 6.31174 17.7163 7.61663 17.9184 9ZM10.125 17.5312C9.2475 16.5178 7.83188 14.4253 7.55157 11.25H12.7022C12.5621 13.0019 12.0127 14.6964 11.0981 16.1972C10.8104 16.6675 10.485 17.1136 10.125 17.5312ZM7.55157 9C7.69162 7.24811 8.24105 5.55357 9.15563 4.05281C9.44215 3.58265 9.76634 3.1365 10.125 2.71875C11.0025 3.73219 12.4181 5.82469 12.6984 9H7.55157ZM7.29282 2.77875C6.12722 4.65776 5.43998 6.79384 5.29125 9H2.33157C2.53369 7.61663 3.09951 6.31174 3.97118 5.21869C4.84285 4.12564 5.98911 3.28364 7.29282 2.77875ZM2.33157 11.25H5.29125C5.43998 13.4562 6.12722 15.5922 7.29282 17.4713C5.98911 16.9664 4.84285 16.1244 3.97118 15.0313C3.09951 13.9383 2.53369 12.6334 2.33157 11.25ZM12.9572 17.4713C14.1228 15.5922 14.81 13.4562 14.9588 11.25H17.9184C17.7163 12.6334 17.1505 13.9383 16.2788 15.0313C15.4072 16.1244 14.2609 16.9664 12.9572 17.4713Z"
                      fill="#1E2939"
                    />
                  </svg>
                  <span className="font-medium text-sm text-gray-900">
                    {t("chooose_language")}
                  </span>
                </div>
                <motion.span
                  animate={{ rotate: openPanel === "lang" ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <FaChevronDown size={11} className="text-gray-500" />
                </motion.span>
              </button>

              <motion.div
                initial={false}
                animate={{
                  height: openPanel === "lang" ? "auto" : 0,
                  opacity: openPanel === "lang" ? 1 : 0,
                }}
                transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
                style={{ overflow: "hidden" }}
              >
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden mx-4 mb-3 mt-1">
                  {tour.languages!.map((lang, idx, arr) => {
                    const active = language === lang.code;
                    return (
                      <label
                        key={lang.code}
                        className={`flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors ${
                          idx < arr.length - 1 ? "border-b border-gray-100" : ""
                        }`}
                      >
                        <span
                          className={`text-sm font-medium ${
                            active ? "text-[#EA004A]" : "text-gray-700"
                          }`}
                        >
                          {lang.name}
                        </span>
                        <input
                          type="radio"
                          name="preferredLanguage"
                          checked={active}
                          // onChange={() => setValue("language", lang.code)}
                          onChange={() => {
                            setValue("language", lang.code);
                            setErrors((prev) => ({
                              ...prev,
                              language: undefined,
                            }));
                          }}
                          className="accent-[#EA004A] w-4 h-4"
                        />
                      </label>
                    );
                  })}
                </div>
                {/* MOVED OUTSIDE motion.div */}
                {errors.language && (
                  <p className="text-[#EA004A] text-xs pb-3 px-4 flex items-center gap-1">
                    <span className="inline-block w-1 h-1 rounded-full bg-[#EA004A]" />
                    {errors.language}
                  </p>
                )}
              </motion.div>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-[#EA004A] text-white text-sm font-semibold py-3.5 rounded-full"
            onClick={handleSubmit(onSubmit)}
          >
            {t("check_availability")}
          </motion.button>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && initialLightboxImages.length > 0 && (
        <Lightbox
          startIndex={lightboxIndex}
          initialImages={initialLightboxImages}
          totalCount={totalCount}
          onClose={() => setLightboxIndex(null)}
          onLoadMore={loadMore}
        />
      )}
    </div>
  );
}
