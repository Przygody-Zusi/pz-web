import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "Symulator Emerytalny ZUS - Przygody Zusi",
    description: "Zaplanuj swoją emeryturę z pomocą symulatora ZUS. Sprawdź wysokość emerytury i stosunek zastąpienia.",
    keywords: "emerytura, ZUS, kalkulator emerytalny, symulator emerytalny, stopa zastąpienia",
    authors: [{ name: "Przygody Zusi" }],
};

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    themeColor: "#00416e",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="pl">
            <body className="antialiased">
                {children}
            </body>
        </html>
    );
}
