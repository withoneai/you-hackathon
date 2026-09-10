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

const description = `Everything you need to build with One at ${EVENT.host}'s ${EVENT.name}: install the skill, connect your apps through the remote MCP server or the CLI, and pair One with You.com, Daytona, and CrewAI.`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Build with One · You.com Hackathon",
    template: "%s · Build with One",
  },
  description,
  alternates: { canonical: SITE_URL },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "One",
    title: "Build with One · You.com Hackathon",
    description,
  },
  twitter: {
    card: "summary_large_image",
    site: "@onedotnew",
    title: "Build with One · You.com Hackathon",
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
