"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { HeroUIProvider } from "@heroui/react";
import { ThemeProvider, useTheme } from "next-themes";
import { Toaster } from "sonner";
import { ReactNode } from "react";
import queryClient from "@/config/queryClient";
import { AuthProvider } from "@/app/context/AuthContext";

const ToasterWithTheme = () => {
  const { resolvedTheme } = useTheme();
  return (
    <Toaster
      position="top-right"
      richColors
      closeButton
      theme={resolvedTheme === "dark" ? "dark" : "light"}
    />
  );
}

const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <HeroUIProvider>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>{children}</AuthProvider>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
        <ToasterWithTheme />
      </HeroUIProvider>
    </ThemeProvider>
  );
};
export default Providers;
