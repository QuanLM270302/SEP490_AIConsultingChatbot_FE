"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui";
import { listTagsManage, createTag, updateTag, deactivateTag } from "@/lib/api/tags";
import type {
  DocumentTagResponse,
  CreateDocumentTagRequest,
  UpdateDocumentTagRequest,
} from "@/types/knowledge";
import { Plus, Pencil, X, Ban } from "lucide-react";

export function TagsTab() {
  const [tags, setTags] = useState<DocumentTagResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [editTag, setEditTag] = useState<DocumentTagResponse | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listTagsManage();
      setTags(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Lỗi tải danh sách thẻ");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
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
      setError(e instanceof Error ? e.message : "Tạo thất bại");
    }
  };

  const handleUpdate = async (id: string, body: UpdateDocumentTagRequest) => {
    setError(null);
    try {
      await updateTag(id, body);
      setEditTag(null);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Cập nhật thất bại");
    }
  };

  const handleDeactivate = async (id: string) => {
    if (!confirm("Vô hiệu hóa thẻ này?")) return;
    setError(null);
    try {
      await deactivateTag(id);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Vô hiệu hóa thất bại");
    }
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-950">
        <p className="text-sm text-zinc-500">Đang tải danh sách thẻ…</p>
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
          Tạo thẻ
        </Button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
        <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-700">
          <thead className="bg-zinc-50 dark:bg-zinc-900">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400">Tên</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400">Mã</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400">Mô tả</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400">Trạng thái</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-zinc-500 dark:text-zinc-400">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
            {tags.map((t) => (
              <tr key={t.id}>
                <td className="px-4 py-3 text-sm text-zinc-900 dark:text-white">{t.name}</td>
                <td className="px-4 py-3 text-sm text-zinc-600 dark:text-zinc-300">{t.code}</td>
                <td className="px-4 py-3 text-sm text-zinc-600 dark:text-zinc-300">{t.description || "—"}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${t.isActive ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400" : "bg-red-500/20 text-red-600 dark:text-red-400"}`}>
                    {t.isActive ? "Active" : "Đã vô hiệu"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  {t.isActive && (
                    <>
                      <button type="button" onClick={() => setEditTag(t)} className="mr-2 rounded p-1.5 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button type="button" onClick={() => handleDeactivate(t.id)} className="rounded p-1.5 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/30" title="Vô hiệu hóa">
                        <Ban className="h-4 w-4" />
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {tags.length === 0 && (
          <p className="px-4 py-6 text-center text-sm text-zinc-500">Chưa có thẻ nào. Hãy tạo mới phía trên.</p>
        )}
      </div>

      {createOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">Tạo thẻ mới</h3>
              <button type="button" onClick={() => setCreateOpen(false)} className="rounded p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Tên *</label>
                <input name="name" type="text" required className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Mã * (duy nhất)</label>
                <input name="code" type="text" required className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900" placeholder="VD: POLICY" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Mô tả</label>
                <input name="description" type="text" className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900" />
              </div>
              <div className="flex gap-2">
                <Button type="submit" variant="primary" size="md">Tạo</Button>
                <Button type="button" variant="outline" size="md" onClick={() => setCreateOpen(false)}>Hủy</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editTag && editTag.isActive && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">Sửa tag</h3>
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
        <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Tên *</label>
        <input value={name} onChange={(e) => setName(e.target.value)} type="text" required className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900" />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Mã *</label>
        <input value={code} onChange={(e) => setCode(e.target.value)} type="text" required className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900" />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Mô tả</label>
        <input value={description} onChange={(e) => setDescription(e.target.value)} type="text" className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900" />
      </div>
      <div className="flex gap-2">
        <Button type="submit" variant="primary" size="md">Lưu</Button>
        <Button type="button" variant="outline" size="md" onClick={onClose}>Hủy</Button>
      </div>
    </form>
  );
}
