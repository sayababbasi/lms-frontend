import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard, Users, Building2, BookOpen, FileQuestion, GraduationCap,
  CreditCard, Calendar, Clock, Bell, MessageSquare, Library, Menu, X,
  LogOut, Plus, Search, MoreVertical, ChevronRight, UserPlus, Save, ArrowLeft
} from 'lucide-react';

// --- MOCK DATA SERVICES (Simulating /services/*.ts) ---

const MOCK_USERS = [
  { id: 1, name: "Dr. Sarah Smith", role: "Teacher", email: "sarah.s@uni.edu", department: "Computer Science", status: "Active" },
  { id: 2, name: "John Doe", role: "Student", email: "j.doe@student.uni.edu", department: "Physics", status: "Active" },
  { id: 3, name: "Admin Sys", role: "Admin", email: "admin@uni.edu", department: "Administration", status: "Active" },
  { id: 4, name: "Emily Blunt", role: "Student", email: "emily.b@student.uni.edu", department: "Mathematics", status: "Inactive" },
];

const MOCK_COURSES = [
  { id: 101, code: "CS-101", name: "Intro to Programming", department: "Computer Science", credits: 4, instructor: "Dr. Sarah Smith" },
  { id: 102, code: "PHY-200", name: "Quantum Mechanics", department: "Physics", credits: 3, instructor: "Dr. Oppenheimer" },
];

// --- UI COMPONENTS (Simulating /src/components/ui/*.tsx) ---

const Button = ({ children, onClick, variant = 'primary', className = '', ...props }) => {
  const baseStyle = "px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2";
  const variants = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm",
    secondary: "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50",
    danger: "bg-red-50 text-red-600 hover:bg-red-100",
    ghost: "text-gray-500 hover:bg-gray-100"
  };
  return (
    <button onClick={onClick} className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

const Card = ({ children, className = '' }) => (
  <div className={`bg-white rounded-xl border border-gray-200 shadow-sm ${className}`}>
    {children}
  </div>
);

const Badge = ({ status }) => {
  const styles = status === 'Active'
    ? "bg-green-100 text-green-700"
    : "bg-gray-100 text-gray-600";
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${styles}`}>
      {status}
    </span>
  );
};

// --- PAGE COMPONENTS (Simulating /src/app/dashboard/**/*) ---

// 1. DASHBOARD HOME (/src/app/dashboard/page.tsx)
const DashboardHome = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[
        { label: 'Total Students', val: '12,450', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Active Courses', val: '342', icon: BookOpen, color: 'text-indigo-600', bg: 'bg-indigo-50' },
        { label: 'Pending Fees', val: '$1.2M', icon: CreditCard, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { label: 'Avg Attendance', val: '88%', icon: Clock, color: 'text-orange-600', bg: 'bg-orange-50' },
      ].map((stat, i) => (
        <Card key={i} className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">{stat.label}</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{stat.val}</h3>
            </div>
            <div className={`p-3 rounded-lg ${stat.bg}`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
          </div>
        </Card>
      ))}
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-2 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Revenue Overview</h3>
        <div className="h-64 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-400">
          [BarChart Component Placeholder]
        </div>
      </Card>
      <Card className="p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Activities</h3>
        <ul className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <li key={i} className="flex items-start gap-3">
              <div className="w-2 h-2 mt-2 rounded-full bg-indigo-500 shrink-0" />
              <div>
                <p className="text-sm text-gray-800 font-medium">New Student Registration</p>
                <p className="text-xs text-gray-500">2 hours ago</p>
              </div>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  </div>
);

// 2. USERS MODULE (/src/app/dashboard/users/*)
const UsersPage = ({ subPath, onNavigate }) => {
  // Simulating /users/add
  if (subPath === 'add') {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="secondary" onClick={() => onNavigate('users')}>
            <ArrowLeft size={16} /> Back
          </Button>
          <h2 className="text-2xl font-bold text-gray-900">Add New User</h2>
        </div>
        <Card className="p-8 max-w-2xl">
          <form className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input type="text" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="John" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input type="text" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Doe" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input type="email" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="john@uni.edu" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <select className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none">
                <option>Student</option>
                <option>Teacher</option>
                <option>Staff</option>
              </select>
            </div>
            <div className="pt-4 flex justify-end gap-3">
              <Button variant="ghost" onClick={() => onNavigate('users')}>Cancel</Button>
              <Button variant="primary"><Save size={16} /> Save User</Button>
            </div>
          </form>
        </Card>
      </div>
    );
  }

  // Simulating /users (List View)
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
        <Button onClick={() => onNavigate('users/add')}>
          <UserPlus size={18} /> Add User
        </Button>
      </div>

      <Card className="overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50 flex gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search users..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-600 font-medium">
              <tr>
                <th className="p-4">Name</th>
                <th className="p-4">Role</th>
                <th className="p-4">Department</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {MOCK_USERS.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <div>
                      <p className="font-semibold text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </td>
                  <td className="p-4"><span className="inline-block px-2 py-1 rounded-md bg-indigo-50 text-indigo-700 text-xs font-medium">{user.role}</span></td>
                  <td className="p-4 text-gray-600">{user.department}</td>
                  <td className="p-4"><Badge status={user.status} /></td>
                  <td className="p-4 text-right">
                    <button className="text-gray-400 hover:text-indigo-600"><MoreVertical size={18} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

// 3. GENERIC PLACEHOLDER for other modules
const GenericModule = ({ title, description }) => (
  <div className="flex flex-col items-center justify-center h-[60vh] text-center p-6 bg-white rounded-xl border border-dashed border-gray-300">
    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400">
      <Building2 size={32} />
    </div>
    <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
    <p className="text-gray-500 max-w-md">{description}</p>
    <Button className="mt-6" variant="primary">Create First Item</Button>
  </div>
);

// --- LAYOUT COMPONENTS (Simulating /src/app/layout.tsx & components/layout/*) ---

const SidebarItem = ({ icon: Icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium ${active
        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
        : "text-gray-500 hover:bg-gray-100 hover:text-indigo-600"
      }`}
  >
    <Icon size={20} strokeWidth={active ? 2.5 : 2} />
    {label}
  </button>
);

