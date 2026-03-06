export function DepartmentOverview() {
  const departments = [
    { name: "Engineering", count: 45 },
    { name: "Sales", count: 32 },
    { name: "Marketing", count: 28 },
    { name: "HR", count: 12 },
    { name: "Finance", count: 15 },
  ];

  return (
    <div className="rounded-lg bg-white p-6 shadow dark:bg-zinc-900">
      <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">Department Overview</h3>
      <div className="mt-6 space-y-3">
        {departments.map((dept) => (
          <div key={dept.name} className="flex items-center justify-between">
            <span className="text-sm text-zinc-600 dark:text-zinc-400">{dept.name}</span>
            <span className="font-semibold text-zinc-900 dark:text-white">{dept.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
