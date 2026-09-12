import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Compass,
  User,
  Bell,
  Settings,
  Sparkles,
  X,
  GraduationCap,
  Route as RouteIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/" },
  { label: "Opportunities", icon: Compass, path: "/opportunities" },
  { label: "My Profile", icon: User, path: "/profile" },
  { label: "Goal Tracker", icon: RouteIcon, path: "/goal-tracker" },
  { label: "Deadline Alerts", icon: Bell, path: "/deadlines", badge: 3 },
  { label: "Settings", icon: Settings, path: "/settings" },
];

export default function Sidebar({ open, onClose }) {
  const location = useLocation();

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "fixed lg:sticky top-0 z-50 lg:z-auto h-screen w-[260px] shrink-0 bg-sidebar border-r border-sidebar-border flex flex-col transition-transform duration-300 lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-6 h-[68px] border-b border-sidebar-border">
          <Link to="/" className="flex items-center gap-2.5" onClick={onClose}>
            <div className="w-9 h-9 rounded-xl bg-brand-gradient flex items-center justify-center shadow-soft">
              <GraduationCap className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-heading font-extrabold text-lg tracking-tight">Ascend</span>
              <span className="text-[10px] text-muted-foreground font-medium tracking-wide uppercase">
                Profile-first
              </span>
            </div>
          </Link>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg hover:bg-sidebar-accent text-muted-foreground"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto no-scrollbar">
          <p className="px-3 mb-2 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
            Menu
          </p>
          {navItems.map((item) => {
            const active =
              location.pathname === item.path ||
              (item.path !== "/" && location.pathname.startsWith(item.path));
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={cn(
                  "group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-soft"
                    : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground"
                )}
              >
                <Icon
                  className={cn(
                    "w-[18px] h-[18px] transition-colors",
                    active ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                  )}
                  strokeWidth={2.2}
                />
                <span className="flex-1">{item.label}</span>
                {item.badge && (
                  <span className="text-[10px] font-bold bg-primary text-primary-foreground rounded-full px-1.5 py-0.5 min-w-[18px] text-center">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* AI insight card */}
        <div className="px-3 pb-4">
          <div className="relative overflow-hidden rounded-2xl bg-brand-gradient p-4 text-white shadow-card">
            <div className="absolute -right-4 -top-4 w-20 h-20 rounded-full bg-white/10" />
            <div className="absolute -right-8 -bottom-8 w-24 h-24 rounded-full bg-white/10" />
            <Sparkles className="w-5 h-5 mb-2 relative" />
            <p className="text-sm font-semibold leading-snug relative">
              8 new matches this week
            </p>
            <p className="text-xs text-white/80 mt-1 relative">
              Gemini found opportunities tailored to your profile.
            </p>
            <Link
              to="/opportunities"
              onClick={onClose}
              className="mt-3 inline-flex items-center text-xs font-semibold bg-white/20 hover:bg-white/30 rounded-lg px-3 py-1.5 transition-colors relative"
            >
              View matches →
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}