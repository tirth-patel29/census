import type { Metadata, Viewport } from "next";
import { Noto_Sans_Gujarati } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Script from "next/script";

const notoSansGujarati = Noto_Sans_Gujarati({
  subsets: ["gujarati"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-gujarati",
  preload: true,
});

export const viewport: Viewport = {
  themeColor: "#000080",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "ગુજરાત જનગણના સર્વે | Gujarat Census Survey",
  description: "સરકારી જનગણના સર્વે પ્રણાલી - Gujarat Government Census Survey System",
  keywords: "Gujarat Census, Gujarati Survey, જનગણના, સર્વે",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Census Survey",
  },
  icons: {
    icon: "/icons/icon-192x192.svg",
    apple: "/icons/icon-192x192.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="gu" className={notoSansGujarati.variable}>
      <head>
        <meta name="application-name" content="Census Survey" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Census" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#000080" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.svg" />
        <link rel="icon" href="/icons/icon-192x192.svg" type="image/svg+xml" />
        <link rel="mask-icon" href="/icons/icon-192x192.svg" color="#000080" />
      </head>
      <body
        className={`${notoSansGujarati.className} bg-gov-bg min-h-screen`}
        style={{ backgroundColor: '#f5f7fa' }}
      >
        <AuthProvider>{children}</AuthProvider>

        {/* Service Worker Registration */}
        <Script id="register-sw" strategy="afterInteractive">
          {`
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', function() {
                navigator.serviceWorker.register('/sw.js')
                  .then(function(reg) { console.log('SW registered:', reg.scope); })
                  .catch(function(err) { console.log('SW error:', err); });
              });
              // Listen for offline sync messages from SW
              navigator.serviceWorker.addEventListener('message', function(event) {
                if (event.data && event.data.type === 'SYNC_OFFLINE') {
                  window.dispatchEvent(new Event('online'));
                }
              });
            }
          `}
        </Script>
      </body>
    </html>
  );
}
