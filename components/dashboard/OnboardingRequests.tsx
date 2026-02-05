"use client";

import { Button } from "@/components/ui";
import { Check, X, Eye } from "lucide-react";

const requests = [
  {
    id: 1,
    company: "Công ty TNHH Tech Solutions",
    contact: "Nguyễn Văn A",
    email: "a.nguyen@techsolutions.vn",
    employees: "50-200",
    industry: "Công nghệ thông tin",
    submittedAt: "2024-03-01",
    status: "pending",
  },
  {
    id: 2,
    company: "Tập đoàn Retail Plus",
    contact: "Trần Thị B",
    email: "b.tran@retailplus.vn",
    employees: "200-500",
    industry: "Bán lẻ",
    submittedAt: "2024-03-02",
    status: "pending",
  },
  {
    id: 3,
    company: "Startup Innovation Hub",
    contact: "Lê Văn C",
    email: "c.le@innovationhub.vn",
    employees: "1-50",
    industry: "Công nghệ",
    submittedAt: "2024-03-03",
    status: "pending",
  },
];

export function OnboardingRequests() {
  return (
    <div className="space-y-4">
      {requests.map((request) => (
        <div
          key={request.id}
          className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
                {request.company}
              </h3>
              <div className="mt-2 grid gap-2 text-sm text-zinc-600 dark:text-zinc-400 sm:grid-cols-2">
                <div>
                  <span className="font-medium">Người liên hệ:</span> {request.contact}
                </div>
                <div>
                  <span className="font-medium">Email:</span> {request.email}
                </div>
                <div>
                  <span className="font-medium">Quy mô:</span> {request.employees} nhân viên
                </div>
                <div>
                  <span className="font-medium">Lĩnh vực:</span> {request.industry}
                </div>
                <div>
                  <span className="font-medium">Ngày gửi:</span> {request.submittedAt}
                </div>
              </div>
            </div>
            <span className="ml-4 inline-flex rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
              Chờ duyệt
            </span>
          </div>
          
          <div className="mt-4 flex gap-2">
            <Button variant="primary" size="sm">
              <Check className="mr-1 h-4 w-4" />
              Phê duyệt
            </Button>
            <Button variant="outline" size="sm">
              <Eye className="mr-1 h-4 w-4" />
              Xem chi tiết
            </Button>
            <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
              <X className="mr-1 h-4 w-4" />
              Từ chối
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
