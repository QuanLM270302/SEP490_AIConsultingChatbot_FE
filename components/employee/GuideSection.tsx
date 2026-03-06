export function GuideSection() {
  const steps = [
    {
      number: 1,
      title: "Đặt câu hỏi",
      description:
        "Sử dụng AI Chatbot để đặt câu hỏi bằng tiếng Việt về công việc, chính sách, hoặc quy trình nội bộ",
      color: "from-green-500 to-green-600",
      shadowColor: "shadow-green-500/30",
    },
    {
      number: 2,
      title: "Xem tài liệu tham khảo",
      description:
        "Mỗi câu trả lời đều có kèm theo các tài liệu tham khảo để bạn có thể xác minh thông tin",
      color: "from-blue-500 to-blue-600",
      shadowColor: "shadow-blue-500/30",
    },
    {
      number: 3,
      title: "Đánh giá câu trả lời",
      description:
        "Giúp chúng tôi cải thiện chất lượng bằng cách đánh giá tính hữu ích của mỗi câu trả lời",
      color: "from-purple-500 to-purple-600",
      shadowColor: "shadow-purple-500/30",
    },
  ];

  return (
    <div className="rounded-3xl border-2 border-zinc-200 bg-white p-8 shadow-lg dark:border-zinc-800 dark:bg-zinc-950">
      <h2 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
        Hướng dẫn sử dụng
      </h2>
      <div className="grid gap-6 sm:grid-cols-3">
        {steps.map((step) => (
          <div key={step.number} className="group flex gap-4">
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br ${step.color} text-lg font-bold text-white shadow-lg ${step.shadowColor} transition group-hover:scale-110`}
            >
              {step.number}
            </div>
            <div>
              <h3 className="mb-1 font-semibold text-zinc-900 dark:text-zinc-50">
                {step.title}
              </h3>
              <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

