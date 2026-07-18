import React, { createContext, useContext } from "react";

const ThemeContext = createContext({ theme: "dark" });

export function ThemeProvider({ children }) {
  // ResumeAudit AI is dark-themed by design; this context exists so
  // pages/components can read the theme without hardcoding it everywhere.
  return <ThemeContext.Provider value={{ theme: "dark" }}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => useContext(ThemeContext);