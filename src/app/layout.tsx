"use client";
import { ThemeProvider } from "next-themes";
import Navbar from "@components/Navbar/Navbar";
import "./globals.css";
import ClientAuthGuard from "@components/Auth/AuthGaurd";
import { usePathname } from "next/navigation";
import { CLIENT_ROUTES } from "@/src/lib/utils/common-constants";
import { Toaster } from "react-hot-toast";
import { toastOptions } from "../lib/utils/toast";
import { Provider } from "react-redux";
import { store } from "../redux-store/store";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const hideNavbarsRoutes = [
    CLIENT_ROUTES.LOGIN_ROUTE,
    CLIENT_ROUTES.SIGNUP_ROUTE,
  ];
  const showNavbar = !hideNavbarsRoutes.includes(pathname);
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          enableSystem={true}
          defaultTheme="system"
        >
          <Provider store={store}>
            <ClientAuthGuard>
              {showNavbar && <Navbar />}
              {children}
              <Toaster toastOptions={toastOptions} position="top-right" />
            </ClientAuthGuard>
          </Provider>
        </ThemeProvider>
      </body>
    </html>
  );
}
