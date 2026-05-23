"use client";

import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getAllMedia } from "@/lib/api/media";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { when: "beforeChildren", staggerChildren: 0.12 },
  },
};

const imageVariants = {
  hidden: { opacity: 0, y: -60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
};
function Lightbox({
  index,
  images,
  onClose,
}: {
  index: number;
  images: { src: string }[];
  onClose: () => void;
}) {
  const [current, setCurrent] = useState(index);
  const [fading, setFading] = useState(false);

  const goTo = useCallback(
    (next: number) => {
      setFading(true);
      setTimeout(() => {
        setCurrent((next + images.length) % images.length);
        setFading(false);
      }, 200);
    },
    [images.length]
  );

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
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-20 w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center hover:bg-white/25 transition"
        >
          <X size={18} className="text-white" />
        </button>

        {/* Counter */}
        <p className="absolute top-6 left-1/2 -translate-x-1/2 text-white/50 text-sm font-medium tracking-widest z-20">
          <span className="text-white font-semibold">{current + 1}</span> /{" "}
          {images.length}
        </p>

        {/* Main content */}
        <div
          className="relative flex items-center justify-center w-full h-full px-20"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Prev */}
          <button
            onClick={() => goTo(current - 1)}
            className="absolute left-5 z-20 w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center hover:bg-white/25 transition backdrop-blur-sm"
          >
            <ChevronLeft size={24} className="text-white" />
          </button>

          {/* Image */}
          <div
            className={`relative transition-opacity duration-200 ${
              fading ? "opacity-0" : "opacity-100"
            }`}
            style={{
              maxWidth: "85vw",
              maxHeight: "88vh",
              width: "85vw",
              height: "88vh",
            }}
          >
            <Image
              src={images[current].src}
              alt={`gallery ${current + 1}`}
              fill
              className="object-contain rounded-xl"
              style={{ boxShadow: "0 25px 80px rgba(0,0,0,0.8)" }}
            />
          </div>

          {/* Next */}
          <button
            onClick={() => goTo(current + 1)}
            className="absolute right-5 z-20 w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center hover:bg-white/25 transition backdrop-blur-sm"
          >
            <ChevronRight size={24} className="text-white" />
          </button>
        </div>

        {/* Thumbnail strip */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 z-20 max-w-[90vw] overflow-x-auto px-4 pb-1">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={(e) => {
                e.stopPropagation();
                goTo(i);
              }}
              className={`relative flex-none w-14 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                i === current
                  ? "border-white opacity-100"
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
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function Gallery() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const { data } = useQuery({
    queryKey: ["all_media"],
    queryFn: getAllMedia,
  });

  const images = (data ?? []).map((item) => ({ src: item.media }));

  const ImgBox = ({
    index,
    className,
    width,
    height,
    alt,
  }: {
    index: number;
    className?: string;
    width: number;
    height: number;
    alt: string;
  }) => (
    <motion.div
      className={`relative rounded-[20px] overflow-hidden cursor-pointer group ${className}`}
      variants={imageVariants}
      onClick={() => setLightboxIndex(index)}
    >
      <Image
        src={images[index].src}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        width={width}
        height={height}
        alt={alt}
      />
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-all duration-300 flex items-center justify-center">
        <div className="w-10 h-10 rounded-full bg-black/50 border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-sm">
          <ZoomIn size={16} className="text-white" />
        </div>
      </div>
    </motion.div>
  );

  return (
    <>
      <div className="max-w-[1280px] mx-auto mt-16 mb-16 px-4 sm:px-6 lg:px-8">
        <div>
          <h1 className="text-[36px] font-bold max-md:text-[26px]">Gallery</h1>
          <p className="font-medium text-[#6A7282] mt-2 text-[14px] max-md:text-[13px]">
            Discover moments from every journey
          </p>
        </div>

        {/* Split images into 3 columns */}
        {(() => {
          const col1 = images.filter((_, i) => i % 3 === 0);
          const col2 = images.filter((_, i) => i % 3 === 1);
          const col3 = images.filter((_, i) => i % 3 === 2);

          const renderCol = (colImages: typeof images, colOffset: number) => (
            <motion.div
              className="flex flex-col gap-5 flex-1"
              variants={imageVariants}
            >
              {colImages.map((img, i) => (
                <motion.div
                  key={i}
                  className="relative w-full rounded-[20px] overflow-hidden cursor-pointer group"
                  style={{ aspectRatio: i % 2 === 0 ? "4/3" : "1/1" }}
                  variants={imageVariants}
                  onClick={() => setLightboxIndex(colOffset + i * 3)}
                >
                  <Image
                    src={img.src}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    alt={`gallery ${colOffset + i * 3 + 1}`}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-all duration-300 flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-black/50 border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-sm">
                      <ZoomIn size={16} className="text-white" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          );

          return (
            <motion.div
              className="flex flex-col md:flex-row gap-5 mt-10"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {renderCol(col1, 0)}
              {renderCol(col2, 1)}
              {renderCol(col3, 2)}
            </motion.div>
          );
        })()}
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          index={lightboxIndex}
          images={images}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </>
  );
}
