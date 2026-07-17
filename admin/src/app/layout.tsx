// ========================================================================
// =
// =    Path: frontend/admin/src/app/layout.tsx
// =    Description: Fixed Admin Layout (NO duplicate children)
// =
// =    Developed by SAYAB — Admin Layout
// =
// ========================================================================

import "../styles/globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-100">{children}</body>
    </html>
  );
}
