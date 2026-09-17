import { useRef, useState } from "react";
import {
  Camera,
  ClipboardPaste,
  Image as ImageIcon,
  Link as LinkIcon,
  Plus,
  Upload,
  X,
} from "lucide-react";
import type { Category, ItemType, SavedItem } from "../types";
import { useAppStore } from "../store/AppStore";
import { extractDomain } from "../utils/format";
import { ColorSwatchButton } from "./ColorSwatchButton";
import { COLOR_PRESETS } from "../data/defaultCategories";

interface AddItemSheetProps {
  categories: Category[];
  onClose: () => void;
}

const TYPE_TABS: { type: ItemType; label: string; icon: typeof LinkIcon }[] = [
  { type: "link", label: "링크", icon: LinkIcon },
  { type: "screenshot", label: "스크린샷", icon: Camera },
  { type: "photo", label: "사진", icon: ImageIcon },
];

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export function AddItemSheet({ categories, onClose }: AddItemSheetProps) {
  const { addItem, addCategory } = useAppStore();
  const [type, setType] = useState<ItemType>("link");
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [note, setNote] = useState("");
  const [imageDataUrl, setImageDataUrl] = useState<string | undefined>();
  const [categoryId, setCategoryId] = useState<string>(categories[0]?.id ?? "");
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryColor, setNewCategoryColor] = useState(COLOR_PRESETS[0]);
  const [clipboardError, setClipboardError] = useState<string | null>(null);
  const [importingCount, setImportingCount] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedCategory = categories.find((c) => c.id === categoryId);

  const canSubmit =
    title.trim().length > 0 &&
    categoryId &&
    (type !== "link" ? Boolean(imageDataUrl) : true);

  async function handleFiles(fileList: FileList) {
    const files = Array.from(fileList);
    if (files.length === 0) return;

    if (files.length === 1) {
      const dataUrl = await readFileAsDataUrl(files[0]);
      setImageDataUrl(dataUrl);
      return;
    }

    setImportingCount(files.length);
    const dataUrls = await Promise.all(files.map(readFileAsDataUrl));
    files.forEach((file, i) => {
      const base = file.name.replace(/\.[^/.]+$/, "").trim();
      addItem({
        type,
        title: base || `${type === "screenshot" ? "스크린샷" : "사진"} ${i + 1}`,
        categoryId,
        imageDataUrl: dataUrls[i],
      });
    });
    setImportingCount(null);
    onClose();
  }

  async function handlePasteFromClipboard() {
    setClipboardError(null);
    try {
      const text = (await navigator.clipboard.readText()).trim();
      if (/^https?:\/\//i.test(text)) {
        setUrl(text);
      } else {
        setClipboardError("클립보드에 링크가 없어요.");
      }
    } catch {
      setClipboardError("클립보드 접근 권한이 필요해요.");
    }
  }

  function handleCreateCategory() {
    if (!newCategoryName.trim()) return;
    const created = addCategory({ name: newCategoryName.trim(), color: newCategoryColor });
    setCategoryId(created.id);
    setNewCategoryName("");
    setShowNewCategory(false);
  }

  function handleSubmit() {
    if (!canSubmit) return;
    const item: Omit<SavedItem, "id" | "createdAt"> = {
      type,
      title: title.trim(),
      note: note.trim() || undefined,
      categoryId,
      ...(type === "link"
        ? { url: url.trim() || undefined, domain: url.trim() ? extractDomain(url.trim()) : undefined }
        : { imageDataUrl }),
    };
    addItem(item);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="w-full sm:max-w-md max-h-[90vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl bg-white dark:bg-[#1c1c1e] shadow-[var(--shadow-pop)] animate-sheet-up sm:animate-pop-in">
        <div className="flex items-center justify-between px-5 pt-5 pb-3 sticky top-0 bg-white dark:bg-[#1c1c1e] z-10">
          <h2 className="text-lg font-bold text-black/90 dark:text-white/90">새로 저장하기</h2>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black/[0.06] dark:bg-white/[0.1] flex items-center justify-center"
            aria-label="닫기"
          >
            <X size={16} />
          </button>
        </div>

        <div className="px-5 pb-6 space-y-5">
          <div className="flex gap-2 bg-black/[0.05] dark:bg-white/[0.06] rounded-xl p-1">
            {TYPE_TABS.map(({ type: t, label, icon: Icon }) => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg py-2 text-[13px] font-semibold transition-colors ${
                  type === t
                    ? "bg-white dark:bg-[#3a3a3c] text-black dark:text-white shadow-sm"
                    : "text-black/45 dark:text-white/45"
                }`}
              >
                <Icon size={14} />
                {label}
              </button>
            ))}
          </div>

          <div>
            <p className="text-[12px] font-semibold text-black/40 dark:text-white/40 mb-2 tracking-wide uppercase">
              카테고리
            </p>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategoryId(cat.id)}
                  className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-all active:scale-95 ${
                    categoryId === cat.id
                      ? "text-white shadow-sm"
                      : "bg-black/[0.05] dark:bg-white/[0.08] text-black/70 dark:text-white/75"
                  }`}
                  style={categoryId === cat.id ? { backgroundColor: cat.color } : undefined}
                >
                  {categoryId !== cat.id && (
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
                  )}
                  {cat.name}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setShowNewCategory((s) => !s)}
                className="flex items-center gap-1 rounded-full px-3 py-1.5 text-[13px] font-medium border border-dashed border-black/20 dark:border-white/25 text-black/45 dark:text-white/45"
              >
                <Plus size={13} />새 카테고리
              </button>
            </div>

            {showNewCategory && (
              <div className="mt-3 flex items-center gap-2 rounded-xl bg-black/[0.03] dark:bg-white/[0.05] p-2.5 animate-pop-in">
                <ColorSwatchButton value={newCategoryColor} onChange={setNewCategoryColor} size={30} />
                <input
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleCreateCategory()}
                  placeholder="카테고리 이름"
                  className="flex-1 bg-transparent text-[14px] outline-none placeholder:text-black/35 dark:placeholder:text-white/35"
                />
                <button
                  type="button"
                  onClick={handleCreateCategory}
                  disabled={!newCategoryName.trim()}
                  className="rounded-lg bg-black dark:bg-white text-white dark:text-black text-[13px] font-semibold px-3 py-1.5 disabled:opacity-30"
                >
                  추가
                </button>
              </div>
            )}
          </div>

          {type !== "link" && (
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => {
                  if (e.target.files) void handleFiles(e.target.files);
                  e.target.value = "";
                }}
              />
              {imageDataUrl ? (
                <div className="relative rounded-2xl overflow-hidden">
                  <img src={imageDataUrl} alt="preview" className="w-full max-h-56 object-cover" />
                  <button
                    type="button"
                    onClick={() => setImageDataUrl(undefined)}
                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/50 text-white flex items-center justify-center"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={importingCount !== null}
                    className="w-full flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-black/15 dark:border-white/20 py-10 text-black/40 dark:text-white/40 hover:border-black/25 dark:hover:border-white/30 transition-colors disabled:opacity-50"
                  >
                    <Upload size={22} />
                    <span className="text-[13px] font-medium">
                      {importingCount !== null
                        ? `${importingCount}장 가져오는 중...`
                        : type === "screenshot"
                          ? "스크린샷 업로드"
                          : "사진 업로드"}
                    </span>
                  </button>
                  <p className="mt-2 text-[12px] text-black/35 dark:text-white/35 text-center">
                    갤러리에서 여러 장을 한 번에 선택하면{" "}
                    {selectedCategory && (
                      <span className="font-medium" style={{ color: selectedCategory.color }}>
                        '{selectedCategory.name}'
                      </span>
                    )}{" "}
                    카테고리로 바로 저장돼요
                  </p>
                </>
              )}
            </div>
          )}

          <div className="space-y-3">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="제목"
              className="w-full rounded-xl bg-black/[0.05] dark:bg-white/[0.07] px-4 py-3 text-[15px] font-medium outline-none focus:ring-2 focus:ring-[var(--color-accent)] placeholder:text-black/35 dark:placeholder:text-white/35"
            />
            {type === "link" && (
              <div>
                <div className="relative">
                  <input
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://instagram.com/p/... 등 링크 붙여넣기"
                    className="w-full rounded-xl bg-black/[0.05] dark:bg-white/[0.07] pl-4 pr-11 py-3 text-[14px] outline-none focus:ring-2 focus:ring-[var(--color-accent)] placeholder:text-black/35 dark:placeholder:text-white/35"
                  />
                  <button
                    type="button"
                    onClick={handlePasteFromClipboard}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-lg bg-black/[0.06] dark:bg-white/[0.1] flex items-center justify-center text-black/50 dark:text-white/55"
                    aria-label="클립보드에서 붙여넣기"
                  >
                    <ClipboardPaste size={14} />
                  </button>
                </div>
                {clipboardError && (
                  <p className="mt-1.5 text-[12px] text-black/40 dark:text-white/40 px-1">
                    {clipboardError}
                  </p>
                )}
              </div>
            )}
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="메모 (선택)"
              rows={2}
              className="w-full resize-none rounded-xl bg-black/[0.05] dark:bg-white/[0.07] px-4 py-3 text-[14px] outline-none focus:ring-2 focus:ring-[var(--color-accent)] placeholder:text-black/35 dark:placeholder:text-white/35"
            />
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="w-full rounded-xl bg-[var(--color-accent)] text-white font-semibold py-3.5 text-[15px] transition-transform active:scale-[0.98] disabled:opacity-30"
          >
            저장하기
          </button>
        </div>
      </div>
    </div>
  );
}
