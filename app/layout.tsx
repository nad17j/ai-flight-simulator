import React from "react";
import "./globals.css";

export const metadata = {
  title: "Tai Labs - AI Co-Pilot Flight Simulator",
  description: "Interactive prompt training simulator for enterprise teams",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
