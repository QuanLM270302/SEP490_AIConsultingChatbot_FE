import { Button } from "@/components/ui";
import Link from "next/link";

export function CTASection() {
  return (
    <section className="bg-white py-24 dark:bg-zinc-950 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
            Sẵn sàng tăng năng suất với AI?
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Hàng nghìn doanh nghiệp đã tin tưởng. Triển khai trong 3 tuần, 
            không cần kiến thức kỹ thuật phức tạp.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Link href="/register">
              <Button size="lg" variant="primary">
                Bắt đầu miễn phí
              </Button>
            </Link>
            <Button size="lg" variant="outline">
              Liên hệ sales
            </Button>
          </div>
        </div>

        <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-8 sm:grid-cols-3">
          <div className="text-center">
            <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">95%</p>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">Độ chính xác câu trả lời</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">3 tuần</p>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">Thời gian triển khai</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">40%</p>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">Tăng năng suất</p>
          </div>
        </div>
      </div>
    </section>
  );
}
