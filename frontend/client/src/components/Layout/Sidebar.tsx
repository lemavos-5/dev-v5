/**
 * Componente Sidebar
 * Navegação principal da aplicação
 */

import { useLocation } from "wouter";
import {
  Home,
  FileText,
  Network,
  Settings,
  LogOut,
  Plus,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/authStore";
import { logout } from "@/services/auth";
import toast from "react-hot-toast";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: string;
}

export default function Sidebar() {
  const [location, setLocation] = useLocation();
  const { user, logout: logoutStore } = useAuthStore();

  const navItems: NavItem[] = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: <Home className="w-5 h-5" />,
    },
    {
      label: "Notas",
      href: "/notes",
      icon: <FileText className="w-5 h-5" />,
    },
    {
      label: "Knowledge Graph",
      href: "/graph",
      icon: <Network className="w-5 h-5" />,
    },
    {
      label: "Configurações",
      href: "/settings",
      icon: <Settings className="w-5 h-5" />,
    },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      logoutStore();
      toast.success("Logout realizado");
      setLocation("/login");
    } catch (err) {
      toast.error("Erro ao fazer logout");
    }
  };

  return (
    <div className="flex flex-col h-full p-4">
      {/* Logo */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg" />
          <span className="font-bold text-lg text-foreground">Continuum</span>
        </div>
        <p className="text-xs text-muted-foreground">PKM & Productivity</p>
      </div>

      {/* New Note Button */}
      <Button
        onClick={() => setLocation("/notes/new")}
        className="w-full mb-6 bg-cyan-600 hover:bg-cyan-700 text-white font-medium"
      >
        <Plus className="w-4 h-4 mr-2" />
        Nova Nota
      </Button>

      {/* Navigation */}
      <nav className="flex-1 space-y-2">
        {navItems.map((item) => (
          <button
            key={item.href}
            onClick={() => setLocation(item.href)}
            className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
              location === item.href
                ? "bg-cyan-600/20 text-cyan-400 border border-cyan-600/30"
                : "text-muted-foreground hover:text-foreground hover:bg-card/50"
            }`}
          >
            {item.icon}
            <span className="flex-1 text-left">{item.label}</span>
            {item.badge && (
              <span className="text-xs bg-cyan-600/20 text-cyan-400 px-2 py-1 rounded">
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* User Info & Logout */}
      <div className="border-t border-border pt-4 space-y-3">
        {user && (
          <div className="px-2 py-2 bg-card/50 rounded-lg">
            <p className="text-xs text-muted-foreground">Logado como</p>
            <p className="text-sm font-medium text-foreground truncate">
              {user.username}
            </p>
            <p className="text-xs text-cyan-400 font-medium">{user.plan}</p>
          </div>
        )}
        <Button
          onClick={handleLogout}
          variant="outline"
          className="w-full text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  );
}
