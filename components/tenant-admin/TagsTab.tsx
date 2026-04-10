"use client";

import { useState, useEffect } from "react";
import { Button, useConfirmDialog } from "@/components/ui";
import { useLanguageStore } from "@/lib/language-store";
import { translations } from "@/lib/translations";
import { listTagsManage, createTag, updateTag, deactivateTag, activateTag, deleteTag } from "@/lib/api/tags";
import type {
  DocumentTagResponse,
  CreateDocumentTagRequest,
  UpdateDocumentTagRequest,
} from "@/types/knowledge";
import { Plus, Pencil, X, Ban, Check, Trash2 } from "lucide-react";

export function TagsTab() {
  const [tags, setTags] = useState<DocumentTagResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [editTag, setEditTag] = useState<DocumentTagResponse | null>(null);
  const { confirm, confirmDialog } = useConfirmDialog();
  const { language } = useLanguageStore();
  const t = translations[language];
  const isEn = language === "en";

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listTagsManage();
      setTags(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : isEn ? "Failed to load tags" : "Lỗi tải danh sách thẻ");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const name = (form.elements.namedItem("name") as HTMLInputElement)?.value?.trim();
    const code = (form.elements.namedItem("code") as HTMLInputElement)?.value?.trim();
    const description = (form.elements.namedItem("description") as HTMLInputElement)?.value?.trim() || undefined;
    if (!name || !code) return;
    setError(null);
    try {
      const body: CreateDocumentTagRequest = { name, code, description: description || null };
      await createTag(body);
      setCreateOpen(false);
      form.reset();
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : isEn ? "Create failed" : "Tạo thất bại");
    }
  };

  const handleUpdate = async (id: string, body: UpdateDocumentTagRequest) => {
    setError(null);
    try {
      await updateTag(id, body);
      setEditTag(null);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : isEn ? "Update failed" : "Cập nhật thất bại");
    }
  };

  const handleDeactivate = async (id: string) => {
    const ok = await confirm({
      title: isEn ? "Deactivate tag?" : "Vô hiệu hóa thẻ?",
      description: isEn ? "This tag will be hidden from active lists." : "Thẻ sẽ ẩn khỏi danh sách active.",
      confirmText: isEn ? "Deactivate" : "Vô hiệu hóa",
      cancelText: t.cancel,
      tone: "warning",
    });
    if (!ok) return;

    setError(null);
    try {
      await deactivateTag(id);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : isEn ? "Deactivate failed" : "Vô hiệu hóa thất bại");
    }
  };

  const handleActivate = async (id: string) => {
    const ok = await confirm({
      title: isEn ? "Reactivate tag?" : "Kích hoạt lại thẻ?",
      description: isEn ? "This tag will appear again in active lists." : "Thẻ sẽ xuất hiện lại trong danh sách active.",
      confirmText: isEn ? "Activate" : "Kích hoạt",
      cancelText: t.cancel,
      tone: "default",
    });
    if (!ok) return;

    setError(null);
    try {
      await activateTag(id);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : isEn ? "Activate failed" : "Kích hoạt thất bại");
    }
  };

  const handleDelete = async (id: string) => {
    const ok = await confirm({
      title: isEn ? "Delete tag permanently?" : "Xóa vĩnh viễn thẻ?",
      description: isEn ? "This action cannot be undone." : "Hành động này không thể hoàn tác.",
      confirmText: t.delete,
      cancelText: t.cancel,
      tone: "danger",
    });
    if (!ok) return;

    setError(null);
    try {
      await deleteTag(id);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : isEn ? "Permanent delete failed" : "Xóa vĩnh viễn thất bại");
    }
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-950">
        <p className="text-sm text-zinc-500">{isEn ? "Loading tags..." : "Đang tải danh sách thẻ..."}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800 dark:bg-red-950/50 dark:text-red-200">
          {error}
        </div>
      )}

      <div className="flex justify-end">
        <Button variant="primary" size="md" onClick={() => setCreateOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          {isEn ? "Create tag" : "Tạo thẻ"}
        </Button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
        <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-700">
          <thead className="bg-zinc-50 dark:bg-zinc-900">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400">{t.name}</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400">{t.code}</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400">{t.description}</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400">{t.status}</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-zinc-500 dark:text-zinc-400">{t.actions}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
            {tags.map((tag) => (
              <tr key={tag.id}>
                <td className="px-4 py-3 text-sm text-zinc-900 dark:text-white">{tag.name}</td>
                <td className="px-4 py-3 text-sm text-zinc-600 dark:text-zinc-300">{tag.code}</td>
                <td className="px-4 py-3 text-sm text-zinc-600 dark:text-zinc-300">{tag.description || "—"}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${tag.isActive ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400" : "bg-red-500/20 text-red-600 dark:text-red-400"}`}>
                    {tag.isActive ? t.active : t.inactive}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  {tag.isActive && (
                    <>
                      <button type="button" onClick={() => setEditTag(tag)} className="mr-2 rounded p-1.5 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button type="button" onClick={() => void handleDeactivate(tag.id)} className="rounded p-1.5 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/30" title={isEn ? "Deactivate" : "Vô hiệu hóa"}>
                        <Ban className="h-4 w-4" />
                      </button>
                    </>
                  )}
                  {!tag.isActive && (
                    <button
                      type="button"
                      onClick={() => void handleActivate(tag.id)}
                      className="rounded p-1.5 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
                      title={isEn ? "Activate" : "Kích hoạt"}
                    >
                      <Check className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => void handleDelete(tag.id)}
                    className={`rounded p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 ${tag.isActive ? "ml-2" : ""}`}
                    title={isEn ? "Delete permanently" : "Xóa vĩnh viễn"}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {tags.length === 0 && (
          <p className="px-4 py-6 text-center text-sm text-zinc-500">
            {isEn ? "No tags yet. Create one above." : "Chưa có thẻ nào. Hãy tạo mới phía trên."}
          </p>
        )}
      </div>

      {createOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">{isEn ? "Create tag" : "Tạo thẻ mới"}</h3>
              <button type="button" onClick={() => setCreateOpen(false)} className="rounded p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">{t.name} *</label>
                <input name="name" type="text" required className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  {isEn ? "Code * (unique)" : "Mã * (duy nhất)"}
                </label>
                <input
                  name="code"
                  type="text"
                  required
                  className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
                  placeholder={isEn ? "Eg: POLICY" : "VD: POLICY"}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">{t.description}</label>
                <input name="description" type="text" className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900" />
              </div>
              <div className="flex gap-2">
                <Button type="submit" variant="primary" size="md">{t.create}</Button>
                <Button type="button" variant="outline" size="md" onClick={() => setCreateOpen(false)}>{t.cancel}</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editTag && editTag.isActive && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">{isEn ? "Edit tag" : "Sửa tag"}</h3>
              <button type="button" onClick={() => setEditTag(null)} className="rounded p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800">
                <X className="h-5 w-5" />
              </button>
            </div>
            <EditTagForm
              tag={editTag}
              onClose={() => setEditTag(null)}
              onSave={(body) => handleUpdate(editTag.id, body)}
            />
          </div>
        </div>
      )}

      {confirmDialog}
    </div>
  );
}

function EditTagForm({
  tag,
  onClose,
  onSave,
}: {
  tag: DocumentTagResponse;
  onClose: () => void;
  onSave: (body: UpdateDocumentTagRequest) => void;
}) {
  const { language } = useLanguageStore();
  const t = translations[language];
  const [name, setName] = useState(tag.name);
  const [code, setCode] = useState(tag.code);
  const [description, setDescription] = useState(tag.description ?? "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name,
      code: code.trim(),
      description: description.trim() || null,
      isActive: true,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">{t.name} *</label>
        <input value={name} onChange={(e) => setName(e.target.value)} type="text" required className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900" />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">{t.code} *</label>
        <input value={code} onChange={(e) => setCode(e.target.value)} type="text" required className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900" />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">{t.description}</label>
        <input value={description} onChange={(e) => setDescription(e.target.value)} type="text" className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900" />
      </div>
      <div className="flex gap-2">
        <Button type="submit" variant="primary" size="md">{t.save}</Button>
        <Button type="button" variant="outline" size="md" onClick={onClose}>{t.cancel}</Button>
      </div>
    </form>
  );
}
