import { useState, useRef, useCallback } from "react";
import { Upload, X, Loader2, ImageIcon, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type UploadedImage = {
  url: string;
  key?: string;
};

type ImageUploaderProps = {
  images: string[];
  onChange: (images: string[]) => void;
  folder?: string;
  maxFiles?: number;
  label?: string;
  single?: boolean;
};

async function uploadFile(file: File, folder: string): Promise<{ url: string; key: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const base64 = (reader.result as string).split(",")[1];
        const res = await fetch("/api/admin/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            file: base64,
            filename: file.name,
            contentType: file.type,
            folder,
          }),
        });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Upload failed");
        }
        const data = await res.json();
        resolve({ url: data.url, key: data.key });
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

export default function ImageUploader({
  images,
  onChange,
  folder = "uploads",
  maxFiles = 20,
  label,
  single = false,
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const effectiveMax = single ? 1 : maxFiles;

  const handleFiles = useCallback(
    async (files: FileList | File[]) => {
      const fileArray = Array.from(files);
      const validFiles = fileArray.filter((f) => {
        if (!f.type.startsWith("image/")) {
          toast.error(`${f.name} is not an image file`);
          return false;
        }
        if (f.size > 10 * 1024 * 1024) {
          toast.error(`${f.name} exceeds 10MB limit`);
          return false;
        }
        return true;
      });

      if (validFiles.length === 0) return;

      const remaining = effectiveMax - images.length;
      if (remaining <= 0) {
        toast.error(`Maximum ${effectiveMax} image${effectiveMax > 1 ? "s" : ""} allowed`);
        return;
      }

      const toUpload = validFiles.slice(0, remaining);
      setUploading(true);
      setUploadProgress(0);

      const newUrls: string[] = [];
      for (let i = 0; i < toUpload.length; i++) {
        try {
          const { url } = await uploadFile(toUpload[i], folder);
          newUrls.push(url);
          setUploadProgress(Math.round(((i + 1) / toUpload.length) * 100));
        } catch (err: any) {
          toast.error(`Failed to upload ${toUpload[i].name}: ${err.message}`);
        }
      }

      if (newUrls.length > 0) {
        if (single) {
          onChange(newUrls.slice(0, 1));
        } else {
          onChange([...images, ...newUrls]);
        }
        toast.success(
          `${newUrls.length} image${newUrls.length > 1 ? "s" : ""} uploaded`
        );
      }

      setUploading(false);
      setUploadProgress(0);
    },
    [images, onChange, folder, effectiveMax, single]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      if (e.dataTransfer.files.length > 0) {
        handleFiles(e.dataTransfer.files);
      }
    },
    [handleFiles]
  );

  const removeImage = (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    onChange(updated);
  };

  const moveImage = (from: number, to: number) => {
    if (to < 0 || to >= images.length) return;
    const updated = [...images];
    const [moved] = updated.splice(from, 1);
    updated.splice(to, 0, moved);
    onChange(updated);
  };

  return (
    <div className="space-y-3">
      {label && (
        <label className="text-sm font-medium text-slate-700">{label}</label>
      )}

      {/* Existing images grid */}
      {images.length > 0 && (
        <div className={`grid gap-3 ${single ? "grid-cols-1" : "grid-cols-2 sm:grid-cols-3 md:grid-cols-4"}`}>
          {images.map((url, index) => (
            <div
              key={`${url}-${index}`}
              className="relative group rounded-lg overflow-hidden border border-slate-200 bg-slate-50 aspect-[4/3]"
            >
              <img
                src={url}
                alt={`Image ${index + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              {/* Overlay controls */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                {!single && images.length > 1 && (
                  <>
                    <button
                      onClick={() => moveImage(index, index - 1)}
                      disabled={index === 0}
                      className="p-1.5 bg-white/90 rounded-md text-slate-700 hover:bg-white disabled:opacity-30 transition-colors"
                      title="Move left"
                    >
                      <GripVertical className="h-3.5 w-3.5 rotate-90" />
                    </button>
                  </>
                )}
                <button
                  onClick={() => removeImage(index)}
                  className="p-1.5 bg-red-500/90 rounded-md text-white hover:bg-red-600 transition-colors"
                  title="Remove"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
              {/* Index badge */}
              {!single && images.length > 1 && (
                <div className="absolute top-1.5 left-1.5 bg-black/60 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                  {index === 0 ? "Cover" : index + 1}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Upload zone */}
      {images.length < effectiveMax && (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
            dragOver
              ? "border-teal-400 bg-teal-50/50"
              : "border-slate-300 hover:border-teal-400 hover:bg-slate-50"
          } ${uploading ? "pointer-events-none opacity-60" : ""}`}
        >
          {uploading ? (
            <div className="space-y-3">
              <Loader2 className="h-8 w-8 mx-auto text-teal-500 animate-spin" />
              <p className="text-sm text-slate-600">Uploading... {uploadProgress}%</p>
              <div className="w-full max-w-xs mx-auto bg-slate-200 rounded-full h-2">
                <div
                  className="bg-teal-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="w-12 h-12 mx-auto rounded-xl bg-slate-100 flex items-center justify-center">
                <Upload className="h-5 w-5 text-slate-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-700">
                  {single ? "Click or drag to upload image" : "Click or drag to upload images"}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  JPEG, PNG, WebP, GIF • Max 10MB each
                  {!single && ` • ${images.length}/${effectiveMax} uploaded`}
                </p>
              </div>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            multiple={!single}
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                handleFiles(e.target.files);
                e.target.value = "";
              }
            }}
          />
        </div>
      )}
    </div>
  );
}
