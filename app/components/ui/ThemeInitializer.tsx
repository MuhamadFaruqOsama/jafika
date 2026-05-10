"use client";

import { useEffect } from "react";

const THEME_STORAGE_KEY = "jafika-theme";

export function ThemeInitializer() {
  useEffect(() => {
    const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
    const isDarkMode = savedTheme === "dark";
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, []);

  return null;
}
