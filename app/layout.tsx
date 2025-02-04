import Footer from "../app/components/Footer";
import "./globals.css";

export const metadata = {
  title: "House of Vape",
  description: "Página de catálogo de productos de vape desechables",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <main>{children}</main>
        <Footer /> {/* Aquí agregamos el Footer */}
      </body>
    </html>
  );
}
