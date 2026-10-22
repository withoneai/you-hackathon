import type { Metadata } from "next";
import { DM_Mono, Inter, Lora } from "next/font/google";
import "./globals.css";
import { EVENT, SITE_URL } from "@/lib/site";

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

const description = `Everything you need to build with One at ${EVENT.host}'s ${EVENT.name}: ${EVENT.subtitle} (${EVENT.city}, ${EVENT.dateShort}). Install the skill, connect your apps through the remote MCP server or the CLI, and build with You.com, CrewAI and Parasail.`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Build with One · Hack With YOU Halloween",
    template: "%s · Build with One",
  },
  description,
  alternates: { canonical: SITE_URL },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "One",
    title: "Build with One · Hack With YOU Halloween",
    description,
  },
  twitter: {
    card: "summary_large_image",
    site: "@onedotnew",
    title: "Build with One · Hack With YOU Halloween",
    description,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`dark h-full ${inter.variable} ${dmMono.variable} ${lora.variable}`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        {children}
      </body>
    </html>
  );
}
