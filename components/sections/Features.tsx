import { 
  MessageSquare, 
  Search, 
  Zap, 
  Shield, 
  Brain, 
  Users 
} from "lucide-react";

const features = [
  {
    name: "RAG-Powered Search",
    description: "Tìm kiếm thông minh với Retrieval-Augmented Generation, trả lời chính xác từ tài liệu nội bộ.",
    icon: Search,
  },
  {
    name: "Chatbot tương tác",
    description: "Trò chuyện tự nhiên với AI, nhận câu trả lời ngay lập tức từ kiến thức doanh nghiệp.",
    icon: MessageSquare,
  },
  {
    name: "Tích hợp nhanh",
    description: "Kết nối với Google Drive, Slack, Confluence, SharePoint và hơn 100+ ứng dụng.",
    icon: Zap,
  },
  {
    name: "Bảo mật cao",
    description: "Mã hóa end-to-end, tuân thủ GDPR, dữ liệu được lưu trữ an toàn tại Việt Nam.",
    icon: Shield,
  },
  {
    name: "Học máy liên tục",
    description: "AI học hỏi từ phản hồi người dùng, ngày càng thông minh và chính xác hơn.",
    icon: Brain,
  },
  {
    name: "Quản lý team",
    description: "Dashboard quản lý người dùng, phân quyền truy cập, theo dõi usage analytics.",
    icon: Users,
  },
];

export function Features() {
  return (
    <section id="features" className="bg-white py-24 dark:bg-zinc-950 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-base font-semibold leading-7 text-blue-600 dark:text-blue-400">
            Tính năng vượt trội
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
            Mọi thứ bạn cần cho AI nội bộ
          </p>
          <p className="mt-6 text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Nền tảng chatbot được xây dựng đặc biệt cho doanh nghiệp Việt Nam
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-7xl sm:mt-20 lg:mt-24">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-3 lg:gap-y-16">
            {features.map((feature) => (
              <div key={feature.name} className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-zinc-900 dark:text-white">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                    <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  {feature.name}
                </dt>
                <dd className="mt-2 text-base leading-7 text-zinc-600 dark:text-zinc-400">
                  {feature.description}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
