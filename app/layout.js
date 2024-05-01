import { Inter } from "next/font/google";
import "bootstrap/dist/css/bootstrap.css";
import "@/app/_components/styles/styles.css";
import BootstrapClient from "@/app/_components/bootstrap_client";

const inter = Inter({ subsets: ["latin"] });
const baseURL = "https://pay.northwaveng.com/"
const title = "NorthWave - Pay";
const description = "NorthWave Pay";

export const metadata = {
  title: title,
  description: description,
  openGraph: {
    title: title,
    description: description,
    type: "website",
    images: "/logos/logo_text_dark.png",
    url: baseURL,
  },
  metadataBase: new URL(baseURL),
  manifest: "/logos/site.webmanifest",
  icons: {
    icon: ["/logos/logo_text_dark_trans.png"],
    apple: ["/logos/logo_text_dark_trans.png"],
    shortcut: ["/logos/logo_text_dark_trans.png"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta property="og:image:width" content="1277" />
        <meta property="og:image:height" content="473" />
        <meta name="theme-color" content="#346BC8" />
        <meta property="og:site_name" content="NorthWave - Pay" />
        <meta name="author" content="NorthWave Pay" />
      </head>
      <body className={inter.className} suppressHydrationWarning={true}>
        {children}
        <BootstrapClient />
      </body>
    </html>
  );
}
