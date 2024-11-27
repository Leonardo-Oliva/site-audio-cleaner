import localFont from "next/font/local";
import "./globals.css";
import Footer from "../components/footer";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "AudioCleaner",
  description: "Aplicação de limpeza de audio",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="layout">
          <div className="content">{children}</div>
          <Footer /> {/* Footer sempre visível no final */}
        </div>
      </body>
    </html>
  );
}
