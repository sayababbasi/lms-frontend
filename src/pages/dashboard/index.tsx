import { useState, useEffect } from 'react';
import Head from 'next/head';
import DashboardLayout from '../../components/layout/DashboardLayout';
import StatCard from '../../components/dashboard/StatCard';
import { DashboardService } from '../../services/dashboard.service';
import Link from 'next/link';
import { Download, Plus, FileText, UserPlus, BookOpen, Clock, Banknote } from 'lucide-react';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';

export default function DashboardHome() {
    const [stats, setStats] = useState({
        total_students: 0,
        active_courses: 0,
        pending_assignments: 0,
        total_revenue: 0 // Keeping number for now, format later
    });
    const [pendingUsers, setPendingUsers] = useState([]);

    useEffect(() => {
        loadStats();
        loadPendingUsers();
    }, []);

    const loadStats = async () => {
        try {
            const data = await DashboardService.getStats();
            setStats(data as any);
        } catch (error) {
            console.error("Failed to load dashboard stats", error);
        }
    };



    const loadPendingUsers = async () => {
        try {
            const token = localStorage.getItem('access_token');
            // Assuming localhost:8000 for now, ideally should use env var or service
            const response = await axios.get('http://localhost:8000/api/pending-users/', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPendingUsers(response.data);
        } catch (error) {
            console.error("Failed to load pending users", error);
        }
    };

    const handleApproveUser = async (id: number) => {
        try {
            const token = localStorage.getItem('access_token');
            await axios.post(`http://localhost:8000/api/approve-user/${id}/`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success("User approved successfully");
            loadPendingUsers(); // Refresh list
        } catch (error) {
            toast.error("Failed to approve user");
            console.error(error);
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
    };

    return (
        <DashboardLayout title="Dashboard">
            <Toaster position="top-right" />
            <div className="space-y-8">
                {/* Welcome Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight dark:text-white">Dashboard Overview</h1>
                        <p className="text-slate-500 mt-1 font-medium">Welcome back, here's what's happening today.</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => {
                                // @ts-ignore
                                const details = stats.detailed_stats || {};
                                const revenue = details.revenue || {};
                                const fees = details.fees || {};
                                const users = details.users || {};
                                const courses = details.courses || [];

                                let csvContent = "data:text/csv;charset=utf-8,";

                                // Section 1: Overview
                                csvContent += "--- OVERVIEW ---\n";
                                csvContent += "Metric,Value\n";
                                csvContent += `Total Students,${stats.total_students}\n`;
                                csvContent += `Active Courses,${stats.active_courses}\n`;
                                csvContent += `Pending Assignments,${stats.pending_assignments}\n`;
                                csvContent += `Total Revenue,${stats.total_revenue}\n`;
                                csvContent += `Active Users (Last 30 Days),${users.active_last_month || 0}\n`;
                                csvContent += `Paid Fee Challans,${fees.paid_challans || 0}\n`;
                                csvContent += "\n";

                                // Section 2: Revenue Breakdown
                                csvContent += "--- REVENUE BREAKDOWN ---\n";
                                csvContent += "Period,Amount\n";
                                csvContent += `Last Week,${revenue.last_week || 0}\n`;
                                csvContent += `Last Month,${revenue.last_month || 0}\n`;
                                csvContent += `Last Year,${revenue.last_year || 0}\n`;
                                csvContent += "\n";

                                // Section 3: Course Details
                                csvContent += "--- COURSE ENROLLMENTS ---\n";
                                csvContent += "Course Code,Title,Students Enrolled\n";
                                courses.forEach((c: any) => {
                                    csvContent += `${c.code},"${c.title}",${c.students}\n`;
                                });

                                const encodedUri = encodeURI(csvContent);
                                const link = document.createElement("a");
                                link.setAttribute("href", encodedUri);
                                link.setAttribute("download", `revotic_report_${new Date().toISOString().split('T')[0]}.csv`);
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                            }}
                            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 font-semibold hover:bg-slate-50 hover:text-primary-600 hover:border-primary-100 transition-all shadow-sm"
                        >
                            <Download className="w-4 h-4" />
                            Download Report
                        </button>

                        <Menu as="div" className="relative inline-block text-left z-30">
                            <Menu.Button className="flex items-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl shadow-lg shadow-primary-600/30 transition-all transform hover:-translate-y-0.5">
                                <Plus className="w-4 h-4" />
                                Add New
                            </Menu.Button>
                            <Transition
                                as={Fragment}
                                enter="transition ease-out duration-100"
                                enterFrom="transform opacity-0 scale-95"
                                enterTo="transform opacity-100 scale-100"
                                leave="transition ease-in duration-75"
                                leaveFrom="transform opacity-100 scale-100"
                                leaveTo="transform opacity-0 scale-95"
                            >
                                <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-xl bg-white shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                                    <div className="px-1 py-1">
                                        <Menu.Item>
                                            {({ active }) => (
                                                <Link
                                                    href="/dashboard/users/create"
                                                    className={`${active ? 'bg-primary-50 text-primary-700' : 'text-slate-700'
                                                        } group flex w-full items-center rounded-lg px-2 py-2 text-sm font-medium transition-colors`}
                                                >
                                                    <UserPlus className="mr-2 h-4 w-4" />
                                                    Add Student/User
                                                </Link>
                                            )}
                                        </Menu.Item>
                                        <Menu.Item>
                                            {({ active }) => (
                                                <Link
                                                    href="/dashboard/courses/create"
                                                    className={`${active ? 'bg-primary-50 text-primary-700' : 'text-slate-700'
                                                        } group flex w-full items-center rounded-lg px-2 py-2 text-sm font-medium transition-colors`}
                                                >
                                                    <BookOpen className="mr-2 h-4 w-4" />
                                                    Create Course
                                                </Link>
                                            )}
                                        </Menu.Item>
                                    </div>
                                    <div className="px-1 py-1">
                                        <Menu.Item>
                                            {({ active }) => (
                                                <Link
                                                    href="/dashboard/assignments/create"
                                                    className={`${active ? 'bg-primary-50 text-primary-700' : 'text-slate-700'
                                                        } group flex w-full items-center rounded-lg px-2 py-2 text-sm font-medium transition-colors`}
                                                >
                                                    <FileText className="mr-2 h-4 w-4" />
                                                    Create Assignment
                                                </Link>
                                            )}
                                        </Menu.Item>
                                        <Menu.Item>
                                            {({ active }) => (
                                                <Link
                                                    href="/dashboard/finance/challan"
                                                    className={`${active ? 'bg-primary-50 text-primary-700' : 'text-slate-700'
                                                        } group flex w-full items-center rounded-lg px-2 py-2 text-sm font-medium transition-colors`}
                                                >
                                                    <Banknote className="mr-2 h-4 w-4" />
                                                    Generate Fee Challan
                                                </Link>
                                            )}
                                        </Menu.Item>
                                    </div>
                                </Menu.Items>
                            </Transition>
                        </Menu>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        title="Total Students"
                        value={stats.total_students.toLocaleString()}
                        icon={<UserPlus className="w-6 h-6 text-white" />}
                        trend="12%"
                        trendUp={true}
                        color="from-blue-500 to-indigo-600"
                    />
                    <StatCard
                        title="Active Courses"
                        value={stats.active_courses.toLocaleString()}
                        icon={<BookOpen className="w-6 h-6 text-white" />}
                        trend="5%"
                        trendUp={true}
                        color="from-violet-500 to-purple-600"
                    />
                    <StatCard
                        title="Pending Assignments"
                        value={stats.pending_assignments.toLocaleString()}
                        icon={<FileText className="w-6 h-6 text-white" />}
                        trend="18%"
                        trendUp={false}
                        color="from-amber-400 to-orange-500"
                    />
                    <StatCard
                        title="Total Revenue"
                        value={formatCurrency(stats.total_revenue)}
                        icon={<div className="font-bold text-xl text-white">$</div>}
                        trend="8%"
                        trendUp={true}
                        color="from-emerald-400 to-green-600"
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Pending Approvals */}
                    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm col-span-1 lg:col-span-2">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-slate-900">Pending Approvals</h3>
                            <span className="bg-amber-100 text-amber-700 text-xs font-bold px-3 py-1 rounded-full">
                                {pendingUsers.length} Pending
                            </span>
                        </div>

                        {pendingUsers.length === 0 ? (
                            <div className="text-center py-8 text-slate-500">
                                No pending requests found.
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b border-slate-100 text-slate-500 text-sm">
                                            <th className="pb-3 pl-2">User</th>
                                            <th className="pb-3">Role</th>
                                            <th className="pb-3">Email</th>
                                            <th className="pb-3 text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {pendingUsers.map((user: any) => (
                                            <tr key={user.id} className="group hover:bg-slate-50 transition-colors">
                                                <td className="py-4 pl-2">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold uppercase">
                                                            {user.username.substring(0, 2)}
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-slate-900">{user.username}</p>
                                                            <p className="text-xs text-slate-500">
                                                                {user.first_name} {user.last_name}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-4">
                                                    <span className={`text-xs font-bold px-2 py-1 rounded-md uppercase ${user.is_teacher && user.is_student ? 'bg-amber-100 text-amber-800' :
                                                            user.is_teacher ? 'bg-purple-100 text-purple-700' :
                                                                user.is_student ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'
                                                        }`}>
                                                        {
                                                            user.is_staff && user.is_teacher && user.is_student ? 'Full Admin Demo' :
                                                                user.is_teacher && user.is_student ? 'Academic Suite (T+S)' :
                                                                    user.is_teacher ? 'Teacher' :
                                                                        user.is_student ? 'Student' : 'User'
                                                        }
                                                    </span>
                                                </td>
                                                <td className="py-4 text-slate-600 text-sm">{user.email}</td>
                                                <td className="py-4 text-right">
                                                    <button
                                                        onClick={() => handleApproveUser(user.id)}
                                                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg shadow-sm hover:shadow-green-600/30 transition-all transform active:scale-95"
                                                    >
                                                        Approve
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col h-full">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-slate-900 font-manrope">Quick Actions</h3>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <Link href="/dashboard/users/create" className="flex flex-col items-center justify-center p-4 rounded-xl border border-slate-100 bg-slate-50 hover:bg-white hover:border-primary-100 hover:shadow-md transition-all group cursor-pointer h-32 text-center">
                                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-sm">
                                    <UserPlus className="w-5 h-5" />
                                </div>
                                <span className="font-semibold text-sm text-slate-700 group-hover:text-blue-700">Add User</span>
                            </Link>

                            <Link href="/dashboard/courses/create" className="flex flex-col items-center justify-center p-4 rounded-xl border border-slate-100 bg-slate-50 hover:bg-white hover:border-indigo-100 hover:shadow-md transition-all group cursor-pointer h-32 text-center">
                                <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-sm">
                                    <BookOpen className="w-5 h-5" />
                                </div>
                                <span className="font-semibold text-sm text-slate-700 group-hover:text-indigo-700">Create Course</span>
                            </Link>

                            <Link href="/dashboard/finance/challan" className="flex flex-col items-center justify-center p-4 rounded-xl border border-slate-100 bg-slate-50 hover:bg-white hover:border-emerald-100 hover:shadow-md transition-all group cursor-pointer h-32 text-center">
                                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-sm">
                                    <FileText className="w-5 h-5" />
                                </div>
                                <span className="font-semibold text-sm text-slate-700 group-hover:text-emerald-700">Fee Challan</span>
                            </Link>

                            <Link href="/dashboard/exams/schedule" className="flex flex-col items-center justify-center p-4 rounded-xl border border-slate-100 bg-slate-50 hover:bg-white hover:border-amber-100 hover:shadow-md transition-all group cursor-pointer h-32 text-center">
                                <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-sm">
                                    <Clock className="w-5 h-5" />
                                </div>
                                <span className="font-semibold text-sm text-slate-700 group-hover:text-amber-700">Schedule Exam</span>
                            </Link>
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-slate-900">Recent Activity</h3>
                            <button className="text-sm font-semibold text-primary-600 hover:text-primary-700">View All</button>
                        </div>

                        <div className="space-y-1">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="flex items-center gap-4 p-4 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer group border border-transparent hover:border-slate-100">
                                    <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform duration-300">
                                        <FileText className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-slate-900 font-semibold group-hover:text-primary-600 transition-colors">New assignment submission</p>
                                        <p className="text-sm text-slate-500">Student John Doe submitted "Physics Final"</p>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-2 py-1 rounded-full">2h ago</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout >
    );
}
