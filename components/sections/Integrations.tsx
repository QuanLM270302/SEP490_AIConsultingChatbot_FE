"use client";

const integrations = [
  { name: "Google Drive", logo: "📁" },
  { name: "Slack", logo: "💬" },
  { name: "Confluence", logo: "📚" },
  { name: "Microsoft Teams", logo: "👥" },
  { name: "SharePoint", logo: "📊" },
  { name: "Notion", logo: "📝" },
  { name: "Jira", logo: "🎯" },
  { name: "GitHub", logo: "💻" },
  { name: "Gmail", logo: "✉️" },
  { name: "Dropbox", logo: "📦" },
  { name: "Salesforce", logo: "☁️" },
  { name: "Zendesk", logo: "🎧" },
];

export function Integrations() {
  return (
    <section id="integrations" className="bg-zinc-50 py-24 dark:bg-zinc-900 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
            Kết nối với mọi công cụ làm việc
          </h2>
          <p className="mt-6 text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Tích hợp dễ dàng với các ứng dụng doanh nghiệp phổ biến. 
            Kéo thả để xem chi tiết tích hợp.
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-5xl grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {integrations.map((integration) => (
            <div
              key={integration.name}
              className="group relative flex flex-col items-center justify-center rounded-xl bg-white p-6 shadow-sm ring-1 ring-zinc-200 transition-all hover:shadow-md hover:ring-blue-500 dark:bg-zinc-800 dark:ring-zinc-700 dark:hover:ring-blue-500"
            >
              <div className="text-4xl">{integration.logo}</div>
              <p className="mt-3 text-center text-sm font-medium text-zinc-900 dark:text-white">
                {integration.name}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-12 text-center">
          <p className="text-base text-zinc-600 dark:text-zinc-400">
            Và hơn <span className="font-semibold text-blue-600 dark:text-blue-400">100+ tích hợp</span> khác
          </p>
        </div>
      </div>
    </section>
  );
}
