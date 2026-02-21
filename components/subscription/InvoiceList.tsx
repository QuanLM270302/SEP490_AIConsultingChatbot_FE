import { ArrowRightIcon } from "@heroicons/react/24/outline";

export interface Invoice {
  id: string;
  date: string;
  amount: string;
  status: "paid" | "pending" | "failed";
  description: string;
}

interface InvoiceListProps {
  invoices: Invoice[];
}

export function InvoiceList({ invoices }: InvoiceListProps) {
  const getStatusStyles = (status: Invoice["status"]) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      case "pending":
        return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
      case "failed":
        return "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400";
      default:
        return "";
    }
  };

  const getStatusLabel = (status: Invoice["status"]) => {
    switch (status) {
      case "paid":
        return "Đã thanh toán";
      case "pending":
        return "Đang xử lý";
      case "failed":
        return "Thất bại";
      default:
        return "";
    }
  };

  return (
    <div className="rounded-3xl border-2 border-zinc-200 bg-white p-8 shadow-lg dark:border-zinc-800 dark:bg-zinc-950">
      <h2 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
        Lịch sử giao dịch
      </h2>
      <div className="space-y-4">
        {invoices.map((invoice) => (
          <div
            key={invoice.id}
            className="flex items-center justify-between rounded-xl border-2 border-zinc-200 bg-zinc-50 p-5 transition hover:border-zinc-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
          >
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">
                  {invoice.description}
                </h3>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${getStatusStyles(
                    invoice.status
                  )}`}
                >
                  {getStatusLabel(invoice.status)}
                </span>
              </div>
              <div className="mt-2 flex items-center gap-4 text-sm text-zinc-600 dark:text-zinc-400">
                <span>ID: {invoice.id}</span>
                <span>•</span>
                <span>{invoice.date}</span>
              </div>
            </div>
            <div className="ml-4 text-right">
              <p className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
                {invoice.amount}
              </p>
              <button className="mt-1 flex items-center gap-1 text-sm font-medium text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300">
                Tải hóa đơn <ArrowRightIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

