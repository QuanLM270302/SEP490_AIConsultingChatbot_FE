"use client";

import { useEffect, useState } from "react";
import { Button, useConfirmDialog } from "@/components/ui";
import {
  activateCategory,
  createCategory,
  deactivateCategory,
  deleteCategoryPermanently,
  listCategoriesManage,
  updateCategory,
} from "@/lib/api/categories";
import type {
  CreateDocumentCategoryRequest,
  DocumentCategoryResponse,
  UpdateDocumentCategoryRequest,
} from "@/types/knowledge";
import { Ban, Check, ChevronRight, Pencil, Plus, Trash2, X } from "lucide-react";

function buildCategoryTree(flat: DocumentCategoryResponse[]): DocumentCategoryResponse[] {
  const byId = new Map<string, DocumentCategoryResponse>();
  for (const category of flat) {
    byId.set(category.id, { ...category, children: [] });
  }

  const roots: DocumentCategoryResponse[] = [];
  for (const category of byId.values()) {
    if (category.parentId && byId.has(category.parentId)) {
      const parent = byId.get(category.parentId);
      if (parent) {
        parent.children = [...(parent.children ?? []), category];
      }
      continue;
    }
    roots.push(category);
  }

  return roots;
}

export function CategoriesTab() {
  const [flat, setFlat] = useState<DocumentCategoryResponse[]>([]);
  const [tree, setTree] = useState<DocumentCategoryResponse[]>([]);
  const [viewMode, setViewMode] = useState<"flat" | "tree">("tree");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [editCat, setEditCat] = useState<DocumentCategoryResponse | null>(null);
  const { confirm, confirmDialog } = useConfirmDialog();

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const categories = await listCategoriesManage();
      setFlat(categories);
      setTree(buildCategoryTree(categories));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Loi tai danh muc");
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
    const code = (form.elements.namedItem("code") as HTMLInputElement)?.value?.trim().toUpperCase();
    const description =
      (form.elements.namedItem("description") as HTMLInputElement)?.value?.trim() || undefined;
    const parentId = (form.elements.namedItem("parentId") as HTMLSelectElement)?.value || undefined;
    if (!name || !code) return;

    setError(null);
    try {
      const body: CreateDocumentCategoryRequest = {
        name,
        code,
        description: description || null,
        parentId: parentId || null,
      };
      await createCategory(body);
      setCreateOpen(false);
      form.reset();
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Tao that bai");
    }
  };

  const handleUpdate = async (id: string, body: UpdateDocumentCategoryRequest) => {
    setError(null);
    try {
      await updateCategory(id, body);
      setEditCat(null);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Cap nhat that bai");
    }
  };

  const handleDeactivate = async (id: string) => {
    const ok = await confirm({
      title: "Vo hieu hoa danh muc?",
      description: "Danh muc se an khoi danh sach active.",
      confirmText: "Vo hieu hoa",
      cancelText: "Huy",
      tone: "warning",
    });
    if (!ok) return;

    setError(null);
    try {
      await deactivateCategory(id);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Vo hieu hoa that bai");
    }
  };

  const handleActivate = async (id: string) => {
    const ok = await confirm({
      title: "Kich hoat lai danh muc?",
      description: "Danh muc se hien lai trong danh sach active.",
      confirmText: "Kich hoat",
      cancelText: "Huy",
      tone: "default",
    });
    if (!ok) return;

    setError(null);
    try {
      await activateCategory(id);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Kich hoat that bai");
    }
  };

  const handleDeletePermanent = async (id: string) => {
    const ok = await confirm({
      title: "Xoa vinh vien danh muc?",
      description: "Hanh dong nay khong the hoan tac.",
      confirmText: "Xoa",
      cancelText: "Huy",
      tone: "danger",
    });
    if (!ok) return;

    setError(null);
    try {
      await deleteCategoryPermanently(id);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Xoa vinh vien that bai");
    }
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-950">
        <p className="text-sm text-zinc-500">Dang tai danh muc...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error ? (
        <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800 dark:bg-red-950/50 dark:text-red-200">
          {error}
        </div>
      ) : null}

      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setViewMode("tree")}
            className={`rounded-lg px-4 py-2 text-sm font-medium ${
              viewMode === "tree"
                ? "bg-green-500 text-white"
                : "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
            }`}
          >
            Xem cay
          </button>
          <button
            type="button"
            onClick={() => setViewMode("flat")}
            className={`rounded-lg px-4 py-2 text-sm font-medium ${
              viewMode === "flat"
                ? "bg-green-500 text-white"
                : "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
            }`}
          >
            Danh sach phang
          </button>
        </div>
        <Button variant="primary" size="md" onClick={() => setCreateOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Tao danh muc
        </Button>
      </div>

      {viewMode === "flat" ? (
        <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
          <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-700">
            <thead className="bg-zinc-50 dark:bg-zinc-900">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400">Ten</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400">Ma</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400">Mo ta</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400">Trang thai</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-zinc-500 dark:text-zinc-400">Thao tac</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
              {flat.map((category) => (
                <tr key={category.id}>
                  <td className="px-4 py-3 text-sm text-zinc-900 dark:text-white">{category.name}</td>
                  <td className="px-4 py-3 text-sm text-zinc-600 dark:text-zinc-300">{category.code}</td>
                  <td className="px-4 py-3 text-sm text-zinc-600 dark:text-zinc-300">{category.description || "-"}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${(category.isActive ?? true)
                        ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                        : "bg-zinc-500/20 text-zinc-600 dark:text-zinc-400"
                        }`}
                    >
                      {(category.isActive ?? true) ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => setEditCat(category)}
                      className="mr-2 rounded p-1.5 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    {(category.isActive ?? true) ? (
                      <button
                        type="button"
                        onClick={() => void handleDeactivate(category.id)}
                        className="mr-2 rounded p-1.5 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/30"
                        title="Vo hieu hoa"
                      >
                        <Ban className="h-4 w-4" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => void handleActivate(category.id)}
                        className="mr-2 rounded p-1.5 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
                        title="Kich hoat"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => void handleDeletePermanent(category.id)}
                      className="rounded p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"
                      title="Xoa vinh vien"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {flat.length === 0 ? (
            <p className="px-4 py-6 text-center text-sm text-zinc-500">Chua co danh muc. Hay tao moi phia tren.</p>
          ) : null}
        </div>
      ) : (
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
          <CategoryTree
            nodes={tree}
            onEdit={setEditCat}
            onActivate={handleActivate}
            onDeactivate={handleDeactivate}
            onDelete={handleDeletePermanent}
          />
          {tree.length === 0 ? (
            <p className="py-6 text-center text-sm text-zinc-500">Chua co category.</p>
          ) : null}
        </div>
      )}

      {createOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">Tao danh muc moi</h3>
              <button type="button" onClick={() => setCreateOpen(false)} className="rounded p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Ten *</label>
                <input name="name" type="text" required className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Code * (unique)</label>
                <input name="code" type="text" required className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900" placeholder="VD: HR" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Mo ta</label>
                <input name="description" type="text" className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Danh muc cha</label>
                <select name="parentId" className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900">
                  <option value="">- Goc -</option>
                  {flat.filter((category) => category.isActive ?? true).map((category) => (
                    <option key={category.id} value={category.id}>{category.name} ({category.code})</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2">
                <Button type="submit" variant="primary" size="md">Tao</Button>
                <Button type="button" variant="outline" size="md" onClick={() => setCreateOpen(false)}>Huy</Button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {editCat ? (
        <EditCategoryModal
          category={editCat}
          parentOptions={flat.filter((category) => category.id !== editCat.id && (category.isActive ?? true))}
          onClose={() => setEditCat(null)}
          onSave={(body) => handleUpdate(editCat.id, body)}
        />
      ) : null}

      {confirmDialog}
    </div>
  );
}

function CategoryTree({
  nodes,
  onEdit,
  onActivate,
  onDeactivate,
  onDelete,
  depth = 0,
}: {
  nodes: DocumentCategoryResponse[];
  onEdit: (category: DocumentCategoryResponse) => void;
  onActivate: (id: string) => void;
  onDeactivate: (id: string) => void;
  onDelete: (id: string) => void;
  depth?: number;
}) {
  return (
    <ul className={depth > 0 ? "ml-4 border-l border-zinc-200 pl-4 dark:border-zinc-700" : "space-y-1"}>
      {nodes.map((node) => (
        <li key={node.id} className="py-1">
          <div className="flex items-center justify-between rounded-lg bg-zinc-50 px-3 py-2 dark:bg-zinc-900">
            <div className="flex items-center gap-2">
              {depth > 0 ? <ChevronRight className="h-4 w-4 text-zinc-400" /> : null}
              <span className="font-medium text-zinc-900 dark:text-white">{node.name}</span>
              <span className="text-xs text-zinc-500">({node.code})</span>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${(node.isActive ?? true)
                  ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                  : "bg-zinc-500/20 text-zinc-600 dark:text-zinc-400"
                  }`}
              >
                {(node.isActive ?? true) ? "Active" : "Inactive"}
              </span>
            </div>
            <div>
              <button type="button" onClick={() => onEdit(node)} className="mr-2 rounded p-1.5 text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-800">
                <Pencil className="h-4 w-4" />
              </button>
              {(node.isActive ?? true) ? (
                <button type="button" onClick={() => void onDeactivate(node.id)} className="mr-2 rounded p-1.5 text-amber-600 hover:bg-amber-100 dark:hover:bg-amber-950/30" title="Vo hieu hoa">
                  <Ban className="h-4 w-4" />
                </button>
              ) : (
                <button type="button" onClick={() => void onActivate(node.id)} className="mr-2 rounded p-1.5 text-emerald-600 hover:bg-emerald-100 dark:hover:bg-emerald-950/30" title="Kich hoat lai">
                  <Check className="h-4 w-4" />
                </button>
              )}
              <button type="button" onClick={() => void onDelete(node.id)} className="rounded p-1.5 text-red-500 hover:bg-red-100 dark:hover:bg-red-950/30" title="Xoa vinh vien">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
          {node.children && node.children.length > 0 ? (
            <CategoryTree
              nodes={node.children}
              onEdit={onEdit}
              onActivate={onActivate}
              onDeactivate={onDeactivate}
              onDelete={onDelete}
              depth={depth + 1}
            />
          ) : null}
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
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">Sua danh muc</h3>
          <button type="button" onClick={onClose} className="rounded p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800">
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Ten *</label>
            <input value={name} onChange={(e) => setName(e.target.value)} type="text" required className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Code *</label>
            <input value={code} onChange={(e) => setCode(e.target.value)} type="text" required className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Mo ta</label>
            <input value={description} onChange={(e) => setDescription(e.target.value)} type="text" className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Danh muc cha</label>
            <select value={parentId ?? ""} onChange={(e) => setParentId(e.target.value || null)} className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900">
              <option value="">- Goc -</option>
              {parentOptions.map((option) => (
                <option key={option.id} value={option.id}>{option.name}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-2">
            <Button type="submit" variant="primary" size="md">Luu</Button>
            <Button type="button" variant="outline" size="md" onClick={onClose}>Huy</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
