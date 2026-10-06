import { createContext, useContext } from "react";

const lightTheme = { theme: "light" };
const ThemeContext = createContext(lightTheme);

export function ThemeProvider({ children }) {
  return <ThemeContext.Provider value={lightTheme}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}
