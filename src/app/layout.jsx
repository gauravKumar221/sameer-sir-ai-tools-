import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
    display: 'swap',
});
export const metadata = {
    title: 'AutoGreen AI — AI is the new green.',
    description: 'A global AI ecosystem helping people and businesses discover, use, automate and build with artificial intelligence. Different Businesses. One Green.',
    keywords: ['AutoGreen AI', 'AI Kits', 'AI Automations', 'AI Agents', 'AI Marketer Kit', 'AI Tools Ecosystem'],
    authors: [{ name: 'AutoGreen AI' }],
    robots: { index: true, follow: true },
};
export default function RootLayout({ children, }) {
    return (<html lang="en" className={`dark ${inter.variable}`}>
      <body className="min-h-screen flex flex-col bg-[#020617] text-slate-100 antialiased selection:bg-emerald-500 selection:text-black">
        <AuthProvider>
          <Navbar />
          <main className="flex-1 w-full">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>);
}
