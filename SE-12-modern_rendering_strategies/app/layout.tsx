import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://signal-content.example.com"),
  title: {
    default: "Signal | High-Performance Content Hub",
    template: "%s | Signal",
  },
  description: "Practical writing about modern rendering, content architecture, and high-performance web publishing.",
  openGraph: {
    title: "Signal | High-Performance Content Hub",
    description: "Practical writing about modern rendering and high-performance web publishing.",
    type: "website",
    siteName: "Signal",
    images: [{ url: "/covers/content-hub.png", width: 1672, height: 941 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Signal | High-Performance Content Hub",
    description: "Practical writing about modern rendering and high-performance web publishing.",
    images: ["/covers/content-hub.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <SiteHeader />
        {children}
        <footer className="mt-20 border-t border-black/5 bg-white py-10">
          <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 text-sm text-muted sm:flex-row sm:items-center sm:justify-between sm:px-8">
            <p>&copy; 2026 Signal Content Hub.</p>
            <p>Built with deliberate SSG, SSR, and ISR boundaries.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
