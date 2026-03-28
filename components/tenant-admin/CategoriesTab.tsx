"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui";
import {
  listCategoriesFlat,
  listCategoriesTree,
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/lib/api/categories";
import type {
  DocumentCategoryResponse,
  CreateDocumentCategoryRequest,
  UpdateDocumentCategoryRequest,
} from "@/types/knowledge";
import { Plus, Pencil, Trash2, X, ChevronRight } from "lucide-react";

export function CategoriesTab() {
  const [flat, setFlat] = useState<DocumentCategoryResponse[]>([]);
  const [tree, setTree] = useState<DocumentCategoryResponse[]>([]);
  const [viewMode, setViewMode] = useState<"flat" | "tree">("tree");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [editCat, setEditCat] = useState<DocumentCategoryResponse | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const [f, t] = await Promise.all([listCategoriesFlat(), listCategoriesTree()]);
      setFlat(f);
      setTree(t);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Lỗi tải danh mục");
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
    const code = (form.elements.namedItem("code") as HTMLInputElement)?.value?.trim().toUpperCase();
    const description = (form.elements.namedItem("description") as HTMLInputElement)?.value?.trim() || undefined;
    const parentId = (form.elements.namedItem("parentId") as HTMLSelectElement)?.value || undefined;
    if (!name || !code) return;
    setError(null);
    try {
      const body: CreateDocumentCategoryRequest = { name, code, description: description || null, parentId: parentId || null };
      await createCategory(body);
      setCreateOpen(false);
      form.reset();
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Tạo thất bại");
    }
  };

  const handleUpdate = async (id: string, body: UpdateDocumentCategoryRequest) => {
    setError(null);
    try {
      await updateCategory(id, body);
      setEditCat(null);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Cập nhật thất bại");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Vô hiệu hóa danh mục này? (xóa mềm)")) return;
    setError(null);
    try {
      await deleteCategory(id);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Xóa thất bại");
    }
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-950">
        <p className="text-sm text-zinc-500">Đang tải danh mục…</p>
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

      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setViewMode("tree")}
            className={`rounded-lg px-4 py-2 text-sm font-medium ${viewMode === "tree" ? "bg-green-500 text-white" : "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"}`}
          >
            Xem cây
          </button>
          <button
            type="button"
            onClick={() => setViewMode("flat")}
            className={`rounded-lg px-4 py-2 text-sm font-medium ${viewMode === "flat" ? "bg-green-500 text-white" : "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"}`}
          >
            Danh sách phẳng
          </button>
        </div>
        <Button variant="primary" size="md" onClick={() => setCreateOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Tạo danh mục
        </Button>
      </div>

      {viewMode === "flat" ? (
        <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
          <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-700">
            <thead className="bg-zinc-50 dark:bg-zinc-900">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400">Tên</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400">Mã</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400">Mô tả</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-zinc-500 dark:text-zinc-400">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
              {flat.map((c) => (
                <tr key={c.id}>
                  <td className="px-4 py-3 text-sm text-zinc-900 dark:text-white">{c.name}</td>
                  <td className="px-4 py-3 text-sm text-zinc-600 dark:text-zinc-300">{c.code}</td>
                  <td className="px-4 py-3 text-sm text-zinc-600 dark:text-zinc-300">{c.description || "—"}</td>
                  <td className="px-4 py-3 text-right">
                    <button type="button" onClick={() => setEditCat(c)} className="mr-2 rounded p-1.5 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800">
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button type="button" onClick={() => handleDelete(c.id)} className="rounded p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {flat.length === 0 && (
            <p className="px-4 py-6 text-center text-sm text-zinc-500">Chưa có danh mục. Hãy tạo mới phía trên.</p>
          )}
        </div>
      ) : (
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
          <CategoryTree nodes={tree} onEdit={setEditCat} onDelete={handleDelete} />
          {tree.length === 0 && (
            <p className="py-6 text-center text-sm text-zinc-500">Chưa có category.</p>
          )}
        </div>
      )}

      {createOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">Tạo danh mục mới</h3>
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
                <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Code * (unique)</label>
                <input name="code" type="text" required className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900" placeholder="VD: HR" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Mô tả</label>
                <input name="description" type="text" className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Danh mục cha</label>
                <select name="parentId" className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900">
                  <option value="">— Gốc —</option>
                  {flat.map((c) => (
                    <option key={c.id} value={c.id}>{c.name} ({c.code})</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2">
                <Button type="submit" variant="primary" size="md">Tạo</Button>
                <Button type="button" variant="outline" size="md" onClick={() => setCreateOpen(false)}>Hủy</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editCat && (
        <EditCategoryModal
          category={editCat}
          parentOptions={flat.filter((c) => c.id !== editCat.id)}
          onClose={() => setEditCat(null)}
          onSave={(body) => handleUpdate(editCat.id, body)}
        />
      )}
    </div>
  );
}

function CategoryTree({
  nodes,
  onEdit,
  onDelete,
  depth = 0,
}: {
  nodes: DocumentCategoryResponse[];
  onEdit: (c: DocumentCategoryResponse) => void;
  onDelete: (id: string) => void;
  depth?: number;
}) {
  return (
    <ul className={depth > 0 ? "ml-4 border-l border-zinc-200 pl-4 dark:border-zinc-700" : "space-y-1"}>
      {nodes.map((node) => (
        <li key={node.id} className="py-1">
          <div className="flex items-center justify-between rounded-lg bg-zinc-50 px-3 py-2 dark:bg-zinc-900">
            <div className="flex items-center gap-2">
              {depth > 0 && <ChevronRight className="h-4 w-4 text-zinc-400" />}
              <span className="font-medium text-zinc-900 dark:text-white">{node.name}</span>
              <span className="text-xs text-zinc-500">({node.code})</span>
            </div>
            <div>
              <button type="button" onClick={() => onEdit(node)} className="mr-2 rounded p-1.5 text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-800">
                <Pencil className="h-4 w-4" />
              </button>
              <button type="button" onClick={() => onDelete(node.id)} className="rounded p-1.5 text-red-500 hover:bg-red-100 dark:hover:bg-red-950/30">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
          {node.children && node.children.length > 0 && (
            <CategoryTree nodes={node.children} onEdit={onEdit} onDelete={onDelete} depth={depth + 1} />
          )}
        </li>
      ))}
    </ul>
  );
}

function EditCategoryModal({
  category,
  parentOptions,
  onClose,
  onSave,
}: {
  category: DocumentCategoryResponse;
  parentOptions: DocumentCategoryResponse[];
  onClose: () => void;
  onSave: (body: UpdateDocumentCategoryRequest) => void;
}) {
  const [name, setName] = useState(category.name);
  const [code, setCode] = useState(category.code);
  const [description, setDescription] = useState(category.description ?? "");
  const [parentId, setParentId] = useState<string | null>(category.parentId ?? null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name,
      code: code.toUpperCase().trim(),
      description: description.trim() || null,
      parentId: parentId || null,
      isActive: category.isActive ?? true,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">Sửa danh mục</h3>
          <button type="button" onClick={onClose} className="rounded p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800">
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Tên *</label>
            <input value={name} onChange={(e) => setName(e.target.value)} type="text" required className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Code *</label>
            <input value={code} onChange={(e) => setCode(e.target.value)} type="text" required className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Mô tả</label>
            <input value={description} onChange={(e) => setDescription(e.target.value)} type="text" className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Danh mục cha</label>
            <select value={parentId ?? ""} onChange={(e) => setParentId(e.target.value || null)} className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900">
              <option value="">— Gốc —</option>
              {parentOptions.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-2">
            <Button type="submit" variant="primary" size="md">Lưu</Button>
            <Button type="button" variant="outline" size="md" onClick={onClose}>Hủy</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
