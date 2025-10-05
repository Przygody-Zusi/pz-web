import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "Przygody Zusi - Retirement Calculator",
    description: "Plan your retirement journey with AI-powered insights",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body>
                {children}
            </body>
        </html>
    );
}
