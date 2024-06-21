import "./globals.css";
import { UserProvider } from "@auth0/nextjs-auth0/client";
import { API_ROUTES } from "./_utilities/_client/constants";
import RootPage from "./page";
import { ErrorBoundary, HighlightInit } from "@highlight-run/next/client";
import ErrorPage from "./(components)/global/ErrorPage";

export const metadata = {
  title: "MixMate",
  description: "Begin Your Journey to Mixology Mastery",
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
      <html lang="en">
        <UserProvider
          loginUrl={API_ROUTES.login}
          profileUrl={API_ROUTES.userJson}
        >
          <body
            style={{ backgroundColor: "#E6FFFF" }}
          >
            <ErrorBoundary customDialog={<ErrorPage />}>
              <RootPage>{children}</RootPage>
            </ErrorBoundary>
          </body>
        </UserProvider>
      </html>
    </>
  );
}
