import Navbar from "../components/Navbar";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Navbar /> {/* Navbar público */}
      <main>{children}</main>
    </div>
  );
}
