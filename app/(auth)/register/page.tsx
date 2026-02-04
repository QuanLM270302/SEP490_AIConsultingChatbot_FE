import { Header } from "@/components/layout/Header";
import { RegisterForm } from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <Header />
      <main className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-16">
          {/* Left side - Benefits */}
          <div className="flex flex-col justify-center">
            <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-5xl">
              Bắt đầu với AI Chatbot
            </h1>
            <p className="mt-6 text-lg leading-8 text-zinc-600 dark:text-zinc-400">
              Triển khai nhanh chóng trong 3 tuần. Không cần kiến thức kỹ thuật phức tạp.
            </p>
            
            <div className="mt-10 space-y-6">
              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-600">
                  <span className="text-xl">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold text-zinc-900 dark:text-white">
                    Dùng thử miễn phí 14 ngày
                  </h3>
                  <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                    Không cần thẻ tín dụng, hủy bất cứ lúc nào
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-600">
                  <span className="text-xl">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold text-zinc-900 dark:text-white">
                    Hỗ trợ triển khai miễn phí
                  </h3>
                  <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                    Đội ngũ kỹ thuật hỗ trợ setup và training
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-600">
                  <span className="text-xl">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold text-zinc-900 dark:text-white">
                    Bảo mật dữ liệu tuyệt đối
                  </h3>
                  <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                    Mã hóa end-to-end, tuân thủ GDPR và ISO 27001
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-600">
                  <span className="text-xl">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold text-zinc-900 dark:text-white">
                    Tích hợp dễ dàng
                  </h3>
                  <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                    Kết nối với 100+ ứng dụng doanh nghiệp
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-10 border-t border-zinc-200 pt-10 dark:border-zinc-800">
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Được tin tưởng bởi hơn 500+ doanh nghiệp tại Việt Nam
              </p>
              <div className="mt-4 flex gap-8 opacity-60">
                <div className="text-2xl">🏢</div>
                <div className="text-2xl">🏢</div>
                <div className="text-2xl">🏢</div>
                <div className="text-2xl">🏢</div>
              </div>
            </div>
          </div>

          {/* Right side - Form */}
          <div className="lg:pl-8">
            <RegisterForm />
          </div>
        </div>
      </main>
    </div>
  );
}
