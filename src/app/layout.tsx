import type { Metadata } from "next";
import { DM_Mono, Inter, Lora } from "next/font/google";
import "./globals.css";
import { SITE_URL } from "@/lib/site";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const dmMono = DM_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-dm-mono",
});
const lora = Lora({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-lora",
});

const description =
  "Every hackathon One supports, upcoming and past: the event page, the skill your agent installs, and templates to start from.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Build with One · Hackathons",
    template: "%s · Build with One",
  },
  description,
  alternates: { canonical: SITE_URL },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "One",
    title: "Build with One · Hackathons",
    description,
  },
  twitter: {
    card: "summary_large_image",
    site: "@onedotnew",
    title: "Build with One · Hackathons",
    description,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`h-full ${inter.variable} ${dmMono.variable} ${lora.variable}`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        {children}
      </body>
    </html>
  );
}
