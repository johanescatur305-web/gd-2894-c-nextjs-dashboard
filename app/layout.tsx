import '@/app/ui/global.css';
import { inter } from '@/app/ui/fonts';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s | GD 2894 C Dashboard',
    default: 'GD 2894 C Dashboard',
  },
  description: 'Dashboard assignment for SIWEB chapters 1-6 built with the official Next.js Learn flow.',
  metadataBase: new URL('https://gd-2894-c-nextjs-dashboard.vercel.app'),
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
