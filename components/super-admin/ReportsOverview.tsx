import { Button } from "@/components/ui";
import { Download, FileText } from "lucide-react";

const reports = [
  { name: "Monthly Usage Report", date: "March 2024", size: "2.4 MB" },
  { name: "Security Audit", date: "March 2024", size: "1.8 MB" },
  { name: "Performance Analytics", date: "February 2024", size: "3.1 MB" },
];

export function ReportsOverview() {
  return (
    <div className="rounded-lg bg-white p-6 shadow dark:bg-zinc-900">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">Available Reports</h3>
        <Button variant="primary" size="sm">Generate New</Button>
      </div>
      <div className="mt-6 space-y-3">
        {reports.map((report, index) => (
          <div key={index} className="flex items-center justify-between rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-blue-500" />
              <div>
                <p className="font-medium text-zinc-900 dark:text-white">{report.name}</p>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">{report.date} • {report.size}</p>
              </div>
            </div>
            <Button variant="ghost" size="sm">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
