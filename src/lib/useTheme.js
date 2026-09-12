import { useState, useEffect, useCallback } from "react";

export function useTheme() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const stored = localStorage.getItem("ascend-theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initial = stored || (prefersDark ? "dark" : "light");
    setTheme(initial);
    applyTheme(initial);
  }, []);

  const applyTheme = (value) => {
    const isDark = value === "dark" || (value === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.classList.toggle("dark", isDark);
  };

  const changeTheme = useCallback((value) => {
    setTheme(value);
    localStorage.setItem("ascend-theme", value);
    applyTheme(value);
  }, []);

  return { theme, changeTheme };
}