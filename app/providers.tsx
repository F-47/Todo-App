"use client";
import { ThemeProvider } from "next-themes";

interface ThemeProviderProps {
  children: React.ReactNode;
}

const Providers: React.FunctionComponent<ThemeProviderProps> = ({
  children,
}) => {
  return <ThemeProvider attribute="class">{children}</ThemeProvider>;
};

export default Providers;
