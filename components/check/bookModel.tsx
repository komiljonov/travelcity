import { ITariff } from "@type/tariff";
import { ITour } from "@type/tour";
// import { api } from "@/api";
import { motion } from "framer-motion";
import { useState } from "react";
import { useForm, useFormContext } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { FaUser, FaCalendarAlt, FaGlobe } from "react-icons/fa";
import { FiX } from "react-icons/fi";
import api from "@/lib/axios";
import { useTranslation } from "react-i18next";

type BookFormValues = {
  name: string;
  email: string;
  phone_number: string;
};

type FormValues = {
  date: Date | null;
  adult: number;
  child: number;
  infant: number;
  language: string;
};

type OrderPayload = BookFormValues & {
  tour: number;
  tariff: number;
  adults: number;
  children: number;
  infants: number;
  date: string | null;
  language: string;
};

/* ─── Book Tour Modal ─── */
export default function BookModal({
  tour,
  tariff,
  onClose,
}: {
  tour: ITour;
  tariff: ITariff;
  onClose: () => void;
}) {
  const { t } = useTranslation();
  const { watch } = useFormContext<FormValues>();

  const date = watch("date");
  const adults = watch("adult");
  const child = watch("child");
  const infants = watch("infant");
  const language = watch("language");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BookFormValues>();

  const { mutate, isPending, isSuccess, isError } = useMutation({
    mutationFn: (payload: OrderPayload) =>
      api.post("/v1/orders/submit", payload),
  });

  function onSubmit(data: BookFormValues) {
    mutate({
      ...data,
      tour: tour.id,
      tariff: tariff.id,
      adults,
      children: child,
      infants,
      //   date: date ? date.toISOString() : null,
      date: date ? date.toISOString().split("T")[0] : null,
      language,
    });
  }

  const serverError = isError
    ? "Something went wrong. Please try again."
    : null;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      <motion.div
        className="relative bg-white rounded-[20px] w-full max-w-[460px] p-6 shadow-2xl z-10"
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 16 }}
        transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
        >
          <FiX size={18} className="text-gray-500" />
        </button>

        {isSuccess ? (
          <div className="flex flex-col items-center justify-center py-8 gap-3 text-center">
            <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center mb-2">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <path
                  d="M5 13l4 4L19 7"
                  stroke="#22c55e"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-[#1E2939]">Booking sent!</h3>
            <p className="text-sm text-gray-500">
              We will contact you soon as possible.
            </p>
            <button
              onClick={onClose}
              className="mt-4 bg-[#1E2939] text-white font-semibold py-3 px-8 rounded-full hover:bg-[#2d3d50] transition-colors"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            <h2 className="text-xl font-bold text-[#1E2939]">Book tour</h2>
            <p className="text-sm text-gray-400 mt-1 mb-5">
              Fill the form below to book tour we will contact with you soon as
              possible
            </p>

            {/* Summary chips */}
            <div className="flex flex-wrap gap-2 mb-5">
              <div className="flex items-center gap-1.5 bg-[#F3F4F6] rounded-full px-3 py-1.5 text-xs font-medium text-[#1E2939]">
                <FaUser size={10} className="text-gray-400" />
                Adults x{adults}
              </div>
              {child > 0 && (
                <div className="flex items-center gap-1.5 bg-[#F3F4F6] rounded-full px-3 py-1.5 text-xs font-medium text-[#1E2939]">
                  <FaUser size={10} className="text-gray-400" />
                  Children x{child}
                </div>
              )}
              {infants > 0 && (
                <div className="flex items-center gap-1.5 bg-[#F3F4F6] rounded-full px-3 py-1.5 text-xs font-medium text-[#1E2939]">
                  <FaUser size={10} className="text-gray-400" />
                  Infants x{infants}
                </div>
              )}
              {date && (
                <div className="flex items-center gap-1.5 bg-[#F3F4F6] rounded-full px-3 py-1.5 text-xs font-medium text-[#1E2939]">
                  <FaCalendarAlt size={10} className="text-gray-400" />
                  {date
                    .toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })
                    .replace(/\//g, ".")}
                </div>
              )}
              <div className="flex items-center gap-1.5 bg-[#F3F4F6] rounded-full px-3 py-1.5 text-xs font-medium text-[#1E2939]">
                <FaGlobe size={10} className="text-gray-400" />
                {language}
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              {/* Full Name */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-[#1E2939] mb-1.5">
                  {t("fullname")}
                </label>
                <input
                  type="text"
                  placeholder="John Anderson"
                  {...register("name", {
                    required: t("errors.full_name_required"),
                  })}
                  className={`w-full h-12 px-4 rounded-[50px] bg-[#F3F4F6] border text-sm text-[#1E2939] placeholder:text-gray-400 outline-none transition-colors ${
                    errors.name
                      ? "border-[#EA004A] bg-red-50"
                      : "border-transparent focus:border-gray-300"
                  }`}
                />
                {errors.name && (
                  <p className="text-[#EA004A] text-xs mt-1.5">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-[#1E2939] mb-1.5">
                  {t("email")}
                </label>
                <input
                  type="email"
                  placeholder="example@email.com"
                  {...register("email", {
                    required: t("errors.email_required"),
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Please enter correct email address",
                    },
                  })}
                  className={`w-full h-12 px-4 rounded-[50px] bg-[#F3F4F6] border text-sm text-[#1E2939] placeholder:text-gray-400 outline-none transition-colors ${
                    errors.email
                      ? "border-[#EA004A] bg-red-50"
                      : "border-transparent focus:border-gray-300"
                  }`}
                />
                {errors.email && (
                  <p className="text-[#EA004A] text-xs mt-1.5">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-[#1E2939] mb-1.5">
                  {t("phone_number")}
                </label>
                <input
                  type="tel"
                  placeholder="+998"
                  {...register("phone_number", {
                    required: t("errors.phone_number_required"),
                  })}
                  className={`w-full h-12 px-4 rounded-[50px] bg-[#F3F4F6] border text-sm text-[#1E2939] placeholder:text-gray-400 outline-none transition-colors ${
                    errors.phone_number
                      ? "border-[#EA004A] bg-red-50"
                      : "border-transparent focus:border-gray-300"
                  }`}
                />
                {errors.phone_number && (
                  <p className="text-[#EA004A] text-xs mt-1.5">
                    {errors.phone_number.message}
                  </p>
                )}
              </div>

              {/* Server error */}
              {serverError && (
                <div className="mb-4 px-4 py-3 rounded-2xl bg-red-50 border border-[#EA004A]/20">
                  <p className="text-[#EA004A] text-xs text-center">
                    {serverError}
                  </p>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isPending}
                  className="flex-1 h-12 rounded-full border border-gray-200 text-sm font-semibold text-[#1E2939] hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t("cancel")}
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex-1 h-12 rounded-full bg-[#1E2939] text-white text-sm font-semibold hover:bg-[#2d3d50] transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isPending ? (
                    <>
                      <svg
                        className="animate-spin h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8z"
                        />
                      </svg>
                      {t("loading")}
                    </>
                  ) : (
                    t("send")
                  )}
                </button>
              </div>
            </form>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}
