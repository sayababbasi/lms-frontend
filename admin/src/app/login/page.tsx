// // // ========================================================================
// // // =
// // // =    Path: frontend/admin/src/app/admin/login/page.tsx
// // // =    Description: Admin Login Page (TailwindCSS v3 + API Integration)
// // // =
// // // =    Developed by SAYAB — Admin Login
// // // =
// // // ========================================================================

// // "use client";

// // import { useState } from "react";
// // import axios from "axios";
// // import { useRouter } from "next/navigation";

// // export default function AdminLoginPage() {
// //   const router = useRouter();

// //   const [email, setEmail] = useState("");
// //   const [password, setPassword] = useState("");
// //   const [loading, setLoading] = useState(false);
// //   const [errorMsg, setErrorMsg] = useState("");

// //   const handleLogin = async () => {
// //     setLoading(true);
// //     setErrorMsg("");

// //     try {
// //       const res = await axios.post("http://127.0.0.1:8000/api/admin-auth/login/", {
// //         email,
// //         password,
// //       });

// //       // Save token
// //       localStorage.setItem("adminToken", res.data.access);

// //       router.push("/admin/dashboard"); // redirect
// //     } catch (error: any) {
// //       setErrorMsg(
// //         error.response?.data?.detail || "Invalid email or password"
// //       );
// //     }

// //     setLoading(false);
// //   };

// //   return (
// //     <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
// //       <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg border border-gray-200">
// //         <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
// //           Admin Login
// //         </h2>

// //         {errorMsg && (
// //           <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-3">
// //             {errorMsg}
// //           </div>
// //         )}

// //         <div className="space-y-4">
// //           <div>
// //             <label className="block mb-1 font-medium text-gray-700">
// //               Email
// //             </label>
// //             <input
// //               type="text"
// //               value={email}
// //               onChange={(e) => setEmail(e.target.value)}
// //               className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
// //               placeholder="Enter your email"
// //             />
// //           </div>

// //           <div>
// //             <label className="block mb-1 font-medium text-gray-700">
// //               Password
// //             </label>
// //             <input
// //               type="password"
// //               value={password}
// //               onChange={(e) => setPassword(e.target.value)}
// //               className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
// //               placeholder="Enter password"
// //             />
// //           </div>

// //           <button
// //             disabled={loading}
// //             onClick={handleLogin}
// //             className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition disabled:bg-blue-300"
// //           >
// //             {loading ? "Signing in..." : "Sign In"}
// //           </button>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }


// ========================================================================
// =
// =    Path: frontend/admin/src/app/admin/login/page.tsx
// =    Description: Admin Login Page (TailwindCSS v3 + API Integration)
// =
// =    Developed by SAYAB — Admin Login
// =
// ========================================================================

"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async () => {
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await axios.post("http://127.0.0.1:8000/api/admin-auth/login/", {
        email,
        password,
      });

      // Save token
      // @ts-ignore
      localStorage.setItem("adminToken", res.data.access);

      router.push("/admin/dashboard"); // redirect
    } catch (error: any) {
      setErrorMsg(
        error.response?.data?.detail || "Invalid email or password"
      );
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Admin Login
        </h2>

        {errorMsg && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-3">
            {errorMsg}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Email
            </label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Enter password"
            />
          </div>

          <button
            disabled={loading}
            onClick={handleLogin}
            className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition disabled:bg-blue-300"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </div>
      </div>
    </div>
  );
}

