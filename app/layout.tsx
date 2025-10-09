import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { ConvexClientProvider } from "@/app/provider/ConvexClientProvider";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "YumYardCafe",
  description: "Prestige Finsberry Park, Brigade El Dorado Rd, Gummanahalli, Bengaluru, Karnataka 562149",
  other: {
    "apple-mobile-web-app-title": "YumYard",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={`${poppins.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <ConvexClientProvider>{children}</ConvexClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
