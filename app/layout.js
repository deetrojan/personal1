import "./globals.css";

export const metadata = {
  title: "Our Little Love Story ❤️",
  description: "A little love quiz made with love for Sangeeta."
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#fff1f5"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
