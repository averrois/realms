import { Jersey_25 } from 'next/font/google'
import "./globals.css";
import { ModalProvider } from './hooks/useModal'
import ModalParent from '@/components/Modal/ModalParent'
import Layout from '@/components/Layout/Layout'

const jersey = Jersey_25({
    subsets: ['latin'],
    weight: ['400'],
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
    <html lang="en" className={jersey.className}>
      <body>
        <Layout>
            {children}
        </Layout>
      </body>
    </html>
  );
}
