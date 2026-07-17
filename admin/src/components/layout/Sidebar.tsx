// ========================================================================
// =
// =    Path: frontend/admin/src/components/layout/Sidebar.tsx
// =    Description: Sidebar navigation for Admin panel
// =                 Links to Dashboard, Users, Courses, Assignments, etc.
// =
// =    Developed by SAYAB — Admin Sidebar
// =
// ========================================================================

"use client";

import React from "react";
import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-gray-800 text-white min-h-screen p-6">
      <div className="text-2xl font-bold mb-8">Admin Panel</div>
      <nav className="space-y-2">
        <Link href="/dashboard" className="block p-2 rounded hover:bg-gray-700">
          Dashboard
        </Link>
        <Link href="/users" className="block p-2 rounded hover:bg-gray-700">
          Users
        </Link>
        <Link href="/departments" className="block p-2 rounded hover:bg-gray-700">
          Departments
        </Link>
        <Link href="/programs" className="block p-2 rounded hover:bg-gray-700">
          Programs
        </Link>
        <Link href="/courses" className="block p-2 rounded hover:bg-gray-700">
          Courses
        </Link>
        <Link href="/assignments" className="block p-2 rounded hover:bg-gray-700">
          Assignments
        </Link>
        <Link href="/exams" className="block p-2 rounded hover:bg-gray-700">
          Exams
        </Link>
        <Link href="/finance" className="block p-2 rounded hover:bg-gray-700">
          Finance
        </Link>
        <Link href="/timetable" className="block p-2 rounded hover:bg-gray-700">
          Timetable
        </Link>
        <Link href="/attendance" className="block p-2 rounded hover:bg-gray-700">
          Attendance
        </Link>
        <Link href="/notifications" className="block p-2 rounded hover:bg-gray-700">
          Notifications
        </Link>
        <Link href="/messaging" className="block p-2 rounded hover:bg-gray-700">
          Messaging
        </Link>
        <Link href="/library" className="block p-2 rounded hover:bg-gray-700">
          Library
        </Link>
      </nav>
    </aside>
  );
}
