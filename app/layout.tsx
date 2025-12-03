import './globals.css';
import SessionProvider from '../utils/SessionProvider';
import { Playfair_Display, Poppins, Montserrat, Open_Sans } from 'next/font/google';
import { ReactNode } from 'react';
import ClientLayoutWrapper from './ClientLayoutWrapper';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  weight: ['400', '700'],
});

const poppins = Poppins({
  subsets: ['latin'],
  variable: '--font-poppins',
  weight: ['400', '500'],
});

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  weight: ['400', '600'],
});

const openSans = Open_Sans({
  subsets: ['latin'],
  variable: '--font-open-sans',
  weight: ['400', '600'],
});

export const metadata = {
  title: "Cooper's Taxation - Professional Tax Services",
  description: "Expert tax preparation and consultation services for individuals and businesses. Professional, reliable, and secure tax solutions.",
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${poppins.variable} ${montserrat.variable} ${openSans.variable}`}
    >
      <head>
        <title>Cooper&apos;s Taxation</title>
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="shortcut icon" href="/favicon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/favicon.png" />
      </head>
      <body className="font-poppins">
        <SessionProvider>
          <ClientLayoutWrapper>
            {children}
          </ClientLayoutWrapper>
        </SessionProvider>
      </body>
    </html>
  );
}