const AdminLayout = ({ children, activePath, onNavigate, onLogout }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'departments', label: 'Departments', icon: Building2 },
    { id: 'courses', label: 'Courses', icon: BookOpen },
    { id: 'exams', label: 'Exams & Results', icon: FileQuestion },
    { id: 'finance', label: 'Finance', icon: CreditCard },
    { id: 'timetable', label: 'Timetable', icon: Calendar },
    { id: 'attendance', label: 'Attendance', icon: Clock },
    { id: 'library', label: 'Library', icon: Library },
  ];

  return (
    <div className="flex h-screen bg-gray-50 font-sans text-gray-900">
      {/* Sidebar */}
      <aside className={`
        fixed lg:relative z-30 w-72 h-full bg-white border-r border-gray-200 flex flex-col transition-transform duration-300
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-2 text-indigo-700">
            <GraduationCap size={32} />
            <span className="text-xl font-extrabold tracking-tight">Uni<span className="text-gray-900">LMS</span></span>
          </div>
          <button onClick={() => setIsMobileMenuOpen(false)} className="lg:hidden text-gray-500">
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 space-y-1 scrollbar-hide">
          <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 mt-2">Main Menu</p>
          {menuItems.map((item) => (
            <SidebarItem
              key={item.id}
              {...item}
              active={activePath.startsWith(item.id)}
              onClick={() => {
                onNavigate(item.id);
                setIsMobileMenuOpen(false);
              }}
            />
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button onClick={onLogout} className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors font-medium text-sm">
            <LogOut size={20} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Navbar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-8">
          <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden text-gray-500 p-2">
            <Menu size={24} />
          </button>

          <div className="flex items-center ml-auto gap-4">
            <button className="relative p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
              <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
                SA
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-semibold text-gray-900">Sayab Admin</p>
                <p className="text-xs text-gray-500">Super Admin</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-4 lg:p-8">
          {children}
        </div>
      </main>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-20 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};

// --- AUTH PAGES (Simulating /src/app/login/page.tsx) ---

const LoginPage = ({ onLogin }) => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
    <div className="bg-white max-w-md w-full rounded-2xl shadow-xl p-8 space-y-8">
      <div className="text-center">
        <div className="w-16 h-16 bg-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4 text-white shadow-lg shadow-indigo-200">
          <GraduationCap size={40} />
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900">Welcome Back</h1>
        <p className="text-gray-500 mt-2">Sign in to manage Revotic LMS</p>
      </div>

      <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); onLogin(); }}>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            required
            defaultValue="admin@university.com"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            type="password"
            required
            defaultValue="password"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all transform hover:-translate-y-0.5"
        >
          Sign In
        </button>
      </form>
    </div>
  </div>
);

// --- MAIN APP (Simulating src/app/page.tsx routing) ---

export default function LmsAdminApp() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // 'path' simulates the URL. E.g., 'dashboard', 'users', 'users/add'
  const [currentPath, setCurrentPath] = useState('dashboard');

  const handleNavigate = (path) => {
    setCurrentPath(path);
  };

  if (!isAuthenticated) {
    return <LoginPage onLogin={() => setIsAuthenticated(true)} />;
  }

  // Routing Logic
  const renderContent = () => {
    // Exact Match Dashboard
    if (currentPath === 'dashboard') {
      return <DashboardHome />;
    }

    // User Module Routing
    if (currentPath.startsWith('users')) {
      const subPath = currentPath.replace('users', '').replace('/', ''); // e.g., 'add' or ''
      return <UsersPage subPath={subPath} onNavigate={handleNavigate} />;
    }

    // Fallback/Generic Pages for other modules
    const modules = {
      'departments': { title: 'Departments', desc: 'Manage university departments and faculties.' },
      'programs': { title: 'Programs', desc: 'Manage degree programs and curriculum.' },
      'courses': { title: 'Courses', desc: 'Schedule courses, assign teachers, and manage credits.' },
      'assignments': { title: 'Assignments', desc: 'Track submissions and grades.' },
      'exams': { title: 'Exams & Results', desc: 'Exam scheduling and result publication.' },
      'finance': { title: 'Finance', desc: 'Fee vouchers, payments, and payroll.' },
      'timetable': { title: 'Timetable', desc: 'Class and exam scheduling.' },
      'attendance': { title: 'Attendance', desc: 'Track daily attendance for students and staff.' },
      'library': { title: 'Library', desc: 'Manage book inventory and issuances.' },
    };

    const activeModuleKey = Object.keys(modules).find(key => currentPath.startsWith(key));
    if (activeModuleKey) {
      return <GenericModule title={modules[activeModuleKey].title} description={modules[activeModuleKey].desc} />;
    }

    return <div className="p-8 text-center text-gray-500">404: Page not found</div>;
  };

  return (
    <AdminLayout activePath={currentPath} onNavigate={handleNavigate} onLogout={() => setIsAuthenticated(false)}>
      {renderContent()}
    </AdminLayout>
  );
}