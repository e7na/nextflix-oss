"use client";
import "./globals.css";
import { UserProvider } from "~/hooks/user";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UserProvider>
      <html lang="en">
        <head />
        <body>
          <>
            {children}
          </>
        </body>
      </html>
    </UserProvider>
  );
}
