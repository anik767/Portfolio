'use client';

import { useRef, useState } from "react";
import { uploadDashboardImage, UploadedImage } from "../utils/uploadImage";

const cx = (...classes: Array<string | null | false | undefined>) =>
  classes.filter(Boolean).join(" ");

interface ImageUploadFieldProps {
  label: string;
  value?: UploadedImage | null;
  onChange: (value: UploadedImage | null) => void;
  folder: string;
  helperText?: string;
  example?: string;
  className?: string;
  shape?: "circle" | "rounded";
  aspect?: "square" | "landscape";
}

export const ImageUploadField = ({
  label,
  value,
  onChange,
  folder,
  helperText,
  example,
  className = "",
  shape = "rounded",
  aspect = "square",
}: ImageUploadFieldProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      const uploaded = await uploadDashboardImage(file, folder);
      onChange(uploaded);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Failed to upload image");
    } finally {
      setUploading(false);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  };

  const handleRemove = () => {
    onChange(null);
    setError(null);
  };

  return (
    <div className={cx("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <label className="text-gray-700 font-semibold text-xs sm:text-sm uppercase tracking-wide">
          {label}
        </label>
        {value?.url && (
          <button
            type="button"
            onClick={handleRemove}
            className="text-xs text-red-500 hover:text-red-600 font-semibold"
          >
            Remove
          </button>
        )}
      </div>

      <div
        className={cx(
          "relative border-2 border-dashed border-gray-200 rounded-2xl p-4 bg-white/40 flex flex-col items-center justify-center text-center transition-all duration-200 hover:border-indigo-400",
          uploading && "opacity-70 pointer-events-none"
        )}
      >
        <div
          className={cx(
            "w-28 h-28 sm:w-32 sm:h-32 overflow-hidden bg-gray-100 flex items-center justify-center mb-3",
            shape === "circle" ? "rounded-full" : "rounded-xl",
            aspect === "landscape" ? "w-full h-40" : ""
          )}
        >
          {value?.url ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={value.url}
                alt={label}
                className={cx(
                  "object-cover w-full h-full",
                  shape === "circle" ? "rounded-full" : "rounded-xl"
                )}
              />
            </>
          ) : (
            <div className="text-gray-400 text-xs flex flex-col items-center gap-1">
              <span className="text-2xl">🖼️</span>
              <span>512×512 PNG</span>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={handleClick}
          className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-semibold shadow hover:bg-gray-800 transition"
        >
          {uploading ? "Uploading..." : value?.url ? "Replace Image" : "Upload Image"}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        {helperText && (
          <p className="text-gray-500 text-xs mt-3">{helperText}</p>
        )}
        {example && (
          <p className="text-gray-400 text-xs italic">{example}</p>
        )}
        {error && (
          <p className="text-red-500 text-xs font-semibold mt-2">{error}</p>
        )}
      </div>
    </div>
  );
};


