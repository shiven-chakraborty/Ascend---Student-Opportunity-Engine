import React from "react";
import { Search, Bell, Menu, BadgeCheck, ChevronDown, User as UserIcon, Settings, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

export default function Topbar({ onMenuClick }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const name = user?.full_name || "Student";
  const email = user?.email || "";
  const verified = user?.verified;
  const avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=4f46e5&color=fff&bold=true&size=128`;

  const handleLogout = () => {
    logout(true);
  };

  return (
    <header className="sticky top-0 z-30 h-[68px] bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="h-full flex items-center gap-3 px-4 sm:px-6 lg:px-8">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg hover:bg-muted text-muted-foreground"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Search */}
        <div className="relative flex-1 max-w-md hidden sm:block">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search opportunities, skills, companies…"
            className="w-full h-10 pl-10 pr-4 rounded-xl bg-muted/60 border border-transparent focus:border-primary focus:bg-card focus:outline-none text-sm placeholder:text-muted-foreground transition-all"
          />
        </div>

        <div className="flex-1 sm:hidden" />

        {/* Notifications */}
        <button className="relative p-2.5 rounded-xl hover:bg-muted text-muted-foreground transition-colors" aria-label="Notifications">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-accent ring-2 ring-background" />
        </button>

        {/* User dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex items-center gap-2.5 pl-1 pr-2 sm:pr-3 py-1 rounded-xl hover:bg-muted transition-colors"
              aria-label="Account menu"
            >
              <div className="relative shrink-0">
                <img src={avatar} alt={name} className="w-9 h-9 rounded-full object-cover ring-2 ring-border" />
                {verified && (
                  <span className="absolute -bottom-0.5 -right-0.5 bg-card rounded-full p-0.5">
                    <BadgeCheck className="w-4 h-4 text-primary fill-primary/10" />
                  </span>
                )}
              </div>
              <div className="hidden sm:flex flex-col items-start leading-tight max-w-[150px]">
                <span className="text-sm font-semibold truncate w-full text-left">{name}</span>
                <span className="text-[11px] text-muted-foreground truncate w-full text-left">{email}</span>
              </div>
              <ChevronDown className="hidden sm:block w-4 h-4 text-muted-foreground shrink-0" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 max-w-[calc(100vw-2rem)]">
            <DropdownMenuLabel className="flex flex-col gap-0.5 normal-case">
              <span className="font-semibold truncate">{name}</span>
              <span className="text-xs font-normal text-muted-foreground truncate">{email}</span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/profile")} className="flex items-center gap-2 cursor-pointer">
              <UserIcon className="w-4 h-4" /> View Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/settings")} className="flex items-center gap-2 cursor-pointer">
              <Settings className="w-4 h-4" /> Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-2 cursor-pointer text-destructive focus:text-destructive">
              <LogOut className="w-4 h-4" /> Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}