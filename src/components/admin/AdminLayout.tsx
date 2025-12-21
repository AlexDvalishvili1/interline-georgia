import { ReactNode } from "react";
import { Navigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { LayoutDashboard, FileText, Settings, LogOut, Home, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AdminLayoutProps {
  children: ReactNode;
}

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/posts", label: "Posts", icon: FileText },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { user, isLoading, isAdmin, signOut } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-heading font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground mb-6">
            You don't have admin privileges. Please contact an administrator to get access.
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild variant="outline">
              <Link to="/">
                <Home className="w-4 h-4 mr-2" />
                Go to Website
              </Link>
            </Button>
            <Button variant="ghost" onClick={() => signOut()}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const isActive = (href: string) => {
    if (href === "/admin") return location.pathname === "/admin";
    return location.pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen flex bg-muted/30">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-border hidden md:flex flex-col">
        <div className="p-6 border-b border-border">
          <Link to="/admin" className="flex items-center gap-2">
            <span className="text-xl font-heading font-bold text-primary">Interline</span>
            <span className="text-xs text-muted-foreground uppercase">Admin</span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-2.5 rounded-md text-sm font-medium transition-colors",
                isActive(item.href)
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-border space-y-2">
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-2.5 rounded-md text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <Home size={18} />
            View Website
          </Link>
          <button
            onClick={() => signOut()}
            className="flex items-center gap-3 px-4 py-2.5 rounded-md text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors w-full"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-card border-b border-border z-50 flex items-center px-4 justify-between">
        <Link to="/admin" className="font-heading font-bold text-primary">
          Interline Admin
        </Link>
        <div className="flex items-center gap-2">
          <Link to="/" className="p-2 text-muted-foreground hover:text-foreground">
            <Home size={20} />
          </Link>
          <button onClick={() => signOut()} className="p-2 text-muted-foreground hover:text-destructive">
            <LogOut size={20} />
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50 flex">
        {navItems.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            className={cn(
              "flex-1 flex flex-col items-center gap-1 py-3 text-xs font-medium transition-colors",
              isActive(item.href)
                ? "text-accent"
                : "text-muted-foreground"
            )}
          >
            <item.icon size={20} />
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Main Content */}
      <main className="flex-1 md:p-8 p-4 pt-20 pb-24 md:pt-8 md:pb-8 overflow-auto">
        {children}
      </main>
    </div>
  );
};
