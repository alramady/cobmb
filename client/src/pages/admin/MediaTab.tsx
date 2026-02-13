import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Image, Trash2, Copy } from "lucide-react";
import { toast } from "sonner";
import ImageUploader from "@/components/ImageUploader";

export function MediaTab({ isArabic }: { isArabic: boolean }) {
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  const removeImage = (idx: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== idx));
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-[#0B1E2D] mb-2 flex items-center gap-2">
          <Image className="h-5 w-5 text-teal-500" />
          {isArabic ? "مكتبة الوسائط" : "Media Library"}
        </h3>
        <p className="text-sm text-slate-500 mb-4">
          {isArabic
            ? "ارفع الصور هنا وانسخ الروابط لاستخدامها في أي مكان بالموقع"
            : "Upload images here and copy URLs to use anywhere on the site"}
        </p>
        <ImageUploader images={uploadedImages} onChange={setUploadedImages} folder="media" maxFiles={50} />
      </div>

      {uploadedImages.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-[#0B1E2D]">
              {isArabic ? "الصور المرفوعة" : "Uploaded Images"} ({uploadedImages.length})
            </h3>
            <Button variant="outline" size="sm" onClick={() => {
              navigator.clipboard.writeText(uploadedImages.join("\n"));
              toast.success(isArabic ? "تم نسخ جميع الروابط" : "All URLs copied!");
            }}>
              <Copy className="h-3.5 w-3.5 me-1" /> {isArabic ? "نسخ الكل" : "Copy All"}
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {uploadedImages.map((url, i) => (
              <div key={i} className="group relative bg-slate-50 rounded-lg overflow-hidden border border-slate-200">
                <img src={url} alt="" className="w-full h-32 object-cover" />
                <div className="p-2 flex items-center gap-2">
                  <input
                    readOnly
                    value={url}
                    className="flex-1 text-[10px] bg-transparent text-slate-500 outline-none truncate"
                    onClick={(e) => (e.target as HTMLInputElement).select()}
                  />
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => { navigator.clipboard.writeText(url); toast.success("Copied!"); }}>
                    <Copy className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-red-400 hover:text-red-600" onClick={() => removeImage(i)}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {uploadedImages.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center text-slate-400">
          <Image className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p>{isArabic ? "لا توجد صور مرفوعة بعد" : "No images uploaded yet"}</p>
          <p className="text-xs mt-1">{isArabic ? "استخدم الأداة أعلاه لرفع الصور" : "Use the uploader above to add images"}</p>
        </div>
      )}
    </div>
  );
}
