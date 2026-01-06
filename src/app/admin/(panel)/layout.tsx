// src/app/admin/(panel)/layout.tsx

import {AdminLayout} from "@/components/admin/AdminLayout";
import {AuthProvider} from "@/contexts/AuthContext";

export default function AdminPanelLayout({children}: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            <AdminLayout>
                {children}
            </AdminLayout>
        </AuthProvider>
    );
}