import "./globals.css";
import { UserProvider } from "@auth0/nextjs-auth0/client";
import { ErrorBoundary, HighlightInit } from "@highlight-run/next/client";
import ErrorPage from "./(components)/global/ErrorPage";
import { Roboto, Pacifico, Open_Sans, Merriweather } from "next/font/google";
import ReduxProvider from "../lib/redux/provider";

const roboto = Roboto({
  subsets: ["latin"],
  variable: "--font-primary",
  display: "swap",
  weight: ["300", "400", "500", "700"],
  preload: true,
  fallback: ["system-ui", "arial"],
});

const pacifico = Pacifico({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["400"],
  preload: true,
  fallback: ["Georgia", "serif"],
});

const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-secondary",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
  preload: true,
  fallback: ["system-ui", "arial"],
});

const merriweather = Merriweather({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
  weight: ["300", "400", "700", "900"],
  preload: true,
  fallback: ["Georgia", "serif"],
});

export const metadata = {
  title: "MixMate - Your Cocktail Companion",
  description:
    "Discover, create, and share amazing cocktail recipes. Begin your journey to mixology mastery with MixMate.",
  keywords: "cocktails, mixology, drinks, recipes, bartending, spirits",
  authors: [{ name: "MixMate Team" }],
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#1a1a2e",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <>
      <HighlightInit
        projectId={"jdk0r07e"}
        serviceName="my-nextjs-frontend"
        tracingOrigins
        networkRecording={{
          enabled: true,
          recordHeadersAndBody: true,
          urlBlocklist: [],
        }}
      />
      <html
        lang="en"
        className={`${roboto.variable} ${pacifico.variable} ${openSans.variable} ${merriweather.variable}`}
      >
        <head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="anonymous"
          />
        </head>
        <UserProvider>
          <body className="antialiased font-primary">
            <ErrorBoundary customDialog={<ErrorPage />}>
              <ReduxProvider>{children}</ReduxProvider>
            </ErrorBoundary>
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  // Add fonts-loaded class when fonts are ready
                  if (document.fonts) {
                    document.fonts.ready.then(function() {
                      document.documentElement.classList.add('fonts-loaded');
                    });
                  } else {
                    // Fallback for browsers that don't support document.fonts
                    setTimeout(function() {
                      document.documentElement.classList.add('fonts-loaded');
                    }, 1000);
                  }
                `,
              }}
            />
          </body>
        </UserProvider>
      </html>
    </>
  );
}

// import "./globals.css";
// import { UserProvider } from "@auth0/nextjs-auth0/client";
// import { API_ROUTES } from "./_utilities/_client/constants";
// import RootPage from "./page";
// import { ErrorBoundary, HighlightInit } from "@highlight-run/next/client";
// import ErrorPage from "./(components)/global/ErrorPage";
// import UnderMaintenance from "./(components)/global/UnderMaintenance";
// export default function RootLayout({ children }) {
//   return (
//     <>
//       <html lang="en">
//           <body
//             style={{ backgroundColor: "#E6FFFF" }}
//           >
//             <UnderMaintenance />
//           </body>
//       </html>
//     </>
//   );
// }
