import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useColorScheme } from "react-native";

import { storage } from "@/src/utils/storage";
import { ColorPalette, darkColors, lightColors } from "./colors";

export type ThemeMode = "light" | "dark" | "system";
export type Scheme = "light" | "dark";

const THEME_KEY = "calc.theme.mode";

type ThemeContextValue = {
  mode: ThemeMode;
  scheme: Scheme;
  colors: ColorPalette;
  setMode: (mode: ThemeMode) => void;
  ready: boolean;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const [mode, setModeState] = useState<ThemeMode>("system");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      const saved = await storage.getItem<string>(THEME_KEY, "system");
      if (saved === "light" || saved === "dark" || saved === "system") {
        setModeState(saved);
      }
      setReady(true);
    })();
  }, []);

  const setMode = useCallback((next: ThemeMode) => {
    setModeState(next);
    storage.setItem(THEME_KEY, next);
  }, []);

  const scheme: Scheme =
    mode === "system" ? ((systemScheme as Scheme) ?? "light") : mode;

  const value = useMemo<ThemeContextValue>(
    () => ({
      mode,
      scheme,
      colors: scheme === "dark" ? darkColors : lightColors,
      setMode,
      ready,
    }),
    [mode, scheme, setMode, ready],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
