import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Flipside — Two Stories. One Truth.",
  description:
    "The same news. Two narratives. Flipside pairs liberal and conservative coverage of the day's top stories side by side.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
