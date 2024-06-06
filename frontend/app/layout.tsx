import { Jersey_25, Roboto, Inter } from 'next/font/google'
import "./globals.css";
import Layout from '@/components/Layout/Layout'

const inter = Inter({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700'],
})

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000"

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "realms",
  description: "Create a realm with your friends and integrate with your Discord server.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      <body>
        <Layout>
            {children}
        </Layout>
      </body>
    </html>
  );
}
