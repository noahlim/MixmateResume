import "./globals.css";
import { UserProvider } from "@auth0/nextjs-auth0/client";
import { API_ROUTES } from "./_utilities/_client/constants";
import RootPage from "./page";
import { ErrorBoundary, HighlightInit } from "@highlight-run/next/client";
import ErrorPage from "./(components)/global/ErrorPage";
import { Poppins, Dancing_Script } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const dancingScript = Dancing_Script({
  subsets: ["latin"],
  variable: "--font-dancing-script",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: "MixMate - Your Cocktail Companion",
  description:
    "Discover, create, and share amazing cocktail recipes. Begin your journey to mixology mastery with MixMate.",
  keywords: "cocktails, mixology, drinks, recipes, bartending, spirits",
  authors: [{ name: "MixMate Team" }],
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#1a1a2e",
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
        className={`${poppins.variable} ${dancingScript.variable}`}
      >
        <UserProvider
          loginUrl={API_ROUTES.login}
          profileUrl={API_ROUTES.userJson}
        >
          <body className="antialiased">
            <ErrorBoundary customDialog={<ErrorPage />}>
              <RootPage>{children}</RootPage>
            </ErrorBoundary>
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
