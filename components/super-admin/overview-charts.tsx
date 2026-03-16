"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Line,
  LineChart,
} from "recharts";

const queryData = [
  { name: "Mon", queries: 4000 },
  { name: "Tue", queries: 3000 },
  { name: "Wed", queries: 2000 },
  { name: "Thu", queries: 2780 },
  { name: "Fri", queries: 1890 },
  { name: "Sat", queries: 2390 },
  { name: "Sun", queries: 3490 },
];

const tenantData = [
  { name: "Jan", total: 40, active: 24 },
  { name: "Feb", total: 45, active: 28 },
  { name: "Mar", total: 55, active: 35 },
  { name: "Apr", total: 70, active: 45 },
  { name: "May", total: 85, active: 60 },
  { name: "Jun", total: 100, active: 80 },
];

const ragData = [
  { name: "Week 1", docs: 120 },
  { name: "Week 2", docs: 210 },
  { name: "Week 3", docs: 180 },
  { name: "Week 4", docs: 350 },
];

const revenueData = [
  { name: "Jan", amount: 4000 },
  { name: "Feb", amount: 5500 },
  { name: "Mar", amount: 6200 },
  { name: "Apr", amount: 7800 },
  { name: "May", amount: 9500 },
  { name: "Jun", amount: 12000 },
];

export function OverviewCharts() {
  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {/* AI Queries Chart */}
      <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-zinc-200 dark:bg-zinc-950 dark:ring-white/10">
        <h3 className="mb-6 font-semibold text-zinc-900 dark:text-zinc-50">
          AI Queries (Last 7 Days)
        </h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={queryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorQueries" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e4e7" className="dark:stroke-zinc-800" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} stroke="#a1a1aa" />
              <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} stroke="#a1a1aa" />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                cursor={{ fill: 'transparent' }}
              />
              <Area
                type="monotone"
                dataKey="queries"
                stroke="#22c55e"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorQueries)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tenants Chart */}
      <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-zinc-200 dark:bg-zinc-950 dark:ring-white/10">
        <h3 className="mb-6 font-semibold text-zinc-900 dark:text-zinc-50">
          Tenants Growth
        </h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={tenantData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e4e7" className="dark:stroke-zinc-800" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} stroke="#a1a1aa" />
              <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} stroke="#a1a1aa" />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Line type="monotone" dataKey="total" name="Total Tenants" stroke="#a1a1aa" strokeWidth={3} dot={false} />
              <Line type="monotone" dataKey="active" name="Active Tenants" stroke="#22c55e" strokeWidth={3} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* RAG Documents Chart */}
      <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-zinc-200 dark:bg-zinc-950 dark:ring-white/10">
        <h3 className="mb-6 font-semibold text-zinc-900 dark:text-zinc-50">
          RAG Documents Uploaded (This Month)
        </h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={ragData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e4e7" className="dark:stroke-zinc-800" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} stroke="#a1a1aa" />
              <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} stroke="#a1a1aa" />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                cursor={{ fill: 'rgba(161, 161, 170, 0.1)' }}
              />
              <Bar dataKey="docs" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-zinc-200 dark:bg-zinc-950 dark:ring-white/10">
        <h3 className="mb-6 font-semibold text-zinc-900 dark:text-zinc-50">
          Revenue ($)
        </h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e4e7" className="dark:stroke-zinc-800" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} stroke="#a1a1aa" />
              <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} stroke="#a1a1aa" />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Area
                type="monotone"
                dataKey="amount"
                stroke="#8b5cf6"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorRevenue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
