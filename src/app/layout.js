import { Rubik } from "next/font/google";
import "./globals.css";

import Providers from "./Providers";
import { Toaster } from "sonner";
import Navbar from "@/components/Navbar";

const rubik = Rubik({ subsets: ["latin"], weight: ["300", "400", "500", "700"] });

export const metadata = {
  title: "Next Todo App",
  description: "A todo app using MERN",
  icons: {
    icon: "/todoflow.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className={`${rubik.className} bg-background text-foreground`}>
        <Providers>
          <Navbar />
          {children}
          <Toaster position="top-center" richColors closeButton />
        </Providers>
      </body>
    </html>
  );
}
