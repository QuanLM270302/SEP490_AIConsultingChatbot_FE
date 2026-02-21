import { DocumentTextIcon } from "@heroicons/react/24/outline";

export function ContentManagerHeader() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-3 text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Content Manager{" "}
            <DocumentTextIcon className="h-8 w-8 text-blue-500" />
          </h1>
          <p className="mt-2 text-lg text-zinc-600 dark:text-zinc-400">
            Quản lý và tối ưu hóa nội dung tài liệu nội bộ cho hệ thống AI
          </p>
        </div>
      </div>
    </div>
  );
}

