import {AuthProvider} from "@/contexts/AuthContext";

export const dynamic = "force-dynamic";

export default function AdminAuthLayout({
                                            children,
                                        }: {
    children: React.ReactNode;
}) {
    return (
        <AuthProvider>
            {children}
        </AuthProvider>
    );
}