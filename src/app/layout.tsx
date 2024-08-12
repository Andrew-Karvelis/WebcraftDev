import "./globals.css";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="bg-yellow-100">
      <body>{children}</body>
    </html>
  );
}
