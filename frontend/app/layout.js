import "./globals.css";

export const metadata = {
  title: "SmartERP",
  description: "Billing, Inventory & Accounting Management System",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
