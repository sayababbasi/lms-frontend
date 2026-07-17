// // ========================================================================
// // =
// // =    Path: frontend/admin/src/components/layout/Navbar.tsx
// // =    Description: Top navigation bar for Admin panel.
// // =                 Contains user profile, notifications, and quick links.
// // =
// // =    Developed by SAYAB — Admin Navbar
// // =
// // ========================================================================

// "use client";

// import React from "react";

// export default function Navbar() {
//   return (
//     <header className="bg-white shadow p-4 flex justify-between items-center">
//       {/* Left side: Logo or title */}
//       <div className="text-xl font-semibold text-gray-800">Revotic LMS Admin</div>

//       {/* Right side: User menu / notifications */}
//       <div className="flex items-center space-x-4">
//         {/* Notifications icon */}
//         <button className="relative">
//           <span className="material-icons text-gray-600">notifications</span>
//           <span className="absolute top-0 right-0 inline-block w-2 h-2 bg-red-500 rounded-full"></span>
//         </button>

//         {/* Profile dropdown */}
//         <div className="flex items-center space-x-2 cursor-pointer">
//           <img
//             src="/logo.png"
//             alt="Profile"
//             className="w-8 h-8 rounded-full border border-gray-300"
//           />
//           <span className="text-gray-700 font-medium">Admin</span>
//         </div>
//       </div>
//     </header>
//   );
// }


// ========================================================================
// =
// =    Path: frontend/admin/src/components/layout/Navbar.tsx
// =    Description: Top Navbar for Admin panel
// =
// =    Developed by SAYAB — Admin Navbar
// =
// ========================================================================

"use client";

import React from "react";

export default function Navbar() {
  return (
    <header className="bg-white shadow p-4 flex justify-between items-center">
      <div className="text-xl font-bold">Admin Dashboard</div>
      <div>
        {/* Example Navbar right-side items */}
        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Logout
        </button>
      </div>
    </header>
  );
}
