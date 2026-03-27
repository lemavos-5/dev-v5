/**
 * Componente Header
 * Barra superior com busca e notificações
 */

import { Menu, Search, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSearch } from "@/stores/uiStore";

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const { setOpen: setSearchOpen } = useSearch();

  return (
    <header className="border-b border-border bg-card px-4 py-3 flex items-center justify-between gap-4">
      {/* Menu Button (Mobile) */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onMenuClick}
        className="md:hidden text-muted-foreground hover:text-foreground"
      >
        <Menu className="w-5 h-5" />
      </Button>

      {/* Search Bar */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Buscar notas, entidades..."
            className="pl-10 bg-background border-border text-foreground placeholder:text-muted-foreground"
            onClick={() => setSearchOpen(true)}
            readOnly
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-foreground"
        >
          <Bell className="w-5 h-5" />
        </Button>
      </div>
    </header>
  );
}
