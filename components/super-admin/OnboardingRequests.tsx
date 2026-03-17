"use client";

import { Button } from "@/components/ui";
import { Check, X } from "lucide-react";

const requests: { id: number; company: string; contact: string; email: string; employees: string; submittedAt: string }[] = [];

export function OnboardingRequests() {
  return (
    <div className="space-y-4">
      {requests.length === 0 ? (
        <div className="rounded-3xl bg-white p-8 text-center shadow-lg dark:bg-zinc-950">
          <p className="text-sm text-zinc-500">Dữ liệu yêu cầu onboarding sẽ được tải từ API.</p>
        </div>
      ) : null}
      {requests.map((request) => (
        <div
          key={request.id}
          className="rounded-3xl bg-white p-6 shadow-lg shadow-green-100/60 dark:bg-zinc-950 dark:shadow-black/40"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
                {request.company}
              </h3>
              <div className="mt-3 grid gap-3 text-sm text-zinc-600 dark:text-zinc-400 sm:grid-cols-2">
                <div className="rounded-2xl bg-zinc-50 p-3 dark:bg-zinc-900">
                  <span className="text-xs font-medium text-zinc-400">Người liên hệ</span>
                  <p className="mt-1 text-zinc-900 dark:text-white">{request.contact}</p>
                </div>
                <div className="rounded-2xl bg-zinc-50 p-3 dark:bg-zinc-900">
                  <span className="text-xs font-medium text-zinc-400">Email</span>
                  <p className="mt-1 text-zinc-900 dark:text-white">{request.email}</p>
                </div>
                <div className="rounded-2xl bg-zinc-50 p-3 dark:bg-zinc-900">
                  <span className="text-xs font-medium text-zinc-400">Quy mô</span>
                  <p className="mt-1 text-zinc-900 dark:text-white">{request.employees} nhân viên</p>
                </div>
                <div className="rounded-2xl bg-zinc-50 p-3 dark:bg-zinc-900">
                  <span className="text-xs font-medium text-zinc-400">Ngày gửi</span>
                  <p className="mt-1 text-zinc-900 dark:text-white">{request.submittedAt}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-4 flex gap-2">
            <Button variant="primary" size="sm">
              <Check className="mr-1 h-4 w-4" />
              Phê duyệt
            </Button>
            <Button variant="ghost" size="sm" className="text-rose-600">
              <X className="mr-1 h-4 w-4" />
              Từ chối
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
