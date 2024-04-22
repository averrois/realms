import { Jersey_25 } from 'next/font/google'
import "./globals.css";

const jersey = Jersey_25({
    subsets: ['latin'],
    weight: ['400']
})

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "realms",
  description: "Create a realm with your friends and integrate them with your Discord server.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={jersey.className}>
      <body>
          {children}
      </body>
    </html>
  );
}
