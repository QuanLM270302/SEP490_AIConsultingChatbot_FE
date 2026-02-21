import { CreditCardIcon, CalendarIcon } from "@heroicons/react/24/outline";

export function BillingForm() {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-6">
        <div className="rounded-3xl border-2 border-zinc-200 bg-white p-8 shadow-lg dark:border-zinc-800 dark:bg-zinc-950">
          <h2 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            Thông tin thanh toán
          </h2>
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Phương thức thanh toán
              </label>
              <div className="flex items-center gap-3 rounded-xl border-2 border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500 text-white">
                  <CreditCardIcon className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-zinc-900 dark:text-zinc-50">
                    •••• •••• •••• 4242
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Hết hạn 12/2025
                  </p>
                </div>
                <button className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800">
                  Thay đổi
                </button>
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Email nhận hóa đơn
              </label>
              <input
                type="email"
                defaultValue="user@company.com"
                className="w-full rounded-xl border-2 border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 focus:border-green-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50"
              />
            </div>
          </div>
        </div>

        <div className="rounded-3xl border-2 border-zinc-200 bg-white p-8 shadow-lg dark:border-zinc-800 dark:bg-zinc-950">
          <h2 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            Ngày gia hạn
          </h2>
          <div className="flex items-center justify-between rounded-xl border-2 border-green-200 bg-green-50 p-6 dark:border-green-900/50 dark:bg-green-950/30">
            <div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Gia hạn tiếp theo
              </p>
              <p className="mt-1 text-2xl font-bold text-green-600 dark:text-green-400">
                15/02/2024
              </p>
            </div>
            <CalendarIcon className="h-12 w-12 text-green-600 dark:text-green-400" />
          </div>
          <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
            Gói của bạn sẽ tự động gia hạn vào ngày này. Bạn có thể hủy bất cứ
            lúc nào.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="rounded-3xl border-2 border-zinc-200 bg-white p-6 shadow-lg dark:border-zinc-800 dark:bg-zinc-950">
          <h3 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            Thông báo
          </h3>
          <div className="space-y-3">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                defaultChecked
                className="h-4 w-4 rounded border-zinc-300 text-green-500 focus:ring-green-500 dark:border-zinc-700"
              />
              <span className="text-sm text-zinc-600 dark:text-zinc-400">
                Thông báo trước khi hết hạn
              </span>
            </label>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                defaultChecked
                className="h-4 w-4 rounded border-zinc-300 text-green-500 focus:ring-green-500 dark:border-zinc-700"
              />
              <span className="text-sm text-zinc-600 dark:text-zinc-400">
                Thông báo khi thanh toán thành công
              </span>
            </label>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-zinc-300 text-green-500 focus:ring-green-500 dark:border-zinc-700"
              />
              <span className="text-sm text-zinc-600 dark:text-zinc-400">
                Thông báo khi thanh toán thất bại
              </span>
            </label>
          </div>
        </div>

        <div className="rounded-3xl border-2 border-rose-200 bg-rose-50 p-6 dark:border-rose-900/50 dark:bg-rose-950/30">
          <h3 className="mb-2 text-lg font-semibold text-rose-900 dark:text-rose-400">
            Hủy gói đăng ký
          </h3>
          <p className="mb-4 text-sm text-rose-700 dark:text-rose-300">
            Gói của bạn sẽ tiếp tục hoạt động đến ngày hết hạn. Bạn sẽ không bị
            tính phí cho chu kỳ tiếp theo.
          </p>
          <button className="w-full rounded-xl border-2 border-rose-500 bg-white px-4 py-2 text-sm font-semibold text-rose-600 transition hover:bg-rose-50 dark:bg-zinc-900 dark:text-rose-400 dark:hover:bg-zinc-800">
            Hủy gói đăng ký
          </button>
        </div>
      </div>
    </div>
  );
}

