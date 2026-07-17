// ========================================================================
// =
// =    Path: frontend/admin/src/app/dashboard/page.tsx
// =    Description: Admin Dashboard Page
// =
// =    Developed by SAYAB — Admin Dashboard
// =
// ========================================================================

export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-semibold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white shadow rounded-lg">
          <h2 className="text-xl font-bold">Total Students</h2>
          <p className="text-3xl font-bold text-blue-600 mt-3">1200</p>
        </div>

        <div className="p-6 bg-white shadow rounded-lg">
          <h2 className="text-xl font-bold">Total Teachers</h2>
          <p className="text-3xl font-bold text-green-600 mt-3">45</p>
        </div>

        <div className="p-6 bg-white shadow rounded-lg">
          <h2 className="text-xl font-bold">Total Courses</h2>
          <p className="text-3xl font-bold text-purple-600 mt-3">98</p>
        </div>
      </div>
    </div>
  );
}
