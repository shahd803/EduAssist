import { Inter, Source_Code_Pro } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

const sourceCodePro = Source_Code_Pro({
  variable: "--font-source-code-pro",
  subsets: ["latin"],
});

export const metadata = {
  title: "Teacher Assist AI",
  description: "Frontend-only PRD prototype",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${sourceCodePro.variable}`}>
        {children}
      </body>
    </html>
  );
}