// src/app/admin/(panel)/layout.tsx

import {AdminLayout} from "@/components/admin/AdminLayout";

export default function AdminPanelLayout({children}: { children: React.ReactNode }) {
    return <AdminLayout>{children}</AdminLayout>;
}